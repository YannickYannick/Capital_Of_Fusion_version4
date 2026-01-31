from django.contrib import admin
from .models import OrganizationNode, OrganizationRole, UserOrganizationRole

@admin.register(OrganizationNode)
class OrganizationNodeAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'parent', 'slug', 'is_visible_3d')
    list_filter = ('type', 'is_visible_3d', 'planet_type')
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = [
        ('Informations de base', {
            'fields': ['name', 'slug', 'parent', 'type', 'description']
        }),
        ('Configuration 3D', {
            'fields': [
                'is_visible_3d',
                'visual_source',
                'planet_type', 
                ('model_3d', 'planet_texture'),
                'planet_color', 
                'planet_scale',
                ('orbit_radius', 'orbit_speed', 'orbit_phase'),
                ('orbit_shape', 'orbit_roundness'),
                'rotation_speed',
            ],
            'classes': ['collapse'],
            'description': 'Paramètres de visualisation 3D pour la page /explore'
        }),
        ('Animation d\'Entrée', {
            'fields': [
                ('entry_start_x', 'entry_start_y', 'entry_start_z'),
                'entry_speed',
            ],
            'classes': ['collapse'],
            'description': 'Configuration de la trajectoire d\'entrée (ligne droite avant l\'orbite)'
        }),
        ('Médias', {
            'fields': ['video_url'],
            'classes': ['collapse']
        }),
    ]

@admin.register(OrganizationRole)
class OrganizationRoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(UserOrganizationRole)
class UserOrganizationRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'node', 'role')
    list_filter = ('node', 'role')
