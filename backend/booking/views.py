from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from django.utils.dateparse import parse_date

from .models import Booking
from django.conf import settings
from users.customPermissions import IsAdminOrStaff
from users.customPermissions import IsAgencyUser
from rest_framework.permissions import IsAuthenticated
from .serializers import BookingSerializer
# GET /api/bookings/?search_key=Travels
# GET /api/bookings/?agency_id=12
# GET /api/bookings/?status=success
# GET /api/bookings/?date=2025-09-18
# GET /api/bookings/?start_date=2025-09-01&end_date=2025-09-18

class BookingListForAdminView(APIView):
    permission_classes = [IsAdminOrStaff]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            queryset = Booking.objects.select_related("agency", "user")

            # --- Search ---
            search_key = request.query_params.get("search_key")
            if search_key:
                queryset = queryset.filter(
                    Q(agency__agency_name__icontains=search_key)
                    | Q(user__first_name__icontains=search_key)
                    | Q(user__last_name__icontains=search_key)
                )

            # --- Filters ---
            agency_id = request.query_params.get("agency_id")
            if agency_id:
                queryset = queryset.filter(agency__id=agency_id)

            booking_id = request.query_params.get("booking_id")
            if booking_id:
                queryset = queryset.filter(id=booking_id)

            status_filter = request.query_params.get("status")
            if status_filter:
                queryset = queryset.filter(status=status_filter)

            # Single date filter
            date_filter = request.query_params.get("date")
            if date_filter:
                queryset = queryset.filter(created_at__date=date_filter)

            # Date range filter
            start_date = request.query_params.get("start_date")
            end_date = request.query_params.get("end_date")
            if start_date and end_date:
                start = parse_date(start_date)
                end = parse_date(end_date)
                if start and end:
                    queryset = queryset.filter(created_at__date__range=[start, end])

            # --- Ordering ---
            queryset = queryset.order_by("-id")

            # --- Pagination ---
            paginator = PageNumberPagination()
            paginator.page_size = int(request.query_params.get("page_size", 10))
            paginated_qs = paginator.paginate_queryset(queryset, request)

            # --- Response formatting ---
            serializer = BookingSerializer(paginated_qs, many=True)

            return paginator.get_paginated_response(serializer.data) 

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
        
        

#GET /api/my-bookings/?status=success&page=2&page_size=5&start_date=2025-09-01&end_date=2025-09-18


#GET /api/my-bookings/?date=2025-09-18
#GET /api/my-bookings/?start_date=2025-09-01&end_date=2025-09-18


class BookingListForAgencyView(APIView):
    permission_classes = [IsAgencyUser]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            agency = request.user.agency  # automatically detect agency
            queryset = Booking.objects.filter(agency=agency).select_related("agency", "user")

            # --- Filters ---
            booking_id = request.query_params.get("booking_id")
            if booking_id:
                queryset = queryset.filter(id=booking_id)

            status_filter = request.query_params.get("status")
            if status_filter:
                queryset = queryset.filter(status=status_filter)

            # Single-day filter
            date_filter = request.query_params.get("date")
            if date_filter:
                queryset = queryset.filter(created_at__date=date_filter)

            # Date range filter
            start_date = request.query_params.get("start_date")
            end_date = request.query_params.get("end_date")
            if start_date and end_date:
                start = parse_date(start_date)
                end = parse_date(end_date)
                if start and end:
                    queryset = queryset.filter(created_at__date__range=[start, end])

            # --- Ordering ---
            queryset = queryset.order_by("-id")

            # --- Pagination ---
            paginator = PageNumberPagination()
            paginator.page_size = int(request.query_params.get("page_size", 10))
            paginated_qs = paginator.paginate_queryset(queryset, request)

            # --- Response formatting ---
            serializer = BookingSerializer(paginated_qs, many=True)

            return paginator.get_paginated_response(serializer.data) 

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class BookingListOfAgentForAdminView(APIView):
    permission_classes = [IsAdminOrStaff]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):  # pk = agency_id from URL
        try:
            queryset = Booking.objects.filter(agency__id=pk).select_related("agency", "user").order_by("-id")

            # --- Pagination ---
            paginator = PageNumberPagination()
            paginator.page_size = int(request.query_params.get("page_size", 10))
            paginated_qs = paginator.paginate_queryset(queryset, request)

            # --- Response formatting ---
            serializer = BookingSerializer(paginated_qs, many=True)

            return paginator.get_paginated_response(serializer.data) 

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class TicketDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        try:
            ticket = Ticket.objects.get(ticket_id=ticket_id)
            serializer = TicketSerializer(ticket)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Ticket.DoesNotExist:
            return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)