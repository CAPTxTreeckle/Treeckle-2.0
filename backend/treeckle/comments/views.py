import logging
import traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from comments.logic import get_booking_comments, create_booking_comment, delete_booking_comments, update_comment
from treeckle.strings.json_keys import AUTHORIZATION
from users.permission_middlewares import check_access
from treeckle.models.user import Role, User

logger = logging.getLogger("main")

class BookingCommentsView(APIView):

    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def get(self, request, requester: User):
        try:
            user_id = requester.id
            id = int(request.GET.get("id", None))
            comments =  get_booking_comments(id)
            data = [x.to_json() for x in comments]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response({"status": "Unknown Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def delete(self, request, requester: User):
        try:
            comments_ids = request.data['ids']
            user_id = requester.id
            deleted_comments =  delete_booking_comments(comments_ids, user_id)
            return Response(deleted_comments, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e.msg)
            return Response({"status": "Unknown Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def post(self, request, requester: User):
        try:
            booking_id = int(request.GET.get("id", None))
            content = request.data['content']
            user_id = requester.id
            created_booking = create_booking_comment(content, booking_id, user_id)
            return Response(created_booking, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            logger.info(e)
            return Response({"status": "Unknown Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def put(self, request, requester: User):
        try: 
            comment_id = int(request.GET.get("id", None))
            updated_content = request.data['content']
            user_id = requester.id
            updated_content = update_comment(comment_id, updated_content, user_id)
            return Response(updated_content, status=status.HTTP_200_OK)
        except Exception as e:
            logger.info(e)
            return Response({"status": "Unknown Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
