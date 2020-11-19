from django.urls import path

from .views import SingleVenueView, VenuesView, VenueCategoriesView


urlpatterns = [
    path("", VenuesView.as_view()),
    path("categories", VenueCategoriesView.as_view()),
    path("<int:venue_id>", SingleVenueView.as_view()),
]
