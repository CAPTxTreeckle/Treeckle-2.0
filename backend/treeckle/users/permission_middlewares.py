from http import HTTPStatus
import logging
from typing import List

from django.http import HttpResponse

from authentication import jwt
from users.logic import get_user_by_id, has_user_role
from treeckle.models.user import Role
from treeckle.strings.json_keys import AUTHORIZATION

logger = logging.getLogger("main")


def check_access(allowed_roles: List[Role]):
    def _method_wrapper(view_method):
        def _arguments_wrapper(instance, request, *args, **kwargs) :
            try:
                access_token = request.headers[AUTHORIZATION]
                user_id, is_valid = jwt.check_access_token(access_token)
                user = get_user_by_id(user_id)
                is_allowed = is_valid and has_user_role(user, allowed_roles)
                if not is_allowed:
                    raise Exception("No permission to access route")
            except Exception as e:
                logger.info(e)
                return HttpResponse(status=HTTPStatus.UNAUTHORIZED)

            return view_method(instance, request, requester=user, *args, **kwargs)

        return _arguments_wrapper

    return _method_wrapper
