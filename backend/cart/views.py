import logging
from rest_framework import views, status, permissions
from rest_framework.response import Response
from .services import CartService
from .repositories import DjangoCartRepository
from .serializers import AddCartItemSerializer
from events.serializers import EventSerializer

logger = logging.getLogger(__name__)
cart_repo = DjangoCartRepository()
cart_service = CartService(cart_repo)

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Получить корзину"""
        try:
            logger.debug(f"Getting cart for user {request.user.id}")
            events = cart_service.get_cart_items(request.user.id)
            return Response(EventSerializer(events, many=True).data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error getting cart: {e}", exc_info=True)
            return Response({'error': 'Failed to get cart'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Добавить в корзину"""
        try:
            serializer = AddCartItemSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            event_id = serializer.validated_data['eventId']
            logger.info(f"User {request.user.id} adding event {event_id} to cart")
            item_id = cart_service.add_to_cart(request.user.id, event_id)
            return Response({'success': True, 'itemId': item_id}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error adding to cart: {e}", exc_info=True)
            return Response({'error': 'Failed to add to cart'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, id):
        try:
            logger.info(f"User {request.user.id} removing cart item {id}")
            success = cart_service.remove_from_cart(request.user.id, id)
            if not success:
                return Response({'success': False, 'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error removing from cart: {e}", exc_info=True)
            return Response({'error': 'Failed to remove item'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)