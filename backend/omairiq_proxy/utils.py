import requests
import json
from django.http import JsonResponse
from django.conf import settings

API_BASE_URL = 'https://omairiq.azurewebsites.net'
API_HEADERS = {
    'api-key': settings.OMAIRIQ_API_KEY,
    'Content-Type': 'application/json',
}

 

def forward_request(request, endpoint_path, method="POST"):
    try:
        headers = API_HEADERS.copy()
        auth_header = request.headers.get("Authorization")
        if auth_header:
            headers["Authorization"] = auth_header

        url = f"{API_BASE_URL}/{endpoint_path.lstrip('/')}"

        # Determine how to send data
        if method.upper() == "GET":
            params = request.GET.dict()
            response = requests.get(url, headers=headers, params=params)
        else:
            payload = json.loads(request.body)
            response = requests.request(method, url, headers=headers, json=payload)

        return JsonResponse(response.json(), status=response.status_code, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

