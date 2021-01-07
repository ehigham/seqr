# Generated by Django 3.1.3 on 2021-01-04 15:29

# Generated by Django 3.1.3 on 2020-12-15 19:46

from django.db import migrations

from settings import ANALYST_PROJECT_CATEGORY, ANALYST_USER_GROUP, PM_USER_GROUP


def create_analyst_project_group(apps, schema_editor):
    ProjectCategory = apps.get_model('seqr', 'ProjectCategory')
    Project = apps.get_model('seqr', 'Project')
    db_alias = schema_editor.connection.alias
    analyst_projects = Project.objects.using(db_alias).filter(disable_staff_access=False)
    if analyst_projects:
        print('Creating analyst project group with {} projects'.format(len(analyst_projects)))
        project_category = ProjectCategory.objects.using(db_alias).create(name=ANALYST_PROJECT_CATEGORY)
        project_category.projects.set(analyst_projects)


def remove_analyst_project_group(apps, schema_editor):
    ProjectCategory = apps.get_model('seqr', 'ProjectCategory')
    Project = apps.get_model('seqr', 'Project')
    db_alias = schema_editor.connection.alias
    analyst_category = ProjectCategory.objects.using(db_alias).filter(name=ANALYST_PROJECT_CATEGORY).first()
    if analyst_category:
        analyst_project_ids = [p.id for p in analyst_category.projects.all()]
        non_staff_projects = Project.objects.using(db_alias).exclude(id__in=analyst_project_ids)
        if non_staff_projects:
            print('Updating staff disabled for {} projects'.format(len(non_staff_projects)))
            for project in non_staff_projects:
                project.disable_staff_access = True
        print('Removing analyst project group')
        analyst_category.delete()

def create_permission_groups(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Group = apps.get_model('auth', 'Group')
    db_alias = schema_editor.connection.alias

    staff_users = User.objects.using(db_alias).filter(is_staff=True)
    if staff_users:
        print('Creating user groups')
        analyst_group = Group.objects.using(db_alias).create(name=ANALYST_USER_GROUP)
        Group.objects.using(db_alias).create(name=PM_USER_GROUP)

        active_staff_users = staff_users.filter(is_active=True)
        print('Adding {} analysts'.format(len(active_staff_users)))
        analyst_group.user_set.set(active_staff_users)

        print('Updating {} staff users'.format(len(staff_users)))
        staff_users.update(is_staff=False)


def remove_permission_groups(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    db_alias = schema_editor.connection.alias

    analyst_group = Group.objects.using(db_alias).get(name=ANALYST_USER_GROUP)
    analysts = analyst_group.user_set.all()
    if analysts:
        print('Updating {} staff users'.format(len(analysts)))
        analysts.update(is_staff=True)

    print('Deleting user groups')
    analyst_group.delete()
    Group.objects.using(db_alias).get(name=PM_USER_GROUP).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('seqr', '0019_auto_20201221_1718'),
    ]

    operations = [
        migrations.RunPython(create_analyst_project_group, reverse_code=remove_analyst_project_group),
        migrations.RunPython(create_permission_groups, reverse_code=remove_permission_groups),
        migrations.RemoveField(
            model_name='project',
            name='disable_staff_access',
        ),
    ]
