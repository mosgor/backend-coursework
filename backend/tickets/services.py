from typing import List
from events.models import Event
from .repositories import TicketRepositoryInterface

class TicketService:
    def __init__(self, repo: TicketRepositoryInterface):
        self.repo = repo

    def get_tickets(self, user_id: int) -> List[Event]:
        return self.repo.get_by_user(user_id)

    def add_ticket(self, user_id: int, event_id: int) -> None:
        self.repo.add(user_id, event_id)