from django.urls import path

from .views.event import (
    CategoriesView,
    EventsView,
    OwnEventsView,
    SignedUpEventsView,
    SingleCategoriesView,
    SingleEventView,
)
from .views.sign_up import (
    OwnSignUpView,
    SignUpView,
)
from .views.subscribe import (
    OwnSubscribeView,
    SubscribedEventsView,
)
from .views.recommend import RecommendedEventsView


urlpatterns = [
    path("", EventsView.as_view()),
    path("categories", CategoriesView.as_view()),
    path("categories/<int:category_id>", SingleCategoriesView.as_view()),
    path("categories/subscriptions", OwnSubscribeView.as_view()),
    path("self", OwnEventsView.as_view()),
    path("signed_up", SignedUpEventsView.as_view()),
    path("subscribed", SubscribedEventsView.as_view()),
    path("recommended", RecommendedEventsView.as_view()),
    path("<int:event_id>", SingleEventView.as_view()),
    path("<int:event_id>/self_sign_up", OwnSignUpView.as_view()),
    path("<int:event_id>/sign_up", SignUpView.as_view()),
]
