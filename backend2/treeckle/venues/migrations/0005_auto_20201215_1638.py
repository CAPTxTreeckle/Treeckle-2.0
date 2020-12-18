# Generated by Django 3.1.3 on 2020-12-15 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('venues', '0004_auto_20201209_1724'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='venue',
            name='unique_organization_venue',
        ),
        migrations.AddConstraint(
            model_name='venue',
            constraint=models.UniqueConstraint(fields=('organization_id', 'name'), name='unique_organization_venue_name'),
        ),
    ]