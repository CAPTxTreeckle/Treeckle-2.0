from treeckle.common.constants import (
    ID,
    CREATED_AT,
    UPDATED_AT,
    USER,
    EVENT_ID,
    STATUS,
)

from users.models import Organization, User
from users.logic import user_to_json
from events.models import Event, EventCategory, EventCategoryType, EventSignUp


def event_sign_up_to_json(event_sign_up: EventSignUp) -> dict:
    return {
        ID: event_sign_up.id,
        CREATED_AT: event_sign_up.created_at,
        UPDATED_AT: event_sign_up.updated_at,
        USER: user_to_json(event_sign_up.user),
        EVENT_ID: event_sign_up.event_id,
        STATUS: event_sign_up.status,
    }


def get_event_sign_ups(**kwargs):
    return EventSignUp.objects.filter(**kwargs)