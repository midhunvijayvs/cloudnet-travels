from decimal import Decimal, DecimalException

from rest_framework.response import Response
from rest_framework import serializers
from django.utils.text import slugify
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from . models import *
from users.models import CustomUser




class AgencySerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Agency
        fields = [
            "id", "agency_name", "office_address", "home_address",
            "alternative_phone_number", "govt_id_number",
            "notes", "is_id_verified","joined_on", "wallet_balance" 
        ]
    


# Combine User + Agency details
class UserWithAgencySerializer(serializers.ModelSerializer):
    agency = AgencySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "first_name", "last_name", "email", "phone_number",
            "user_type", "is_email_verified", "is_phone_verified", "verified",
            "is_deactivated", "created_at", "gender", "dob", "profile_image",
            "agency"  # nested agency data
        ]




class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = [
            "id",
            "transaction_amount",
            "opening_balance",
            "closing_balance",
            "payment_method",
            "gateway_transaction_reference_number",
            "description",
            "created_at",
        ]