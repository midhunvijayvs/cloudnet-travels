from decimal import Decimal
import uuid

from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.models import CustomUser, PasswordResetToken
from users.serializers import UserSerializer
from users.customPermissions import IsAdminOrStaff, IsAgencyUser

from .general_functions import CustomPagination
from .mailgunEmailAndSMSSendingFunctions import send_welcome_email_for_admin_created_agency
from .models import Agency, WalletTransaction
from .serializers import UserWithAgencySerializer, AgencySerializer, WalletTransactionSerializer


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
        
        copied_request_data = request.data.copy()  # copy to modify safely
        
        if 'wallet_balance' not in copied_request_data or copied_request_data.get('wallet_balance') in [None, '']:
            copied_request_data['wallet_balance'] = 0
        
        agency_serializer = AgencySerializer(data=copied_request_data)
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
        reset_url = f'{settings.FRONTEND_DOMAIN}/reset-password/?token={token}'
        
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
    serializer_class = UserWithAgencySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff]
    pagination_class = CustomPagination

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
    
    
    
class AgencyDetailForAdminView(generics.RetrieveAPIView):
    serializer_class = UserWithAgencySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        # Only agency users should be fetched
        return CustomUser.objects.filter(user_type="agency")

    def get_object(self):
        # Get agency by user_id passed in the URL
        user_id = self.kwargs.get("pk")  
        return get_object_or_404(self.get_queryset(), pk=user_id)
    
    
    #APIView is used as it is customized business logic. Not just automated data writing/fetching.


class InitiateAddMoneyToWalletView(APIView):
    permission_classes = [IsAgencyUser]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            amount = request.data.get("amount")
            payment_method = request.data.get("payment_method", "phonepe")
            description = request.data.get("description", "Wallet top-up")

            if not amount or not str(amount).isdigit():
                return Response({"message": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

            amount = Decimal(amount)
            agency = request.user.agency

            opening_balance = agency.wallet_balance

            transaction = WalletTransaction.objects.create(
                agency=agency,
                transaction_amount=amount,
                opening_balance=opening_balance,
                closing_balance=None,  # not updated yet
                payment_method=payment_method,
                description=description,
                status="processing",
                credit_or_debit="debit",
            )

            return Response(
                {
                    "message": "Transaction initiated",
                    "transaction_id": transaction.id,
                    "amount": str(amount),
                    "status": transaction.status,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ManualAddMoneyToWalletFromAdmin(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff]   # assuming you already defined this

    def post(self, request):
        try:
            agency_id = request.data.get("agency_id")
            amount = request.data.get("amount")
            description = request.data.get("description", "Manual top-up from admin")

            if not agency_id or not amount:
                return Response({"message": "agency_id and amount are required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                agency = Agency.objects.get(id=agency_id)
            except Agency.DoesNotExist:
                return Response({"message": "Agency not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                amount = Decimal(amount)
            except:
                return Response({"message": "Invalid amount format"}, status=status.HTTP_400_BAD_REQUEST)

            # Update wallet balance
            opening_balance = agency.wallet_balance
            closing_balance = opening_balance + amount
            agency.wallet_balance = closing_balance
            agency.save(update_fields=["wallet_balance"])

            # Create wallet transaction
            transaction = WalletTransaction.objects.create(
                agency=agency,
                transaction_amount=amount,
                opening_balance=opening_balance,
                closing_balance=closing_balance,
                payment_method="manual",   # no gateway involved
                description=description,
                status="success",
                credit_or_debit="debit",  # because money is being added
                payment_completed_at=timezone.now(),
            )

            return Response({
                "message": "Wallet credited successfully",
                "transaction_id": transaction.id,
                "agency_id": agency.id,
                "agency_name": agency.agency_name,
                "amount": str(amount),
                "opening_balance": str(opening_balance),
                "closing_balance": str(closing_balance),
                "status": transaction.status,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     
        
class WalletTransactionListView(APIView):
    permission_classes = [IsAgencyUser]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        agency = request.user.agency
        print("\n\nDEBUG from user panel AGENCY ID:", agency.id)
        transactions = WalletTransaction.objects.filter(agency=agency).order_by("-initiated_at")

        # Apply pagination
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(transactions, request)

        serializer = WalletTransactionSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    
    
    
    
    
  
        agency = request.user.agency
        transactions = WalletTransaction.objects.filter(agency=agency).order_by("-initiated_at")

        # Apply pagination
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(transactions, request)

        serializer = WalletTransactionSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    
    
    
class WalletTransactionListOfAgentForAdminView(APIView):
    permission_classes = [IsAdminOrStaff]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):  # pk = agency_id from URL
        try:
            print("DEBUG AGENCY ID pk:", pk)
            transactions = WalletTransaction.objects.filter(
                agency__id=pk
            ).order_by("-id")  # reverse of id order

            # Apply pagination
            paginator = CustomPagination()
            result_page = paginator.paginate_queryset(transactions, request)

            serializer = WalletTransactionSerializer(result_page, many=True)

            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
