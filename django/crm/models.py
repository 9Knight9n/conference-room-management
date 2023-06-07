from django.core.validators import MaxValueValidator
from django.db import models
import uuid
from authentication.models import User


class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(editable=False, null=False, blank=False, unique=True)
    capacity = models.IntegerField(editable=False, null=False, blank=False)

    def __str__(self):
        return self.name


class Meeting(models.Model):
    STATUS_CHOICES = (
        ('P', 'pending acceptation'),
        ('A', 'Accepted'),
        ('R', 'Rejected'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(editable=False, null=False, blank=False, max_length=255)
    number_of_participant = models.PositiveIntegerField(editable=False, null=False, blank=False)
    status = models.CharField(choices=STATUS_CHOICES, max_length=1, default='P', null=False, blank=False)
    proposed_start_time = models.TimeField(editable=False, null=False, blank=False)
    proposed_end_time = models.TimeField(editable=False, null=False, blank=False)
    duration = models.PositiveIntegerField(editable=False, null=False, blank=False, validators=[MaxValueValidator(300)])
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    proposed_date = models.DateField(editable=False, null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, editable=False, null=False, blank=False)
    room = models.ForeignKey(Room, on_delete=models.DO_NOTHING, null=True, blank=True)

    def __str__(self):
        return f'{self.title} ({self.status})'
    
