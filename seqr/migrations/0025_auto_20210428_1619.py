# Generated by Django 3.1.6 on 2021-04-28 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seqr', '0024_varianttag_metadata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='family',
            name='analysis_status',
            field=models.CharField(choices=[('S', 'S'), ('S_kgfp', 'S'), ('S_kgdp', 'S'), ('S_ng', 'S'), ('ES', 'E'), ('Sc_kgfp', 'S'), ('Sc_kgdp', 'S'), ('Sc_ng', 'S'), ('Rcpc', 'R'), ('Rncc', 'R'), ('C', 'C'), ('I', 'A'), ('Q', 'W')], default='Q', max_length=10),
        ),
    ]