from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Document
from .serializers import DocumentSerializer

class DocumentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


from django.http import FileResponse
from django.shortcuts import get_object_or_404

class DocumentDetailUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Логика для просмотра документа
        # Например, вы можете вернуть содержимое файла или другую информацию о документе
        # В этом примере я предполагаю, что в модели Document есть поле file, содержащее путь к файлу
        file_path = instance.file.path
        return FileResponse(open(file_path, 'rb'))

    def download(self, request, *args, **kwargs):
        instance = self.get_object()
        # Логика для скачивания документа
        # В этом примере я также предполагаю, что в модели Document есть поле file, содержащее путь к файлу
        file_path = instance.file.path
        response = FileResponse(open(file_path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{instance.file.name}"'
        return response

