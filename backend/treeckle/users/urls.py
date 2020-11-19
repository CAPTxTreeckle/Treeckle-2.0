from django.urls import path

from .views import (
    SingleUserInviteView,
    SingleUserView,
    UserInviteView,
    UsersView,
)


urlpatterns = [
    path("", UsersView.as_view()),
    path("<int:user_id>", SingleUserView.as_view()),
    path("invite", UserInviteView.as_view()),
    path("invite/<int:user_invite_id>", SingleUserInviteView.as_view()),
]
