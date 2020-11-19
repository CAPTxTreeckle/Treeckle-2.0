from django.db import models
from django.conf import settings

from treeckle.models.user import User
from treeckle.models.timestamped_model import TimestampedModel
from treeckle.strings.json_keys import ID, CONTENT, NAME, CREATED_AT, UPDATED_AT, USER_ID


class Comment(TimestampedModel):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	name = models.CharField(max_length=255)
	content = models.TextField()
	
	class Meta:
		db_table = "comment_tab"

	def to_json(self):
		return {
			ID: self.id,
			USER_ID: self.user.id,
			NAME: self.user.name,
			CONTENT: self.content,
			CREATED_AT: self.created_at,
			UPDATED_AT: self.updated_at
		}
		