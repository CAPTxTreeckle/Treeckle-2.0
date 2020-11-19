from django.contrib import admin
from django.urls import path, include, re_path
from comments.views import BookingCommentsView

urlpatterns = [
    path("", BookingCommentsView.as_view()),
    path("<int:id>", BookingCommentsView.as_view())
]