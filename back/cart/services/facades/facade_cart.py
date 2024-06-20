from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.query import QuerySet

from cart.models import Cart

LOGGER = settings.LOGGER


class FacadeCart():
    """Фасад Корзина."""

    model = Cart
    error_message = "Неверный адрес"
    delivery_price_full = 0
    cost_info = {}
    cost_for_shops = []
    cost_for_web_shops = []

    CALCULATE_DELIVERY_FOR_SHOP = 'SHOP'
    CALCULATE_DELIVERY_FOR_WEB_SHOP = 'WEB_SHOP'

    def get_cart(self, user: User) -> Cart:
        """
            Получает корзину.
        """

        if Cart.objects.filter(user=user).first():
            return user.cart
        else:
            cart = self.model.objects.create(user=user)
            return cart

    def get_cart_items_count(self, user: User) -> Cart:
        """
            Получает корзину.
        """

        cart = self.get_cart(user=user)
        return cart.get_cart_items_count_all

    def get_cart_info(self, user: User) -> dict:
        """
            Получает информацию корзины.
        """

        cart = self.get_cart(user=user)
        cart_info = {
            'selected_cart_items_number': cart.get_selected_cart_items_number,
            'selected_cart_items_count': cart.get_selected_cart_items_count,
            'total_cost_for_selected': cart.get_total_cost_for_selected,
        }
        return cart_info

    def get_cost_info_for_shop(self, user: User, shop_name: str) -> dict:
        """Получает информацию заказа"""

        cost_info_for_shop = {}

        cart = self.get_cart(user=user)

        total_cost_for_shop = 0
        cart_items = cart.cart_items.filter(
            is_selected=True,
            shop__name=str(shop_name),
            )
        for cart_item in cart_items:
            total_cost_for_shop += cart_item.get_cost
        cost_info_for_shop['total_cost_for_shop'] = round(
            total_cost_for_shop, 2)

        cost_info_for_shop['cart_items_count'] = cart_items.count()
        cost_info_for_shop['cart_items_number'] = sum(
            int(item.cart_item_quantity) for item in cart_items)

        return cost_info_for_shop

    def sort_cart_items(self, cart_items: QuerySet, type: str) -> dict:
        """Сортирует позиции корзины по магазинам."""

        from cart.services.facades import FacadeCartItem

        facade_cart_item = FacadeCartItem()

        cart_items = sorted(cart_items, key=facade_cart_item.cart_item_sorter)

        if not cart_items:
            return []

        cart_items_dict = {}
        cart_items_list = []

        for cart_item in cart_items:
            if not cart_item.shop:
                continue

            if not cart_item.max_quantity > 0:
                continue

            if cart_items_dict.get(cart_item.shop.name):
                cart_items_dict[cart_item.shop.name].append(
                    cart_item)
            else:
                cart_items_list.append(cart_item)
                cart_items_dict[
                    cart_item.shop.name] = cart_items_list
            cart_items_list = []

        if type == 'create_offer':
            web_shop_object = self.sort_cart_items_by_web_shop(
                cart_items_dict=cart_items_dict,
            )
            return web_shop_object

        return cart_items_dict

    def sort_cart_items_by_web_shop(self, cart_items_dict: dict) -> dict:
        """Сортирует позиции корзины по интернет магазинам."""

        if not cart_items_dict:
            return []

        web_shop_object = {}
        shops_with_cart_items = []

        for item in cart_items_dict.items():
            _, cart_items = item

            if web_shop_object.get(cart_items[0].shop.web_shop.site):
                web_shop_object[cart_items[0].shop.web_shop.site].append(item)
            else:
                shops_with_cart_items.append(item)
                web_shop_object[cart_items[0].shop.web_shop.site] = shops_with_cart_items

            shops_with_cart_items = []

        return web_shop_object

    def get_cost_info(self, cost_info_data: dict) -> list:
        """Получает информацию о стоимости."""

        user = cost_info_data.get('user')

        data_delivery = {}

        self.cost_info['total_cost_for_shop_all_valid'] = 0
        self.cost_info['cart_items_count_all_valid'] = 0
        self.cost_info['cart_items_number_all_valid'] = 0

        self.cost_for_shops = []
        self.cost_info['cost_for_shops'] = []

        cart = self.get_cart(user=user)
        favorite_address = cart.favorite_address
        if not favorite_address:
            return {}

        data_delivery['recipient_address'] = favorite_address.address_delivery

        if settings.CALCULATE_DELIVERY_FOR == self.CALCULATE_DELIVERY_FOR_SHOP:
            self._calculate_delivery_for_shops(
                cost_info_data=cost_info_data,
                data_delivery=data_delivery,
                user=user,
            )

        if settings.CALCULATE_DELIVERY_FOR == self.CALCULATE_DELIVERY_FOR_WEB_SHOP:
            self._calculate_delivery_for_web_shops(
                cost_info_data=cost_info_data,
                data_delivery=data_delivery,
                user=user,
            )

        cost_info = self._set_cost_info()

        return cost_info

    def _set_cost_info(self) -> dict:
        """Устанавливает полную стоимость для заказа."""

        self.cost_info['delivery_price_all_valid'] = round(
            self.delivery_price_full, 2)

        total_cost_for_shop_all_valid = self.cost_info.get(
            'total_cost_for_shop_all_valid')
        delivery_price_all_valid = self.cost_info.get(
            'delivery_price_all_valid')
        self.cost_info['total_order_cost'] = round(
            total_cost_for_shop_all_valid + delivery_price_all_valid, 2)

        self.cost_info['cost_for_shops'] = self.cost_for_shops

        self.cost_info['total_cost_for_shop_all_valid'] = round(
            self.cost_info['total_cost_for_shop_all_valid'], 2)

        self.cost_info['cost_for_web_shops'] = self.cost_for_web_shops

        return self.cost_info

    def _calculate_delivery_for_shops(
            self,
            cost_info_data: dict,
            data_delivery: dict,
            user: User,
            ) -> None:
        """Подсчитывает доставку для магазинов."""

        from core.service.facades import FacadeShop, FacadeDelivery
        from cart.services.facades import YandexDelivery

        yandex_delivery = YandexDelivery()
        facade_delivery = FacadeDelivery()

        hashed_shop_names = cost_info_data.get('shop_names')
        if not hashed_shop_names:
            return None

        self.cost_info['cost_for_shops'] = []
        for hashed_shop_name in hashed_shop_names:

            shop_name = hashed_shop_name.get('shop_name')
            index = hashed_shop_name.get('index')

            shop = FacadeShop.get_shop_by_name(shop_name=shop_name)
            if not shop:
                continue

            data_delivery['shop_address'] = shop.address

            calculated_delivery = facade_delivery.calculate_yandex_delivery(
                data_delivery=data_delivery,
            )
            if calculated_delivery == self.error_message:
                delivery_price = settings.DELIVERY_PRICE_DEFAULT
                delivery_time_arrival = ''
            else:
                delivery_price, delivery_time_arrival = calculated_delivery

            delivery_types = yandex_delivery.get_delivery_types(
                data_delivery=data_delivery,
            )

            self._set_costs_for_order(
                delivery_price=delivery_price,
                delivery_types=delivery_types,
                user=user,
                shop_name=shop_name,
                shop_index=index,
            )

        return None

    def _calculate_delivery_for_web_shops(
            self,
            cost_info_data: dict,
            data_delivery: dict,
            user: User,
            ) -> None:
        """Подсчитывает доставку для магазинов."""

        from core.service.facades import FacadeWebShop
        from cart.services.facades import YandexDelivery

        yandex_delivery = YandexDelivery()
        facade_web_shop = FacadeWebShop()

        self.cost_for_web_shops = []

        for web_shop_hashed in cost_info_data.get('web_shop_names'):

            site = web_shop_hashed.get('web_shop_name')
            index = web_shop_hashed.get('index')
            web_shop = facade_web_shop.get_web_shop_by_site(
                site=site,
            )
            if not web_shop:
                continue

            data_delivery['shop_address'] = web_shop.address

            delivery_types = yandex_delivery.get_delivery_types(
                data_delivery=data_delivery,
            )

            self._set_costs_for_web_shop(
                web_shop_index=index,
                delivery_types=delivery_types,
                web_shop_site=web_shop.site,
            )

        hashed_shop_names = cost_info_data.get('shop_names')
        if not hashed_shop_names:
            return None

        self.cost_info['cost_for_shops'] = []
        for hashed_shop_name in hashed_shop_names:

            shop_name = hashed_shop_name.get('shop_name')
            index = hashed_shop_name.get('index')

            self._set_costs_for_order(
                user=user,
                shop_name=shop_name,
                shop_index=index,
            )
        return None

    def _set_costs_for_web_shop(
            self,
            web_shop_site: str,
            web_shop_index: int = 0,
            delivery_types: list = [],
            ) -> None:
        """Подсчитывает стоимость для интернет магазина"""

        web_shop_price_data = {
            'web_shop_site': web_shop_site,
            'web_shop_index': web_shop_index,
            'delivery_types': delivery_types,
        }

        self.cost_for_web_shops.append(web_shop_price_data)

        return None

    def _set_costs_for_order(
            self,
            user: User,
            shop_name: str,
            delivery_price: float = 0.0,
            delivery_types: list = [],
            shop_index: int = 0,
            ) -> None:
        """Подсчитывает стоимость для заказа."""

        self.delivery_price_full += float(delivery_price)

        info_for_shop = self.get_cost_info_for_shop(
            user=user,
            shop_name=shop_name,
        )

        total_cost_for_shop = info_for_shop.get('total_cost_for_shop')

        self.cost_info['total_cost_for_shop_all_valid'] += total_cost_for_shop

        self.cost_info['cart_items_count_all_valid'] += info_for_shop.get(
            'cart_items_count')
        self.cost_info['cart_items_number_all_valid'] += info_for_shop.get(
            'cart_items_number')

        shop_price_data = {
            'shop_prices': f"{shop_index}---{delivery_price}---{total_cost_for_shop}---{shop_name}",
            'delivery_types': delivery_types,
        }
        self.cost_for_shops.append(shop_price_data)

        return None

    def filter_cart_items_for_cart(
            self,
            cart: Cart,
            filter_data: dict,
            ) -> QuerySet:
        """
            Фильтрует позиции корзины.
        """

        try:
            cart_items = cart.cart_items.filter(**filter_data)
        except Exception as ex:
            LOGGER.warning(f'{ex}')
            return QuerySet
        else:
            return cart_items

    def check_wait_states(
            self,
            user: User,
            ) -> QuerySet:
        """
            Проверяет WAIT состояния у корзины.
        """

        cart = self.get_cart(user=user)
        return cart.check_wait_states()
