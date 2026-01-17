import os
import django
import sys
import math

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.organization.models import OrganizationNode

def populate_organization_nodes():
    """Create sample organization nodes with 3D configuration"""
    
    # Clear existing nodes (optional - comment out if you want to keep existing data)
    # OrganizationNode.objects.all().delete()
    
    nodes_data = [
        {
            'name': 'BachataVibe',
            'slug': 'bachatavibe',
            'type': 'ROOT',
            'description': 'Nœud racine - École de Bachata',
            'planet_type': 'glass',
            'planet_color': '#7c3aed',
            'orbit_radius': 3.0,
            'orbit_speed': 0.3,
            'planet_scale': 0.8,
            'rotation_speed': 1.2,
            'orbit_phase': 0.0,
            'is_visible_3d': True,
        },
        {
            'name': 'Cours',
            'slug': 'cours',
            'type': 'BRANCH',
            'description': 'Cours de Bachata',
            'planet_type': 'chrome',
            'planet_color': '#06b6d4',
            'orbit_radius': 5.0,
            'orbit_speed': 0.25,
            'planet_scale': 0.6,
            'rotation_speed': 0.8,
            'orbit_phase': math.pi,
            'is_visible_3d': True,
        },
        {
            'name': 'Événements',
            'slug': 'evenements',
            'type': 'EVENT',
            'description': 'Événements et soirées',
            'planet_type': 'wire',
            'planet_color': '#f59e0b',
            'orbit_radius': 7.0,
            'orbit_speed': 0.2,
            'planet_scale': 0.9,
            'rotation_speed': 0.8,
            'orbit_phase': math.pi / 2,
            'is_visible_3d': True,
        },
        {
            'name': 'Boutique',
            'slug': 'boutique',
            'type': 'BRANCH',
            'description': 'Boutique en ligne',
            'planet_type': 'dotted',
            'planet_color': '#ec4899',
            'orbit_radius': 9.0,
            'orbit_speed': 0.15,
            'planet_scale': 0.7,
            'rotation_speed': 1.2,
            'orbit_phase': math.pi * 1.5,
            'is_visible_3d': True,
        },
        {
            'name': 'Communauté',
            'slug': 'communaute',
            'type': 'BRANCH',
            'description': 'Réseau social et communauté',
            'planet_type': 'network',
            'planet_color': '#10b981',
            'orbit_radius': 11.0,
            'orbit_speed': 0.12,
            'planet_scale': 1.0,
            'rotation_speed': 0.6,
            'orbit_phase': math.pi / 4,
            'is_visible_3d': True,
        },
        {
            'name': 'À propos',
            'slug': 'apropos',
            'type': 'BRANCH',
            'description': 'Informations sur l\'école',
            'planet_type': 'star',
            'planet_color': '#8b5cf6',
            'orbit_radius': 13.0,
            'orbit_speed': 0.1,
            'planet_scale': 0.85,
            'rotation_speed': 1.0,
            'orbit_phase': math.pi * 1.25,
            'is_visible_3d': True,
        },
    ]
    
    created_count = 0
    updated_count = 0
    
    for node_data in nodes_data:
        node, created = OrganizationNode.objects.update_or_create(
            slug=node_data['slug'],
            defaults=node_data
        )
        
        if created:
            created_count += 1
            print(f"✓ Created: {node.name} ({node.planet_type})")
        else:
            updated_count += 1
            print(f"↻ Updated: {node.name} ({node.planet_type})")
    
    print(f"\n{'='*50}")
    print(f"Summary: {created_count} created, {updated_count} updated")
    print(f"Total nodes: {OrganizationNode.objects.count()}")
    print(f"{'='*50}")

if __name__ == '__main__':
    print("Populating Organization Nodes with 3D configuration...\n")
    populate_organization_nodes()
    print("\n✓ Done!")
