import logging

from django.core.mail import send_mail
from django.core.mail import EmailMessage

from treeckle.models.user import User


logger = logging.getLogger("main")


def send_email(to_user: User, cc: [User], subject: str,  content: str):
    plain_text_content = \
        "Dear " + to_user.name + ",\r\n\r\n" + \
        content + "\r\n\r\n" + \
        "Best regards,\r\n" + \
        "Treeckle Admin"

    cc_email = [x.email for x in cc]

    logger.info(plain_text_content)

    #logger.info("Sending email to " + to_user.name + " (Email: " + to_user.email + ")" + email_purpose_msg)
    email = EmailMessage(subject=subject, to=[
                         to_user.email], cc=cc_email, from_email="no-reply@treeckle.com", body=plain_text_content)
    email.send(fail_silently=False)

def send_invitation_email(email, organisation):
    subject = f'You have been invited to join {organisation.name}'
    content = f'You have been invited to join {organisation.name}.\nYou can login at v2.treeckle.com'
    invitation_content  = \
        "Dear User,\r\n\r\n" + \
        content + "\r\n\r\n" + \
        "Best regards,\r\n" + \
        "Treeckle Admin"
    
    email = EmailMessage(subject=subject, to=[email], cc=[], from_email="no-reply@treeckle.com", body=invitation_content)
    email.send(fail_silently=False)
