import uuid
from .models import Ticket


def create_ticket_for_booking(booking):
    """
    Auto-generate a Ticket record for a given Booking.
    """
    # Generate a unique ticket ID if not already present
    ticket_id = booking.ticket_id or str(uuid.uuid4()).replace("-", "")[:10]

    # Extract passenger info (example: first adult if available, fallback to user)
    passenger_name = None
    passenger_email = None
    passenger_phone = None

    if booking.adult_info and len(booking.adult_info) > 0:
        # Assuming adult_info is a list of dicts with keys like name/email/phone
        passenger_name = booking.adult_info[0].get("name")
        passenger_email = booking.adult_info[0].get("email")
        passenger_phone = booking.adult_info[0].get("phone")
    else:
        passenger_name = booking.user.get_full_name() or booking.user.username
        passenger_email = booking.user.email
        passenger_phone = booking.user.phone if hasattr(booking.user, "phone") else None

    # Create Ticket
    ticket = Ticket.objects.create(
        booking=booking,
        ticket_id=ticket_id,
        passenger_name=passenger_name,
        passenger_email=passenger_email,
        passenger_phone=passenger_phone,
        flight_number=booking.airiq_response.get("flight_number", "N/A") if booking.airiq_response else "N/A",
        airline_name=booking.airiq_response.get("airline", "N/A") if booking.airiq_response else "N/A",
        departure_airport=booking.origin,
        arrival_airport=booking.destination,
        departure_time=booking.airiq_response.get("departure_time") if booking.airiq_response else None,
        arrival_time=booking.airiq_response.get("arrival_time") if booking.airiq_response else None,
        seat_number=None,
        pnr=booking.airiq_response.get("pnr") if booking.airiq_response else None,
        gate=None,
    )
    return ticket
