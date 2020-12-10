from rest_framework.exceptions import NotFound, PermissionDenied

from users.models import User
from .models import Venue
from .logic import get_venue


def check_user_venue_same_organization(view_method):
    def _arguments_wrapper(
        instance, request, requester: User, venue_id: int, *args, **kwargs
    ):
        try:
            venue = get_venue(id=venue_id)

            if venue.organization != requester.organization:
                raise PermissionDenied(
                    "User and venue are in different organization.",
                    "wrong_organization",
                )

        except (Venue.DoesNotExist, PermissionDenied):
            raise NotFound("No venue found.", code="no_venue_found")

        return view_method(
            instance, request, requester=requester, venue=venue, *args, **kwargs
        )

    return _arguments_wrapper