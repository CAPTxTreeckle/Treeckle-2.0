import logging
import traceback

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from treeckle.models.booking import Booking
from treeckle.strings.json_keys import AUTHORIZATION
from bookings.BookingSerializer import BookingSerializer
from bookings.logic import get_bookings, create_bookings, delete_bookings, get_all_bookings, change_booking_status, get_user_id, positive_integer_validator
from users.permission_middlewares import check_access
from treeckle.models.user import Role, User

logger = logging.getLogger("main")

class GetBookingsDetails(APIView):

    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def get(self, request, requester: User):
        # only id is compulsory
        try:
            user_id = requester.id
            logger.info(user_id)
            offset = request.GET.get("offset", None)
            limit = request.GET.get("limit", None)

            if offset:
                offset = int(offset)
            
            if limit:
                limit = int(limit)

            bookings = get_bookings(user_id, offset, limit)
            data = [x.to_json() for x in bookings]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response({"error": "Unknown error has occurred!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def post(self, request, requester: User):
        user_id = requester.id
        bookings = request.data

        # append bookings one by one
        try:
            created_bookings = create_bookings(requester, bookings)
            return Response(created_bookings.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            traceback.print_exc()
            return Response({"Error": "Error has occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @check_access([Role.ADMIN])
    def delete(self, request, requester: User):
        try:
            user_id = get_user_id(request)
            delete_ids = request.data["id"]
            deleted_bookings = delete_bookings(delete_ids, user_id)
            return Response(deleted_bookings, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response({"Error": "Error has occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def patch(self, request, requester: User):
        try:
            user_id = requester.id
            status_id = request.data["status"]
            booking_id = request.data["id"]
            return change_booking_status(status_id, user_id, booking_id)
        except:
            traceback.print_exc()
            return Response({"Error": "Error has occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllBookings(APIView):
    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def get(self, request, requester: User):
        try:
            user_id = requester.id
            logger.info(user_id)
            offset = request.GET.get("offset", None)
            limit = request.GET.get("limit", None)
            status_id = request.GET.get("status", None)
            start_date = request.GET.get("start", None)
            end_date = request.GET.get("end", None)
            venue_id = request.GET.get("venue", None)

            if not positive_integer_validator([start_date, end_date, limit, offset, status_id]):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            if limit:
                limit = int(limit)
            
            if offset:
                offset = int(offset)

            bookings = get_all_bookings(status_id, offset, limit, venue_id, user_id, start_date, end_date)
            data = [x.to_json() for x in bookings]
            return Response(data, status=status.HTTP_200_OK)
        except:
            logger.info(e)
            return Response({"error": "Unknown error has occurred!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
