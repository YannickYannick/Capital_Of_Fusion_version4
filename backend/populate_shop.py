import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.shop.models import Product

def populate_shop():
    products = [
        {
            'name': 'T-Shirt BachataVibe V4',
            'slug': 'tshirt-bachatavibe-v4',
            'description': 'T-shirt premium 100% coton bio. Coupe moderne.',
            'price': 25.00,
            'stock': 100
        },
        {
            'name': 'Hoodie Fusion Black',
            'slug': 'hoodie-fusion-black',
            'description': 'Hoodie ultra-confort pour vos workshops.',
            'price': 45.00,
            'stock': 50
        },
        {
            'name': 'Chaussures de Danse Pro',
            'slug': 'chaussures-danse-pro',
            'description': 'Spécialement conçues pour le pivot et le confort.',
            'price': 89.00,
            'stock': 20
        },
        {
            'name': 'Pack de Stickers Cosmic',
            'slug': 'stickers-cosmic',
            'description': 'Brillez avec nos stickers holographiques.',
            'price': 5.00,
            'stock': 500
        }
    ]
    
    for p_data in products:
        p, created = Product.objects.get_or_create(
            slug=p_data['slug'],
            defaults=p_data
        )
        if created:
            print(f"Produit '{p.name}' créé !")
        else:
            print(f"Produit '{p.name}' existe déjà.")

if __name__ == '__main__':
    populate_shop()
