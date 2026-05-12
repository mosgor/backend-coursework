from django.urls import path
from .views import EventListView

urlpatterns = [
    path('events', EventListView.as_view(), name='events-list'),
]