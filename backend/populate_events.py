import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.events.models import Event, EventPass
from apps.organization.models import OrganizationNode

def populate_events():
    # 1. Get references
    node = OrganizationNode.objects.get(slug='bachatavibe')
    
    # 2. Create Event
    event, created = Event.objects.get_or_create(
        name='Bachata Vibe Festival 2026',
        slug='bachata-vibe-festival-2026',
        defaults={
            'type': 'FESTIVAL',
            'description': 'Le plus gros festival de Bachata de l\'année. Workshops avec les meilleurs profs internationaux, soirées mémorables et shows.',
            'start_date': date.today() + timedelta(days=60),
            'end_date': date.today() + timedelta(days=63),
            'location_name': 'Hôtel de Ville, Lyon',
            'node': node
        }
    )
    
    if created:
        # 3. Create passes
        EventPass.objects.create(
            event=event,
            name='Full Pass Early Bird',
            price=89.00,
            quantity_available=50
        )
        EventPass.objects.create(
            event=event,
            name='Full Pass Regular',
            price=120.00,
            quantity_available=200
        )
        print(f"Événement '{event.name}' créé !")
    else:
        print(f"Événement '{event.name}' existe déjà.")

if __name__ == '__main__':
    populate_events()
