from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for enhanced custom User model."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'dance_level', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'dance_level']
    search_fields = ['username', 'first_name', 'last_name', 'email']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Dance Profile', {
            'fields': ('phone', 'bio', 'profile_picture', 'dance_level', 'dance_styles', 'dance_professions')
        }),
    )
    
    filter_horizontal = ('dance_styles', 'dance_professions', 'groups', 'user_permissions')
