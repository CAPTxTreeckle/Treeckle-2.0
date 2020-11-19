from typing import Sequence

from django.db import transaction

from treeckle.models.organisation import Organisation
from treeckle.models.user import Role, User, UserInvite, UserRole
from treeckle.strings.json_keys import EMAIL, ID, NAME, ROLE, ORGANISATION
from emailer.send import send_invitation_email


def create_user_invitation(email: str, organisation: Organisation) -> UserInvite:
    existing_user = User.objects.filter(email=email).first()
    if existing_user is not None:
        raise Exception("User already exists")

    user_invite = UserInvite.objects.create(email=email, organisation=organisation)
    send_invitation_email(email, organisation)
    return user_invite

def delete_users_by_emails(emails: Sequence[str]) -> None:
    return User.objects.filter(email__in=emails).delete()


def delete_user_invite_by_id(id: int) -> None:
    return UserInvite.objects.filter(id=id).delete()


def get_user_by_email(email: str) -> User:
    return User.objects.get(email=email)


def get_user_by_id(id: int) -> User:
    return User.objects.select_related("organisation").get(id=id)
        

def user_to_json(user: User) -> dict:
    user_role = get_user_roles(user).first()
    return {
        ID: user.id,
        NAME: user.name,
        EMAIL: user.email,
        ORGANISATION: user.organisation.name,
        ROLE: user_role.role,
    }


def user_invite_to_json(user_invite: UserInvite) -> dict:
    return {
        ID: user_invite.id,
        EMAIL: user_invite.email,
        ROLE: user_invite.role,
        ORGANISATION: user_invite.organisation.name
    }


def get_user_roles(user: User):
    return UserRole.objects.filter(user=user)


def get_users_of_organisation(organisation: Organisation) -> Sequence[Organisation]:
    return User.objects.filter(organisation=organisation)


def has_user_role(user: User, roles: Sequence[Role]) -> bool:
    return UserRole.objects.filter(user=user, role__in=roles).exists()



def update_user_by_id(id: int, role: str) -> User:
    user = get_user_by_id(id)
    with transaction.atomic():
        UserRole.objects.filter(user=user).delete()
        UserRole.objects.create(user=user, role=role)
    return user


def update_user_invite(user: User) -> None:
    try:
        user_invite = UserInvite.objects.get(email=user.email)      
    except:
        return

    with transaction.atomic():
        new_user = User.objects.create(
            third_party_authenticator=user.third_party_authenticator,
            third_party_id=user.third_party_id,
            name=user.name,
            email=user.email,
            organisation=user_invite.organisation,
        )
        UserRole.objects.create(user=new_user, role=user_invite.role)
        UserInvite.objects.filter(id=user_invite.id).delete()
