# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-11-12 16:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0036_merge_20171112_1618'),
    ]

    operations = [
        migrations.AlterField(
            model_name='family',
            name='short_description',
            field=models.TextField(blank=True, default=b''),
        ),
    ]
