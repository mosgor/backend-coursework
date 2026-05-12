from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from django.contrib.auth.hashers import check_password
from .models import User

class UserRepositoryInterface(ABC):
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]: ...
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]: ...
    
    @abstractmethod
    def create(self, email: str, name: str, password: str) -> User: ...
    
    @abstractmethod
    def update(self, user: User) -> User: ...

class DjangoUserRepository(UserRepositoryInterface):
    def get_by_id(self, user_id: int) -> Optional[User]:
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    def get_by_email(self, email: str) -> Optional[User]:
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None

    def create(self, email: str, name: str, password: str) -> User:
        return User.objects.create_user(email=email, name=name, password=password)

    def update(self, user: User) -> User:
        user.save()
        return user

    def verify_password(self, raw_password: str, hashed_password: str) -> bool:
        return check_password(raw_password, hashed_password)