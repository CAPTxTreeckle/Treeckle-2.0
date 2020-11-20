from .models import User, UserInvite
from treeckle.common.constants import ID, NAME, EMAIL, ORGANIZATION, ROLE


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
        ORGANIZATION: user_invite.organisation.name,
    }