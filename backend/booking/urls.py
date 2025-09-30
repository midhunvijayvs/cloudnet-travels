from django.urls import path
from django.urls import path, register_converter

from .views import *

urlpatterns = [
    path('list-for-admin/', BookingListForAdminView.as_view(), name='booking-list-admin'),
    path('list-for-agency/', BookingListForAgencyView.as_view(), name='booking-list-agency'),    
   
    path("bookings-list-of-agent-for-admin/<int:pk>/", BookingListOfAgentForAdminView.as_view(), name="bookings-list-of-agent-for-admin"),
    path("saved-tickets/<str:ticket_id>/", TicketDetailView.as_view(), name="ticket-detail"),]




 
