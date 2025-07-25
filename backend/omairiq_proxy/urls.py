from django.urls import path
from .views import proxy_login,  proxy_search,  proxy_book, initiate_payment

urlpatterns = [
    path('api/login/', proxy_login),
    path('api/search/', proxy_search),
    path('api/book/', proxy_book),
    path('api/phonepe/initiate/', initiate_payment),
    # path('api/phonepe/verify/', verify_payment),
]
