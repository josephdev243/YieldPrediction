from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_customuser_prefers_email_notifications_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="email",
            field=models.EmailField(max_length=254, unique=True, verbose_name="email address"),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="username",
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="role",
            field=models.CharField(
                choices=[
                    ("farmer", "Farmer"),
                    ("extension_officer", "Extension Officer"),
                    ("admin", "Admin"),
                ],
                default="farmer",
                max_length=20,
            ),
        ),
    ]
