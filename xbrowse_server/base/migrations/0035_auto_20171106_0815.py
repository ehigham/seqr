# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-11-06 08:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0034_auto_20171102_0000'),
    ]

    operations = [
        migrations.AddField(
            model_name='family',
            name='coded_phenotype',
            field=models.TextField(blank=True, default=b'', null=True),
        ),
        migrations.AddField(
            model_name='family',
            name='post_discovery_omim_number',
            field=models.TextField(blank=True, default=b'', null=True),
        ),
    ]
