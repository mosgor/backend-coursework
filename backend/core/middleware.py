import redis
from django.http import HttpResponse
from django.conf import settings

class JWTBlacklistMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.redis_client = None
        if hasattr(settings, 'REDIS_HOST'):
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD or None,
                decode_responses=True
            )

    def __call__(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
            if self.redis_client and self.redis_client.exists(f'blacklist:{token}'):
                return HttpResponse('Token revoked', status=401)
        return self.get_response(request)	