from django.db import models
from django.conf import settings
from django.utils import timezone
# Create your models here.

class Agency(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="agency")
    agency_name = models.CharField(max_length=100)
    office_address = models.TextField(max_length=500)
    home_address = models.TextField(max_length=500)
    alternative_phone_number = models.CharField(max_length=20)
    govt_id_number=models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField()
    is_id_verified=models.BooleanField(default=False)
    joined_on = models.DateField(default=timezone.now)

