from typing import Optional, List

from django.db.models import QuerySet

from treeckle.common.constants import (
    ID,
    CREATED_AT,
    UPDATED_AT,
    NAME,
    CATEGORY,
    CAPACITY,
    IC_NAME,
    IC_EMAIL,
    IC_CONTACT_NUMBER,
    FORM_FIELD_DATA,
)
from treeckle.common.parsers import parse_datetime_to_ms_timestamp
from users.models import Organization
from .models import Venue, VenueCategory


def venue_to_json(venue: Venue) -> dict:
    return {
        ID: venue.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(venue.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(venue.updated_at),
        NAME: venue.name,
        CATEGORY: venue.category.name,
        CAPACITY: str(venue.capacity) if venue.capacity else None,
        IC_NAME: venue.ic_name,
        IC_EMAIL: venue.ic_email,
        IC_CONTACT_NUMBER: venue.ic_contact_number,
        FORM_FIELD_DATA: venue.form_field_data,
    }


def get_venue_categories(**kwargs) -> QuerySet[VenueCategory]:
    return VenueCategory.objects.filter(**kwargs)


def get_venue(**kwargs) -> Venue:
    return Venue.objects.select_related("category", "organization").get(**kwargs)


def get_venues(**kwargs) -> QuerySet[Venue]:
    return Venue.objects.select_related("category").filter(**kwargs)


def get_or_create_venue_category(
    name: str, organization: Organization
) -> VenueCategory:
    venue_category, _ = VenueCategory.objects.get_or_create(
        name=name, organization=organization
    )

    return venue_category


def delete_unused_venue_categories(organization: Organization):
    used_venue_category_ids = (
        Venue.objects.all().values_list("category_id", flat=True).distinct()
    )
    VenueCategory.objects.exclude(id__in=used_venue_category_ids).delete()


def create_venue(
    organization: Organization,
    venue_name: str,
    category_name: str,
    capacity: Optional[int],
    ic_name: str,
    ic_email: str,
    ic_contact_number: str,
    form_field_data: List[dict],
) -> Venue:

    venue_category = get_or_create_venue_category(
        name=category_name, organization=organization
    )

    new_venue = Venue.objects.create(
        organization=organization,
        name=venue_name,
        category=venue_category,
        capacity=capacity,
        ic_name=ic_name,
        ic_email=ic_email,
        ic_contact_number=ic_contact_number,
        form_field_data=form_field_data,
    )

    return new_venue


def update_venue(
    current_venue: Venue,
    venue_name: str,
    category_name: str,
    capacity: Optional[int],
    ic_name: str,
    ic_email: str,
    ic_contact_number: str,
    form_field_data: List[dict],
) -> Venue:
    venue_category = get_or_create_venue_category(
        name=category_name, organization=current_venue.organization
    )

    current_venue.update_from_dict(
        {
            "name": venue_name,
            "category": venue_category,
            "capacity": capacity,
            "ic_name": ic_name,
            "ic_email": ic_email,
            "ic_contact_number": ic_contact_number,
            "form_field_data": form_field_data,
        },
        commit=True,
    )

    delete_unused_venue_categories(organization=current_venue.organization)

    return current_venue
