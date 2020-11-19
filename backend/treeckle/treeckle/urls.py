from django.contrib import admin
from django.urls import path, include
from bookings.views import GetBookingsDetails, AllBookings

urlpatterns = [
    path("administration/", admin.site.urls),
    path("api/", include("treeckle.rest_api_urls")),
]
