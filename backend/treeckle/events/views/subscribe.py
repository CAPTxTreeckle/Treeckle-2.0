from enum import Enum
import fastjsonschema
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from events.logic.event import event_to_json, get_subscribed_events
from events.logic.subscribe import (
    get_user_subscriptions,
    get_user_not_subscribed_categories,
    subscribe_to_category,
    unsubscribe_to_category,
)
from treeckle.models.user import Role, User
from treeckle.strings.json_keys import (
    ACTION,
    ACTIONS,
    CATEGORY_NAME,
    NOT_SUBSCRIBED_CATEGORIES,
    OBJECT,
    PROPERTIES,
    REQUIRED,
    STRING,
    SUBSCRIBED_CATEGORIES,
    TYPE,
)
from users.permission_middlewares import check_access


logger = logging.getLogger("main")


class SubscribeAction(str, Enum):
    SUBSCRIBE = "SUBSCRIBE"
    UNSUBSCRIBE = "UNSUBSCRIBE"


subscribe_action_data_validate = fastjsonschema.compile({
    TYPE: OBJECT,
    PROPERTIES: {
        ACTION: {TYPE: STRING},
        CATEGORY_NAME: {TYPE: STRING},
    },
    REQUIRED: [ACTION, CATEGORY_NAME]
})

class OwnSubscribeView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            subscriptions = get_user_subscriptions(requester)
            subscribed_categories = [s.category.name for s in subscriptions]
            not_subscribed_categories = get_user_not_subscribed_categories(requester, subscribed_categories)
            
            data = {
                SUBSCRIBED_CATEGORIES: subscribed_categories,
                NOT_SUBSCRIBED_CATEGORIES: [c for c in not_subscribed_categories]
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def patch(self, request, requester: User):
        try:
            actions = request.data[ACTIONS]
            for data in actions:
                try:
                    subscribe_action_data_validate(data)
                    action = data[ACTION]
                    category_name = data[CATEGORY_NAME]
                    if action == SubscribeAction.SUBSCRIBE:
                        subscribe_to_category(user=requester, category_name=category_name)
                    elif action == SubscribeAction.UNSUBSCRIBE:
                        unsubscribe_to_category(user=requester, category_name=category_name)
                except Exception as e:
                    logger.info(e)

            subscriptions = get_user_subscriptions(requester)
            subscribed_categories = [s.category.name for s in subscriptions]
            not_subscribed_categories = get_user_not_subscribed_categories(requester, subscribed_categories)
            
            data = {
                SUBSCRIBED_CATEGORIES: subscribed_categories,
                NOT_SUBSCRIBED_CATEGORIES: [c for c in not_subscribed_categories]
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SubscribedEventsView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            subscriptions = get_user_subscriptions(requester)
            events = get_subscribed_events(subscriptions)
            data = [event_to_json(e, requester) for e in events]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
