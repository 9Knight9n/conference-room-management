from django.db import models
import uuid
from django.contrib.auth.models import User as DjangoUser


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.OneToOneField(DjangoUser, on_delete=models.DO_NOTHING, null=False, blank=False)
    is_manager = models.BooleanField(default=False, null=False, blank=False)

    def __str__(self):
        return self.user.username

    def has_access_to_crm_panel(self):
        return self.user.is_superuser or self.is_manager

    def has_access_to_admin_panel(self):
        return self.user.is_superuser
