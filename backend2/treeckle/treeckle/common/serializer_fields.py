from rest_framework import serializers


class IntegerListField(serializers.ListField):
    child = serializers.IntegerField()


class StringListField(serializers.ListField):
    child = serializers.CharField()


class EmailListField(serializers.ListField):
    child = serializers.EmailField()