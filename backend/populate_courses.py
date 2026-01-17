import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.core.models import DanceStyle, Level
from apps.courses.models import Course, Schedule
from apps.organization.models import OrganizationNode
from django.contrib.auth import get_user_model

User = get_user_model()

def populate_courses():
    # 1. Get references
    style, _ = DanceStyle.objects.get_or_create(name='Bachata', slug='bachata')
    level, _ = Level.objects.get_or_create(name='Débutant', slug='debutant', order=1)
    node = OrganizationNode.objects.get(slug='bachatavibe')
    teacher = User.objects.get(username='admin')
    
    # 2. Create Course
    course, created = Course.objects.get_or_create(
        name='Bachata Débutant - Lundi',
        slug='bachata-debutant-lundi',
        defaults={
            'description': 'Apprenez les bases de la Bachata dans une ambiance conviviale. Pas de base, tours simples et connexion.',
            'style': style,
            'level': level,
            'node': node,
            'is_active': True
        }
    )
    if created:
        course.teachers.add(teacher)
        
        # 3. Create Schedule
        Schedule.objects.create(
            course=course,
            day_of_week=0, # Lundi
            start_time='19:30:00',
            end_time='20:30:00',
            location_name='Studio Vibe'
        )
        print(f"Cours '{course.name}' créé !")
    else:
        print(f"Cours '{course.name}' existe déjà.")

if __name__ == '__main__':
    populate_courses()
