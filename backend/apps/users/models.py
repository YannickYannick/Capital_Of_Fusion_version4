from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.models import BaseModel

class User(AbstractUser, BaseModel):
    """
    Enhanced User model for BachataVibe V4.
    """
    # Professional Profile
    dance_styles = models.ManyToManyField('core.DanceStyle', blank=True, related_name='dancers')
    dance_professions = models.ManyToManyField('core.DanceProfession', blank=True, related_name='professionals')
    
    # Organization Roles
    organization_roles = models.ManyToManyField(
        'organization.OrganizationNode', 
        through='organization.UserOrganizationRole',
        related_name='staff'
    )

    # Basic Info
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    # Dance-specific fields
    dance_level = models.ForeignKey(
        'core.Level', 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        related_name='users'
    )
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.username or self.email
