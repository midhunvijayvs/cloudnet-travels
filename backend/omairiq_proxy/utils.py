import requests
import json
from django.http import JsonResponse
from django.conf import settings
from .models import AIRIQLoginToken
from django.utils import timezone
from datetime import timedelta

AIRIQ_BASE_URL = 'https://omairiq.azurewebsites.net'
AIRIQ_API_HEADERS = {
    'api-key': settings.AIRIQ_API_KEY,
    'Content-Type': 'application/json',
}


def get_airiq_token():
    # Get the latest token from DB
    token_obj = AIRIQLoginToken.objects.order_by("-last_logged_in").first()
    
    if token_obj and token_obj.is_valid():
        return token_obj.token

    # If no valid token, request new one
    response = requests.post(f"{AIRIQ_BASE_URL}/login", headers=AIRIQ_API_HEADERS, json={
        "username": settings.AIRIQ_USERNAME,
        "password": settings.AIRIQ_PASSWORD,
    })

    try:
        data = response.json()
    except Exception:
        data = {"error": "Invalid response from AIRIQ", "raw": response.text}
    
    if response.status_code == 200:
        data = response.json()
        
        token = data.get("token")
        token_type = data.get("token_type")
        expiration = data.get("expiration", 3600)  # default 1 hour
        expires_at = timezone.now() + timedelta(seconds=expiration)
        balance_at_login_time=data.get("user", {}).get("balance")
        
        # Save to DB
        AIRIQLoginToken.objects.create(
            token=token,
            token_type = token_type,
            expiration=expiration,
            expires_at=expires_at,
            balance_at_login_time=balance_at_login_time,
            last_logged_in=timezone.now()
            
        )
        return token
    else:
        # Instead of raising generic exception, return both status and full response
        raise Exception(json.dumps({
            "status_code": response.status_code,
            "airiq_response": data
        }))
    
    
def forward_request(request, endpoint_path, method="POST"):
    try:
        headers = AIRIQ_API_HEADERS.copy()
        token = get_airiq_token()
        if token:
           headers["Authorization"] = f"{token}"

        url = f"{AIRIQ_BASE_URL}/{endpoint_path.lstrip('/')}"

        # Determine how to send data
        if method.upper() == "GET":
            params = request.GET.dict()
            response = requests.get(url, headers=headers, params=params)
        else:
            payload = json.loads(request.body)
            response = requests.request(method, url, headers=headers, json=payload)

        return JsonResponse(response.json(), status=response.status_code, safe=False)

    except Exception as e:
        try:
            # If e.message contains JSON string from get_airiq_token
            error_data = json.loads(str(e))
            return JsonResponse(error_data, status=error_data.get("status_code", 500))
        except:
            return JsonResponse({'error': str(e)}, status=500)
        
        