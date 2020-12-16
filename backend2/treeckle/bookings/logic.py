from typing import Iterable

from django.db.models import QuerySet


from treeckle.common.constants import (
    ID,
    CREATED_AT,
    UPDATED_AT,
    VENUE_NAME,
    BOOKER,
    START_DATE_TIME,
    END_DATE_TIME,
    STATUS,
    FORM_RESPONSE_DATA,
)
from treeckle.common.parsers import parse_datetime_to_ms_timestamp
from users.logic import user_to_json
from users.models import Organization
from .models import Booking


def booking_to_json(booking: Booking):
    return {
        ID: booking.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(booking.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(booking.updated_at),
        BOOKER: user_to_json(booking.booker),
        VENUE_NAME: booking.venue.name,
        START_DATE_TIME: parse_datetime_to_ms_timestamp(booking.start_date_time),
        END_DATE_TIME: parse_datetime_to_ms_timestamp(booking.end_date_time),
        STATUS: booking.status,
        FORM_RESPONSE_DATA: booking.form_response_data,
    }


def get_bookings(**kwargs) -> QuerySet[Booking]:
    return Booking.objects.filter(**kwargs)


def delete_bookings(
    booking_ids_to_be_deleted: Iterable[int], organization: Organization
) -> None:
    get_bookings(organization=organization, id__in=booking_ids_to_be_deleted)