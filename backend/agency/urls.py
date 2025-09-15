from django.urls import path
from django.urls import path, register_converter

from .views import *

urlpatterns = [
  #Registering an agency user from the admin side.
    path('register/', AgencyRegistrationFromAdminSideView.as_view(), name='admin-register'),
    path('list/', AgencyListView.as_view(), name='agency-list'),
    path("<int:pk>/", AgencyDetailForAdminView.as_view(), name="admin-agency-detail"),
    path("add-money-to-wallet/", AddMoneyToWalletView.as_view(), name="add-money-to-wallet"),
    path("update-wallet-transaction/", UpdateWalletTransactionView.as_view(), name="update-wallet"),
    path("wallet-transactions/list/", WalletTransactionListView.as_view(), name="wallet-transactions"),
    
    ]




 
