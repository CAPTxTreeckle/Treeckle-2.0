from datetime import datetime
import logging
from typing import Optional, Sequence
import uuid

from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import URLValidator

from content_delivery_network.images import (
    delete_image,
    upload_image,
)
from treeckle.models.event import (
    Category,
    Event,
    EventCategory,
    EventSignUp,
    Subscription,
)
from users.logic import user_to_json
from treeckle.models.organisation import Organisation
from treeckle.models.user import User
from treeckle.strings.json_keys import (
    CAPACITY,
    CATEGORIES,
    END_DATE,
    DESCRIPTION,
    ID,
    IMAGE,
    IS_PUBLISHED,
    IS_SIGN_UP_ALLOWED,
    IS_SIGN_UP_APPROVAL_REQUIRED,
    ORGANISER,
    ORGANISED_BY,
    SIGN_UP_COUNT,
    START_DATE,
    TITLE,
    VENUE_NAME,
    CREATED_AT,
    UPDATED_AT,
    SIGN_UP_STATUS
)


logger = logging.getLogger("main")
validate_url = URLValidator()


def create_event(
    title: str,
    description: str,
    organiser: User,
    organised_by: str,
    venue_name: str,
    capacity: Optional[int],
    start_date: datetime,
    end_date: datetime,
    categories: Sequence[str],
    image: str,
    is_sign_up_allowed: bool,
    is_sign_up_approval_required: bool,
    is_published: bool,
) -> Event:
    with transaction.atomic():
        filename = _generate_random_filename()
        image_id, image_url = upload_image(filename, image)
        event = Event.objects.create(
            title=title,
            description=description,
            organiser=organiser,
            organised_by=organised_by,
            venue_name=venue_name,
            capacity=capacity,
            start_date=start_date,
            end_date=end_date,
            image_id=image_id,
            image_url=image_url,
            is_sign_up_allowed=is_sign_up_allowed,
            is_sign_up_approval_required=is_sign_up_approval_required,
            is_published=is_published,
        )
        for category_name in categories:
            category, _ = Category.objects.get_or_create(
                organisation=organiser.organisation,
                name=category_name,
            )
            EventCategory.objects.create(event=event, category=category)

    return event


def delete_event_by_id(id: int) -> None:
    with transaction.atomic():
        event = Event.objects.get(id=id)
        image_id =  event.image_id
        event.delete()
        delete_image(image_id)


def delete_category_by_id(id: int) -> None:
    Category.objects.filter(id=id).delete()


def event_to_json(event: Event, user: User) -> dict:
    event_categories = EventCategory.objects.filter(event=event)
    category_ids = [e.category_id for e in event_categories]
    categories = Category.objects.filter(id__in=category_ids)

    try:
        sign_up_status = EventSignUp.objects.get(event=event, user=user).status
    except ObjectDoesNotExist:
        sign_up_status = None

    return {
        ID: event.id,
        CREATED_AT: round(event.created_at.timestamp() * 1000),
        UPDATED_AT: round(event.updated_at.timestamp() * 1000),
        TITLE: event.title,
        DESCRIPTION: event.description,
        ORGANISER: user_to_json(event.organiser),
        ORGANISED_BY: event.organised_by,
        CAPACITY: event.capacity,
        IMAGE: event.image_url,
        VENUE_NAME: event.venue_name,
        START_DATE: event.start_date,
		END_DATE: event.end_date,
        CATEGORIES: [c.name for c in categories],
        IS_PUBLISHED: event.is_published,
        IS_SIGN_UP_ALLOWED: event.is_sign_up_allowed,
        IS_SIGN_UP_APPROVAL_REQUIRED: event.is_sign_up_approval_required,
        SIGN_UP_COUNT: event.eventsignup_set.count(),
        SIGN_UP_STATUS: sign_up_status
    }


def get_category_by_id(id: int) -> Category:
    return Category.objects.get(id=id)


def get_event_by_id(id: int) -> Event:
    return Event.objects.get(id=id)


def get_event_sign_ups(event: Event) -> Sequence[EventSignUp]:
    return EventSignUp.objects.filter(event=event).select_related("user")


def get_events_by_organisation(organisation: Organisation):
    return get_events_with_associations().filter(organiser__organisation=organisation)


def get_events_by_organiser(organiser: User) -> Sequence[Event]:
    return get_events_with_associations().filter(organiser=organiser)


def get_events_with_associations():
    return Event.objects.all()\
        .select_related("organiser")\
        .prefetch_related(
            "eventcategory_set",
            "eventsignup_set",
            "eventcategory_set__category",
        )


def get_events_with_user_sign_up(user: User) -> Sequence[Event]:
    sign_ups = EventSignUp.objects.filter(user=user)
    event_ids = [s.event_id for s in sign_ups]
    return get_events_with_associations().filter(id__in=event_ids)


def get_subscribed_events(subscriptions: Sequence[Subscription]) -> Sequence[Event]:
    categories = [s.category for s in subscriptions]
    event_ids = EventCategory.objects.filter(category__in=categories).values_list("event_id", flat=True)
    return get_events_with_associations().filter(id__in=event_ids)


def update_event(
    id: int,
    title: str,
    description: str,
    organiser: User,
    organised_by: str,
    venue_name: str,
    capacity: Optional[int],
    start_date: datetime,
    end_date: datetime,
    categories: Sequence[str],
    image: str,
    is_sign_up_allowed: bool,
    is_sign_up_approval_required: bool,
    is_published: bool,
) -> Event:
    event = get_event_by_id(id)
    with transaction.atomic():
        EventCategory.objects.filter(event=event).delete()
        for category_name in categories:
            category, _ = Category.objects.get_or_create(
                organisation=organiser.organisation,
                name=category_name,
            )
            EventCategory.objects.create(event=event, category=category)
        
        image_id = event.image_id
        try:
            validate_url(image)
            image_url = event.image_url
        except Exception as e:
            logger.info(e)
            delete_image(image_id)

            if image == "":
                image_id = image_url = ""
            else:
                filename = _generate_random_filename()
                image_id, image_url = upload_image(filename, image)
                

        Event.objects.filter(id=id).update(
            title=title,
            description=description,
            organised_by=organised_by,
            venue_name=venue_name,
            capacity=capacity,
            start_date=start_date,
            end_date=end_date,
            image_id=image_id,
            image_url=image_url,
            is_sign_up_allowed=is_sign_up_allowed,
            is_sign_up_approval_required=is_sign_up_approval_required,
            is_published=is_published,
        )

    return get_event_by_id(id)


def get_event_categories_by_organisation(organisation: Organisation) -> Sequence[Category]:
    return Category.objects.filter(organisation=organisation)


def _generate_random_filename() -> str:
    return str(uuid.uuid4())