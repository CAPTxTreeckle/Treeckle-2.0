import logging
from typing import Sequence

from treeckle.models.organisation import (
    Organisation,
    OrganisationListener,
)
from treeckle.strings.json_keys import (
    EMAIL,
    ID,
    ORGANISATION_ID,
)


logger = logging.getLogger("main")


def create_listener(
    email: str,
    organisation: Organisation,
) -> OrganisationListener:
    return OrganisationListener.objects.create(
        email=email,
        organisation=organisation,
    )


def delete_listener_by_id(id: int) -> None:
    OrganisationListener.objects.filter(id=id).delete()


def get_listener_by_id(id: int) -> OrganisationListener:
    return OrganisationListener.objects.get(id=id)


def get_listeners_by_organisation(organisation: Organisation) -> Sequence[OrganisationListener]:
    return OrganisationListener.objects.filter(organisation=organisation)


def listener_to_json(listener: OrganisationListener) -> dict:
    return {
        ID: listener.id,
        EMAIL: listener.email,
        ORGANISATION_ID: listener.organisation_id,
    }
