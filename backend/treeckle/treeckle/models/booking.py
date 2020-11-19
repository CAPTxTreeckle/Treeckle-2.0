import datetime

from django.db import models
from datetime import timezone, timedelta, datetime
from enum import IntEnum
from treeckle.models.user import User
from treeckle.models.venue import Venue
from treeckle.models.timestamped_model import TimestampedModel
from bookings.managers.BookingManager import DefaultManager
from treeckle.strings.json_keys import NAME, EMAIL, VENUE, START_DATE, END_DATE, CREATED_AT, FORM_DATA, STATUS, ID

class Status(IntEnum):
	PENDING = 0
	APPROVED = 1
	REJECTED = 2
	CANCELLED = 3

	@classmethod
	def statuses(cls):
		return [(key.value, key.name) for key in cls]

class Booking(TimestampedModel):
	booker = models.ForeignKey(User, on_delete=models.CASCADE)
	venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
	form_data = models.TextField()
	start_date = models.DateTimeField()
	end_date = models.DateTimeField()
	status = models.IntegerField(choices=Status.statuses(), default=Status.PENDING)
	
	class Meta:
		db_table = "booking_tab"
		ordering = ["start_date", "end_date"]
	
	def convert_to_epoch(self, dt: datetime) -> int:
		return int(dt.timestamp() * 1000)

	def to_json(self) -> dict:
		return {
			ID: self.id,
			NAME: self.booker.name,
			EMAIL: self.booker.email,
			VENUE: self.venue.name,
			START_DATE: self.convert_to_epoch(self.start_date),
			END_DATE: self.convert_to_epoch(self.end_date),
			CREATED_AT: self.convert_to_epoch(self.created_at),
			STATUS: Status(self.status).name,
			FORM_DATA: self.form_data
		}

	objects = DefaultManager()

