from django.contrib import admin
from .models import Course, Schedule, Enrollment

class ScheduleInline(admin.TabularInline):
    model = Schedule
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'style', 'level', 'node', 'is_active')
    list_filter = ('style', 'level', 'node', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ScheduleInline]
    filter_horizontal = ('teachers',)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'enrolled_at', 'is_active')
    list_filter = ('course', 'is_active')
