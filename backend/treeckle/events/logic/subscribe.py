from typing import Sequence

from treeckle.models.event import Category, Subscription
from treeckle.models.user import User
from treeckle.strings.json_keys import (
    CATEGORY_ID,
    ID,
    USER_ID,
)
from events.logic.event import get_event_categories_by_organisation


def get_subscriptions_with_associations():
    return Subscription.objects.all().select_related("category", "user")


def get_user_subscriptions(user: User) -> Sequence[Subscription]:
    return get_subscriptions_with_associations().filter(user=user)

def get_user_not_subscribed_categories(user: User, subscribed_categories: Sequence[str]) -> Sequence[str]:
    all_categories = get_event_categories_by_organisation(user.organisation)
    return all_categories.exclude(name__in=subscribed_categories).values_list("name", flat=True)


def subscribe_to_category(user: User, category_name: str) -> Subscription:
    category =  Category.objects.get(organisation=user.organisation, name=category_name)
    return Subscription.objects.create(user=user, category=category)
    

def subscription_to_json(subscription: Subscription) -> dict:
    return {
        ID: subscription.id,
        CATEGORY_ID: subscription.category_id,
        USER_ID: subscription.user_id,
    }


def unsubscribe_to_category(user: User, category_name: str) -> None:
    category =  Category.objects.get(organisation=user.organisation, name=category_name)
    Subscription.objects.filter(user=user, category=category).delete()
