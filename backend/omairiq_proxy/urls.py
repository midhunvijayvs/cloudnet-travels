from django.urls import path
from .views import proxy_login,  proxy_search,  proxy_book, initiate_payment

urlpatterns = [
    path('login/', proxy_login),
    path('search/', proxy_search),
    path('book/', proxy_book),
    path('phonepe/initiate/', initiate_payment),
    # path('api/phonepe/verify/', verify_payment),
]
