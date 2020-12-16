from rest_framework import serializers

from .models import Booking, BookingStatus, BookingAction


class GetBookingSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=False)
    venue_id = serializers.IntegerField(required=False)
    start_date_time = serializers.IntegerField(min_value=0, required=False)
    end_date_time = serializers.IntegerField(min_value=0, required=False)
    status = status = serializers.ChoiceField(
        choices=BookingStatus.choices, required=False
    )

    def validate(self, data):
        """
        Check that start_date_time is before end_date_time.
        """
        if (
            "start_date_time" in data
            and "end_date_time" in data
            and data["start_date_time"] <= data["end_date_time"]
        ):
            raise serializers.ValidationError(
                "Booking start date/time must be after end date/time"
            )

        return data


class PostBookingSerializer(serializers.ModelSerializer):
    venue_id = serializers.IntegerField()
    start_date_time = serializers.IntegerField(min_value=0)
    end_date_time = serializers.IntegerField(min_value=0)

    def validate(self, data):
        """
        Check that start_date_time is before end_date_time.
        """
        if data["start_date_time"] <= data["end_date_time"]:
            raise serializers.ValidationError(
                "Booking start date/time must be after end date/time"
            )

        return data

    class Meta:
        model = Booking
        fields = ["venue_id", "start_date_time", "end_date_time", "form_response_data"]


class BookingActionSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=BookingAction.choices)


class PatchBookingSerializer(serializers.Serializer):
    actions = BookingActionSerializer(many=True)


class DeleteBookingSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())
