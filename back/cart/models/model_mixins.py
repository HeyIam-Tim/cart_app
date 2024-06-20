from django.conf import settings
from django.db import models
from django.shortcuts import reverse

LOGGER = settings.LOGGER


class CreatedMixin(models.Model):
    """ Добавляет поле created"""

    created = models.DateTimeField(verbose_name='Добавлен', auto_now_add=True,
                                   null=True, blank=True)

    def get_absolute_url(self):
        return reverse(
            'model-detail-view',
            kwargs={'pk': self.pk, 'model_name': f'{self._meta.object_name}'})

    class Meta:
        abstract = True


class UpdatedMixin(models.Model):
    """ Добавляет поле updated"""

    updated = models.DateTimeField(verbose_name='Изменен', auto_now=True,
                                   null=True, blank=True)

    def get_absolute_url(self):
        return reverse(
            'model-detail-view',
            kwargs={'pk': self.pk, 'model_name': f'{self._meta.object_name}'})

    class Meta:
        abstract = True
