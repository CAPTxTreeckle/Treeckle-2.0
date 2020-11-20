from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, UserInvite, Role
from .permission_middlewares import check_access

# Create your views here.
class UserInviteView(APIView):
    @check_access([Role.ADMIN, Role.ORGANIZER, Role.RESIDENT])
    def get(self, request, requester):
        print(requester)

        return Response({}, status=status.HTTP_200_OK)