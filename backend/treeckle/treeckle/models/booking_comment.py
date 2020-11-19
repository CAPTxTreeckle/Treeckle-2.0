from django.db import models
from django.conf import settings

from treeckle.models.booking import Booking
from treeckle.models.comment import Comment
from treeckle.models.timestamped_model import TimestampedModel


class BookingComment(TimestampedModel):
	booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
	comment = models.ForeignKey(Comment, on_delete=models.CASCADE)

	class Meta:
		db_table = "booking_comment_tab"

	def to_json(self):
		return self.comment.to_json()