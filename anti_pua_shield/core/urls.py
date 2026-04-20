from django.urls import path
from core.views import index, generate_content

urlpatterns = [
    path('', index, name='index'),
    path('api/generate/', generate_content, name='generate_content'),
]
