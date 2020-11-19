import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.validators import validate_email

from organisations.logic import (
    create_listener,
    delete_listener_by_id,
    get_listener_by_id,
    get_listeners_by_organisation,
    listener_to_json,
)
from treeckle.models.user import Role, User
from treeckle.strings.json_keys import (
    ACCEPTED,
    EMAILS,
    LISTENERS,
    REJECTED,
)
from users.permission_middlewares import check_access


logger = logging.getLogger("main")

class OrganisationListenersView(APIView):
    @check_access([Role.ADMIN])
    def post(self, request, requester: User):
        try:
            emails = request.data[EMAILS]
            accepted_list = []
            rejected_list = []
            for email in emails:
                try:  
                    validate_email(email)
                    create_listener(
                        email=email,
                        organisation=requester.organisation,
                    )
                    accepted_list.append(email)
                except:
                    rejected_list.append(email)
            data = {
                ACCEPTED: accepted_list,
                REJECTED: rejected_list,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.ADMIN])
    def get(self, request, requester: User):
        try:
            listeners = get_listeners_by_organisation(requester.organisation)
            data = {LISTENERS: [listener_to_json(x) for x in listeners]}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SingleOrganisationListenerView(APIView):
    @check_access([Role.ADMIN])
    def delete(self, request, requester: User, listener_id: int):
        try:
            listener = get_listener_by_id(listener_id)
            if listener.organisation_id != requester.organisation_id:
                raise Exception("User has no permission to modify this category")
            delete_listener_by_id(listener_id)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
