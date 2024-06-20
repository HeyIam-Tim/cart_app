from django.conf import settings

from core.service.facades import FacadeDelivery
from cart.models import RecipientData
from .facade_cart_item import FacadeCart

LOGGER = settings.LOGGER


class FacadeRecipientData():
    """Фасад Данные получателя."""

    model = RecipientData
    facade_cart = FacadeCart()
    success_message = 'Адрес доставки успешно добавлен.'
    is_favorite_message = 'Адрес доставки успешно установлен.'
    delete_message = 'Адрес доставки успешно удален.'
    error_message = 'Такой адрес доставки уже есть.'
    post_method = 'post'
    put_method = 'put'
    delete_method = 'delete'
    test_address = 'г Оренбург, ул Ульянова, д 11'
    error_address = 'Неверный адрес'

    def handle_recipient_data(
            self,
            method: str,
            cart_recipient_data: dict,
            ) -> None:
        """
            Работает с данными получателя.
        """

        if method == self.put_method:
            recipient_data = self._set_favorite_recipient_data(
                cart_recipient_data=cart_recipient_data)
        elif method == self.delete_method:
            recipient_data = self._delete_recipient_data(
                cart_recipient_data=cart_recipient_data)
        elif method == self.post_method:
            recipient_data = self._get_or_create_recipient_data(
                cart_recipient_data=cart_recipient_data)
        return recipient_data

    def _get_or_create_recipient_data(
            self,
            cart_recipient_data: dict,
            ) -> dict:
        """
            Получает или добавляет данные для получателя в бд.
        """

        from core.service.facades import FacadeTelegramBotBuyer
        facade_telegram_bot_buyer = FacadeTelegramBotBuyer()

        cart = self.facade_cart.get_cart(user=cart_recipient_data.get('user'))
        recipient_data = cart_recipient_data.get('cart_recipient_data')
        user = cart_recipient_data.get('user')

        recipient_data_object = {}
        address_delivery = recipient_data.get(
            'address_delivery')

        recipient_data_object['recipient_name'] = recipient_data.get(
            'recipient_name')
        flag_telegram = recipient_data.get('phone')
        if flag_telegram == 'telegramtelegram':
            phone = user.userphonefield.phone
        else:
            phone = recipient_data.get('phone')
        recipient_data_object['phone'] = phone
        recipient_data_object['porch'] = recipient_data.get('porch')
        recipient_data_object['floor'] = recipient_data.get('floor')
        recipient_data_object['appartment'] = recipient_data.get('appartment')
        recipient_data_object['door_code'] = recipient_data.get('door_code')

        recipient_data_object['longitude'] = recipient_data.get('longitude')
        recipient_data_object['latitude'] = recipient_data.get('latitude')

        recipient_data_object['email'] = recipient_data.get('email')

        recipient_data_object['is_favorite'] = True

        favorite_cart_recipient_old = self.model.objects.filter(
            is_favorite=True).first()
        self._set_is_favorite_to_false(
            favorite_cart_recipient_old=favorite_cart_recipient_old,
            )

        cart_recipient_id = recipient_data.get('cart_recipient_id')

        try:
            recipient_data, cr = self.model.objects.update_or_create(
                cart=cart,
                address_delivery=address_delivery,
                defaults=recipient_data_object,
                )
        except Exception as ex:
            LOGGER.warning(f'{ex}')
            return {'ok': False, 'message': self.error_message}
        else:
            if cr and cart_recipient_id:
                self.model.objects.filter(
                    id=int(cart_recipient_id)).first().delete()

            self._check_recipient_address(recipient_data=recipient_data)

            if flag_telegram == 'telegramtelegram':
                facade_telegram_bot_buyer.delivery_address_accepted(
                    user=user,
                    )

            return {
                'ok': True if cr else False,
                'message': self.success_message if cr else self.error_message,
            }

    def _set_favorite_recipient_data(
            self,
            cart_recipient_data: dict,
            ) -> dict:
        """
            Устанавливает выбранный адрес.
        """

        favorite_cart_recipient_old = self.model.objects.filter(
            is_favorite=True).first()
        if favorite_cart_recipient_old:
            self._set_is_favorite_to_false(
                favorite_cart_recipient_old=favorite_cart_recipient_old,
                )

        recipient_data = cart_recipient_data.get('cart_recipient_data')
        cart_recipient_id = recipient_data.get('cart_recipient_id')
        favorite_cart_recipient = self.model.objects.filter(
            id=int(cart_recipient_id)).first()
        if favorite_cart_recipient:
            favorite_cart_recipient.is_favorite = True
            favorite_cart_recipient.save()

        self._check_recipient_address(recipient_data=favorite_cart_recipient)

        return {'message': self.is_favorite_message}

    def _delete_recipient_data(
            self,
            cart_recipient_data: dict,
            ) -> dict:
        """
            Удаляте данные для получателя.
        """

        recipient_data = cart_recipient_data.get('cart_recipient_data')
        cart_recipient_id = recipient_data.get('cart_recipient_id')
        cart_recipient = self.model.objects.filter(
            id=int(cart_recipient_id)).first()
        if cart_recipient:
            cart_recipient.delete()

        return {'message': self.delete_message}

    def _set_is_favorite_to_false(
            self,
            favorite_cart_recipient_old: RecipientData,
            ) -> None:
        """
            Устанавливает is_favorite to False.
        """

        if favorite_cart_recipient_old:
            favorite_cart_recipient_old.is_favorite = False
            favorite_cart_recipient_old.save()

        return

    def _check_recipient_address(self, recipient_data: RecipientData) -> None:
        """Проверяет адрес получателя."""

        data_delivery = {}
        data_delivery['recipient_address'] = recipient_data.address_delivery
        data_delivery['shop_address'] = self.test_address

        facade_delivery = FacadeDelivery()
        yandex_delivery = facade_delivery.calculate_yandex_delivery(
            data_delivery=data_delivery,
            )

        if yandex_delivery == self.error_address:
            recipient_data.is_valid_address = False
        else:
            recipient_data.is_valid_address = True
        recipient_data.save()

        return
