from django.shortcuts import render

# Create your views here.
import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
import uuid
from .utils import finalize_wallet_transaction





#phonepay apis.

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
            "redirectUrl": success_redirect_url,
             "failedRedirectUrl": failed_redirect_url  
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
    })





@require_POST
@csrf_exempt
def check_payment_status_and_update_wallet(request):
    data = json.loads(request.body)
    merchant_order_id = data.get("merchant_order_id")
    merchant_transaction_id = data.get("merchant_transaction_id")  # WalletTransaction id stored when initiated

    if not merchant_order_id or not merchant_transaction_id:
        return JsonResponse({"error": "merchant_order_id and merchant_transaction_id are required"}, status=400)

    # Get auth token again
    token, token_payload, token_response = get_phonepay_auth_token()
    if not token:
        return JsonResponse({
            "error": "Failed to authenticate with PhonePe",
            "auth_token_payload": token_payload,
            "auth_token_response": token_response
        }, status=400)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"O-Bearer {token}"
    }

    # Call PhonePe status API
    url = f"{settings.PHONEPE_BASE_URL}/checkout/v2/order/{merchant_order_id}/status"
    response = requests.get(url, headers=headers)

    try:
        status_data = response.json()
    except Exception as e:
        return JsonResponse({
            "error": "Failed to parse response from PhonePe",
            "exception": str(e),
            "status_code": response.status_code,
            "raw_response": response.text
        }, status=500)

    # Extract payment details
    order_state = status_data.get("state")  # COMPLETED, FAILED, PENDING
    payment_details = status_data.get("paymentDetails", [])
    phonpe_payment_referance_number = ""
    
    if payment_details and isinstance(payment_details, list):
        phonpe_payment_referance_number = payment_details[0].get("transactionId", "")

    # Verify and finalize wallet transaction
    if order_state == "COMPLETED":
        result = finalize_wallet_transaction(
            merchant_transaction_id=merchant_transaction_id,
            payment_status="success",
            phonpe_payment_referance_number=phonpe_payment_referance_number
        )
        
        print("called finalize_wallet_transaction with order_state == COMPLETED")
        
        result["merchant_order_id"] = merchant_order_id
        result["merchant_transaction_id"] = merchant_transaction_id
        result["backend_log"] = "called finalize_wallet_transaction with order_state == COMPLETED"
        result["phonepe_response_data"] = status_data
        return JsonResponse(result, status=200)

    elif order_state in ["FAILED", "CANCELLED"]:
  
        result = finalize_wallet_transaction(
            merchant_transaction_id=merchant_transaction_id,
            payment_status="failed",
            phonpe_payment_referance_number=phonpe_payment_referance_number
        )
        print("called finalize_wallet_transaction with order_state == FAILED or CANCELLED")
        
        result["merchant_order_id"] = merchant_order_id
        result["merchant_transaction_id"] = merchant_transaction_id
        result["backend_log"] = "called finalize_wallet_transaction with order_state == FAILED or CANCELLED"
        result["phonepe_response_data"] = status_data
        return JsonResponse(result, status=400)

    else:
        # ensure status_data is dict
        phonepe_response_serializable = status_data if isinstance(status_data, dict) else {}
        # Payment still pending
        print("no expected order state came")
        return JsonResponse({
            "message": "Payment is still pending",
            "status": order_state,
            "phonpe_payment_referance_number": phonpe_payment_referance_number,
            "backend_log":"no expected order state came",
            "phonepe_response_data" :status_data,
            "phonepe_response_serializable":phonepe_response_serializable
        }, status=202)