from typing import List
from django.db import transaction
from cart.repositories import CartRepositoryInterface
from tickets.repositories import TicketRepositoryInterface

class PaymentService:
    def __init__(self, cart_repo: CartRepositoryInterface, ticket_repo: TicketRepositoryInterface):
        self.cart_repo = cart_repo
        self.ticket_repo = ticket_repo

    @transaction.atomic
    def process_payment(self, user_id: int, event_ids: List[int]) -> bool:
        for event_id in event_ids:
            self.ticket_repo.add(user_id, event_id)
            self.cart_repo.remove_by_event_id(user_id, event_id)
        return True