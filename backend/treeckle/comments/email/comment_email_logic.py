import logging
from emailer.send import send_email
from treeckle.models.booking import Booking
from treeckle.models.user import User
from treeckle.models.booking import Status
from treeckle.models.comment import Comment
from treeckle.models.booking_comment import BookingComment
from organisations.logic import get_listeners_by_organisation
from bookings.email.create_email_logic import convert_date

logger = logging.getLogger("main")

def send_comment_email(booking: Booking, comment: Comment, user: User):
    body = create_comment_body(booking, comment)
    subject = f"[{booking.venue.name}] New comment by {comment.user.name}"

    # need to check who to send to
    comments_made = BookingComment.objects.filter(booking=booking.id).select_related("comment")
    if len(comments_made) == 0:
        # if the comment not by user then send to that user
        if comment.user.id == user.id:
            listeners = get_listeners_by_organisation(user.organisation)
            emails = [x.email for x in listeners if x.email != user.email]
            to_users = User.objects.filter(email__in=emails)
            chain_send(to_users, body, subject)
        else:
            send_email(user, [], subject, body)
    else:
        logger.info(comments_made)
        to_users = [x.comment.user for x in comments_made if x.comment.user.id != user.id]
        chain_send(to_users, body, subject)

# helper function to chain send emails
def chain_send(to_users: [User], body: str, subject: str):
    send_users = set()
    for to_user in to_users:
        if to_user.id not in send_users:
            send_email(to_user, [], subject, body)
            send_users.add(to_user.id)

def create_comment_body(booking: Booking, comment: Comment) -> str:
    body_template = get_comment_body_template()
    body_template[0] += str(convert_date(comment.created_at))
    body_template[1] = f'{comment.user.name} commented:\n'
    body_template[2] = str(comment.content)

    return "\n".join(body_template)

def get_comment_body_template() -> [str]:
    body_template = [
        "",
        "",
        ""
    ]

    return body_template