# airiq/serializers.py
from rest_framework import serializers
from .models import AIRIQLoginToken

class AIRIQLoginTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIRIQLoginToken
        fields = "__all__"
