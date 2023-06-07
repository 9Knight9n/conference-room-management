from django.urls import path
from .api.admin import UserView
from .api.public import MeetingView


urlpatterns = [
    path('admin/user/', UserView.as_view(), name="admin's user management APIs"),
    path('public/meeting/', MeetingView.as_view(), name="basic user's APIs"),

]
