from django.urls import path
from .views import   proxy_search,  proxy_book, AIRIQLoginTokenListView

urlpatterns = [
    # path('login/', proxy_login),
    path('search/', proxy_search),
    path('book/', proxy_book),
    path("login-history/", AIRIQLoginTokenListView.as_view(), name="airiq-token-list"),
]
