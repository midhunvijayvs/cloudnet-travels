from django.urls import path
from django.urls import path, register_converter

from .views import *

urlpatterns = [
    path('list-for-admin/', BookingListForAdminView.as_view(), name='booking-list-admin'),
    path('list-for-agency/', BookingListForAgencyView.as_view(), name='booking-list-agency'),    
    ]




 
