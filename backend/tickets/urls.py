from django.urls import path
from .views import TicketListView

urlpatterns = [
    path('tickets', TicketListView.as_view(), name='tickets-list'),
]