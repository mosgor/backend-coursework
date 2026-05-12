from typing import List
from .models import Event
from .repositories import EventRepositoryInterface

class EventService:
    def __init__(self, repo: EventRepositoryInterface):
        self.repo = repo

    def get_events(self) -> List[Event]:
        events = self.repo.get_all()
        return events