import logging
from emailer.send import send_email
from treeckle.models.booking import Booking
from treeckle.models.user import User
from treeckle.models.booking import Status
from bookings.email.create_email_logic import convert_date
logger = logging.getLogger("main")

def send_update_email(booking: Booking, previous_status: int):
    greeting_message = "An admin has updated your booking request. Please refer to the details below.\n\n"
    body = create_update_body(booking, previous_status)
    
    subject = f"[{booking.venue.name}] Your booking request has been updated"

    send_email(booking.booker, [], subject, greeting_message + body)

def create_update_body(booking, previous_status: int):
    body_template = get_update_body_template()
    logger.info(len(body_template))
    body_template[0] += str(booking.booker.name)
    body_template[1] += str(booking.booker.email)
    body_template[2] += str(booking.venue.name)
    body_template[3] += str(convert_date(booking.created_at))
    body_template[4] += f'{convert_date(booking.start_date)} to {convert_date(booking.end_date)}'
    body_template[5] += f'{Status(previous_status).name}'
    body_template[6] += f'{Status(booking.status).name}'

    return "\n".join(body_template)

def get_update_body_template() -> [str]:
    body_template = [
        "Name: ",
        "Email: ",
        "Venue name: ",
        "Booked at: ",
        "Slot: ",
        "Previous Status: ",
        "New Status: "
    ]
    return body_template