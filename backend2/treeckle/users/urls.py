from django.urls import path

from .views import UserInviteView

urlpatterns = [
    path("invite", UserInviteView.as_view(), name="user_invite"),
]