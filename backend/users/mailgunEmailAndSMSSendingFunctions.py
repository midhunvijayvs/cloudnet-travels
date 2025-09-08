import requests
import json
from django.conf import settings

def send_login_otp_via_email(user, otp_value):
    """
    Sends OTP to user's email using Mailgun template.
    Response format:
        - Success sending OTP: {status: 'success', message: 'OTP sent successfully'}
        - Failed sending OTP: {status: 'failed', message: <original error>}
    """

    MAILGUN_DOMAIN = settings.MAILGUN_DOMAIN  # e.g., 'sandbox123.mailgun.org'
    MAILGUN_API_KEY = settings.MAILGUN_API_KEY
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = user.email

    # Use a Mailgun template stored in your Mailgun account
    template_name = "login_otp_template"  # Your template name in Mailgun
    template_variables = {
        "username": user.username,
        "otp": otp_value,
        "valid_minutes": 5
    }

    try:
        response = requests.post(
            f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
            auth=("api", MAILGUN_API_KEY),
            data={
                "from": from_email,
                "to": [to_email],
                "subject": "Your Login OTP",
                "template": template_name,
                "h:X-Mailgun-Variables": json.dumps(template_variables)
            }
        )

        if response.status_code == 200:
            return {'status': 'success', 'message': 'OTP sent successfully'}
        else:
            return {'status': 'failed', 'message': response.text}

    except Exception as e:
        error_message = str(e)
        print(f"Mailgun Error: {error_message}")
        return {'status': 'failed', 'message': error_message}

