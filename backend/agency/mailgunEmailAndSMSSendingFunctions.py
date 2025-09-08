import requests
import json
from django.conf import settings


import requests
from django.conf import settings

def send_welcome_email_for_admin_created_agency(first_name, last_name, username, email, reset_url):
    """
    Sends a welcome email to an agency created by admin using Mailgun.
    Response format:
        - Success: {status: 'success', message: 'successfully sent mail'}
        - Failed:  {status: 'failed', message: <original error>}
    """

    MAILGUN_DOMAIN = settings.MAILGUN_DOMAIN   # e.g., "mg.yourdomain.com"
    MAILGUN_API_KEY = settings.MAILGUN_API_KEY
    from_email = settings.DEFAULT_FROM_EMAIL

    email_content = f"""
    Dear {first_name} {last_name},

    You are successfully registered with us. 
    Your login details are as follows:
    
    Username: {username}
    Email: {email}

    For login please set your password using the following link:
    {reset_url}

    Regards,
    Cloudnet Team
    """

    try:
        response = requests.post(
            f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
            auth=("api", MAILGUN_API_KEY),
            data={
                "from": from_email,
                "to": [email],
                "subject": "Welcome to Taste Fleet!",
                "text": email_content
            }
        )

        if response.status_code == 200:
            return {'status': 'success', 'message': 'successfully sent mail'}
        else:
            return {'status': 'failed', 'message': response.text}

    except Exception as e:
        error_message = str(e)
        return {'status': 'failed', 'message': error_message}
