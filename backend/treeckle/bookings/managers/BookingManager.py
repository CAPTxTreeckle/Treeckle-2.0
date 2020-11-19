import logging
import datetime
import traceback

from django.db import models
from django.apps import apps
from users.logic import get_user_by_id

logger = logging.getLogger("main")

START_DATE_DEFAULT = 0
END_DATE_DEFAULT = int(pow(2, 31) - 1) * 1000 # default end_time

class DefaultManager(models.Manager):
    def get_bookings(self, booker, offset=None, limit=None):
        try:
            query_result = super().all().filter(booker=booker)
            if offset is not None and limit is not None:
                return query_result[offset: offset + limit]
            elif offset is None and limit is not None:
                return query_result[0: 0 + limit]
            elif limit is None and offset is not None:
                return query_result[offset:]
            else:
                return query_result
        except self.model.DoesNotExist:
            return None

    def get_all_bookings(self, status, start_date, end_date, offset, limit, venue_id, user_id):
        try:
            current_user = get_user_by_id(user_id)
            # set filter
            filters = {}
            if status:
                filters['status'] = status
            
            if venue_id:
                filters['venue__id'] = venue_id
            
            query_result = super().all().filter(**filters).filter(booker__organisation=current_user.organisation)
            query_result = self.filter_time_interval(query_result, start_date, end_date)

            if offset is not None and limit is not None:
                return query_result[offset: offset + limit]
            elif offset is None and limit is not None:
                return query_result[0: 0 + limit]
            elif limit is None and offset is not None:
                return query_result[offset:]
            else:
                return query_result
        except self.model.DoesNotExist:
            return None
        except Exception as e:
            logger.info(traceback.print_exc())
    
    def filter_time_interval(self, query_result, start_date=START_DATE_DEFAULT, end_date=END_DATE_DEFAULT):
        if start_date is None:
            start_date = 0
        
        if end_date is None:
            end_date = int(pow(2, 31) - 1) * 1000 # default end_time
        
        start_datetime = self.convert_to_datetime(start_date)
        end_datetime = self.convert_to_datetime(end_date)

        start_date_bookings = query_result.filter(start_date__range=(start_datetime, end_datetime))
        end_date_bookings = query_result.filter(end_date__range=(start_datetime, end_datetime))
        
        return self.combine_bookings(start_date_bookings, end_date_bookings)

    def convert_to_datetime(self, timestamp) -> datetime:
        return datetime.datetime.fromtimestamp(float(timestamp) / 1000.0)

    def combine_bookings(self, start_date_bookings, end_date_bookings):
        inserted = set()
        all_bookings = []

        for booking in start_date_bookings:
            if not booking.id in inserted:
                all_bookings.append(booking)
                inserted.add(booking.id)
        
        for booking in end_date_bookings:
            if not booking.id in inserted:
                all_bookings.append(booking)
                inserted.add(booking.id)
        
        return all_bookings