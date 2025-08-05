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

API_BASE_URL = 'https://omairiq.azurewebsites.net'
API_HEADERS = {
    'api-key': settings.OMAIRIQ_API_KEY,
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



#phonepay apis. can be moved to a seperate app later

# /v1/oauth/token response structure
#{
#     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTM0MjIyMjQ1MTIsIm1lcmNoYW50SWQiOiJURVNULU0yMllYUzBGN1hWSTAifQ.5lU9Qh-PM-J9XJE2gG5ox_VJNqkkHoEU8a3pBNot60s",
#     "encrypted_access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTM0MjIyMjQ1MTIsIm1lcmNoYW50SWQiOiJURVNULU0yMllYUzBGN1hWSTAifQ.5lU9Qh-PM-J9XJE2gG5ox_VJNqkkHoEU8a3pBNot60s",
#     "expires_in": 3600,
#     "issued_at": 1753418624,
#     "expires_at": 1753422224,
#     "session_expires_at": 1753422224,
#     "token_type": "O-Bearer"
# }

def get_phonepay_auth_token():
    url =f"{settings.PHONEPE_AUTHORISATION_BASE_URL}/v1/oauth/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    payload = {
        "client_id": settings.PHONEPE_CLIENT_ID,
        "client_secret": settings.PHONEPE_CLIENT_SECRET,
        "client_version":settings.PHONEPE_CLIENT_VERSION,
        "grant_type":"client_credentials"
    }

    try:
        response = requests.post(url, headers=headers, data=payload)
        responseData = response.json()
        if "access_token" in responseData:
            return responseData.get("access_token"), payload, responseData
        else:
            return None, payload, responseData  # 👈 return responseData even if it's an error
    except Exception as e:
        return None, payload, {"error": str(e)}  # 👈 catch network/JSON errors too



#checkout/v2/pay request body structure
# {
#     "merchantOrderId": "newtxn123456",
#     "amount": 1000,
#     "expireAfter": 1200,
#     "metaInfo": {
#         "udf1": "test1",
#         "udf2": "new param2",
#         "udf3": "test3",
#         "udf4": "dummy value 4",
#         "udf5": "addition infor ref1"
#     },
#     "paymentFlow": {
#         "type": "PG_CHECKOUT",
#         "message": "Payment message used for collect requests",
#         "merchantUrls": {
#             "redirectUrl": "https://google.com"
#         }
#     } 
# }


#checkout/v2/pay response structure
# {"orderId": "OMO2507251045237447051562",
#     "state": "PENDING",
#     "expireAt": 1753593323746,
#     "redirectUrl": "https://mercury-uat.phonepe.com/transact/uat_v2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTM0NDM5MjM3NDUsIm1lcmNoYW50SWQiOiJURVNULU0yMllYUzBGN1hWSTAiLCJtZXJjaGFudE9yZGVySWQiOiJuZXd0eG4xMjM0NTYifQ.KLF5cI5lLz8o-Pst5kv9_QLVZWXI-jmSsLZDOgXbErY"
# }


@require_POST
@csrf_exempt
def initiate_payment(request):
    data = json.loads(request.body)


    token, token_payload, token_response = get_phonepay_auth_token()
    if not token:
        return JsonResponse({
    "error": "Failed to authenticate with PhonePe",
    "auth_token_payload": token_payload,
    "auth_token_response": token_response
     }, status=400)

    amount = data.get("amount")  # e.g., in paisa: ₹1 = 100
    merchant_order_id = data.get("merchant_order_id")  # should be unique
    merchant_transaction_id=data.get("merchant_transaction_id")  # should be unique
    success_redirect_url=data.get('success_redirect_url')
    failed_redirect_url=data.get('failed_redirect_url')
   
    # merchant_transaction_id = str(uuid.uuid4())
    # merchant_order_id = str(uuid.uuid4())  # Or a real order ID from your system
    payload = {

    "merchantOrderId": merchant_order_id,
    "merchantTransactionId": merchant_transaction_id,
    "amount": amount,
    "expireAfter": 1200,

        "metaInfo": {
        "udf1": "test1",
        "udf2": "new param2",
        "udf3": "test3",
        "udf4": "dummy value 4",
        "udf5": "addition infor ref1"
        },

    "paymentFlow": {
        "type": "PG_CHECKOUT",
        "message": "Payment message used for collect requests",
        "merchantUrls": {
            "redirectUrl": success_redirect_url
        }
    } 
    }

    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"O-Bearer {token}" 
    }

    response = requests.post(
        f"{settings.PHONEPE_BASE_URL}/checkout/v2/pay",
        headers=headers,
        json=payload

    )

    try:
        response_data = response.json()
    except Exception as e:
        return JsonResponse({
            "error": "Failed to parse response from PhonePe",
            "exception": str(e),
            "status_code": response.status_code,
            "raw_response": response.text
        }, status=500)

    return JsonResponse({
        "data": response_data,
        # "auth_token_payload": token_payload,
        # "auth_token_response": token_response
    })

# @csrf_exempt
# @require_POST
# def verify_payment(request):
#     data = json.loads(request.body)
#     transaction_id = data.get('transactionId')  # PhonePe transaction ID
#     order_id = data.get('merchantTransactionId')

#     url = f"{settings.PHONEPE_BASE_URL}/pg/v1/status/{settings.PHONEPE_MERCHANT_ID}/{order_id}"
#     checksum = hashlib.sha256(
#         f"/v1/status/{settings.PHONEPE_MERCHANT_ID}/{order_id}{settings.PHONEPE_SALT_KEY}".encode('utf-8')
#     ).hexdigest()

#     headers = {
#         "X-VERIFY": f"{checksum}##{settings.PHONEPE_SALT_INDEX}",
#         "Content-Type": "application/json"
#     }

#     res = requests.get(url, headers=headers)
#     return JsonResponse(res.json())

