from rest_framework import serializers

from treeckle.common.serializer_fields import EmailListField
from .models import User, UserInvite, Role


class UserInviteSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(Role.choices, default=Role.RESIDENT)

    class Meta:
        model = UserInvite
        fields = ("email", "role")


class PostUserInviteSerializer(serializers.Serializer):
    invitations = UserInviteSerializer(many=True)


class EmailListSerializer(serializers.Serializer):
    emails = EmailListField()


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255, required=False)
    email = serializers.CharField(required=False)
    role = serializers.ChoiceField(Role.choices, required=False)

    class Meta:
        model = User
        fields = ("id", "name", "email", "role")


class PatchUserSerializer(serializers.Serializer):
    users = UserSerializer(many=True)