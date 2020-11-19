from django.urls import path

from .views import (
    OrganisationListenersView,
    SingleOrganisationListenerView,
)


urlpatterns = [
    path("listeners", OrganisationListenersView.as_view()),
    path("listeners/<int:listener_id>", SingleOrganisationListenerView.as_view()),
]
