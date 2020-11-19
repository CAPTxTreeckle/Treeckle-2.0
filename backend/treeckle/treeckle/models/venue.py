from django.db import models

from treeckle.models.organisation import Organisation
from treeckle.models.timestamped_model import TimestampedModel


class VenueCategory(TimestampedModel):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "venue_category_tab"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "organisation_id"],
                name="unique organisation and venue category name",
            )
        ]
        ordering = ["name"]


class Venue(TimestampedModel):
    name = models.CharField(max_length=255)
    form_data = models.TextField()
    category = models.ForeignKey(VenueCategory, on_delete=models.CASCADE, null=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)

    class Meta:
        db_table = "venue_tab"
        ordering = ["name"]
