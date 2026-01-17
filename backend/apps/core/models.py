from django.db import models
import uuid

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class DanceStyle(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE, 
        related_name='sub_styles'
    )
    icon = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Style de danse"
        verbose_name_plural = "Styles de danse"

    def __str__(self):
        return self.name

class Level(BaseModel):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default="#3b82f6")
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Niveau"
        verbose_name_plural = "Niveaux"
        ordering = ['order']

    def __str__(self):
        return self.name

class DanceProfession(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


# Site Configuration (CMS)
class SiteConfiguration(models.Model):
    """
    Singleton model for site-wide configuration.
    Only one instance should exist.
    """
    site_name = models.CharField(
        max_length=200,
        default="Capital of Fusion",
        verbose_name="Nom du site",
        help_text="Nom affiché dans la navbar (ex: 'Capital of Fusion')"
    )
    
    hero_title = models.CharField(
        max_length=500,
        default="L'EXPÉRIENCE BACHATA ULTIME",
        verbose_name="Titre Hero",
        help_text="Titre principal de la page d'accueil"
    )
    
    hero_subtitle = models.TextField(
        default="Plongez dans l'univers de la Bachata Fusion. Apprenez, progressez et connectez-vous avec la meilleure communauté de France.",
        verbose_name="Sous-titre Hero",
        help_text="Description sous le titre principal"
    )
    
    hero_video_url = models.URLField(
        max_length=500,
        default="https://www.youtube.com/watch?v=XOfvM3i9S4A",
        verbose_name="URL Vidéo YouTube",
        help_text="URL complète de la vidéo YouTube pour le fond (ex: https://www.youtube.com/watch?v=VIDEO_ID)"
    )
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Configuration du Site"
        verbose_name_plural = "Configuration du Site"
    
    def __str__(self):
        return f"Configuration - {self.site_name}"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists (Singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Prevent deletion
        pass
    
    @classmethod
    def load(cls):
        """Get or create the singleton instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


__all__ = ['BaseModel', 'DanceStyle', 'Level', 'DanceProfession', 'SiteConfiguration']
