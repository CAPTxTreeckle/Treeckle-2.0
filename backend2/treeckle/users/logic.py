from typing import Sequence, Iterable, Tuple

from django.db.models.query import QuerySet

from treeckle.common.constants import ID, NAME, EMAIL, ORGANIZATION, ROLE
from email_service.logic import send_user_invite_emails
from .models import User, UserInvite, Organization


def user_to_json(user: User) -> dict:
    return {
        ID: user.id,
        NAME: user.name,
        EMAIL: user.email,
        ORGANIZATION: user.organization.name,
        ROLE: user.role,
    }


def user_invite_to_json(user_invite: UserInvite) -> dict:
    return {
        ID: user_invite.id,
        EMAIL: user_invite.email,
        ROLE: user_invite.role,
        ORGANIZATION: user_invite.organization.name,
    }


def get_user(**kwargs) -> User:
    return User.objects.select_related("organization").get(**kwargs)


def get_user_invite(**kwargs) -> UserInvite:
    return UserInvite.objects.select_related("organization").get(**kwargs)


def get_users(**kwargs) -> QuerySet[User]:
    return User.objects.select_related("organization").filter(**kwargs)


def get_user_invites(**kwargs) -> QuerySet[UserInvite]:
    return UserInvite.objects.select_related("organization").filter(**kwargs)


def get_valid_invitations(invitations: dict) -> Sequence[Tuple[str, str]]:
    existing_user_emails = User.objects.values_list("email", flat=True)
    existing_user_invite_emails = UserInvite.objects.values_list("email", flat=True)

    existing_emails_set = set(existing_user_emails) | set(existing_user_invite_emails)

    valid_invitations = [
        (invitation["email"].lower(), invitation["role"])
        for invitation in invitations
        if invitation["email"].lower() not in existing_emails_set
    ]

    return valid_invitations


def create_user_invites(
    valid_invitations: Iterable[Tuple[str, str]], organization: Organization
) -> Sequence[UserInvite]:
    user_invites_to_be_created = (
        UserInvite(organization=organization, email=email, role=role)
        for email, role in valid_invitations
    )
    new_user_invites = UserInvite.objects.bulk_create(
        user_invites_to_be_created, ignore_conflicts=True
    )

    send_user_invite_emails(new_user_invites)

    return new_user_invites


def update_users(user_data_dict: dict, organization: Organization) -> Sequence[User]:
    user_ids_to_be_updated = user_data_dict.keys()
    users_to_be_updated = [
        user
        for user in get_users(
            id__in=user_ids_to_be_updated,
            organization=organization,
        )
    ]

    ## https://pypi.org/project/django-update-from-dict/
    for user in users_to_be_updated:
        user.update_from_dict(user_data_dict[user.id], commit=False)

    User.objects.bulk_update(users_to_be_updated, fields=("name", "email", "role"))

    return users_to_be_updated


def delete_user_invites(
    emails_to_be_deleted: Iterable[str], organization: Organization
) -> None:
    get_user_invites(email__in=emails_to_be_deleted, organization=organization).delete()


def delete_users(
    emails_to_be_deleted: Iterable[str], organization: Organization
) -> None:
    get_users(email__in=emails_to_be_deleted, organization=organization).delete()


def sanitize_and_convert_data_list_to_dict(
    data_list: Iterable[dict],
    key_name: str,
    fields: Iterable[str],
) -> dict:
    fields_set = set(fields)

    return {
        data[key_name]: {
            field: field_value
            for field, field_value in data.items()
            if field in fields_set
        }
        for data in data_list
        if key_name in data
    }
