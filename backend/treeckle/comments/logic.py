import logging

from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
from treeckle.models.booking import Booking
from treeckle.models.comment import Comment
from treeckle.models.booking_comment import BookingComment
from comments.CommentsSerializer import CommentSerializer, BookingCommentSerializer
from treeckle.strings.json_keys import AUTHORIZATION
from users.logic import get_user_by_id
from comments.email.comment_email_logic import send_comment_email

logger = logging.getLogger("main")

def get_booking_comments(booking_id: int) -> []:
    return BookingComment.objects.filter(booking=booking_id).select_related("comment")

def delete_booking_comments(comment_id: [int], user_id: int) -> []:
    current_user = get_user_by_id(user_id)
    return Comment.objects.filter(user__organisation=current_user.organisation, id__in=comment_id).delete()

def create_booking_comment(content, booking_id, user_id):
    current_user = get_user_by_id(user_id)

    comment_data = {
        "user": current_user.id,
        "name": current_user.name,
        "content": content
    }

    serializer = CommentSerializer(data=comment_data)

    if not serializer.is_valid():
        raise ValidationError(str(serializer.errors))
    
    comment_created = Comment.objects.create(user=current_user, name=current_user.name, content=content)

    # grab bookings
    booking = Booking.objects.get(id=booking_id)
    booking_comment_data = {
        "booking": booking_id,
        "comment": comment_created.id
    }

    serializer = BookingCommentSerializer(data=booking_comment_data)
    if not serializer.is_valid():
        raise ValidationError(str(serializer.errors))
    
    booking_comment = BookingComment.objects.create(booking=booking, comment=comment_created)
    send_comment_email(booking, comment_created, current_user)
    return booking_comment.to_json()


def update_comment(comment_id: int, content, user_id: int):
    current_user = get_user_by_id(user_id)
    comment = Comment.objects.filter(user__organisation=current_user.organisation).get(id=comment_id)
    comment.content = content
    comment.save()    
    return comment.to_json()
