from enum import Enum
import fastjsonschema
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from events.middlewares import validate_event_edit_access
from events.logic.sign_up import (
    approve_sign_up,
    attend_sign_up,
    create_sign_up,
    delete_sign_up,
    sign_up_to_json,
)
from treeckle.models.user import Role, User
from treeckle.strings.json_keys import (
    ACTION,
    ACTIONS,
    NUMBER,
    OBJECT,
    PROPERTIES,
    REQUIRED,
    USER_ID,
    STRING,
    TYPE,
)
from users.permission_middlewares import check_access


logger = logging.getLogger("main")

class OwnSignUpView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def post(self, request, requester: User, event_id: int):
        try:
            sign_up = create_sign_up(user_id=requester.id, event_id=event_id)
            data = sign_up_to_json(sign_up)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def patch(self, request, requester: User, event_id: int):
        try:
            sign_up = attend_sign_up(user_id=requester.id, event_id=event_id)
            data = sign_up_to_json(sign_up)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def delete(self, request, requester: User, event_id: int):
        try:
            delete_sign_up(user_id=requester.id, event_id=event_id)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SignUpAction(str, Enum):
    ATTEND = "ATTEND"
    CONFIRM = "CONFIRM"
    REJECT = "REJECT"


sign_up_action_data_validate = fastjsonschema.compile({
    TYPE: OBJECT,
    PROPERTIES: {
        ACTION: {TYPE: STRING},
        USER_ID: {TYPE: NUMBER},
    },
    REQUIRED: [ACTION, USER_ID]
})

class SignUpView(APIView):
    @check_access([Role.ORGANIZER, Role.ADMIN])
    @validate_event_edit_access
    def patch(self, request, requester: User, event_id: int):
        try:
            actions = request.data[ACTIONS]
            for data in actions:
                sign_up_action_data_validate(data)
                action = data[ACTION]
                user_id = data[USER_ID]
                if action == SignUpAction.ATTEND:
                    attend_sign_up(user_id=user_id, event_id=event_id)
                elif action == SignUpAction.CONFIRM:
                    approve_sign_up(user_id=user_id, event_id=event_id)
                elif action == SignUpAction.REJECT:
                    delete_sign_up(user_id=user_id, event_id=event_id)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
