from django.urls import path
from .views import GmailLoginView, OpenIdLoginView, AccessTokenRefreshView

urlpatterns = [
    path("openid", OpenIdLoginView.as_view(), name="login_openid"),
    path("gmail", GmailLoginView.as_view(), name="login_gmail"),
    path("refresh", AccessTokenRefreshView.as_view(), name="login_refresh"),
]
