from typing import Dict, Any
from .models import User
from .repositories import UserRepositoryInterface

class UserService:
    def __init__(self, repo: UserRepositoryInterface):
        self.repo = repo

    def register(self, email: str, name: str, password: str) -> User:
        if self.repo.get_by_email(email):
            raise ValueError("User with this email already exists")
        return self.repo.create(email, name, password)

    def login(self, email: str, password: str) -> User:
        user = self.repo.get_by_email(email)
        if not user or not self.repo.verify_password(password, user.password):
            raise ValueError("Invalid credentials")
        return user

    def get_user(self, user_id: int) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        return user

    def update_user(self, user_id: int, data: Dict[str, Any]) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.set_password(data['password'])
            
        return self.repo.update(user)