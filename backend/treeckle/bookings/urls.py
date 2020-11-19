from django.contrib import admin
from django.urls import path, include, re_path
from bookings.views import GetBookingsDetails, AllBookings

urlpatterns = [
    re_path(r'^(?:/(?P<offset>^[0-9]+$))?(?:/(?P<limit>^[0-9]+$))?/$', GetBookingsDetails.as_view()),
    re_path(r'^/all(?:/(?P<offset>^[0-9]+$))?(?:/(?P<limit>^[0-9]+$))?(?:/(?P<status>^[0-3]$))?(?:/(?P<start>^[0-9]+$))?(?:/(?P<end>^[0-9]+$))?(?:/(?P<venue>^[0-9]+$))?/$', AllBookings.as_view())
]