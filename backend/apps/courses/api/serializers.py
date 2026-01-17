from rest_framework import serializers
from apps.courses.models import Course, Schedule, Enrollment

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'day_of_week', 'start_time', 'end_time', 'location_name']

class CourseSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'name', 'slug', 'description', 'style', 'level', 
            'teachers', 'node', 'is_active', 'image', 'schedules'
        ]

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'enrolled_at', 'is_active']
