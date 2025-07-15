from django.shortcuts import render

# Create your views here.
import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import forward_request

API_BASE_URL = 'https://omairiq.azurewebsites.net'
API_HEADERS = {
    'api-key': 'NTMzNDUwMDpBSVJJUSBURVNUIEFQSToxODkxOTMwMDM1OTk2OmpTMm0vUU1HVmQvelovZi81dFdwTEE9PQ==',
    'Content-Type': 'application/json',
}



@csrf_exempt
def proxy_login(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            response = requests.post(f"{API_BASE_URL}/login/", headers=API_HEADERS, json=payload)
            return JsonResponse(response.json(), status=response.status_code, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)



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