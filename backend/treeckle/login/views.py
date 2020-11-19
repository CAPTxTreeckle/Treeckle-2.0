import fastjsonschema
import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.exceptions import ObjectDoesNotExist

from authentication import jwt, google
from users.logic import (
    get_user_by_email,
    get_user_by_id,
    update_user_invite,
)
from treeckle.models.user import ThirdPartyAuthenticator, User
from treeckle.strings.json_keys import (
    AUTHORIZATION,
    EMAIL,
    ID_TOKEN,
    NAME,
    NUSNET_ID,
    OBJECT,
    PROPERTIES,
    REQUIRED,
    STRING,
    TYPE,
)

logger = logging.getLogger("main")


gmail_login_data_validate = fastjsonschema.compile({
    TYPE: OBJECT,
    PROPERTIES: {ID_TOKEN: {TYPE: STRING}},
    REQUIRED: [ID_TOKEN]
})

class GmailLoginView(APIView):
    def post(self, request):
        try:
            request_data = request.data
            gmail_login_data_validate(request_data)
            id_token = request_data[ID_TOKEN]
            authenticated_user = google.authenticate_gmail_token(id_token)
            update_user_invite(authenticated_user)
            user = get_user_by_email(authenticated_user.email)
            data = jwt.get_authentication_data(user)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response({}, status=status.HTTP_400_BAD_REQUEST)


nus_login_data_validate = fastjsonschema.compile({
    TYPE: OBJECT,
    PROPERTIES: {
        EMAIL: {TYPE: STRING},
        NAME: {TYPE: STRING},
        NUSNET_ID: {TYPE: STRING},
    },
    REQUIRED: [EMAIL, NAME, NUSNET_ID]
})

class NusNetView(APIView):
    def post(self, request):
        try:
            request_data = request.data
            nus_login_data_validate(request_data)
            authenticated_user = User(
                third_party_authenticator=ThirdPartyAuthenticator.NUSNET,
                third_party_id=request_data[NUSNET_ID],
                name=request_data[NAME],
                email=request_data[EMAIL],
            )
            logger.info(request_data[EMAIL])
            update_user_invite(authenticated_user)
            user = get_user_by_email(authenticated_user.email)
            data = jwt.get_authentication_data(user)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response({}, status=status.HTTP_400_BAD_REQUEST)


token_login_data_validate = fastjsonschema.compile({
    TYPE: STRING,
})

class TokenLoginView(APIView):
    def post(self, request):
        try:
            refresh_token = request.headers.get(AUTHORIZATION)
            token_login_data_validate(refresh_token)
            user_id, is_valid = jwt.check_refresh_token(refresh_token)
        except Exception as e:
            logger.info(e)
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        if not is_valid:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = get_user_by_id(user_id)
            data = jwt.get_authentication_data(user)
            return Response(data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.info(e)
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
