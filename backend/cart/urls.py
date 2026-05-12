from django.urls import path
from .views import CartView, CartDeleteView

urlpatterns = [
    path('cart', CartView.as_view(), name='cart'),
    path('cart/<int:id>', CartDeleteView.as_view(), name='cart-delete'),
]