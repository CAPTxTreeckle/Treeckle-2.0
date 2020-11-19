import fastjsonschema
import logging
import traceback
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.validators import validate_email

from users.logic import (
    create_user_invitation,
    delete_users_by_emails,
    delete_user_invite_by_id,
    user_to_json,
    get_users_of_organisation,
    update_user_by_id,
)
from treeckle.models.user import Role, User
from treeckle.strings.json_keys import (
    EMAILS,
    INVITED,
    OBJECT,
    PROPERTIES,
    REJECTED,
    REQUIRED,
    ROLE,
    STRING,
    TYPE,
    USER,
    USERS,
)
from users.permission_middlewares import check_access

logger = logging.getLogger("main")


validate_string = fastjsonschema.compile({TYPE: STRING})


class UserInviteView(APIView):
    @check_access([Role.ADMIN])
    def post(self, request, requester: User):
        try:
            new_user_emails = request.data[EMAILS]
            invited_list = []
            rejected_list = []
            for email in new_user_emails:
                try:  
                    validate_string(email)
                    validate_email(email)
                    create_user_invitation(email, requester.organisation)
                    invited_list.append(email)
                except Exception as e:
                    traceback.print_exc()
                    rejected_list.append(email)
            data = {
                INVITED: invited_list,
                REJECTED: rejected_list,
            }
            logger.info(data)
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SingleUserInviteView(APIView):
    @check_access([Role.ADMIN])
    def delete(self, request, requester: User, user_invite_id: int):
        try:
            delete_user_invite_by_id(user_invite_id)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UsersView(APIView):
    @check_access([Role.ADMIN])
    def get(self, request, requester: User):
        try:
            organisation_users = get_users_of_organisation(
                requester.organisation)
            organisation_user_list = [user_to_json(user) for user in organisation_users]
            data = {USERS: organisation_user_list}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @check_access([Role.ADMIN])
    def delete(self, request, requester: User):
        try:
            emails_of_users_to_delete = request.data[EMAILS]
            for email in emails_of_users_to_delete:
                validate_string(email)
            delete_users_by_emails(emails_of_users_to_delete)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


patch_user_data_validate = fastjsonschema.compile({
    TYPE: OBJECT,
    PROPERTIES: {ROLE: {TYPE: STRING}},
    REQUIRED: [ROLE]
})


class SingleUserView(APIView):
    @check_access([Role.ADMIN])
    def patch(self, request, requester: User, user_id: int):
        try:
            request_data = request.data
            patch_user_data_validate(request_data)
            role = request_data[ROLE]
            user = update_user_by_id(user_id, role)
            data = {USER: user_to_json(user)}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
