# Generated by Django 3.1 on 2020-10-14 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('treeckle', '0007_auto_20201014_0549'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='organised_by',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='event',
            name='image_url',
            field=models.URLField(),
        ),
    ]
