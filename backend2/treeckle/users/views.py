from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from treeckle.common.generators import generate_error_message
from .logic import (
    get_user_invites,
    get_users,
    user_invite_to_json,
    user_to_json,
    get_valid_invitations,
    create_user_invites,
    update_user_invites,
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
    PatchUserInviteSerializer,
)

# Create your views here.
class UserInviteView(APIView):
    @check_access([Role.Admin])
    def get(self, request, requester: User):
        same_organization_user_invites = get_user_invites(
            organization=requester.organization
        )

        data = [
            user_invite_to_json(user_invite)
            for user_invite in same_organization_user_invites
        ]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.Admin])
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

    @check_access([Role.Admin])
    def patch(self, request, requester: User):
        serializer = PatchUserInviteSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        ## shape: [{id, role}]
        user_invite_data_list = serializer.validated_data["users"]

        ## shape: {id: {role: }}
        user_invite_data_dict = {
            user_invite_data["id"]: {
                field: field_value
                for field, field_value in user_invite_data.items()
                if field != "id"
            }
            for user_invite_data in user_invite_data_list
        }

        updated_user_invites = update_user_invites(
            user_invite_data_dict,
            organization=requester.organization,
        )

        if not updated_user_invites:
            return Response(
                generate_error_message("No user invites updated."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = [
            user_invite_to_json(user_invite) for user_invite in updated_user_invites
        ]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.Admin])
    def delete(self, request, requester: User):
        serializer = EmailListSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        emails_to_be_deleted = serializer.validated_data["emails"]
        deleted_emails = delete_user_invites(
            emails_to_be_deleted,
            organization=requester.organization,
        )

        if not deleted_emails:
            return Response(
                generate_error_message("No user invites deleted."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(deleted_emails, status=status.HTTP_200_OK)


class UserView(APIView):
    @check_access([Role.Admin])
    def get(self, request, requester: User):
        same_organization_users = get_users(organization=requester.organization)

        data = [user_to_json(user) for user in same_organization_users]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.Admin])
    def patch(self, request, requester: User):
        serializer = PatchUserSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        ## shape: [{id, name, email, role}]
        user_data_list = serializer.validated_data["users"]

        ## shape: {id: {name: , email: , role: }}
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

        if not updated_users:
            return Response(
                generate_error_message("No users updated."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = [user_to_json(user) for user in updated_users]

        return Response(data, status=status.HTTP_200_OK)

    @check_access([Role.Admin])
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

        deleted_emails = delete_users(
            emails_to_be_deleted,
            organization=requester.organization,
        )

        if not deleted_emails:
            return Response(
                generate_error_message("No users deleted."),
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(deleted_emails, status=status.HTTP_200_OK)