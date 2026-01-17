from django.db import models
from apps.core.models import BaseModel

class Product(BaseModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"

    def __str__(self):
        return self.name

class Order(BaseModel):
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('PAID', 'Payé'),
        ('SHIPPED', 'Expédié'),
        ('CANCELLED', 'Annulé'),
    )
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"

class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_order = models.DecimalField(max_digits=10, decimal_places=2)
