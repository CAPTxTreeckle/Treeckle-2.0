import fastjsonschema
import logging

from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from treeckle.models.user import Role, User
from treeckle.strings.json_keys import (
    CATEGORY,
    FORM_DATA,
    NAME,
    NUMBER,
    OBJECT,
    PROPERTIES,
    REQUIRED,
    STRING,
    TYPE,
)
from users.permission_middlewares import check_access
from venues.logic import (
    create_or_update_category,
    create_venue,
    delete_venue_by_id,
    get_venues_by_organisation,
    get_venue_by_id,
    get_venue_categories_by_organisation,
    update_venue,
    venue_to_json,
)
from venues.middlewares import validate_venue_same_organisation


logger = logging.getLogger("main")

validate_number = fastjsonschema.compile({TYPE: NUMBER})

post_venue_data_validate = fastjsonschema.compile({
    TYPE: OBJECT,
    PROPERTIES: {
        CATEGORY: {TYPE: STRING},
        FORM_DATA: {TYPE: STRING},
        NAME: {TYPE: STRING},
    },
    REQUIRED: [CATEGORY, FORM_DATA, NAME]
})

put_venue_data_validate = post_venue_data_validate


class VenuesView(APIView):
    @check_access([Role.ADMIN])
    def post(self, request, requester: User):
        try:
            request_data = request.data
            post_venue_data_validate(request_data)

            with transaction.atomic():
                category = create_or_update_category(
                    name=request_data[CATEGORY],
                    organisation=requester.organisation
                )
                venue = create_venue(
                    name=request_data[NAME],
                    form_data=request_data[FORM_DATA],
                    category=category,
                    organisation=requester.organisation,
                )

            data = venue_to_json(venue)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    def get(self, request, requester: User):
        try:
            venues = get_venues_by_organisation(requester.organisation)
            data = [venue_to_json(venue) for venue in venues]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SingleVenueView(APIView):
    @check_access([Role.RESIDENT, Role.ORGANIZER, Role.ADMIN])
    @validate_venue_same_organisation
    def get(self, request, requester: User, venue_id: int):
        try:
            venue = get_venue_by_id(venue_id)
            data = venue_to_json(venue)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.ADMIN])
    @validate_venue_same_organisation
    def put(self, request, requester: User, venue_id: int):
        try:
            request_data = request.data
            put_venue_data_validate(request_data)

            with transaction.atomic():
                category = create_or_update_category(
                    name=request_data[CATEGORY],
                    organisation=requester.organisation
                )
                venue = update_venue(
                    id=venue_id,
                    name=request_data[NAME],
                    form_data=request_data[FORM_DATA],
                    category=category,
                    organisation=requester.organisation,
                )

            data = venue_to_json(venue)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


    @check_access([Role.ADMIN])
    @validate_venue_same_organisation
    def delete(self, request, requester: User, venue_id: int):
        try:
            delete_venue_by_id(venue_id)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class VenueCategoriesView(APIView):
    @check_access([Role.ADMIN])
    def get(self, request, requester: User):
        try:
            categories = get_venue_categories_by_organisation(requester.organisation)
            data = [category.name for category in categories]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
