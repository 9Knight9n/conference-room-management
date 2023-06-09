from rest_framework.permissions import BasePermission
from .models import User


class HasAccessToAdmin(BasePermission):
    def has_permission(self, request, view):
        return User.objects.get(user=request.user).has_access_to_admin_panel()


class HasAccessToManager(BasePermission):
    def has_permission(self, request, view):
        return User.objects.get(user=request.user).has_access_to_crm_panel()

