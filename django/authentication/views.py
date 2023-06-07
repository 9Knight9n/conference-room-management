from django.contrib.auth import login
from rest_framework import generics, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from .serializers import AuthSerializer, UserSerializer
from .models import User


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer


class LoginView(KnoxLoginView):
    serializer_class = AuthSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        django_user = serializer.validated_data['user']
        login(request, django_user)
        response = super(LoginView, self).post(request, format=None)
        user = User.objects.get(user=django_user)
        response.data['username'] = django_user.username
        response.data['id'] = user.__dict__['id']
        has_access_to_crm_panel = user.has_access_to_crm_panel()
        response.data['has_access_to_crm_panel'] = has_access_to_crm_panel
        response.data['has_access_to_admin_panel'] = user.has_access_to_admin_panel()
        del response.data['expiry']
        return response
