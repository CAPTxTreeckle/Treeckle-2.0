import logging

from rest_framework import status
from rest_framework.response import Response

from treeckle.models.user import User
from venues.logic import get_venue_by_id


logger = logging.getLogger("main")

def validate_venue_same_organisation(view_method):
    def _arguments_wrapper(instance, request, requester: User, venue_id: int, *args, **kwargs) :
        try:
            venue = get_venue_by_id(venue_id)
            if venue.organisation != requester.organisation:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return view_method(instance, request, requester=requester, venue_id=venue_id, *args, **kwargs)
    return _arguments_wrapper