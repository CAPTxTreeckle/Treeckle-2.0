from django.urls import path

from .views import UserInvitesView, UsersView

urlpatterns = [
    path("", UsersView.as_view(), name="all_users"),
    path("invite", UserInvitesView.as_view(), name="all_user_invites"),
]