from rest_framework import serializers
from treeckle.models.comment import Comment
from treeckle.models.booking_comment import BookingComment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'name', 'content']

class BookingCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingComment
        fields = ['booking', 'comment'] 
        