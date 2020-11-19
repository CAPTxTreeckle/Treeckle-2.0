from collections import Counter
from datetime import datetime
import math
import re
from typing import Sequence

from treeckle.models.event import (
    Event,
    EventCategory,
)
from events.logic.event import (
    get_events_by_organisation,
    get_events_with_user_sign_up,
)
from treeckle.models.user import User


_SPACE = " "


def get_recommended_events(user: User) -> Sequence[Event]:
    signed_up_events = get_events_with_user_sign_up(user)
    signed_up_event_ids = [e.id for e in signed_up_events]

    new_events  = get_events_by_organisation(user.organisation)\
        .exclude(id__in=signed_up_event_ids)\
        .filter(end_date__gte=datetime.now())
    new_events_list = list(new_events)

    for event in new_events_list:
        similarity_scores = [_get_event_similarity_score(event, signed_up_event) for signed_up_event in signed_up_events]
        event.score = sum(similarity_scores)

    get_score = lambda event : event.score if event.score is not None else 0.0
    recommended_events = sorted(new_events_list, key=get_score, reverse=True)
    return recommended_events


def _get_event_similarity_score(event1: Event, event2: Event) -> float:
    vector1 = _get_event_word_vector(event1)
    vector2 = _get_event_word_vector(event2)
    return _get_cosine_similarity(vector1, vector2)


def _get_event_word_vector(event: Event):
    event_event_categories = EventCategory.objects.filter(event=event).select_related("category")
    event_tags = [e.category.name for e in event_event_categories]
    event_joined_tags = _SPACE.join(event_tags)
    text = event.title.lower() + _SPACE + event.description.lower() + _SPACE + event_joined_tags
    return _text_to_vector(text)


# Formula reference: https://en.wikipedia.org/wiki/Cosine_similarity
def _get_cosine_similarity(vec1: dict, vec2: dict) -> float:
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[key] * vec2[key] for key in intersection])

    sum1 = sum([vec1[key] ** 2 for key in vec1.keys()])
    sum2 = sum([vec2[key] ** 2 for key in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if denominator == 0.0:
        return 0.0
    else:
        return float(numerator) / denominator


WORD_REGEX = re.compile(r"\w+")

def _text_to_vector(text: str):
    words = WORD_REGEX.findall(text)
    return Counter(words)
