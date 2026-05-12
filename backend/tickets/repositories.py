from abc import ABC, abstractmethod
from typing import List
from .models import Ticket
from events.models import Event

class TicketRepositoryInterface(ABC):
    @abstractmethod
    def get_by_user(self, user_id: int) -> List[Event]: ...
    @abstractmethod
    def add(self, user_id: int, event_id: int) -> None: ...

class DjangoTicketRepository(TicketRepositoryInterface):
    def get_by_user(self, user_id: int) -> List[Event]:
        tickets = Ticket.objects.filter(user_id=user_id).select_related('event')
        return [t.event for t in tickets]

    def add(self, user_id: int, event_id: int) -> None:
        Ticket.objects.create(user_id=user_id, event_id=event_id)