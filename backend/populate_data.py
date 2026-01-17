import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.core.models import DanceStyle, Level
from apps.organization.models import OrganizationNode

def populate():
    # 1. Levels
    beg, _ = Level.objects.get_or_create(name='Débutant', slug='debutant', order=1, color='#3b82f6')
    inter, _ = Level.objects.get_or_create(name='Intermédiaire', slug='intermediaire', order=2, color='#10b981')
    adv, _ = Level.objects.get_or_create(name='Avancé', slug='avance', order=3, color='#ef4444')
    
    # 2. Dance Styles
    bachata, _ = DanceStyle.objects.get_or_create(name='Bachata', slug='bachata')
    DanceStyle.objects.get_or_create(name='Bachata Sensual', slug='bachata-sensual', parent=bachata)
    DanceStyle.objects.get_or_create(name='Bachata Moderna', slug='bachata-moderna', parent=bachata)
    
    # 3. Organization Nodes
    coff, _ = OrganizationNode.objects.get_or_create(name='Capital of Fusion', slug='coff', type='ROOT')
    OrganizationNode.objects.get_or_create(name='BachataVibe', slug='bachatavibe', type='BRANCH', parent=coff)
    
    print("Population terminée avec succès !")

if __name__ == '__main__':
    populate()
