from rest_framework.exceptions import NotFound, PermissionDenied

from users.models import User, Role
from events.models import Event
from events.logic.event import get_event


def check_user_event_same_organization(view_method):
    def _arguments_wrapper(
        instance, request, requester: User, event_id: int, *args, **kwargs
    ):
        try:
            event = get_event(id=event_id)

            if event.creator.organization != requester.organization:
                raise PermissionDenied(
                    "User and event are in different organization.",
                    "wrong_organization",
                )

        except (Event.DoesNotExist, PermissionDenied):
            raise NotFound("No event found.", code="no_event_found")

        return view_method(
            instance, request, requester=requester, event=event, *args, **kwargs
        )

    return _arguments_wrapper


def check_event_modifier(view_method):
    def _arguments_wrapper(
        instance, request, requester: User, event: Event, *args, **kwargs
    ):
        is_admin = requester.role == Role.ADMIN
        is_event_creator = requester == event.creator
        has_modify_event_permission = is_admin or is_event_creator

        if not has_modify_event_permission:
            raise PermissionDenied(
                "No permission to modify event.",
                "no_modify_event_permission",
            )

        return view_method(
            instance, request, requester=requester, event=event, *args, **kwargs
        )

    return _arguments_wrapper