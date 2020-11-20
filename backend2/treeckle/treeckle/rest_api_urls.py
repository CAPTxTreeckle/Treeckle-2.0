from django.urls import include, path


urlpatterns = [
    path("gateway/", include("authentication.urls")),
    path("users/", include("users.urls")),
]
