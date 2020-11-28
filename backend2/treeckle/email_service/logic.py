import os
from typing import Iterable

from django.core.mail import get_connection, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from users.models import UserInvite, Organization

host = os.getenv("HOST")


def send_user_invite_emails(user_invites: Iterable[UserInvite]) -> None:
    emails = []

    for user_invite in user_invites:
        organization_name = user_invite.organization.name
        recipient_email = user_invite.email

        subject = f"Account creation for Treeckle ({organization_name})"
        html_message = render_to_string(
            "user_invite_email_template.html",
            context={
                "organization": organization_name,
                "email": recipient_email,
                "host": host,
            },
        )
        plain_message = strip_tags(html_message)

        email = EmailMultiAlternatives(
            subject=subject, body=plain_message, to=[recipient_email]
        )
        email.attach_alternative(html_message, "text/html")

        emails.append(email)

    connection = get_connection()
    connection.send_messages(emails)
