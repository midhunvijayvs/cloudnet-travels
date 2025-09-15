from django.urls import path
from .views import initiate_payment,check_payment_status_and_update_wallet

urlpatterns = [
  
    path('initiate/', initiate_payment),
    path('check-status-and-update-wallet/', check_payment_status_and_update_wallet),
]
