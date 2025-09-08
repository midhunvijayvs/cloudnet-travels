
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings
from twilio.rest import Client as TwilioClient

def send_welcome_email_for_admin_created_agency(first_name, last_name, username, email, reset_url):
    if settings.SENDGRID_API_KEY:
        email_content = f"""
        Dear {first_name} {last_name},

        You are successfully registered with us. 
        Your login details are as follows:
        
        Username: {username}
        Email: {email}
    

        for login please set your password using the following link:
        {reset_url}

        Regards,
        Cloudnet Team
        """

        message = Mail(
            from_email=settings.DEFAULT_FROM_EMAIL,
            to_emails=email,
            subject='Welcome to Taste Fleet!',
            plain_text_content=email_content
        )

        try:
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            sg.send(message)
            print("Email sent successfully")
        
        except Exception as e:
            
            error_message = str(e)
            if hasattr(e, 'body'):
                error_message = e.body
            elif hasattr(e, 'message'):
                error_message = e.messageprint(f"Error sending email: {e}")
            return {'status': 'failed', 'message': error_message}
        
    else:
        return({'status': 'failed', 'message': "SendGrid API Key not configured."})





