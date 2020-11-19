from django.db import models

from treeckle.models.timestamped_model import TimestampedModel


class Organisation(TimestampedModel):
	name = models.CharField(max_length=255, unique=True)

	class Meta:
		db_table = "organisation_tab"


class OrganisationListener(TimestampedModel):
	email = models.EmailField(unique=True)
	organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)

	class Meta:
		db_table = "organisation_listener_tab"
		constraints = [
            models.UniqueConstraint(
                fields=["email", "organisation_id"],
                name="unique organisation and email for listener",
            )
        ]
