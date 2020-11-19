import logging

logger = logging.getLogger("main")

from emailer.send import send_email
from treeckle.models.booking import Booking
from treeckle.models.user import User
from organisations.logic import get_listeners_by_organisation
from datetime import datetime, timedelta

def convert_date(dt: datetime):
	result = dt + timedelta(hours=8)
	return result.strftime("%Y/%m/%d %H:%M:%S")

BOLD = '\033[1m' # for bolding of labels
BOLD_END = '\033[0m'

def bold_str(string: str) -> str:
    #return BOLD + string + BOLD_END
    return string

def send_creation_email(bookings: [Booking], user: User):
    greeting_message = "You have created a new booking request. Please refer to the details below.\n\n"
    body = format_creation_email_body(bookings, user)
    listeners = get_listeners_by_organisation(user.organisation)
    subject = f"[{bookings[0].venue.name}] Your booking request has been created"
    send_email(user, listeners, subject, greeting_message + body)

def format_creation_email_body(bookings:[Booking], user: User) -> str:
    body_template = get_creation_body_template()

    first_booking = bookings[0]
    body_template[0] += str(user.name)
    body_template[1] += str(user.email)
    body_template[2] += str(first_booking.venue.name)
    body_template[3] += str(convert_date(first_booking.created_at))
    body_template[5] += "PENDING"

    counter = 1

    for booking in bookings:
        date_string = f'\n\t{counter}. {convert_date(booking.start_date)} to {convert_date(booking.end_date)}'
        body_template[4] += date_string
        counter += 1

    return "\n".join(body_template)
    

def get_creation_body_template() -> [str]:
    body_template = [
        bold_str("Name: "),
        bold_str("Email: "),
        bold_str("Venue name: "),
        bold_str("Booked at: "),
        bold_str("Slot(s):"),
        bold_str("Status: ")
    ]
    return body_template