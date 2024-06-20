from django.conf import settings
from django.http import HttpResponseRedirect
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login

from core.service.facades import FacadeUser, FacadePassport
from core.service.helper_services import paginator

from cart.services.facades import FacadeCart, FacadeOrder, FacadeDelivery

LOGGER = settings.LOGGER


class CartView(TemplateView):
    """Корзина."""

    template_name = 'cart/cart.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        if self.request.user.is_anonymous:
            user_id = self.request.GET.get('user_id')
            if user_id:
                user = FacadeUser.get_user_by_id(user_id=user_id)
                login(self.request, user,
                      backend='django.contrib.auth.backends.ModelBackend')
            else:
                return context

        facade_cart = FacadeCart()
        cart = facade_cart.get_cart(user=self.request.user)

        context['cart'] = cart
        return context


class CreateOrdersView(LoginRequiredMixin, TemplateView):
    """
        Оформление заказа.
    """

    template_name = 'cart/create_order.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        facade_cart = FacadeCart()
        cart = facade_cart.get_cart(user=self.request.user)
        context['cart'] = cart

        context['service_fee'] = settings.SERVICE_FEE

        facade_passport = FacadePassport()
        is_passport = facade_passport.check_passport(
            passport_data={'user': self.request.user},
        )
        context['is_passport'] = is_passport

        return context


class Orders(LoginRequiredMixin, TemplateView):
    """
        Заказы.
    """

    template_name = 'cart/orders.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_anonymous:
            user_id = self.request.GET.get('user_id')
            if user_id:
                user = FacadeUser.get_user_by_id(user_id=user_id)
                login(self.request, user,
                      backend='django.contrib.auth.backends.ModelBackend')
            else:
                return context

        page_num = self.request.GET.get('page', 1)

        facade_order = FacadeOrder()
        orders = facade_order.get_orders(user=self.request.user)
        orders = facade_order.check_payment_periods_expired(orders=orders)

        page, page_range = paginator(
            objects=orders, page_num=page_num)
        context['page_range'] = page_range
        context['orders'] = page
        context['YANDEX_GEO_TOKEN'] = settings.YANDEX_GEO_TOKEN

        return context


class Order(LoginRequiredMixin, TemplateView):
    """
        Заказ.
    """

    template_name = 'cart/order.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pk = kwargs.get("pk")

        facade_order = FacadeOrder()
        order = facade_order.get_order(id=pk)
        context['order'] = order
        context['YANDEX_GEO_TOKEN'] = settings.YANDEX_GEO_TOKEN
        return context


class Delivery(LoginRequiredMixin, TemplateView):
    """
        Доставка.
    """

    template_name = 'cart/delivery.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pk = kwargs.get("pk")

        facade_delivery = FacadeDelivery()
        delivery = facade_delivery.get_delivery(id=pk)
        context['delivery'] = delivery
        context['YANDEX_GEO_TOKEN'] = settings.YANDEX_GEO_TOKEN
        return context


class ConfirmPayment(LoginRequiredMixin, TemplateView):
    """
        Подтверждение оплаты.
    """

    template_name = 'cart/confirm_payment.html'

    def get(self, request, *args, **kwargs):
        user = self.request.user
        order_id = self.request.GET.get("order_id")

        facade_order = FacadeOrder()
        order = facade_order.get_order(id=order_id, user=user)
        if not order:
            return HttpResponseRedirect('/')

        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        order_id = self.request.GET.get("order_id")

        facade_order = FacadeOrder()
        order = facade_order.get_order(id=order_id)
        if order:
            cart_check = facade_order.get_info_for_cart_receipt(
                order=order
            )
            context['order_id'] = order_id
            context['order'] = order
            context['cart_check'] = cart_check

            recipient_name = self.request.user.cart.favorite_address.recipient_name
            LOGGER.info(
                f"""
ПОДТВЕРЖДЕНИЕ оплаты:
    Order ID: {order_id};
    Получатель: {recipient_name};
    Полная сумма заказа: {order.get_full_order_cost} Р;

""")

        context['action'] = settings.ACTION_HTML_FOR_PAYMENT

        return context
