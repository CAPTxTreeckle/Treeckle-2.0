from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from treeckle.common.parsers import parse_ms_timestamp_to_datetime
from users.permission_middlewares import check_access
from users.models import Role, User
from .serializers import (
    GetBookingSerializer,
    PostBookingSerializer,
    PatchBookingSerializer,
    DeleteBookingSerializer,
)
from .models import BookingStatus
from .logic import get_bookings, booking_to_json, delete_bookings

# Create your views here.
class TotalBookingCountView(APIView):
    def get(self, request):
        data = get_bookings().count()

        return Response(data, status=status.HTTP_200_OK)


class PendingBookingCountView(APIView):
    @check_access(Role.ADMIN)
    def get(self, request, requester: User):
        data = get_bookings(
            status=BookingStatus.PENDING, venue__organization=user.organization
        ).count()

        return Response(data, status=status.HTTP_200_OK)


class BookingsView(APIView):
    @check_access(Role.RESIDENT, Role.ORGANIZER, Role.ADMIN)
    def get(self, request, requester: User):
        pass

    @check_access(Role.RESIDENT, Role.ORGANIZER, Role.ADMIN)
    def post(self, request, requester: User):
        pass

    @check_access(Role.ADMIN)
    def patch(self, request, requester: User):
        pass

    @check_access(Role.ADMIN)
    def delete(self, request, requester: User):
        serializer = DeleteBookingSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        booking_ids_to_be_deleted = serializer.validated_data.get("ids", [])

        delete_bookings(booking_ids_to_be_deleted, organization=requester.organization)

        return Response(status=status.HTTP_204_NO_CONTENT)
