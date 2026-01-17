from django.contrib import admin
from .models import Event, EventPass, Registration

class EventPassInline(admin.TabularInline):
    model = EventPass
    extra = 1

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'start_date', 'end_date', 'node')
    list_filter = ('type', 'node', 'start_date')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [EventPassInline]

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event_pass', 'registered_at', 'is_paid')
    list_filter = ('is_paid', 'event_pass__event')
