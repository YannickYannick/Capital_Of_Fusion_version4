from rest_framework import serializers
from apps.core.models import DanceStyle, Level, DanceProfession, SiteConfiguration

class DanceStyleSerializer(serializers.ModelSerializer):
    sub_styles = serializers.SerializerMethodField()
    
    class Meta:
        model = DanceStyle
        fields = ['id', 'name', 'slug', 'icon', 'description', 'parent', 'sub_styles']
    
    def get_sub_styles(self, obj):
        if obj.sub_styles.exists():
            return DanceStyleSerializer(obj.sub_styles.all(), many=True).data
        return []

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'name', 'slug', 'order', 'color', 'description']

class DanceProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DanceProfession
        fields = ['id', 'name', 'slug', 'description']

class SiteConfigurationSerializer(serializers.ModelSerializer):
    video_id = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteConfiguration
        fields = ['site_name', 'hero_title', 'hero_subtitle', 'hero_video_url', 'video_id', 'updated_at']
    
    def get_video_id(self, obj):
        """Extract YouTube video ID from URL"""
        url = obj.hero_video_url
        if 'youtube.com/watch?v=' in url:
            return url.split('v=')[1].split('&')[0]
        elif 'youtu.be/' in url:
            return url.split('youtu.be/')[1].split('?')[0]
        return None
