from django.db import models

from treeckle.models.organisation import Organisation
from treeckle.models.timestamped_model import TimestampedModel


_ROLE = "role"
_THIRD_PARTY_AUTHENTICATOR = "third_party_authenticator"
_THIRD_PARTY_ID = "third_party_id"
_USER_ID = "user_id"


class ThirdPartyAuthenticator(models.TextChoices):
    NONE = "NONE"
    GOOGLE = "GOOGLE"
    NUSNET = "NUSNET"


class Role(models.TextChoices):
    RESIDENT = "RESIDENT"
    ORGANIZER = "ORGANIZER"
    ADMIN = "ADMIN"


class User(TimestampedModel):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    third_party_authenticator = models.CharField(
        max_length=100,
        choices=ThirdPartyAuthenticator.choices,
        default=ThirdPartyAuthenticator.NONE,
    )
    third_party_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    class Meta:
        db_table = "treeckle_user_tab"
        constraints = [
            models.UniqueConstraint(
                fields=[_THIRD_PARTY_ID, _THIRD_PARTY_AUTHENTICATOR],
                name="unique third party id and authenticator",
            )
        ]


class UserRole(TimestampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=50, choices=Role.choices, default=Role.RESIDENT)

    class Meta:
        db_table = "user_role_tab"
        constraints = [
            models.UniqueConstraint(
                fields=[_USER_ID, _ROLE], name="unique user role")
        ]


class UserInvite(TimestampedModel):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=50, choices=Role.choices, default=Role.RESIDENT)

    class Meta:
        db_table = "treeckle_user_invite_tab"
