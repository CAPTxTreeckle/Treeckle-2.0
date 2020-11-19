import logging

from rest_framework import status
from rest_framework.response import Response

from treeckle.models.user import Role, User
from events.logic.event import get_event_by_id
from users.logic import has_user_role


logger = logging.getLogger("main")

def validate_event_edit_access(view_method):
    def _arguments_wrapper(instance, request, requester: User, event_id: int, *args, **kwargs) :
        try:
            event = get_event_by_id(event_id)
            is_same_organisation = event.organiser.organisation == requester.organisation
            has_admin_role = has_user_role(requester, [Role.ADMIN])
            is_event_creator = event.organiser == requester
            has_permission = is_same_organisation and (has_admin_role or is_event_creator)
            if not has_permission:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return view_method(instance, request, requester=requester, event_id=event_id, *args, **kwargs)
    return _arguments_wrapper