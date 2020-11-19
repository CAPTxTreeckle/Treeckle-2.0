import logging

from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta

# Create your views here.
from treeckle.models.booking import Booking
from bookings.BookingSerializer import BookingSerializer
from bookings.email.create_email_logic import send_creation_email
from bookings.email.update_status_logic import send_update_email
from bookings.email.cancellation_email_logic import send_cancellation_email
from treeckle.models.user import User
from treeckle.strings.json_keys import AUTHORIZATION
from users.logic import get_user_by_id
from authentication import jwt
from login.views import token_login_data_validate

logger = logging.getLogger("main")

# TODO remove this method
def get_user_id(request):
    access_token = request.headers.get(AUTHORIZATION)
    token_login_data_validate(access_token)
    user_info = jwt.check_access_token(access_token)
    return user_info[0]

def get_bookings(id, offset, limit):    
    return Booking.objects.get_bookings(id, offset, limit)
    
def create_bookings(user: User, bookings: list):
    user_id = user.id
    new_bookings = []
    current_user = get_user_by_id(user_id)
    logger.info(user_id)
    logger.info(bookings)
    for booking in bookings:
        booking["booker"] = user_id
        serializer = BookingSerializer(data=booking)
                
        if not serializer.is_valid():
            logger.info(serializer.errors)
            continue
                
        booker = serializer.validated_data.get("booker")
        venue = serializer.validated_data.get("venue")
        form_data = serializer.validated_data.get("form_data")
        start_date = serializer.validated_data.get("start_date") - timedelta(hours=8)
        end_date = serializer.validated_data.get("end_date") - timedelta(hours=8)
        status = serializer.validated_data.get("status")

        if valid_new_booking(start_date, end_date, current_user):
            new_bookings.append(Booking.objects.create(booker=booker, venue=venue, form_data=form_data, 
                start_date=start_date, end_date=end_date, status=status))

    if len(new_bookings) > 0:
        send_creation_email(new_bookings, user)

    return BookingSerializer(new_bookings, many=True)

def delete_bookings(delete_ids: [], id: int):
    current_user = get_user_by_id(id)
    return Booking.objects.filter(booker__organisation=current_user.organisation, id__in=delete_ids).delete()

def get_all_bookings(status_id, offset, limit, venue_id, user_id, start_date, end_date):    
    return Booking.objects.get_all_bookings(status_id, start_date, end_date, offset, limit, venue_id, user_id)

def change_booking_status(status_id, user_id, booking_id):
    current_user = get_user_by_id(user_id)

    booking = Booking.objects.filter(booker__organisation=current_user.organisation).filter(id=booking_id)

    if len(booking) == 0:
        return Response({"Error": "Cannot find booking or user not from the same org!"}, status=status.HTTP_400_BAD_REQUEST)
    
    booking = booking[0]
    previous_status = booking.status

     # if status is changed to confirmed -> need to find all pending and put them to rejected status
    with transaction.atomic():
        prev_status = booking.status
        booking.status = status_id
        booking.save()

    if prev_status != status_id and status_id == 1:
        logger.info("Applying all changes")
        update_booking_statuses(booking, current_user)

    response = [booking.to_json()]

    if status_id == 3 and status_id != previous_status:
        send_cancellation_email(booking, current_user)
    else:
        send_update_email(booking, previous_status) 
           
    return Response(response, status=status.HTTP_200_OK)

def update_booking_statuses(booking, current_user):
    start_date = booking.start_date
    end_date = booking.end_date

    affected_bookings_start = Booking.objects.filter(booker__organisation=current_user.organisation).filter(status=0).filter(start_date__range=(start_date, end_date))
    affected_bookings_end = Booking.objects.filter(booker__organisation=current_user.organisation).filter(status=0).filter(end_date__range=(start_date, end_date))
    
    logger.info(affected_bookings_end)
    logger.info(affected_bookings_start)

    affected_bookings = get_affected_bookings(affected_bookings_start, affected_bookings_end, start_date, end_date)

    logger.info(affected_bookings)

    for booking in affected_bookings:
        booking.status = 2
        booking.save()

def get_affected_bookings(affected_bookings_start, affected_bookings_end, start_date, end_date) -> set:
    inserted_bookings = set()
    affected_bookings = []

    for booking in affected_bookings_start:
        if booking.start_date != end_date and booking.id not in inserted_bookings:
            affected_bookings.append(booking)
            inserted_bookings.add(booking.id)
            
    
    for booking in affected_bookings_end:
        if  booking.end_date != start_date and booking.id not in inserted_bookings:
            affected_bookings.append(booking)
            inserted_bookings.add(booking.id)
    
    return affected_bookings

def positive_integer_validator(num: [int]) -> bool:
    for i in num:
        int_i = get_integer(i)
        if int_i and int_i < 0:
            return False
    
    return True

def get_integer(num) -> int:
    try:
        return int(num)
    except:
        return None

def valid_new_booking(start_date, end_date, current_user):
    affected_bookings_start = list(Booking.objects.filter(booker__organisation=current_user.organisation).filter(status=1).filter(start_date__range=(start_date, end_date)))
    affected_bookings_end = list(Booking.objects.filter(booker__organisation=current_user.organisation).filter(status=1).filter(end_date__range=(start_date, end_date)))

    for booking in affected_bookings_end:
        if booking.end_date == start_date: # above query filters is inclusive, need to remove those
            affected_bookings_end.remove(booking)
    
    for booking in affected_bookings_start:
        if booking.start_date == end_date:
            affected_bookings_start.remove(booking)

    return len(affected_bookings_end) == 0 and len(affected_bookings_start) == 0 # both must be empty
