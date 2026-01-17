from django.db import models
from apps.core.models import BaseModel

class OrganizationNode(BaseModel):
    NODE_TYPES = (
        ('ROOT', 'Root (CofF)'),
        ('BRANCH', 'Branch (BachataVibe)'),
        ('EVENT', 'Event (PBF)'),
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL, 
        related_name='children'
    )
    type = models.CharField(max_length=20, choices=NODE_TYPES)
    video_url = models.URLField(blank=True) # For the popup
    description = models.TextField(blank=True)
    
    # Configuration 3D pour la visualisation planétaire
    VISUAL_SOURCES = (
        ('preset', 'Préglage (Planet Type)'),
        ('glb', 'Fichier GLB'),
        ('gif', 'Fichier GIF / Image'),
    )
    
    visual_source = models.CharField(
        max_length=10,
        choices=VISUAL_SOURCES,
        default='preset',
        help_text="Choisissez la source du visuel : un préglage paramétrique ou un fichier"
    )

    PLANET_TYPES = (
        ('wire', 'Wireframe'),
        ('dotted', 'Dotted'),
        ('glass', 'Glass'),
        ('chrome', 'Chrome'),
        ('network', 'Network'),
        ('star', 'Starburst'),
    )
    
    planet_type = models.CharField(
        max_length=20,
        choices=PLANET_TYPES,
        default='glass',
        help_text="Utilisé si la source est 'Préglage'"
    )
    
    # Fichiers pour types personnalisés
    model_3d = models.FileField(
        upload_to='planets/models/',
        blank=True,
        null=True,
        help_text="Utilisé si la source est 'Fichier GLB'"
    )
    planet_texture = models.ImageField(
        upload_to='planets/textures/',
        blank=True,
        null=True,
        help_text="Utilisé si la source est 'Fichier GIF / Image'"
    )

    planet_color = models.CharField(
        max_length=7,
        default='#7c3aed',
        help_text="Couleur de la planète (format hex: #RRGGBB)"
    )
    orbit_radius = models.FloatField(
        default=5.0,
        help_text="Distance du centre (rayon de l'orbite)"
    )
    orbit_speed = models.FloatField(
        default=0.15,
        help_text="Vitesse de rotation orbitale"
    )
    planet_scale = models.FloatField(
        default=0.8,
        help_text="Taille de la planète"
    )
    rotation_speed = models.FloatField(
        default=1.0,
        help_text="Vitesse de rotation sur elle-même"
    )
    orbit_phase = models.FloatField(
        default=0.0,
        help_text="Position initiale sur l'orbite (en radians)"
    )
    is_visible_3d = models.BooleanField(
        default=True,
        help_text="Afficher cette planète dans la scène 3D"
    )

    class Meta:
        verbose_name = "Noeud d'organisation"
        verbose_name_plural = "Noeuds d'organisation"

    def __str__(self):
        return self.name

class OrganizationRole(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Rôle d'organisation"
        verbose_name_plural = "Rôles d'organisation"

    def __str__(self):
        return self.name

class UserOrganizationRole(BaseModel):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='user_roles')
    node = models.ForeignKey(OrganizationNode, on_delete=models.CASCADE, related_name='node_users')
    role = models.ForeignKey(OrganizationRole, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Rôle d'utilisateur"
        unique_together = ('user', 'node', 'role')
