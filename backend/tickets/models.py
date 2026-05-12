from django.db import models
from users.models import User
from events.models import Event

class Ticket(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, db_column='event_id')

    class Meta:
        db_table = 'tickets'

    def __str__(self):
        return f"Ticket {self.id} for event {self.event_id}"