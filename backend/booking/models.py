from django.db import models
from django.utils import timezone
from agency.models import WalletTransaction
from django.conf import settings

class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings",  null=True, blank=True)
    agency = models.ForeignKey("agency.Agency", on_delete=models.CASCADE, null=True, blank=True)
    
    wallet_transaction = models.OneToOneField(WalletTransaction, on_delete=models.CASCADE, related_name="booking")

    ticket_id = models.TextField()
    origin = models.TextField( null=True, blank=True)
    destination = models.TextField( null=True, blank=True)
    total_pax = models.IntegerField()
    adult = models.IntegerField(default=0)
    child = models.IntegerField(default=0)
    infant = models.IntegerField(default=0)

    adult_info = models.JSONField(default=list, blank=True)
    child_info = models.JSONField(default=list, blank=True)
    infant_info = models.JSONField(default=list, blank=True)

    airiq_response = models.JSONField(null=True, blank=True)

    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.ticket_id} - {self.status}"
 
 
class Ticket(models.Model):
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="ticket"
    )
    ticket_id = models.CharField(max_length=50, unique=True)
    passenger_name = models.CharField(max_length=255)
    passenger_email = models.EmailField()
    passenger_phone = models.CharField(max_length=20, blank=True, null=True)

    flight_number = models.CharField(max_length=20)
    airline_name = models.CharField(max_length=100)
    departure_airport = models.CharField(max_length=100)
    arrival_airport = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()

    seat_number = models.CharField(max_length=10, blank=True, null=True)
    pnr = models.CharField(max_length=20, blank=True, null=True)
    gate = models.CharField(max_length=20, blank=True, null=True)

    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ticket {self.ticket_id} - {self.passenger_name}"