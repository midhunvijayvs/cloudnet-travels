from django.shortcuts import render

# Create your views here.
import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import forward_request
from django.views.decorators.http import require_POST
from django.conf import settings
import uuid
from rest_framework import generics, filters
from .models import AIRIQLoginToken
from .serializers import AIRIQLoginTokenSerializer
from .general_functions import CustomPagination

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from users.customPermissions import IsAdminOrStaff

@csrf_exempt
def proxy_search(request):
    if request.method == 'POST':
        return forward_request(request, 'search/','POST')
    return JsonResponse({'error': 'Only POST allowed'}, status=405)


@csrf_exempt
def proxy_book(request):
    if request.method == 'POST':
        return forward_request(request, 'book/','POST')
    return JsonResponse({'error': 'Only POST allowed'}, status=405)


class AIRIQLoginTokenListView(generics.ListAPIView):
    queryset = AIRIQLoginToken.objects.all().order_by("-last_logged_in")
    serializer_class = AIRIQLoginTokenSerializer
    pagination_class = CustomPagination

    # auth & permission
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrStaff | IsAuthenticated]  # staff or authenticated

    # filters (DjangoFilterBackend + search + ordering)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["token_type", "balance_at_login_time"]  # quick text/number search
    ordering_fields = ["last_logged_in", "expires_at", "balance_at_login_time"]
    ordering = ["-last_logged_in"]  # default