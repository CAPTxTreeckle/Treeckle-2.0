from enum import Enum
import fastjsonschema
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from events.logic.event import event_to_json
from events.logic.recommend import get_recommended_events
from treeckle.models.user import Role, User
from users.permission_middlewares import check_access


logger = logging.getLogger("main")


class RecommendedEventsView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            events = get_recommended_events(requester)
            data = [event_to_json(e, requester) for e in events]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)