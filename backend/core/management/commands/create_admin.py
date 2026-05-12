from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Создаёт или обновляет пользователя с правами суперюзера (admin)'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, required=True)
        parser.add_argument('--password', type=str, required=True)
        parser.add_argument('--name', type=str, default='Admin')

    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = kwargs['email']
        password = kwargs['password']
        name = kwargs['name']

        user, created = User.objects.update_or_create(
            email=email,
            defaults={'name': name, 'is_staff': True, 'is_superuser': True}
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Admin created: {email}'))
        else:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.WARNING(f'Admin updated: {email}'))