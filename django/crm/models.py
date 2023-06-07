from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
import uuid
from authentication.models import User
from .config import MAX_NUMBER_OF_PARTICIPANT, MAX_MEETING_DURATION_IN_MINUTE, \
    EARLIEST_MEETING_START, LATEST_MEETING_END
from datetime import datetime


class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(null=False, blank=False, unique=True)
    capacity = models.PositiveIntegerField(
        null=False, blank=False,
        validators=[MaxValueValidator(MAX_NUMBER_OF_PARTICIPANT, f'Maximum room capacity is '
                                                                 f'{MAX_NUMBER_OF_PARTICIPANT}.')]
    )

    def __str__(self):
        return self.name


class Meeting(models.Model):
    STATUS_CHOICES = (
        ('P', 'pending acceptation'),
        ('A', 'Accepted'),
        ('R', 'Rejected'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(null=False, blank=False, max_length=255)
    number_of_participant = models.PositiveIntegerField(
        null=False, blank=False,
        validators=[MaxValueValidator(MAX_NUMBER_OF_PARTICIPANT, f'Maximum number of participants is '
                                                                 f'{MAX_NUMBER_OF_PARTICIPANT}.')]
    )
    status = models.CharField(choices=STATUS_CHOICES, max_length=1, default='P', null=False, blank=False)
    proposed_start_time = models.TimeField(
        null=False, blank=False,
        validators=[MinValueValidator(EARLIEST_MEETING_START, f'No meeting can start before '
                                                              f'{EARLIEST_MEETING_START}.')]
    )
    proposed_end_time = models.TimeField(
        null=False, blank=False,
        validators=[MaxValueValidator(LATEST_MEETING_END, f'No meeting can end after {LATEST_MEETING_END}.')]
    )
    duration = models.PositiveIntegerField(
        null=False, blank=False,
        validators=[MaxValueValidator(MAX_MEETING_DURATION_IN_MINUTE, f'Maximum meeting duration is '
                                                                      f'{MAX_MEETING_DURATION_IN_MINUTE} minutes.')]
    )
    start_time = models.TimeField(
        null=True, blank=True,
        validators=[MinValueValidator(EARLIEST_MEETING_START, f'No meeting can start before '
                                                              f'{EARLIEST_MEETING_START}.')]
    )
    end_time = models.TimeField(
        null=True, blank=True,
        validators=[MaxValueValidator(LATEST_MEETING_END, f'No meeting can end after {LATEST_MEETING_END}.')]
    )
    proposed_date = models.DateField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=False, blank=False)
    room = models.ForeignKey(Room, on_delete=models.DO_NOTHING, null=True, blank=True)

    def __str__(self):
        return f'{self.title} ({self.status})'

    def is_possible(self):
        if not self.proposed_date:
            return True
        for room in Room.objects.all():
            if room.capacity < self.number_of_participant:
                continue
            meetings = Meeting.objects.filter(status='A', date=self.proposed_date).order_by('start_time')
            for index in range(len(meetings) + 1):
                if index == 0:
                    start = self.proposed_start_time
                else:
                    start = meetings[index - 1].end_time

                if index == len(meetings):
                    end = self.proposed_end_time
                else:
                    end = meetings[index].start_time

                base = datetime.today()
                end = base.replace(hour=end.hour, minute=end.minute)
                start = base.replace(hour=start.hour, minute=start.minute)
                if int((end - start).total_seconds() / 60) >= self.duration:
                    return True
        return False
