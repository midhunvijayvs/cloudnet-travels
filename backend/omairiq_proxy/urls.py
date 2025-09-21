from django.urls import path
from .views import   ProxySearchView,  BookTicketView, AIRIQLoginTokenListView

urlpatterns = [
    # path('login/', proxy_login),
    path("search/", ProxySearchView.as_view(), name="proxy-search"),

    path('book/', BookTicketView.as_view(), name="book-ticket"),

    path("login-history/", AIRIQLoginTokenListView.as_view(), name="airiq-token-list"),
]
