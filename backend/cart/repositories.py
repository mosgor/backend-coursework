from abc import ABC, abstractmethod
from typing import List
from .models import CartItem
from events.models import Event

class CartRepositoryInterface(ABC):
    @abstractmethod
    def get_by_user(self, user_id: int) -> List[Event]: ...
    @abstractmethod
    def add(self, user_id: int, event_id: int) -> CartItem: ...
    @abstractmethod
    def remove_by_id(self, user_id: int, item_id: int) -> bool: ...
    @abstractmethod
    def remove_by_event_id(self, user_id: int, event_id: int) -> bool: ...

class DjangoCartRepository(CartRepositoryInterface):
    def get_by_user(self, user_id: int) -> List[Event]:
        items = CartItem.objects.filter(user_id=user_id).select_related('event')
        return [item.event for item in items]

    def add(self, user_id: int, event_id: int) -> CartItem:
        item, _ = CartItem.objects.get_or_create(user_id=user_id, event_id=event_id)
        return item

    def remove_by_id(self, user_id: int, item_id: int) -> bool:
        deleted, _ = CartItem.objects.filter(id=item_id, user_id=user_id).delete()
        return deleted > 0

    def remove_by_event_id(self, user_id: int, event_id: int) -> bool:
        deleted, _ = CartItem.objects.filter(user_id=user_id, event_id=event_id).delete()
        return deleted > 0