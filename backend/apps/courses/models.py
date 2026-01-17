from django.db import models
from apps.core.models import BaseModel

class Course(BaseModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    style = models.ForeignKey('core.DanceStyle', on_delete=models.CASCADE, related_name='courses')
    level = models.ForeignKey('core.Level', on_delete=models.CASCADE, related_name='courses')
    teachers = models.ManyToManyField('users.User', related_name='teaching_courses')
    node = models.ForeignKey('organization.OrganizationNode', on_delete=models.CASCADE, related_name='courses')
    
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='courses/', blank=True, null=True)

    class Meta:
        verbose_name = "Cours"
        verbose_name_plural = "Cours"

    def __str__(self):
        return self.name

class Schedule(BaseModel):
    DAYS = (
        (0, 'Lundi'), (1, 'Mardi'), (2, 'Mercredi'), (3, 'Jeudi'),
        (4, 'Vendredi'), (5, 'Samedi'), (6, 'Dimanche'),
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location_name = models.CharField(max_length=200)
    
    class Meta:
        verbose_name = "Horaire"
        verbose_name_plural = "Horaires"

class Enrollment(BaseModel):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='students')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'course')
