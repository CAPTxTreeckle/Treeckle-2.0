from rest_framework import serializers
from treeckle.models.booking import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['booker', 'venue', 'form_data', 'start_date', 'end_date', 'status']
