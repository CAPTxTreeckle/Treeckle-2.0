from django.urls import include, path


urlpatterns = [
    path("events/", include("events.urls")),
    path("login/", include("login.urls")),
    path("organisations/", include("organisations.urls")),
    path("users/", include("users.urls")),
    path("venues/", include("venues.urls")),
    path("bookings", include("bookings.urls")),
    path("comments/", include("comments.urls"))
]
