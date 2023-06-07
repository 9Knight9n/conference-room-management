from django.urls import path
from .api.admin import UserView


urlpatterns = [
    path('admin/user/', UserView.as_view(), name="admin's user management APIs"),

]
