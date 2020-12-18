from datetime import datetime

from django.utils.timezone import make_aware
from django.db import IntegrityError

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from treeckle.common.exceptions import BadRequest
from treeckle.common.parsers import parse_ms_timestamp_to_datetime
from users.permission_middlewares import check_access
from users.models import Role, User
from venues.logic import get_venue
from venues.models import Venue
from .serializers import (
    GetBookingSerializer,
    PostBookingSerializer,
    PatchBookingSerializer,
    DeleteBookingSerializer,
)
from .models import BookingStatus
from .logic import (
    get_bookings,
    get_requested_bookings,
    booking_to_json,
    create_bookings,
    delete_bookings,
    DateTimeInterval,
    update_booking_statuses,
)

# Create your views here.
class TotalBookingCountView(APIView):
    def get(self, request):
        data = get_bookings().count()

        return Response(data, status=status.HTTP_200_OK)


class PendingBookingCountView(APIView):
    @check_access(Role.ADMIN)
    def get(self, request, requester: User):
        data = get_bookings(
            status=BookingStatus.PENDING, venue__organization=requester.organization
        ).count()

        return Response(data, status=status.HTTP_200_OK)


class BookingsView(APIView):
    @check_access(Role.RESIDENT, Role.ORGANIZER, Role.ADMIN)
    def get(self, request, requester: User):
        serializer = GetBookingSerializer(data=request.query_params.dict())

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        start_date_time = validated_data.get("start_date_time", None)
        end_date_time = validated_data.get("end_date_time", None)

        bookings = get_requested_bookings(
            organization=requester.organization,
            user_id=validated_data.get("user_id", None),
            venue_name=validated_data.get("venue_name", None),
            start_date_time=parse_ms_timestamp_to_datetime(start_date_time)
            if start_date_time is not None
            else make_aware(datetime.min),
            end_date_time=parse_ms_timestamp_to_datetime(end_date_time)
            if end_date_time is not None
            else make_aware(datetime.max),
            status=validated_data.get("status", None),
        )

        data = [booking_to_json(booking) for booking in bookings]

        return Response(data, status=status.HTTP_200_OK)

    @check_access(Role.RESIDENT, Role.ORGANIZER, Role.ADMIN)
    def post(self, request, requester: User):
        serializer = PostBookingSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        try:
            venue = get_venue(
                organization=requester.organization,
                id=validated_data.get("venue_id", None),
            )
        except Venue.DoesNotExist:
            raise BadRequest("Invalid venue")

        ## shape: [{start_date_time:, end_date_time:}]
        date_time_ranges = validated_data.get("date_time_ranges", [])
        ## shape: [(start, end)]
        new_date_time_intervals = [
            DateTimeInterval(
                parse_ms_timestamp_to_datetime(date_time_range["start_date_time"]),
                parse_ms_timestamp_to_datetime(date_time_range["end_date_time"]),
            )
            for date_time_range in date_time_ranges
        ]

        try:
            created_bookings = create_bookings(
                booker=requester,
                venue=venue,
                new_date_time_intervals=new_date_time_intervals,
                form_response_data=validated_data.get("form_response_data", []),
            )
        except Exception as e:
            raise BadRequest(e)

        data = [booking_to_json(booking) for booking in created_bookings]

        return Response(data, status=status.HTTP_201_CREATED)

    @check_access(Role.ADMIN)
    def patch(self, request, requester: User):
        serializer = PatchBookingSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        actions = serializer.validated_data.get("actions", [])

        try:
            updated_bookings = update_booking_statuses(
                actions=actions, organization=requester.organization
            )
        except Exception as e:
            raise BadRequest(e)

        data = [booking_to_json(booking) for booking in updated_bookings]

        return Response(data, status=status.HTTP_200_OK)

    @check_access(Role.ADMIN)
    def delete(self, request, requester: User):
        serializer = DeleteBookingSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        booking_ids_to_be_deleted = serializer.validated_data.get("ids", [])

        delete_bookings(booking_ids_to_be_deleted, organization=requester.organization)

        return Response(status=status.HTTP_204_NO_CONTENT)
