from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'

    def ready(self):
        import os
        if os.environ.get('RUN_MAIN'):
            from django.contrib.auth.models import User as DjangoUser
            from .models import User
            django_users = set(DjangoUser.objects.all().values_list('id', flat=True))
            users = set(User.objects.all().values_list('user__id', flat=True))
            for user_id in django_users.difference(users):
                User.objects.create(user=DjangoUser.objects.get(id=user_id)).save()
