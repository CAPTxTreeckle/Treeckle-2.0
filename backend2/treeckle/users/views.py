from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .logic import (
    get_user_invites,
    get_users,
    user_invite_to_json,
    user_to_json,
    get_valid_invitations,
    create_user_invites,
    update_users,
    delete_user_invites,
    delete_users,
)
from .models import User, UserInvite, Role
from .permission_middlewares import check_access
from .serializers import (
    PostUserInviteSerializer,
    EmailListSerializer,
    PatchUserSerializer,
)

# Create your views here.
class UserInviteView(APIView):
    @check_access([Role.ADMIN])
    def get(self, request, requester: User):
        same_organization_user_invites = get_user_invites(
            organization=requester.organization
        )

        data = [
            user_invite_to_json(user_invite)
            for user_invite in same_organization_user_invites
        ]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.ADMIN])
    def post(self, request, requester: User):
        serializer = PostUserInviteSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        ## shape: [{email: <email>, role: <role>}]
        invitations = serializer.validated_data["invitations"]
        ## shape: [(email, role)]
        valid_invitations = get_valid_invitations(invitations)
        new_user_invites = create_user_invites(
            valid_invitations=valid_invitations,
            organization=requester.organization,
        )

        data = [user_invite_to_json(user_invite) for user_invite in new_user_invites]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.ADMIN])
    def delete(self, request, requester: User):
        serializer = EmailListSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        emails_to_be_deleted = serializer.validated_data["emails"]
        delete_user_invites(emails_to_be_deleted, organization=requester.organization)

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserView(APIView):
    @check_access([Role.ADMIN])
    def get(self, request, requester: User):
        same_organization_users = get_users(organization=requester.organization)

        data = [user_to_json(user) for user in same_organization_users]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.ADMIN])
    def patch(self, request, requester: User):
        serializer = PatchUserSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        ## shape: [{id, name, email, role}]
        user_data_list = serializer.validated_data["users"]

        ## shape: {id: {name, email, role}}
        user_data_dict = {
            user_data["id"]: {
                field: field_value
                for field, field_value in user_data.items()
                if field != "id"
            }
            for user_data in user_data_list
        }

        ## ensure user doesn't change own role
        if "role" in user_data_dict.get(requester.id, {}):
            del user_data_dict[requester.id]["role"]

            if not user_data_dict[requester.id]:
                del user_data_dict[requester.id]

        updated_users = update_users(
            user_data_dict,
            organization=requester.organization,
        )

        data = [user_to_json(user) for user in updated_users]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.ADMIN])
    def delete(self, request, requester: User):
        serializer = EmailListSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        emails_to_be_deleted = serializer.validated_data["emails"]

        ## ensure user doesn't delete its own account
        try:
            emails_to_be_deleted.remove(requester.email)
        except ValueError:
            ## self not in emails_to_be_deleted
            pass

        delete_users(emails_to_be_deleted, organization=requester.organization)

        return Response(status=status.HTTP_204_NO_CONTENT)