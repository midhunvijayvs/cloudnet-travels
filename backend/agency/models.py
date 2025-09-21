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
    notes = models.TextField(null=True, blank=True)
    is_id_verified=models.BooleanField(default=False)
    joined_on = models.DateField(default=timezone.now)
    wallet_balance = models.DecimalField(
        max_digits=12,      # can hold values up to 9999999999.99
        decimal_places=2,   # 2 decimal places for currency
        default=0,
        null=False,
        blank=False
    )



class WalletTransaction(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ("phonepe", "PhonePe"),
        ("googlepay", "Google Pay (Manual)"),
        ("manual", "Manual"),
    )

    STATUS_CHOICES = (
        ("processing", "Processing"),
        ("success", "Success"),
        ("failed", "Failed"),
    )
    
    CREDIT_OR_DEBIT_CHOICES = (
        ("credit", "Credit"),  # money added to wallet
        ("debit", "Debit"),    # money deducted from wallet
    )

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name="wallet_transactions")
    transaction_amount = models.DecimalField(max_digits=12, decimal_places=2)
    opening_balance = models.DecimalField(max_digits=12, decimal_places=2)
    closing_balance = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default="phonepe")
    gateway_transaction_reference_number = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    
    credit_or_debit = models.CharField(max_length=10, choices=CREDIT_OR_DEBIT_CHOICES, default="debit")
    
    initiated_at = models.DateTimeField(auto_now_add=True)   # renamed from created_at
    payment_completed_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="processing")

    def __str__(self):
        return f"{self.agency.agency_name} {self.transaction_amount} ({self.status})"
    
    
    
    
    