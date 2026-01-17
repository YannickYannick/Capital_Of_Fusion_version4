from django.db import models

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
