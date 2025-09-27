from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source="agency.agency_name", read_only=True)
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = "__all__"  # <-- includes all model fields
        # OR list them explicitly if you prefer more control

    def get_user_full_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return None
