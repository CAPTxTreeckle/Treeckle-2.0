from events.logic.event import get_event_by_id
from treeckle.models.event import EventSignUp, SignUpStatus
from treeckle.strings.json_keys import (
    EVENT_ID,
    ID,
    STATUS,
    USER,
    CREATED_AT,
    UPDATED_AT
)
from users.logic import get_user_by_id, user_to_json


def approve_sign_up(user_id: int, event_id: int) -> EventSignUp:
    sign_up = get_sign_up_by_id(user_id=user_id, event_id=event_id)
    if sign_up.status != SignUpStatus.PENDING:
        raise Exception("Sign up does not need approval")
    sign_up.status = SignUpStatus.CONFIRMED
    sign_up.save()
    return sign_up


def attend_sign_up(user_id: int, event_id: int) -> EventSignUp:
    sign_up = get_sign_up_by_id(user_id=user_id, event_id=event_id)
    if sign_up.status != SignUpStatus.CONFIRMED:
        raise Exception("Cannot attend a signup that has not been confirmed.")
    sign_up.status = SignUpStatus.ATTENDED
    sign_up.save()
    return sign_up


def create_sign_up(user_id: int, event_id: int) -> EventSignUp:
    user = get_user_by_id(user_id)
    event = get_event_by_id(event_id)
    if not event.is_sign_up_allowed:
        raise Exception("Sign up is not allowed for this event.")
    status = SignUpStatus.PENDING if event.is_sign_up_approval_required else SignUpStatus.CONFIRMED
    sign_up = EventSignUp.objects.create(event=event, user=user, status=status)
    return sign_up
    

def delete_sign_up(user_id: int, event_id: int) -> None:
    EventSignUp.objects.filter(user_id=user_id, event_id=event_id).delete()


def get_sign_up_by_id(user_id: int, event_id: int) -> EventSignUp:
    return EventSignUp.objects.get(user_id=user_id, event_id=event_id)


def sign_up_to_json(sign_up: EventSignUp) -> dict:
    return {
        ID: sign_up.id,
        CREATED_AT: round(sign_up.created_at.timestamp() * 1000),
        UPDATED_AT: round(sign_up.updated_at.timestamp() * 1000),
        USER: user_to_json(sign_up.user),
        EVENT_ID: sign_up.event_id,
        STATUS: sign_up.status,
    }