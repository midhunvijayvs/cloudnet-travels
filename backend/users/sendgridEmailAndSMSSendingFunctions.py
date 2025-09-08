
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings
from twilio.rest import Client as TwilioClient





def send_login_otp_via_email(user, otp_value):
    """
    Sends OTP to user's email using SendGrid.
    Response format:
        - Success sending OTP: {status: 'success', message: 'OTP sent successfully'}
        - Failed sending OTP: {status: 'failed', message: <original error>}
    """
    template_id = 'd-a574566a6ae04886926d04dd31c395dc'
    template_data = {'otp': otp_value}

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=user.email,
    )
    message.dynamic_template_data = template_data
    message.template_id = template_id

    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        sg.send(message)
        return {'status': 'success', 'message': 'OTP sent successfully'}
    except Exception as e:
        error_message = str(e)
        if hasattr(e, 'body'):
            error_message = e.body
        elif hasattr(e, 'message'):
            error_message = e.message
        print(f"SendGrid Error: {error_message}")
        return {'status': 'failed', 'message': error_message}




def send_login_otp_via_sms(user, otp_value):
    """
    Sends OTP to user's phone using Twilio.
    Response format:
        - Success sending OTP: {status: 'success', message: 'OTP sent successfully'}
        - Failed sending OTP: {status: 'failed', message: <original error>}
    """
    try:
        twilio_client = TwilioClient(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        twilio_client.messages.create(
            body=f"Your OTP is {otp_value}",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=user.phonenumber
        )
        return {'status': 'success', 'message': 'OTP sent successfully'}
    except Exception as e:
        print(f"Twilio Error: {e}")
        return {'status': 'failed', 'message': str(e)}
