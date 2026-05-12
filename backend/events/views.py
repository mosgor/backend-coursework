import logging
from rest_framework import views, status
from rest_framework.response import Response
from .services import EventService
from .repositories import DjangoEventRepository
from .serializers import EventSerializer

logger = logging.getLogger(__name__)
event_repo = DjangoEventRepository()
event_service = EventService(event_repo)

class EventListView(views.APIView):
    def get(self, request):
        try:
            logger.info("Fetching all events")
            events = event_service.get_events()
            logger.info(f"Found {len(events)} events")
            return Response({'events': EventSerializer(events, many=True).data}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching events: {e}", exc_info=True)
            return Response({'error': 'Failed to fetch events'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)