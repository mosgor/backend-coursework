from typing import List
from events.models import Event
from .repositories import CartRepositoryInterface

class CartService:
    def __init__(self, repo: CartRepositoryInterface):
        self.repo = repo

    def get_cart_items(self, user_id: int) -> List[Event]:
        return self.repo.get_by_user(user_id)

    def add_to_cart(self, user_id: int, event_id: int) -> int:
        item = self.repo.add(user_id, event_id)
        return item.id

    def remove_from_cart(self, user_id: int, item_id: int) -> bool:
        return self.repo.remove_by_id(user_id, item_id)

    def remove_event_from_cart(self, user_id: int, event_id: int) -> bool:
        return self.repo.remove_by_event_id(user_id, event_id)