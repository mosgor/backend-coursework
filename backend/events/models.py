from django.db import models

class Event(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=127)
    date = models.DateTimeField()
    description = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    price = models.IntegerField()

    class Meta:
        db_table = 'events'
        verbose_name = 'Event'
        verbose_name_plural = 'Events'

    def __str__(self):
        return f"{self.title} ({self.date})"