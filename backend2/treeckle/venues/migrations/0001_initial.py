# Generated by Django 3.1.3 on 2020-12-07 23:51

from django.db import migrations, models
import django.db.models.deletion
import django_update_from_dict


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0003_auto_20201206_1634'),
    ]

    operations = [
        migrations.CreateModel(
            name='VenueCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
            options={
                'ordering': ['name'],
            },
            bases=(django_update_from_dict.UpdateFromDictMixin, models.Model),
        ),
        migrations.CreateModel(
            name='Venue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('capacity', models.PositiveIntegerField(blank=True)),
                ('ic_name', models.CharField(blank=True, max_length=255)),
                ('ic_email', models.EmailField(blank=True, max_length=254)),
                ('ic_contact_number', models.CharField(blank=True, max_length=50)),
                ('form_data', models.JSONField()),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='venues.venuecategory')),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
            options={
                'ordering': ['name'],
            },
            bases=(django_update_from_dict.UpdateFromDictMixin, models.Model),
        ),
        migrations.AddConstraint(
            model_name='venuecategory',
            constraint=models.UniqueConstraint(fields=('name', 'organization_id'), name='unique_organization_venue_category'),
        ),
        migrations.AddConstraint(
            model_name='venue',
            constraint=models.UniqueConstraint(fields=('organization_id', 'name', 'category_id'), name='unique_organization_venue'),
        ),
    ]