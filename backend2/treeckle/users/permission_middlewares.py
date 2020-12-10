from typing import List

from django.utils.translation import gettext_lazy as _

from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

from .models import User, Role
from .logic import get_user


def check_access(*allowed_roles: Role):
    def _method_wrapper(view_method):
        def _arguments_wrapper(instance, request, *args, **kwargs):
            requester_id = request.user.id

            try:
                requester = get_user(id=requester_id)

            except User.DoesNotExist:
                raise AuthenticationFailed(
                    _("Invalid user."),
                    code="invalid_user",
                )

            if requester.role not in allowed_roles:
                raise PermissionDenied(
                    _("No permission to access route"), code="invalid_permission"
                )

            return view_method(instance, request, requester=requester, *args, **kwargs)

        return _arguments_wrapper

    return _method_wrapper
