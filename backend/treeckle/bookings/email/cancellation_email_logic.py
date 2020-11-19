import logging

from emailer.send import send_email
from treeckle.models.booking import Booking
from treeckle.models.user import User
from treeckle.models.booking import Status
from organisations.logic import get_listeners_by_organisation
from bookings.email.create_email_logic import convert_date

logger = logging.getLogger("main")

# feelsbad
def send_cancellation_email(booking: Booking, user: User):
    greeting_message = "You have cancelled your booking request. Please refer to the details below.\n\n"
    body = get_cancellation_email_body(booking)
    listeners = get_listeners_by_organisation(user.organisation)
    emails = [x.email for x in listeners]
    cc_users = User.objects.filter(email__in=emails)
    subject = f'[{booking.venue.name}] Your booking request has been cancelled'

    send_email(user, cc_users, subject, greeting_message + body)
    

def get_cancellation_email_body(booking: Booking) -> str:
    body_template = get_cancellation_body_template()

    body_template[0] += str(booking.booker.name)
    body_template[1] += str(booking.booker.email)
    body_template[2] += str(booking.venue.name)
    body_template[3] += str(convert_date(booking.created_at))
    body_template[4] += f'{convert_date(booking.start_date)} to {convert_date(booking.end_date)}'

    return "\n".join(body_template)

def get_cancellation_body_template() -> str:
    body_template = [
        "Name: ",
        "Email: ",
        "Venue name: ",
        "Booked at: ",
        "Slot: "
    ]
    return body_template