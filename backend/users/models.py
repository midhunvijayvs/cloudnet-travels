


from datetime import timezone
from django.db.models.signals import pre_save
from django.contrib.auth.models import Permission
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import models

from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.forms import ValidationError
from django.db.models.signals import post_save
from django.utils import timezone
from django.conf import settings

from django.contrib.auth.models import BaseUserManager

#folowing is for overiding createsuperuser function  to assign admin in the custom field user_type we added, automatically when creating a superuser via createsuperuser command
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 'admin')  # <-- Automatically assign admin role

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)



class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=150,null=True,blank=True)
    last_name = models.CharField(max_length=150,null=True,blank=True)
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    guest = models.BooleanField(default = False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    phone_number = models.CharField(max_length=20,null=True,blank=True)
    gender = models.CharField(max_length=20,null=True,blank=True)
    dob = models.CharField(max_length=20,null=True,blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    password_reset_count = models.IntegerField(default=0)
    checkout_initiate_time = models.DateTimeField(null=True, blank=True)
    checkout_initiate_mode = models.CharField(max_length=30, null=True, blank=True, default=None)
    auth_provider = models.CharField(max_length=255, null=True, blank=True, default = 'email')
    is_deactivated = models.BooleanField(default=False, null=True, blank = True)
    
    
    user_type = models.CharField(max_length=20,null=True,blank=True, default = 'agency')
    #folowing is for overiding createsuperuser function  to assign admin in the custom field user_type we added, automatically when creating a superuser via createsuperuser command
    objects = CustomUserManager()  # <-- assign your custom manager here


  
class EmailVerificationToken(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    firstname=models.CharField(max_length=90)
    lastname=models.CharField(max_length=90)
    email=models.CharField(max_length=90)
    phone_number=models.CharField(max_length=90)
    date_of_birth=models.CharField(max_length=90)
    gender=models.CharField(max_length=90)
    streetadd=models.CharField(max_length=90)
    postalcode=models.CharField(max_length=90)
    city=models.CharField(max_length=90)
    country=models.CharField(max_length=90)
    address=models.CharField(max_length=90)
    locationmap=models.CharField(max_length=90)

    image = models.ImageField(upload_to='review_images/')

    def __str__(self):
        return f"Image for Review ID {self.review.id}"








class test(models.Model):
    testdata=models.CharField(max_length=90)\
    
import uuid
class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class OTP(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    email_otp = models.CharField(max_length=6,null=True, blank=True)
    sms_otp = models.CharField(max_length=6,null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)


