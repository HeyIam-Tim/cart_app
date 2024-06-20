from django.conf import settings
from django.contrib import messages
from django.contrib.auth.models import User
from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from cart.services.facades import FacadeReceipts

from core.service.helper_services import check_working_day, \
    get_price_for_catalog

from cart.services.utilities.utilities import check_data_from_paykeeper
from cart.services.facades import FacadeCartItem, FacadeRecipientData, \
    FacadeOrder, FacadeCart, FacadeDelivery, YandexDelivery
from cart.services.utilities.utilities import crypt_md5

LOGGER = settings.LOGGER


class DataForCartItem(APIView):
    """
        Cобирает данные для позиции корзины | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_item_data = request.data
        cart_item_data.update({'user': request.user})

        facade_cart_item = FacadeCartItem()
        cart_quantities = facade_cart_item.handle_cart_item(
            cart_item_data=cart_item_data)

        return Response({
            'ok': True,
            'cart_quantities': cart_quantities,
        })


class DataForRecipientData(APIView):
    """
        Cобирает данные для получателя заказа | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_recipient_data = request.data
        cart_recipient_data.update({'user': request.user})

        facade_recipient_data = FacadeRecipientData()
        recipient_data = facade_recipient_data.handle_recipient_data(
            cart_recipient_data=cart_recipient_data, method='post')

        message = recipient_data.get('message')
        messages.success(self.request, message)

        return Response(recipient_data)


class DataForCartItemComment(APIView):
    """
        Комментарий к позиции корзины | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def _handle_cart_item_comment(self, method: str) -> None:
        """Работает с комментарием для позиции корзины."""

        cart_item_data = self.request.data

        facade_cart_item = FacadeCartItem()
        cart_item_comment_info = facade_cart_item.handle_cart_item_comment(
            cart_item_data=cart_item_data,
            method=method,
        )

        message = cart_item_comment_info.get('message')
        messages.success(self.request, message)

        return

    def post(self, request):
        self._handle_cart_item_comment(method='post')

        return Response({'ok': True})

    def delete(self, request):
        self._handle_cart_item_comment(method='delete')

        return Response({'ok': True})


class DataForUpdateCartItemQuantity(APIView):
    """
        Количеcтво для позиции корзины | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def _handle_cart_item_quantity(self, method: str) -> None:
        """Работает с количеством для позиции корзины."""

        cart_item_data = self.request.data

        facade_cart_item = FacadeCartItem()
        cart_item_quantity_info = facade_cart_item.handle_cart_item_quantity(
            cart_item_data=cart_item_data,
            method=method,
        )

        message = cart_item_quantity_info.get('message')
        messages.success(self.request, message)

        return

    def post(self, request):
        self._handle_cart_item_quantity(method='post')

        return Response({'ok': True})

    def delete(self, request):
        self._handle_cart_item_quantity(method='delete')

        return Response({'ok': True})


class DataForUpdateCartItemIsSelected(APIView):
    """
        Is_selected для позиции корзины | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def _handle_cart_item_is_selected(self, method: str) -> None:
        """Работает с is_selected для позиции корзины."""

        cart_item_data = self.request.data
        cart_item_data.update({'user': self.request.user})

        facade_cart_item = FacadeCartItem()
        cart_info = facade_cart_item.handle_cart_item_is_selected(
            cart_item_data=cart_item_data,
            method=method,
        )
        return cart_info

    def post(self, request):
        cart_info = self._handle_cart_item_is_selected(method='post')

        return Response({'ok': True, 'cart_info': cart_info})

    def delete(self, request):
        cart_info = self._handle_cart_item_is_selected(method='delete')

        return Response({'ok': True, 'cart_info': cart_info})


class DeleteCartItems(APIView):
    """
        Удаляет для позиции корзины | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """
            Удаляет для позиции корзины | апи.
        """

        cart_item_data = self.request.data
        facade_cart_item = FacadeCartItem()
        delete_info = facade_cart_item.delete_cart_items(
            cart_item_data=cart_item_data)
        message = delete_info.get('message')
        messages.success(self.request, message)

        return Response({'ok': True})


class RecipientData(APIView):
    """
        Работает с СartRecipient | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        self._helper(method='post')
        return Response({'ok': True})

    def put(self, request):

        self._helper(method='put')
        return Response({'ok': True})

    def delete(self, request):

        self._helper(method='delete')
        return Response({'ok': True})

    def _helper(self, method: str, user: User = None, telegram: bool = None):
        """
            Работает с СartRecipient | апи.
        """

        cart_recipient_data = self.request.data
        if method == 'post':
            cart_recipient_data.update({
                    'user': user if user else self.request.user,
                    'telegram': telegram,
                },)

        facade_recipient_data = FacadeRecipientData()
        recipient_data = facade_recipient_data.handle_recipient_data(
            method=method,
            cart_recipient_data=cart_recipient_data,
        )

        message = recipient_data.get('message')
        messages.success(self.request, message)

        return


class CreateOrder(APIView):
    """
        Оформляет заказ | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    message = 'Заказ успешно принят в обработку'

    def post(self, request):
        order_data = self.request.data
        order_data.update({'user': request.user})

        facade_order = FacadeOrder()
        order_data_back = facade_order.handle_order(
            order_data=order_data,
        )

        messages.success(self.request, self.message)

        return Response({'ok': True, 'data': order_data_back})


class CostInfo(APIView):
    """
        Получает информацию о стоимости | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cost_info_data = self.request.data
        cost_info_data.update({'user': request.user})

        facade_cart = FacadeCart()

        cost_info = facade_cart.get_cost_info(
            cost_info_data=cost_info_data,
            )

        return Response({'ok': True, 'cost_info': cost_info})


class DeleteOrder(APIView):
    """
        Отменяет заказ | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    message = 'Заказ успешно отменен.'

    def delete(self, request):
        order_data = self.request.data

        facade_order = FacadeOrder()
        order_id = facade_order.cancell_order(
            order_data=order_data,
            )
        messages.success(self.request, f'{self.message} № Заказа: {order_id}')

        return Response({'ok': True, 'message': self.message})


class CancellDelivery(APIView):
    """
        Отменяет доставку | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    message = 'Доставка отменена.'

    def put(self, request):
        delivery_data = self.request.data

        facade_delivery = FacadeDelivery()
        delivery_id = facade_delivery.cancell_delivery(
            delivery_data=delivery_data,
            )
        messages.success(
            self.request,
            f'{self.message} № Доставки: {delivery_id}')

        return Response({'ok': True, 'message': self.message})


class CheckDeliveryStatus(APIView):
    """
        Проверяет статусы доставок | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data_delivery = self.request.data

        facade_delivery = FacadeDelivery(delivery_engine=YandexDelivery())
        status_delivery_list_schema = facade_delivery.check_status(
            data_delivery=data_delivery)

        if status_delivery_list_schema:
            return Response(
                {'ok': True,
                 'data': status_delivery_list_schema.model_dump(),
                 })
        return Response({'ok': True, 'data': {}})


class GetDeliveryEnd(APIView):
    """
        Проверяет время окончания доставки | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data_delivery = self.request.data

        delivery_id = data_delivery.get('delivery_id')

        facade_delivery = FacadeDelivery(delivery_engine=YandexDelivery())

        delivery_end = facade_delivery.check_delivery_end(
            delivery_id=delivery_id)

        return Response({'ok': True, 'data': delivery_end})


class ReCalculateCartItem(APIView):
    """
        Заново проценивает данные для позиции | апи.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_item_data = self.request.data

        cart_item_data.update({'user': request.user})
        facade_cart_item = FacadeCartItem()
        facade_cart_item.recalculate_cart_item(
            cart_item_data=cart_item_data)
        return Response({'ok': True})


class HandlePayments(APIView):
    """
        Работает с оплатой.
    """

    def post(self, request):
        data_payments = self.request.data

        LOGGER.info(f'data_payments: {data_payments}')

        return Response({'ok': True})


class GetCartItemsCount(APIView):
    """
        Количество позиций в корзине.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items_count = request.user.cart.get_cart_items_count
        if cart_items_count:
            return Response({'ok': True, 'cart_items_count': cart_items_count})
        return Response({'ok': False})


class CheckWorkingHours(APIView):
    """
        Проверяет рабочие часы.
    """

    def get(self, request):
        city_id = self.request.GET.get('city_id')
        is_working_day = check_working_day(city_id=city_id)
        return Response({'is_working_day': is_working_day})


class CheckWaitStates(APIView):
    """
        Проверяет WAIT состояния.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        facade_cart = FacadeCart()
        wait_states = facade_cart.check_wait_states(user=request.user)
        return Response({'wait_states': wait_states})


class SetCartItemsFromCookie(APIView):
    """
        Заполняет позиции корзины из куки.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items_data = self.request.data

        cart_items_data.update({'user': request.user})
        facade_cart_item = FacadeCartItem()
        facade_cart_item.set_cart_items_from_cookie(
            cart_items_data=cart_items_data)

        return Response({'ok': True})


class PaymentNotification(APIView):
    """Оповещение об оплате"""

    status = 'ОПЛАЧЕН'
    message_success = 'Оплата прошла успешно'
    message_fail = 'Что-то пошло нитак. Неуспешная оплата'

    def post(self, request):
        data_payments = self.request.data
        payment_id = data_payments.get('id')

        is_valid_data = check_data_from_paykeeper(
            data_payments=data_payments)
        if is_valid_data.get('status'):

            data_to_encrypt = f'{payment_id}{settings.SECRET_SEED}'

            payment_id_and_secret_seed_crypted = crypt_md5(
                data=data_to_encrypt)

            success_response = f'OK {payment_id_and_secret_seed_crypted}'

            messages.success(self.request, self.message_success)
            return HttpResponse(success_response)

        messages.error(self.request, self.message_fail)
        return HttpResponse(False)


class CheckDeliveryReturningTimeExpired(APIView):
    """
        Проверяет срок для возврата.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items_data = self.request.data

        cart_items_data.update({'user': request.user})
        facade_cart_item = FacadeCartItem()
        facade_cart_item.set_cart_items_from_cookie(
            cart_items_data=cart_items_data)

        return Response({'ok': True})


class CatalogPrice(APIView):
    """
        Цены для каталога.
    """

    def post(self, request):
        catalog_data = self.request.data

        price_catalog_list = get_price_for_catalog(catalog_data=catalog_data)
        return Response({'ok': True, 'data': price_catalog_list})
        data_delivery = self.request.data

        facade_delivery = FacadeDelivery()

        data_back = facade_delivery.check_delivery_returning_time_expired(
            data_delivery=data_delivery)

        return Response({'ok': True, 'data': data_back})


class ReturnDelivery(APIView):
    """
        Возврат доставки.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    message = 'Данные для возврата успеншо получены'

    def post(self, request):
        delivery_data = self.request.data

        facade_delivery = FacadeDelivery()

        facade_delivery.return_delivery(
            delivery_data=delivery_data)

        messages.success(self.request, self.message)

        return Response({'ok': True})


class GetReceipts(APIView):
    """Чеки об оплате"""

    def get(self, request):
        """Получает чеки об оплате"""

        order_data = self.request.GET
        order_id = order_data.get('order_id')

        facade_receipts = FacadeReceipts()

        receipts = facade_receipts.get_receipts_by_order_id(
            order_id=order_id)

        return Response({'receipts': receipts})
