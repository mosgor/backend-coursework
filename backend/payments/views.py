import logging
from rest_framework import views, status, permissions
from rest_framework.response import Response
from .serializers import PayRequestSerializer
from .services import PaymentService
from cart.repositories import DjangoCartRepository
from tickets.repositories import DjangoTicketRepository

logger = logging.getLogger(__name__)
cart_repo = DjangoCartRepository()
ticket_repo = DjangoTicketRepository()
payment_service = PaymentService(cart_repo, ticket_repo)

class PaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            serializer = PayRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            event_ids = serializer.validated_data['eventIds']
            logger.info(f"Processing payment for user {request.user.id}, events: {event_ids}")
            success = payment_service.process_payment(request.user.id, event_ids)
            return Response({'success': success}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Payment processing failed: {e}", exc_info=True)
            return Response({'success': False, 'error': 'Payment failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)