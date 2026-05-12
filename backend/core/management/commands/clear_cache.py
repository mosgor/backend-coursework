from django.core.management.base import BaseCommand
from django.conf import settings
import redis

class Command(BaseCommand):
    help = 'Очищает Redis кэш (blacklist токенов и прочие данные)'

    def handle(self, *args, **kwargs):
        r = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD or None
        )
        r.flushdb()
        self.stdout.write(self.style.SUCCESS('Redis cache cleared successfully'))