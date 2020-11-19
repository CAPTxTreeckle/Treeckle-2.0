from typing import Sequence

from django.db.models import Q

from treeckle.models.organisation import Organisation
from treeckle.models.venue import Venue, VenueCategory
from treeckle.strings.json_keys import CATEGORY, CREATED_AT, UPDATED_AT, FORM_DATA, ID, NAME


_CATEGORY_ID = "category_id"

def create_or_update_category(name: str, organisation: Organisation) -> VenueCategory:
    category, _ = VenueCategory.objects.update_or_create(
        name=name, organisation=organisation)
    return category


def create_venue(
    name: str,
    form_data: str,
    category: VenueCategory,
    organisation: Organisation,
) -> Venue:
    return Venue.objects.create(
        name=name,
        form_data=form_data,
        category=category,
        organisation=organisation,
    )


def delete_venue_by_id(id: int) -> None:
    Venue.objects.filter(id=id).delete()
    delete_unused_categories()


def delete_unused_categories():
    used_category_ids = Venue.objects.all().values_list(_CATEGORY_ID, flat=True).distinct()
    VenueCategory.objects.filter(~Q(id__in=used_category_ids)).delete()


def get_venue_by_id(id: int) -> Venue:
    return Venue.objects.get(id=id)


def get_venues_by_organisation(organisation: Organisation) -> Sequence[Venue]:
    return Venue.objects.filter(organisation=organisation)


def get_venue_categories_by_organisation(organisation: Organisation) -> Sequence[VenueCategory]:
    category_ids = Venue.objects.filter(organisation=organisation).values_list(_CATEGORY_ID, flat=True).distinct()
    return VenueCategory.objects.filter(id__in=category_ids)


def update_venue(
    id: int,
    name: str,
    form_data: str,
    category: VenueCategory,
    organisation: Organisation,
) -> Venue:
    Venue.objects.filter(id=id).update(
        name=name,
        form_data=form_data,
        category=category,
        organisation=organisation,
    )
    return get_venue_by_id(id)


def venue_to_json(venue: Venue) -> dict:
    return {
        ID: venue.id,
        CREATED_AT: round(venue.created_at.timestamp() * 1000),
        UPDATED_AT: round(venue.updated_at.timestamp() * 1000),
        NAME: venue.name,
        FORM_DATA: venue.form_data,
        CATEGORY: venue.category.name,
    }