"""
Script to populate the MenuItem model with the navigation structure.
Run with: python manage.py shell < populate_menu.py
Or: python populate_menu.py (if Django is configured)
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.core.models import MenuItem

# Clear existing menu items
print("Clearing existing menu items...")
MenuItem.objects.all().delete()

# Menu structure definition
MENU_STRUCTURE = [
    {
        "name": "Cours",
        "slug": "cours",
        "url": "/cours",
        "icon": "GraduationCap",
        "order": 1,
        "children": [
            {"name": "Liste & Planning", "slug": "cours-planning", "url": "/cours/planning", "icon": "Calendar", "order": 1},
            {"name": "Filtres (Ville, Niveau)", "slug": "cours-filtres", "url": "/cours/filtres", "icon": "Filter", "order": 2},
            {"name": "Détails des programmes", "slug": "cours-programmes", "url": "/cours/programmes", "icon": "FileText", "order": 3},
            {"name": "Inscription", "slug": "cours-inscription", "url": "/cours/inscription", "icon": "UserPlus", "order": 4},
        ]
    },
    {
        "name": "Formations",
        "slug": "formations",
        "url": "/formations",
        "icon": "BookOpen",
        "order": 2,
        "children": [
            {"name": "Contenu éducatif en ligne", "slug": "formations-contenu", "url": "/formations/contenu", "icon": "Monitor", "order": 1},
            {"name": "Catégories", "slug": "formations-categories", "url": "/formations/categories", "icon": "FolderTree", "order": 2},
            {"name": "Vidéothèque", "slug": "formations-videotheque", "url": "/formations/videotheque", "icon": "Video", "order": 3},
        ]
    },
    {
        "name": "Trainings",
        "slug": "trainings",
        "url": "/trainings",
        "icon": "Dumbbell",
        "order": 3,
        "children": [
            {"name": "Sessions libres", "slug": "trainings-sessions", "url": "/trainings/sessions", "icon": "Clock", "order": 1},
            {"name": "Organisation adhérents", "slug": "trainings-adherents", "url": "/trainings/adherents", "icon": "Users", "order": 2},
        ]
    },
    {
        "name": "Artistes",
        "slug": "artistes",
        "url": "/artistes",
        "icon": "Star",
        "order": 4,
        "children": [
            {"name": "Annuaire", "slug": "artistes-annuaire", "url": "/artistes/annuaire", "icon": "BookUser", "order": 1},
            {"name": "Profils & Bios", "slug": "artistes-profils", "url": "/artistes/profils", "icon": "User", "order": 2},
            {"name": "Booking", "slug": "artistes-booking", "url": "/artistes/booking", "icon": "CalendarCheck", "order": 3},
            {"name": "Avis & Notes", "slug": "artistes-avis", "url": "/artistes/avis", "icon": "MessageSquare", "order": 4},
        ]
    },
    {
        "name": "Théorie",
        "slug": "theorie",
        "url": "/theorie",
        "icon": "Library",
        "order": 5,
        "children": [
            {"name": "Cours théoriques", "slug": "theorie-cours", "url": "/theorie/cours", "icon": "BookOpenCheck", "order": 1},
            {"name": "Quiz de connaissances", "slug": "theorie-quiz", "url": "/theorie/quiz", "icon": "CircleHelp", "order": 2},
            {"name": "Suivi de progression", "slug": "theorie-progression", "url": "/theorie/progression", "icon": "TrendingUp", "order": 3},
        ]
    },
    {
        "name": "Care",
        "slug": "care",
        "url": "/care",
        "icon": "Heart",
        "order": 6,
        "children": [
            {"name": "Soins & Récupération", "slug": "care-soins", "url": "/care/soins", "icon": "Sparkles", "order": 1},
            {"name": "Nos Praticiens", "slug": "care-praticiens", "url": "/care/praticiens", "icon": "Stethoscope", "order": 2},
            {"name": "Réservation", "slug": "care-reservation", "url": "/care/reservation", "icon": "CalendarPlus", "order": 3},
        ]
    },
    {
        "name": "Shop",
        "slug": "shop",
        "url": "/shop",
        "icon": "ShoppingBag",
        "order": 7,
        "children": [
            {"name": "Pulls & Sweats", "slug": "shop-pulls", "url": "/shop/pulls", "icon": "Shirt", "order": 1},
            {"name": "T-shirts", "slug": "shop-tshirts", "url": "/shop/tshirts", "icon": "Shirt", "order": 2},
            {"name": "Chaussures", "slug": "shop-chaussures", "url": "/shop/chaussures", "icon": "Footprints", "order": 3},
            {"name": "Vins & Spiritueux", "slug": "shop-vins", "url": "/shop/vins", "icon": "Wine", "order": 4},
        ]
    },
    {
        "name": "Projets",
        "slug": "projets",
        "url": "/projets",
        "icon": "Rocket",
        "order": 8,
        "children": [
            {"name": "Programme d'incubation", "slug": "projets-incubation", "url": "/projets/incubation", "icon": "Lightbulb", "order": 1},
            {"name": "Autres initiatives", "slug": "projets-initiatives", "url": "/projets/initiatives", "icon": "Sparkle", "order": 2},
        ]
    },
    {
        "name": "Organisation",
        "slug": "organisation",
        "url": "/organisation",
        "icon": "Network",
        "order": 9,
        "children": [
            {"name": "Structure", "slug": "organisation-structure", "url": "/organisation/structure", "icon": "Building2", "order": 1},
            {"name": "Pôles", "slug": "organisation-poles", "url": "/organisation/poles", "icon": "Boxes", "order": 2},
        ]
    },
]


def create_menu_items():
    """Create all menu items from the structure definition."""
    created_count = 0
    
    for category in MENU_STRUCTURE:
        # Create parent menu item
        parent = MenuItem.objects.create(
            name=category["name"],
            slug=category["slug"],
            url=category["url"],
            icon=category["icon"],
            order=category["order"],
            is_active=True,
        )
        created_count += 1
        print(f"  Created: {parent.name}")
        
        # Create children
        for child_data in category.get("children", []):
            child = MenuItem.objects.create(
                name=child_data["name"],
                slug=child_data["slug"],
                url=child_data["url"],
                icon=child_data["icon"],
                order=child_data["order"],
                parent=parent,
                is_active=True,
            )
            created_count += 1
            print(f"    - {child.name}")
    
    return created_count


if __name__ == "__main__":
    print("\n" + "="*50)
    print("Populating Menu Items")
    print("="*50 + "\n")
    
    count = create_menu_items()
    
    print("\n" + "="*50)
    print(f"Successfully created {count} menu items!")
    print("="*50 + "\n")
