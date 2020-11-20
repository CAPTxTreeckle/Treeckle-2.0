from treeckle.common.constants import ID, NAME, EMAIL, ORGANIZATION, ROLE
from .models import User, UserInvite


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