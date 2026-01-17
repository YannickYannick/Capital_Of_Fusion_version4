import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.core.models import SiteConfiguration

def populate_site_config():
    config = SiteConfiguration.load()
    print(f"Configuration créée/mise à jour : {config}")
    print(f"  - Nom du site : {config.site_name}")
    print(f"  - Titre Hero : {config.hero_title}")
    print(f"  - Sous-titre Hero : {config.hero_subtitle}")
    print(f"  - URL Vidéo : {config.hero_video_url}")

if __name__ == '__main__':
    populate_site_config()
