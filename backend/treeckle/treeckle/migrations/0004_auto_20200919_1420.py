# Generated by Django 3.1 on 2020-09-19 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('treeckle', '0003_remove_venue_contact'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='category',
            constraint=models.UniqueConstraint(fields=('name', 'organisation_id'), name='unique organisation and category name'),
        ),
    ]
