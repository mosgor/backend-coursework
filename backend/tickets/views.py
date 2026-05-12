import logging
from rest_framework import views, status, permissions
from rest_framework.response import Response
from .services import TicketService
from .repositories import DjangoTicketRepository
from events.serializers import EventSerializer

logger = logging.getLogger(__name__)
ticket_repo = DjangoTicketRepository()
ticket_service = TicketService(ticket_repo)

class TicketListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            logger.debug(f"Getting tickets for user {request.user.id}")
            events = ticket_service.get_tickets(request.user.id)
            return Response(EventSerializer(events, many=True).data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error getting tickets: {e}", exc_info=True)
            return Response({'error': 'Failed to get tickets'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)