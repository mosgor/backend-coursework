import logging
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from django.conf import settings
import redis
from .services import UserService
from .repositories import DjangoUserRepository
from .serializers import (
    UserSerializer, RegisterRequestSerializer, LoginRequestSerializer
)

logger = logging.getLogger(__name__)

user_repo = DjangoUserRepository()
user_service = UserService(user_repo)

def get_redis_client():
    return redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        password=settings.REDIS_PASSWORD or None,
        decode_responses=True
    )

class RegisterView(views.APIView):
    def post(self, request):
        try:
            serializer = RegisterRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = user_service.register(**serializer.validated_data)
            token = str(AccessToken.for_user(user))
            logger.info(f"User registered: {user.email}")
            return Response({'user': UserSerializer(user).data, 'token': token}, status=status.HTTP_200_OK)
        except ValueError as e:
            logger.warning(f"Registration failed: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected registration error: {e}", exc_info=True)
            return Response({'error': 'Registration failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(views.APIView):
    def post(self, request):
        try:
            serializer = LoginRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = user_service.login(**serializer.validated_data)
            token = str(AccessToken.for_user(user))
            logger.info(f"User logged in: {user.email}")
            return Response({'user': UserSerializer(user).data, 'token': token}, status=status.HTTP_200_OK)
        except ValueError as e:
            logger.warning(f"Login failed: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected login error: {e}", exc_info=True)
            return Response({'error': 'Login failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if auth_header.startswith('Bearer '): 
                token = auth_header[7:]
                r = get_redis_client()
                r.setex(f'blacklist:{token}', 86400, '1')
                logger.info(f"User {request.user.email} logged out, token blacklisted")
            return Response({'message': 'logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Logout failed: {e}", exc_info=True)
            return Response({'error': 'Logout failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(views.APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = user_service.get_user(request.user.id)
            return Response(UserSerializer(user).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting profile: {e}", exc_info=True)
            return Response({'error': 'Failed to get profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        try:
            user = user_service.update_user(request.user.id, request.data)
            logger.info(f"User {request.user.id} profile updated")
            return Response(UserSerializer(user).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating profile: {e}", exc_info=True)
            return Response({'error': 'Failed to update profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)