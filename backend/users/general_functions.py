from users.models import CustomUser
from django.http import HttpResponse
from django.utils import timezone
    
def checkPaswwordReset(request):
    token_payload = request.auth.payload
    password_reset_count = token_payload.get('password_reset_count')
    my_user = CustomUser.objects.get(id=request.user.id)
    if password_reset_count != my_user.password_reset_count :
        return True
    else :
        return False
    

def get_client_ip(request):
    # Get the user's IP address from the request
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
