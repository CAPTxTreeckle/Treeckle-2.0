from django.db import models

from treeckle.models.organisation import Organisation
from treeckle.models.user import User
from treeckle.models.timestamped_model import TimestampedModel


_CATEGORY_ID = "category_id"
_EVENT_ID = "event_id"
_USER_ID = "user_id"

class Event(TimestampedModel):
    title = models.CharField(max_length=255)
    organiser = models.ForeignKey(User, on_delete=models.CASCADE)
    organised_by = models.CharField(max_length=255)
    venue_name = models.CharField(max_length=255)
    description = models.TextField()
    capacity = models.IntegerField(null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    image_url = models.URLField()
    image_id = models.CharField(max_length=255)
    is_published = models.BooleanField()
    is_sign_up_allowed = models.BooleanField()
    is_sign_up_approval_required = models.BooleanField()

    class Meta:
        db_table = "event_tab"


class Category(TimestampedModel):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "category_tab"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "organisation_id"],
                name="unique organisation and category name",
            )
        ]
        ordering = ["name"]


class EventCategory(TimestampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        db_table = "event_category_tab"
        constraints = [
            models.UniqueConstraint(
                fields=[_CATEGORY_ID, _EVENT_ID], name="unique event category")
        ]


class SignUpStatus(models.TextChoices):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    ATTENDED = "ATTENDED"


class EventSignUp(TimestampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=SignUpStatus.choices, default=SignUpStatus.PENDING)

    class Meta:
        db_table = "event_sign_up_tab"
        constraints = [
            models.UniqueConstraint(
                fields=[_USER_ID, _EVENT_ID], name="unique user event signup")
        ]


class Subscription(TimestampedModel):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "event_subscription_tab"
        constraints = [
            models.UniqueConstraint(
                fields=[_CATEGORY_ID, _USER_ID], name="unique user category subscription")
        ]
