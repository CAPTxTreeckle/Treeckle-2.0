from django.urls import path

from .views import GmailLoginView, NusNetView, TokenLoginView


urlpatterns = [
    path('gmail', GmailLoginView.as_view()),
    path('nusnet', NusNetView.as_view()),
    path('token', TokenLoginView.as_view()),
]
