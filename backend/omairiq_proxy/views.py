from django.shortcuts import render

# Create your views here.
import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import forward_request_to_air_iq
from django.views.decorators.http import require_POST
from django.conf import settings
import uuid
from rest_framework import generics, filters
from .models import AIRIQLoginToken
from .serializers import AIRIQLoginTokenSerializer
from .general_functions import CustomPagination

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from users.customPermissions import IsAdminOrStaff
from booking.models import Booking
from agency.models import WalletTransaction, Agency
from rest_framework.views import APIView
from rest_framework.response import Response
from users.customPermissions import IsAgencyUser
from rest_framework import status
from decimal import Decimal
import json


class ProxySearchView(APIView):
    authentication_classes = []  # optional, keep empty if you don’t want auth
    permission_classes = []      # optional, keep empty if no permissions

    def post(self, request, *args, **kwargs):
        return forward_request_to_air_iq(request, 'search/', 'POST')

    def get(self, request, *args, **kwargs):
        return Response({'error': 'Only POST allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    

class BookTicketView(APIView):
    permission_classes = [IsAgencyUser]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            payload = request.data

            ticket_id = payload.get("ticket_id")
            total_pax = payload.get("total_pax", 0)
            adult = payload.get("adult", 0)
            child = payload.get("child", 0)
            infant = payload.get("infant", 0)

            user = request.user
            agency = user.agency  

            amount = Decimal(payload.get("price"))
            opening_balance = agency.wallet_balance

            if opening_balance < amount:
                return Response({"error": "Insufficient wallet balance"}, status=status.HTTP_403_FORBIDDEN)

            closing_balance = opening_balance - amount

            # Create WalletTransaction (credit → money out of wallet)
            wallet_txn = WalletTransaction.objects.create(
                agency=agency,
                transaction_amount=amount,
                opening_balance=opening_balance,
                closing_balance=closing_balance,
                payment_method="phonepe",
                description=f"Ticket booking for {ticket_id}",
                credit_or_debit="credit",
                status="processing",
            )

            # Create Booking
            booking = Booking.objects.create(
                user=user,
                agency=agency,
                wallet_transaction=wallet_txn,
                ticket_id=ticket_id,
                total_pax=total_pax,
                adult=adult,
                child=child,
                infant=infant,
                adult_info=payload.get("adult_info", []),
                child_info=payload.get("child_info", []),
                infant_info=payload.get("infant_info", []),
                status="pending",
            )

            # Call AirIQ
            airiq_response = forward_request_to_air_iq(request, "book/", "POST")
            airiq_data = json.loads(airiq_response.content.decode('utf-8'))  # decode bytes → dict
            
            if airiq_response.status_code == 200 and airiq_data.get("status") == "success":
                booking.status = "success"
                wallet_txn.status = "success"
                agency.wallet_balance = closing_balance
                agency.save()
            else:
                booking.status = "failed"
                wallet_txn.status = "failed"
                wallet_txn.closing_balance = opening_balance  # rollback

            booking.airiq_response = airiq_data
            booking.save()
            wallet_txn.save()

            return Response(
                {
                    "booking": {
                        "id": booking.id,
                        "ticket_id": booking.ticket_id,
                        "status": booking.status,
                        "wallet_transaction_id": wallet_txn.id,
                        "user_id": booking.user.id,
                        "agency_id": booking.agency.id,
                    },
                    "airiq_response": airiq_data,
                },
                status=airiq_response.status_code,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
    

class AIRIQLoginTokenListView(generics.ListAPIView):
    queryset = AIRIQLoginToken.objects.all().order_by("-last_logged_in")
    serializer_class = AIRIQLoginTokenSerializer
    pagination_class = CustomPagination

    # auth & permission
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff | IsAuthenticated]  # staff or authenticated

    # filters (DjangoFilterBackend + search + ordering)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["token_type", "balance_at_login_time"]  # quick text/number search
    ordering_fields = ["last_logged_in", "expires_at", "balance_at_login_time"]
    ordering = ["-last_logged_in"]  # default