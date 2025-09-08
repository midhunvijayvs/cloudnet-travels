from django.urls import path
from django.urls import path, register_converter

from .views import *

urlpatterns = [
  #Registering an agency user from the admin side.
    path('register/', AgencyRegistrationFromAdminSideView.as_view(), name='admin-register'),

    path('list/', AgencyListView.as_view(), name='agency-list'),
    path("<int:pk>/", AgencyDetailView.as_view(), name="agency-detail"),
]




 
