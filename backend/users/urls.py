from django.urls import path
from django.urls import path, register_converter

from .views import *
urlpatterns = [

    # path('register/', UserRegistrationView.as_view(), name='register'),
    path('verify_email/', VerifyEmailView.as_view(), name='verify-email'),
    path('verify_phone/', VerifyPhoneView.as_view(), name='verify-phone'),
    path('login/', LoginView.as_view(), name='login'),
    path('submit_otp/', SubmitOTPView.as_view(), name='submit_otp'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset-request/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset/new-password/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('activate/', ActivateAccountView.as_view(), name='activate'),

    path("<int:pk>/", UserDeletionView.as_view(), name="user-delete"),
    
    path("details/", UserDetailsView.as_view(), name="user-detail"),

]




 
