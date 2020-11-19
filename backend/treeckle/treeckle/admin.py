from django.contrib import admin

from treeckle.models.booking import Booking
from treeckle.models.booking_comment import BookingComment
from treeckle.models.comment import Comment
from treeckle.models.event import (
    Category,
    Event,
    EventCategory,
    EventSignUp,
    Subscription,
)
from treeckle.models.organisation import Organisation
from treeckle.models.user import User, UserInvite, UserRole
from treeckle.models.venue import Venue, VenueCategory

_ID = "id"
_NAME = "name"
_EMAIL = "email"
_ORGANISATION = "organisation"
_ORGANISATION_NAME = "organisation_name"
_ROLE = "role"
_USER = "user"
_USER_NAME = "user_name"


class OrganisationAdmin(admin.ModelAdmin):
    search_fields = (_ID, _NAME)
    list_display = (_ID, _NAME)


class UserAdmin(admin.ModelAdmin):
    search_fields = (_ID, _NAME, _EMAIL, _ORGANISATION_NAME)
    list_display = (_ID, _NAME, _EMAIL, _ORGANISATION_NAME)

    def organisation_name(self, obj):
        return obj.organisation.name

    def get_queryset(self, request):
        return super(UserAdmin, self) \
            .get_queryset(request) \
            .select_related(_ORGANISATION)


class UserRoleAdmin(admin.ModelAdmin):
    search_fields = (_ID, _ROLE)
    list_display = (_ID, _USER_NAME, _ROLE)

    def user_name(self, obj):
        return obj.user.name

    def get_queryset(self, request):
        return super(UserRoleAdmin, self) \
            .get_queryset(request) \
            .select_related(_USER)


admin.site.register(Booking)
admin.site.register(BookingComment)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Event)
admin.site.register(EventCategory)
admin.site.register(EventSignUp)
admin.site.register(Organisation, OrganisationAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(UserInvite)
admin.site.register(UserRole, UserRoleAdmin)
admin.site.register(Subscription)
admin.site.register(Venue)
admin.site.register(VenueCategory)