from datetime import datetime
from dateutil import parser
import fastjsonschema
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from events.middlewares import validate_event_edit_access
from events.logic.sign_up import sign_up_to_json
from events.logic.event import (
    create_event,
    delete_event_by_id,
    delete_category_by_id,
    event_to_json,
    update_event,
    get_category_by_id,
    get_event_by_id,
    get_event_sign_ups,
    get_events_by_organisation,
    get_events_by_organiser,
    get_events_with_user_sign_up,
    get_event_categories_by_organisation,
)
from treeckle.models.user import Role, User
from treeckle.strings.json_keys import (
    BOOLEAN,
    CAPACITY,
    CATEGORIES,
    DESCRIPTION,
    END_DATE,
    EVENT,
    IMAGE,
    IS_PUBLISHED,
    IS_SIGN_UP_ALLOWED,
    IS_SIGN_UP_APPROVAL_REQUIRED,
    NUMBER,
    OBJECT,
    ORGANISED_BY,
    PROPERTIES,
    REQUIRED,
    SIGN_UPS,
    START_DATE,
    STRING,
    TITLE,
    TYPE,
    VENUE_NAME,
)
from users.permission_middlewares import check_access

logger = logging.getLogger("main")

validate_number = fastjsonschema.compile({TYPE: NUMBER})

post_event_data_validate = fastjsonschema.compile({
    TYPE: OBJECT,
    PROPERTIES: {
        TITLE: {TYPE: STRING},
        DESCRIPTION: {TYPE: STRING},
        ORGANISED_BY: {TYPE: STRING},
        VENUE_NAME: {TYPE: STRING},
        START_DATE: {TYPE: STRING},
        END_DATE: {TYPE: STRING},
        IMAGE: {TYPE: STRING},
        IS_SIGN_UP_ALLOWED: {TYPE: BOOLEAN},
        IS_SIGN_UP_APPROVAL_REQUIRED: {TYPE: BOOLEAN},
        IS_PUBLISHED: {TYPE: BOOLEAN},

    },
    REQUIRED: [TITLE, DESCRIPTION, VENUE_NAME, END_DATE, START_DATE, IS_SIGN_UP_ALLOWED, IS_SIGN_UP_APPROVAL_REQUIRED, IS_PUBLISHED]
})

put_event_data_validate = post_event_data_validate


class EventsView(APIView):
    @check_access([Role.ORGANIZER, Role.ADMIN])
    def post(self, request, requester: User):
        try:
            request_data = request.data
            post_event_data_validate(request_data)
            start_date = _convert_to_datetime(request_data[START_DATE])
            end_date = _convert_to_datetime(request_data[END_DATE])
            event = create_event(
                title=request_data[TITLE],
                description=request_data[DESCRIPTION],
                organiser=requester,
                organised_by=request_data[ORGANISED_BY],
                venue_name=request_data[VENUE_NAME],
                capacity=request_data[CAPACITY],
                start_date=start_date,
                end_date=end_date,
                categories=request_data[CATEGORIES],
                image=request_data[IMAGE],
                is_sign_up_allowed=request_data[IS_SIGN_UP_ALLOWED],
                is_sign_up_approval_required=request_data[IS_SIGN_UP_APPROVAL_REQUIRED],
                is_published=request_data[IS_PUBLISHED],
            )   
            data = event_to_json(event, requester)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            events = get_events_by_organisation(requester.organisation)
            data = [event_to_json(event, requester) for event in events]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class OwnEventsView(APIView):
    @check_access([Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            events = get_events_by_organiser(requester)
            data = [event_to_json(event, requester) for event in events]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SignedUpEventsView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            events = get_events_with_user_sign_up(requester)
            data = [event_to_json(event, requester) for event in events]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SingleEventView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User, event_id: int):
        try:
            event = get_event_by_id(event_id)
            sign_ups = get_event_sign_ups(event)
            data = {
                EVENT: event_to_json(event, requester),
                SIGN_UPS: [sign_up_to_json(s) for s in sign_ups]
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.ORGANIZER, Role.ADMIN])
    @validate_event_edit_access
    def put(self, request, requester: User, event_id: int):
        try:
            request_data = request.data
            put_event_data_validate(request_data)
            start_date = _convert_to_datetime(request_data[START_DATE])
            end_date = _convert_to_datetime(request_data[END_DATE])
            event = update_event(
                id=event_id,
                title=request_data[TITLE],
                description=request_data[DESCRIPTION],
                organiser=requester,
                organised_by=request_data[ORGANISED_BY],
                venue_name=request_data[VENUE_NAME],
                capacity=request_data[CAPACITY],
                start_date=start_date,
                end_date=end_date,
                categories=request_data[CATEGORIES],
                image=request_data[IMAGE],
                is_sign_up_allowed=request_data[IS_SIGN_UP_ALLOWED],
                is_sign_up_approval_required=request_data[IS_SIGN_UP_APPROVAL_REQUIRED],
                is_published=request_data[IS_PUBLISHED],           
            )   
            data = event_to_json(event, requester)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.ADMIN])
    @validate_event_edit_access
    def delete(self, request, requester: User, event_id: int):
        try:
            delete_event_by_id(event_id)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


def _convert_to_datetime(date_string: str) -> datetime:
    return parser.parse(date_string)


class CategoriesView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            categories = get_event_categories_by_organisation(requester.organisation)
            data = [c.name for c in categories]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SingleCategoriesView(APIView):
    @check_access([Role.ADMIN])
    def delete(self, request, requester: User, category_id: int):
        try:
            category = get_category_by_id(category_id)
            if category.organisation_id != requester.organisation_id:
                raise Exception("User has no permission to modify this category")
            delete_category_by_id(category_id)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
