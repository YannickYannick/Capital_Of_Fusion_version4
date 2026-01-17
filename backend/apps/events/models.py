from django.db import models
from apps.core.models import BaseModel

class Event(BaseModel):
    EVENT_TYPES = (
        ('FESTIVAL', 'Festival'),
        ('PARTY', 'Social/Soirée'),
        ('WORKSHOP', 'Workshop/Stage'),
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    type = models.CharField(max_length=20, choices=EVENT_TYPES)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location_name = models.CharField(max_length=200)
    node = models.ForeignKey('organization.OrganizationNode', on_delete=models.CASCADE, related_name='events')
    
    image = models.ImageField(upload_to='events/', blank=True, null=True)

    class Meta:
        verbose_name = "Événement"
        verbose_name_plural = "Événements"

    def __str__(self):
        return self.name

class EventPass(BaseModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='passes')
    name = models.CharField(max_length=100) # Full Pass, Social Pass...
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.IntegerField(default=-1) # -1 for unlimited
    
    def __str__(self):
        return f"{self.event.name} - {self.name}"

class Registration(BaseModel):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='event_registrations')
    event_pass = models.ForeignKey(EventPass, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
