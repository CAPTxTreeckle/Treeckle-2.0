from django.urls import path

from .views.event import (
    EventsView,
    EventCategoryTypesView,
    OwnEventsView,
    SignedUpEventsView,
    PublishedEventsView,
    SingleEventView,
)
from .views.subscription import (
    SubscribedEventsView,
    OwnEventCategoryTypeSubscriptionsView,
)

urlpatterns = [
    path("", EventsView.as_view(), name="all_events"),
    path("categories", EventCategoryTypesView.as_view(), name="event_categories"),
    path(
        "categories/subscriptions",
        OwnEventCategoryTypeSubscriptionsView.as_view(),
        name="own_event_category_subscriptions",
    ),
    path("own", OwnEventsView.as_view(), name="own_events"),
    path("signedup", SignedUpEventsView.as_view(), name="signed_up_events"),
    path("published", PublishedEventsView.as_view(), name="published_events"),
    path("subscribed", SubscribedEventsView.as_view(), name="subscribed_events"),
    path("<int:event_id>", SingleEventView.as_view(), name="single_event"),
]