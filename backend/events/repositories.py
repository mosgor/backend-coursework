from abc import ABC, abstractmethod
from typing import List
from .models import Event

class EventRepositoryInterface(ABC):
    @abstractmethod
    def get_all(self) -> List[Event]: ...

class DjangoEventRepository(EventRepositoryInterface):
    def get_all(self) -> List[Event]:
        return list(Event.objects.all())