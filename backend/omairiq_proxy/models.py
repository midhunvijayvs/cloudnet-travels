# airiq/models.py
from django.db import models
from django.utils import timezone

class AIRIQLoginToken(models.Model):
    token = models.TextField()
    token_type = models.CharField(max_length=20, default="bearer")
    expiration = models.IntegerField(default=3600)  # seconds
    expires_at = models.DateTimeField(null=True, blank=True)
    last_logged_in = models.DateTimeField(default=timezone.now)
    balance_at_login_time = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def is_valid(self):
        return self.expires_at and self.expires_at > timezone.now()

    def __str__(self):
        return f"Token valid until {self.expires_at}"
