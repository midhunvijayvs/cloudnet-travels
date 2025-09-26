from django.urls import path
from django.urls import path, register_converter

from .views import *

urlpatterns = [
  #Registering an agency user from the admin side.
    path('register/', AgencyRegistrationFromAdminSideView.as_view(), name='admin-register'),
    path('list/', AgencyListView.as_view(), name='agency-list'),
    path("<int:pk>/", AgencyDetailForAdminView.as_view(), name="admin-agency-detail"),
    path("initiate-add-money-to-wallet/", InitiateAddMoneyToWalletView.as_view(), name="initiate-add-money-to-wallet"),
    path("admin-add-money-to-wallet/", ManualAddMoneyToWalletFromAdmin.as_view(), name="admin-add-money-to-wallet"),
    path("wallet-transactions/list/", WalletTransactionListView.as_view(), name="wallet-transactions"),
    
    path("wallet-transaction-list-of-agent-for-admin/<int:pk>/", WalletTransactionListOfAgentForAdminView.as_view(), name="wallet-transaction-list-of-agent-for-admin"),
    
    ]




 
