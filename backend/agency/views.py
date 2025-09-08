from django.shortcuts import render
from rest_framework import generics
from users.serializers import UserSerializer
from .serializers import AgencyUserSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from users.customPermissions import IsAdminOrStaff
from .general_functions import StandardResultsSetPagination
from users.models import CustomUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import AgencySerializer
from django.db import transaction
import uuid
from users.models import PasswordResetToken
from django.conf import settings
from .mailgunEmailAndSMSSendingFunctions import send_welcome_email_for_admin_created_agency
from django.db.models import Q
from django.shortcuts import get_object_or_404


class AgencyRegistrationFromAdminSideView(generics.CreateAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff]
    
    
    @transaction.atomic  #Wrapping in a transaction ensures both succeed or both fai
    def create(self, request, *args, **kwargs):
        user = request.user

        
        
        # Check for duplicate email
        email = request.data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {'message': 'A user with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Serialize and save user instance
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_user = serializer.save(context={'request': request})

        
        # ✅ Force user_type to "agency" and mark it as a verified user as it is created from admin panel
        new_user.user_type = "agency"
        new_user.verified = True
        new_user.save()
        
        # Save Agency separately
        agency_serializer = AgencySerializer(data=request.data)
        agency_serializer.is_valid(raise_exception=True)
        agency=agency_serializer.save(user=new_user)

        token = str(uuid.uuid4())
        PasswordResetToken.objects.create(user=new_user, token=token)
        
        #preparing data
        first_name = new_user.first_name
        last_name = new_user.last_name
        email = new_user.email
        username = new_user.username
        user_id = new_user.id
        reset_url = f'{settings.FRONTEND_DOMAIN}/password-reset/confirm/{token}/'
        
        if settings.SEND_EMAIL:
            email_response=send_welcome_email_for_admin_created_agency(
                first_name=first_name,
                last_name=last_name,
                username=username,
                email=email,
                reset_url=reset_url
            )
            if email_response['status'] == 'failed':
                    return Response(email_response, status=500)
            
        

        response_data = {
            "first_name": first_name,
            "last_name": last_name,
            "username": username,
            "email": email,
            "reset_url": reset_url,
            "user_id": user_id if user_id else None,
            "agency_id": f"CLDNTAGNT{agency.id}" if agency.id else None,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class AgencyListView(generics.ListAPIView):
    serializer_class = AgencyUserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = CustomUser.objects.filter(user_type="agency").order_by("-id")

        search_key = self.request.query_params.get("search_key")
        if search_key:
            queryset = queryset.filter(
                Q(first_name__icontains=search_key)
                | Q(last_name__icontains=search_key)
                | Q(agency__agency_name__icontains=search_key)
            )

        # Filters
        is_id_verified = self.request.query_params.get("is_id_verified")
        if is_id_verified is not None:
            queryset = queryset.filter(agency__is_id_verified=is_id_verified.lower() in ["true", "1"])

        joined_after = self.request.query_params.get("joined_after")
        if joined_after:
            queryset = queryset.filter(agency__joined_on__gte=joined_after)

        joined_before = self.request.query_params.get("joined_before")
        if joined_before:
            queryset = queryset.filter(agency__joined_on__lte=joined_before)

        return queryset
    
    
    
class AgencyDetailView(generics.RetrieveAPIView):
    serializer_class = AgencyUserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        # Only agency users should be fetched
        return CustomUser.objects.filter(user_type="agency")

    def get_object(self):
        # Get agency by user_id passed in the URL
        user_id = self.kwargs.get("pk")  
        return get_object_or_404(self.get_queryset(), pk=user_id)