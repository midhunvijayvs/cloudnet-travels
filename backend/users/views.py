
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer
from .models import OTP

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination
from .serializers import PasswordResetSerializer
from users.models import PasswordResetToken
from .serializers import PasswordResetConfirmSerializer# to register a user from admin side
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib.auth import authenticate
from django.utils.crypto import get_random_string
from datetime import datetime, timedelta
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .mailgunEmailAndSMSSendingFunctions import send_login_otp_via_email
from .sendgridEmailAndSMSSendingFunctions import send_login_otp_via_sms
from .customPermissions import IsAdminOrStaff

from .general_functions import checkPaswwordReset
import uuid
from django.contrib.auth import get_user_model





class LoginView(APIView):
    authentication_classes = []  # Disable default JWT authentication

    def generate_and_save_otp(self, user, send_sms=False):
        otp_value = get_random_string(length=6, allowed_chars='0123456789')
        otp_instance, created = OTP.objects.get_or_create(user=user)

        if send_sms:
            otp_instance.sms_otp = otp_value
        else:
            otp_instance.email_otp = otp_value

        otp_instance.created_at = datetime.now()
        otp_instance.save()
        return otp_value

    def post(self, request):
        if settings.ENABLE_RECAPTCHA:
            is_mobile = request.headers.get('X-Client') == 'mobile'
            X_App_Secret = request.headers.get('X-App-Secret') == settings.X_APP_SECRET
            if not (is_mobile and X_App_Secret):
                recaptcha_token = request.data.get('recaptchaToken')
                if not recaptcha_token:
                    return Response({'error': 'reCAPTCHA is missing'}, status=status.HTTP_400_BAD_REQUEST)
                resp = requests.post(
                    'https://www.google.com/recaptcha/api/siteverify',
                    data={'secret': settings.RECAPTCHA_SECRET_KEY, 'response': recaptcha_token}
                )
                if not resp.json().get('success'):
                    return Response({'error': 'Invalid reCAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)

        is_email = request.data.get('otp_channel')=="email"
        username_or_email_or_phone = request.data.get('username_or_email_or_phone')
        password = request.data.get('password')

        if not username_or_email_or_phone or not password:
            return Response({'error': 'username, email or phone_number and password is required'}, status=status.HTTP_400_BAD_REQUEST)


         # Try with username
        user = authenticate(username=username_or_email_or_phone, password=password)

        # Try email
        if user is None:
            try:
                user = CustomUser.objects.get(email=username_or_email_or_phone)
                user = authenticate(username=user.username, password=password)
                is_email = True
            except CustomUser.DoesNotExist:
                pass

        # Try phone
        if user is None:
            try:
                user = CustomUser.objects.get(phone_number=username_or_email_or_phone)
                if not user.check_password(password):
                    return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User does not Exist'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'Account not active'}, status=status.HTTP_403_FORBIDDEN)

        
        if not( user.verified or user.is_superuser):
            return Response({'message': 'Account not verified'}, status=status.HTTP_403_FORBIDDEN)
        
        # generate OTP via email or phone
        
        if is_email:
             otp_value = self.generate_and_save_otp(user, send_sms=False)
        else:
            otp_value = self.generate_and_save_otp(user, send_sms=True)
            
        
        # send OTP via email or phone
       
        if settings.SEND_EMAIL and settings.SEND_SMS:
            
            if is_email:
                
                email_response = send_login_otp_via_email(user, otp_value)
                if email_response['status'] == 'failed':
                    return Response(email_response, status=500)
            
            else:
                sms_response = send_login_otp_via_sms(user, otp_value)
                if sms_response['status'] == 'failed':
                    return Response(sms_response, status=500)
                
        response_data = {
            'access_token': 'otp_required',
            'otp_valid_for': f"{settings.OTP_EXPIRY_TIME_IN_MINUTES} minute",
            'user_id': user.id,
            'role': user.user_type,
        }

        # Add otp only if not sending either email or sms
        if not settings.SEND_EMAIL or not settings.SEND_SMS:
            response_data['otp'] = otp_value

        return Response(response_data, status=status.HTTP_200_OK)

        


class SubmitOTPView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        submitted_otp = request.data.get('otp')
        otp_type = request.data.get('otp_type')  # should be 'email' or 'phone'

        if not user_id or not submitted_otp or otp_type not in ['email', 'phone']:
            return Response({'error': 'Invalid input'}, status=status.HTTP_400_BAD_REQUEST)

        otp_instance = get_object_or_404(OTP, user_id=user_id)
        user = get_object_or_404(CustomUser, id=user_id)

        # Determine which field to compare based on otp_type
        actual_otp = otp_instance.email_otp if otp_type == 'email' else otp_instance.sms_otp

        if submitted_otp != actual_otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP is still valid (within 5 minutes)
        if timezone.now() - otp_instance.created_at > timedelta(minutes=settings.OTP_EXPIRY_TIME_IN_MINUTES):
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Update verification status
        if otp_type == 'email':
            user.is_email_verified = True
        elif otp_type == 'phone':
            user.is_phone_verified = True

        # Mark as fully verified if both verified
        if user.is_email_verified and user.is_phone_verified:
            user.verified = True
        user.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        refresh['password_reset_count'] = user.password_reset_count
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        #Textract the expiry times from each token and format it into a human-readable datetime string.for returning expiry times explicitly in the response.
        access_exp = datetime.utcfromtimestamp(refresh.access_token.payload['exp']).strftime('%Y-%m-%d %H:%M:%S')
        refresh_exp = datetime.utcfromtimestamp(refresh.payload['exp']).strftime('%Y-%m-%d %H:%M:%S')

        return Response({
            'message': f"{otp_type} verified",
            'access_token': access_token,
            'access_token_expiry': access_exp,
            'refresh_token': refresh_token,
            'refresh_token_expiry': refresh_exp,
            'user_id': user.id,
            'role': 'admin' if user.is_superuser else 'user',
        }, status=status.HTTP_200_OK)
    


class TokenRefreshView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        if checkPaswwordReset(request):
            return Response({'error':'Session expired, please login to continue'})
        refresh_token_value = request.data.get('refresh')
        # print(refresh_token_value.payload['user_id'],'444444444444444444')
        if not refresh_token_value:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh_token = RefreshToken(refresh_token_value)
            access_token = str(refresh_token.access_token)
             
            # Since ROTATE_REFRESH_TOKENS=True, generate new refresh
            new_refresh = str(refresh_token)
            
            return Response({
                "access_token": access_token,
                "refresh_token": new_refresh,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class CustomPagination(PageNumberPagination):
    page_size = None
    page_size_query_param = 'page_size'
    max_page_size = 100






class PasswordResetView(generics.CreateAPIView):
    serializer_class = PasswordResetSerializer
    

    def create(self, request, *args, **kwargs):
        
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            email = serializer.validated_data['email']
            user = CustomUser.objects.get(email=email)

            # Create a password reset token
            token = str(uuid.uuid4())
            PasswordResetToken.objects.create(user=user, token=token)

            # Send the password reset email using SendGrid
            template_id = 'd-3d6cc8174a374eecb9d9fca5ed06cf22' 
            # Replace with your SendGrid template ID
            template_data = {
                'reset_url': f'{settings.FRONTEND_DOMAIN}/password-reset/confirm/{token}/',
            }

            message = Mail(
                from_email=settings.DEFAULT_FROM_EMAIL,
                to_emails=email,
            )
            message.dynamic_template_data = template_data
            message.template_id = template_id

            try:
                sg = SendGridAPIClient(settings.SENDGRID_API_KEY)  # Initialize the SendGrid client
                response = sg.send(message)  # Send the email
                print(response.status_code)
            except Exception as e:
                print(e)  # Handle the error properly in your application

            return Response({'detail': 'Password reset email sent.'}, status=status.HTTP_200_OK)
        
                            


class PasswordResetConfirmView(generics.UpdateAPIView):
    queryset = PasswordResetToken.objects.all()
    serializer_class = PasswordResetConfirmSerializer
    

    def update(self, request, *args, **kwargs):
        
            token = kwargs['token']
            try:
                token_obj = self.queryset.get(token=token)
            except PasswordResetToken.DoesNotExist:
                return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = token_obj.user
            new_password = serializer.validated_data['password']
            user.set_password(new_password)
            user.password_reset_count += 1
            
            user.save()

            token_obj.delete()

            return Response({'detail': 'Password reset successful.'}, status=status.HTTP_200_OK)
        




class ActivateAccountView(APIView):
    def put(self, request):
        token = request.GET.get('token')
        try:
            email_verification_token = EmailVerificationToken.objects.get(token=token)
            user = email_verification_token.user
            user.verified = True
            user.save()
            email_verification_token.delete()
            return Response({"message": "Success"}, status=200)
        except EmailVerificationToken.DoesNotExist:
            return Response({"error": "Invalid token"}, status=400)





@method_decorator(csrf_exempt, name='dispatch')
class VerifyRecaptchaView(APIView):
    def post(self, request):
        recaptcha_token = request.data.get('recaptcha_token', '')
        secret_key = settings.RECAPTCHA_SECRET_KEY
        
        if not recaptcha_token:
            return Response({'message': 'reCAPTCHA is missing'}, status=400)
        
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', {
            'secret': secret_key,
            'response': recaptcha_token
        })
        
        result = response.json()
        if result.get('success'):
            return Response({'message': 'reCAPTCHA verified successfully'})
        else:
            return Response({'message': 'Invalid reCAPTCHA'}, status=400)
        



class VerifyEmailView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        otp = request.data.get('otp')

        if not user_id or not otp:
            return Response({'error': 'user_id and otp are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp_instance = OTP.objects.get(user=user)
        except OTP.DoesNotExist:
            return Response({'error': 'No OTP found for this user'}, status=status.HTTP_404_NOT_FOUND)

        # Check if provided OTP matches
        if otp_instance.otp_value != otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark email as verified
        user.is_email_verified = True
        # if user.is_email_verified and user.is_phone_verified:
        user.verified = True
        user.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        refresh['password_reset_count'] = user.password_reset_count
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        access_exp = datetime.utcfromtimestamp(refresh.access_token.payload['exp']).strftime('%Y-%m-%d %H:%M:%S')
        refresh_exp = datetime.utcfromtimestamp(refresh.payload['exp']).strftime('%Y-%m-%d %H:%M:%S')

        return Response({
            'message': 'email verified',
            'user_id': user.id,
            'role': 'admin' if user.is_superuser else 'user',
            'access_token': access_token,
            'access_token_expiry': access_exp,
            'refresh_token': refresh_token,
            'refresh_token_expiry': refresh_exp
        }, status=status.HTTP_200_OK)
    

class VerifyPhoneView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        otp = request.data.get('otp')

        if not user_id or not otp:
            return Response({'error': 'user_id and otp are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp_instance = OTP.objects.get(user=user)
        except OTP.DoesNotExist:
            return Response({'error': 'No OTP found for this user'}, status=status.HTTP_404_NOT_FOUND)

        # Check SMS OTP match
        if otp_instance.sms_otp != otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark phone as verified
        user.is_phone_verified = True
        # if user.is_email_verified and user.is_phone_verified:
        user.verified = True
        user.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        refresh['password_reset_count'] = user.password_reset_count
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        access_exp = datetime.utcfromtimestamp(refresh.access_token.payload['exp']).strftime('%Y-%m-%d %H:%M:%S')
        refresh_exp = datetime.utcfromtimestamp(refresh.payload['exp']).strftime('%Y-%m-%d %H:%M:%S')

        return Response({
            'message': 'phone verified',
            'user_id': user.id,
            'role': 'admin' if user.is_superuser else 'user',
            'access_token': access_token,
            'access_token_expiry': access_exp,
            'refresh_token': refresh_token,
            'refresh_token_expiry': refresh_exp
        }, status=status.HTTP_200_OK)

#used generic instead of APIView because it is fully automatic in error handling. recomended by chatgpt
class UserDeletionView(generics.DestroyAPIView):
    queryset = get_user_model().objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff]  # your custom class
    lookup_field = "pk"  # expects /users/<pk>/ in URL