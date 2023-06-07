from rest_framework.permissions import BasePermission
from .models import User


class HasAccessToAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(User.objects.get(user=request.user).has_access_to_admin_panel())


class HasAccessToCRM(BasePermission):
    def has_permission(self, request, view):
        return bool(User.objects.get(user=request.user).has_access_to_crm_panel())


class HasAccessToReserve(BasePermission):
    def has_permission(self, request, view):
        return not bool(User.objects.get(user=request.user).has_access_to_crm_panel())
