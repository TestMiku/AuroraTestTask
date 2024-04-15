from django.urls import path
from .views import DocumentListCreateAPIView, DocumentDetailUpdateDeleteAPIView

urlpatterns = [
    path('', DocumentListCreateAPIView.as_view(), name='document_list_create'),
    path('<int:pk>/', DocumentDetailUpdateDeleteAPIView.as_view(), name='document_detail'),
    path('<int:pk>/view/', DocumentDetailUpdateDeleteAPIView.as_view(), name='document_view'),
]
