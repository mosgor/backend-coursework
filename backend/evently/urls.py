from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin', admin.site.urls),
    path('api/schema', SpectacularAPIView.as_view(), name='schema'),
    path('swagger', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('', include('users.urls')),
    path('', include('events.urls')),
    path('', include('cart.urls')),
    path('', include('tickets.urls')),
    path('', include('payments.urls')),
]