from django.contrib import admin
from .models import DanceStyle, Level, DanceProfession, SiteConfiguration, MenuItem

@admin.register(DanceStyle)
class DanceStyleAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order')
    list_editable = ('order',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(DanceProfession)
class DanceProfessionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Identité du Site', {
            'fields': ('site_name',)
        }),
        ('Page d\'Accueil - Hero Section', {
            'fields': ('hero_title', 'hero_subtitle', 'hero_video_url'),
            'description': 'Contenu de la section principale de la page d\'accueil'
        }),
        ('Métadonnées', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('updated_at',)
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteConfiguration.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion
        return False


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'url', 'order', 'is_active')
    list_filter = ('is_active', 'parent')
    list_editable = ('order', 'is_active')
    search_fields = ('name', 'slug', 'url')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order', 'name')
    
    fieldsets = (
        ('Informations', {
            'fields': ('name', 'slug', 'parent')
        }),
        ('Navigation', {
            'fields': ('url', 'icon', 'order')
        }),
        ('Visibilité', {
            'fields': ('is_active',)
        }),
    )
