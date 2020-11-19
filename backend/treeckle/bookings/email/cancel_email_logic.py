import logging

logger = logging.getLogger("main")


from emailer.send import send_email
from treeckle.models.booking import Booking
from treeckle.models.user import User

# TODO for cancellation of email