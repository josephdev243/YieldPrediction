from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """Custom user model with additional agricultural fields."""
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('extension_officer', 'Extension Officer'),
        ('admin', 'Admin'),
    )

    # Keep username for admin compatibility, but authenticate primarily via email.
    username = models.CharField(max_length=150, blank=True, null=True, unique=False)
    email = models.EmailField(unique=True)
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='farmer')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    prefers_email_notifications = models.BooleanField(default=True)
    prefers_sms_notifications = models.BooleanField(default=False)
    prefers_whatsapp_notifications = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        display_name = self.get_full_name() or self.email
        return f"{display_name} ({self.role})"
