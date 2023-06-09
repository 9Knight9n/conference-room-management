from django.urls import path
from .api.admin import UserView
from .api.public import MeetingView
from .api.manager import RoomView


urlpatterns = [
    path('admin/user/', UserView.as_view(), name="admin's user management APIs"),
    path('public/meeting/', MeetingView.as_view(), name="basic user's APIs"),
    path('manager/room/', RoomView.as_view(), name="room management APIs"),

]
