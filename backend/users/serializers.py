from decimal import Decimal, DecimalException

from rest_framework.response import Response
from rest_framework import serializers
from django.utils.text import slugify
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from . models import *


User = get_user_model()

from users.models import CustomUser  # Import the CustomUser model from your app


from rest_framework.exceptions import ValidationError
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    #the below block is for specifying validations and read or write rules for each fields, not needed in all serializers
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    username = serializers.CharField(read_only=True)
    gender = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    dob = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ('password', 'first_name', 'last_name', 'email', 'phone_number', 'username', 'gender', 'dob')

    def create(self, validated_data):
        email = validated_data.get('email')

        # Check if a user with the provided email already exists
        if CustomUser.objects.filter(email=email).exists():
            return Response(
                {'error': 'A user with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate a unique username based on first_name and last_name
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        base_username = f"{slugify(first_name)}_{slugify(last_name)}"
        # Check if the generated username already exists; if so, add a suffix
        count = 1
        username = base_username
        while CustomUser.objects.filter(username=username).exists():
            username = f"{base_username}_{count:03d}"
            count += 1

        user = CustomUser.objects.create_user(
            username=username,
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=validated_data['phone_number']
        )
        return user



    







class Testserializer(serializers.ModelSerializer):
    class Meta:
        model=test
        fields='__all__'


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
   



class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)


