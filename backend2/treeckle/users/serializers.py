from rest_framework import serializers

from treeckle.common.serializer_fields import EmailListField
from .models import User, UserInvite, Role


class PostSingleUserInviteSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(Role.choices, default=Role.Resident)

    class Meta:
        model = UserInvite
        fields = ["email", "role"]
        extra_kwargs = {"email": {"validators": []}}


class PostUserInviteSerializer(serializers.Serializer):
    invitations = PostSingleUserInviteSerializer(many=True)


class PatchSingleUserInviteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    role = serializers.ChoiceField(Role.choices)

    class Meta:
        model = UserInvite
        fields = ["id", "role"]


class PatchUserInviteSerializer(serializers.Serializer):

    users = PatchSingleUserInviteSerializer(many=True)


class EmailListSerializer(serializers.Serializer):
    emails = EmailListField()


class PatchSingleUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=255, required=False)
    email = serializers.CharField(required=False)
    role = serializers.ChoiceField(Role.choices, required=False)

    class Meta:
        model = User
        fields = ["id", "name", "email", "role"]


class PatchUserSerializer(serializers.Serializer):
    users = PatchSingleUserSerializer(many=True)