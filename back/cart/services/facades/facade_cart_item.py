from typing import Union

from django.conf import settings
from django.db.models.query import QuerySet

from cart.models import CartItem, Cart
from cart.services.tasks import task_recalculate_cart_item
from core.models import Product, Shop
from .facade_cart import FacadeCart

LOGGER = settings.LOGGER


class FacadeCartItem():
    """Фасад Позиция корзины."""

    model = CartItem
    cart = FacadeCart()
    comment_message_success = 'Комментарий успешно обновлен.'
    comment_message_delete = 'Комментарий успешно удален.'
    quantity_message_success = 'Количество успешно обновилось.'
    quantity_message_delete = 'Товар успешно удален.'
    message_delete = 'Товары успешно удалены.'
    CHECKBOX_STATE = 2
    WAIT_STATE = 1
    RECALCULATE_TIMEOUT = 43200

    def handle_cart_item(self, cart_item_data: dict) -> dict:
        """
            Работает с позицией корзины.
        """

        cart_item = self._get_cart_item(cart_item_data=cart_item_data)
        if cart_item:
            cart_item = self._update_cart_item(
                cart_item_data=cart_item_data,
                cart_item=cart_item)
        else:
            cart_item = self._create_cart_item(cart_item_data=cart_item_data)

        self._add_cart_item_to_cart(
            cart_item=cart_item,
            cart_item_data=cart_item_data,
        )

        self._handle_cart_item_quantity(
            cart_item_data=cart_item_data,
            cart_item=cart_item)

        cart_quantities = self._count_cart_quantities(
            cart_item_data=cart_item_data, cart_item=cart_item)

        return cart_quantities

    def _get_cart_item(self, cart_item_data: dict) -> Union[CartItem, None]:
        """
            Получает позицию корзины.
        """

        cart_item_id = self._generate_cart_item_id_by_offer_data(
            cart_item_data=cart_item_data)

        cart_item = self.model.objects.filter(
            cart_item_id=str(cart_item_id)).first()
        if cart_item:
            return cart_item
        else:
            return

    def _create_cart_item(self, cart_item_data: dict) -> Union[CartItem, None]:
        """
            Создает позицию корзины.
        """

        cart_item_id = self._generate_cart_item_id_by_offer_data(
            cart_item_data=cart_item_data)
        cart_item_quantity = cart_item_data.get('cart_item_quantity')
        image_url = cart_item_data.get('image_url')

        shop = self._get_shop(cart_item_data=cart_item_data)

        product_name = cart_item_data.get(
            'warehouse_data').get('product_name')
        article = cart_item_data.get('warehouse_data').get('article')
        brand = cart_item_data.get('warehouse_data').get('brand')
        price = cart_item_data.get('warehouse_data').get('price')
        delivery_period = cart_item_data.get(
            'warehouse_data').get('delivery_period')
        max_quantity = cart_item_data.get(
            'warehouse_data').get('warehouse_quantity')

        _comment = cart_item_data.get('comment')
        _is_selected = cart_item_data.get('is_selected')
        comment = _comment if _comment else ''
        is_selected = True if _is_selected else False

        if all((cart_item_id, cart_item_quantity)):
            try:
                cart_item, _ = self.model.objects.update_or_create(
                    cart_item_id=cart_item_id,
                    defaults={
                        'shop': shop,
                        'product_name': product_name,
                        'article': article,
                        'brand': brand,
                        'price': price,
                        'cart_item_quantity': cart_item_quantity,
                        'delivery_period': delivery_period,
                        'image_url': image_url,
                        'max_quantity': float(max_quantity),
                        'comment': comment,
                        'is_selected': is_selected,
                    },
                )
            except Exception as ex:
                LOGGER.warning(f'{ex}')
                return
            return cart_item
        else:
            return

    def _update_cart_item(
            self,
            cart_item_data: dict,
            cart_item: CartItem,
    ) -> CartItem:
        """
            Обновляет позицию корзины.
        """

        cart_item_quantity = cart_item_data.get('cart_item_quantity')

        if cart_item_quantity == '':
            cart_item_quantity = 0.0
        cart_item.cart_item_quantity = float(cart_item_quantity)

        warehouse_data = cart_item_data.get('warehouse_data')
        if warehouse_data:
            max_quantity = warehouse_data.get('warehouse_quantity')
            price = warehouse_data.get('price')
            cart_item.max_quantity = float(max_quantity)
            cart_item.price = float(price)

        comment = cart_item_data.get('comment')
        is_selected = cart_item_data.get('is_selected')
        cart_item.comment = comment if comment else ''
        cart_item.is_selected = True if is_selected else False

        cart_item.state = self.CHECKBOX_STATE
        cart_item.save()
        return cart_item

    def _get_shop(self, cart_item_data: dict) -> Union[Shop, None]:
        """
            Получает магазин.
        """

        shop_name = cart_item_data.get('warehouse_data').get('shop_name')
        if shop_name:
            from core.service.facades import FacadeShop
            return FacadeShop.get_shop_by_name(shop_name=shop_name)
        else:
            return

    def _get_product(self, cart_item_data: dict) -> Union[Product, None]:
        """
            Получает товар.
        """

        product_name = cart_item_data.get(
            'warehouse_data').get('product_name')
        article = cart_item_data.get('warehouse_data').get('article')
        brand = cart_item_data.get('warehouse_data').get('brand')
        if all((product_name, article, brand)):
            from core.service.facades import FacadeProduct
            facade_product = FacadeProduct()

            return facade_product.create_product_by_strings(
                name=product_name,
                article=brand,
                brand=brand,
            )
        else:
            return

    def _generate_cart_item_id_by_offer_data(
            self,
            cart_item_data: dict,
    ) -> str:
        """
            Генерирует уникальный ключ по данным из предложения
            (product_name, article, brand, user, shop_name).
        """

        product_name = cart_item_data.get(
            'warehouse_data').get('product_name')
        article = cart_item_data.get('warehouse_data').get('article')
        brand = cart_item_data.get('warehouse_data').get('brand')
        shop_name = cart_item_data.get('warehouse_data').get('shop_name')
        user = cart_item_data.get('user')

        signer_str = f'{product_name}{article}{brand}{user}{shop_name}'

        if all((product_name, article, brand)):
            signer_str = f'{product_name}{article}{brand}{user}{shop_name}'
            cart_item_id = signer_str
            return cart_item_id

    def _count_cart_quantities(
            self,
            cart_item_data: dict,
            cart_item: CartItem = None,
    ) -> dict:
        """
            Подсчитывает количество для одной позиции корзины и всей корзины.
        """

        if cart_item:
            cart_item_quantity = cart_item.cart_item_quantity
        else:
            cart_item_quantity = 0

        user = cart_item_data.get('user')
        cart_items_count = self.cart.get_cart_items_count(user=user)

        if cart_item_quantity == 0:
            cart_item_quantity = ''

        quantites_data = {
            'cart_item_quantity': cart_item_quantity,
            'cart_items_count': cart_items_count}
        return quantites_data

    def _handle_cart_item_quantity(
            self,
            cart_item_data: dict,
            cart_item: CartItem = None,
    ) -> None:
        """
            Работает с количеством позиции корзины.
        """

        cart_item_quantity = cart_item_data.get('cart_item_quantity')
        if cart_item_quantity == '' and cart_item and cart_item.cart_item_quantity == 0.0:  # NOQA
            cart_item.delete()
        return

    def handle_cart_item_comment(
            self,
            cart_item_data: dict,
            method: str,
    ) -> dict:
        """
            Работает с комментарием позиции корзины.
        """

        cart_item = self._get_cart_item_by_cart_item_id(
            cart_item_data=cart_item_data,
        )
        cart_item_comment_info = self._add_comment_to_cart_item(
            cart_item_data=cart_item_data,
            cart_item=cart_item,
            method=method,
        )
        return cart_item_comment_info

    def _get_cart_item_by_cart_item_id(
            self,
            cart_item_data: str,
    ) -> Union[CartItem, None]:
        """
            Получает позицию корзины по cart_item_id.
        """

        cart_item_id = cart_item_data.get('cart_item_id')
        if cart_item_id:
            cart_item = self.model.objects.filter(
                cart_item_id=str(cart_item_id)).first()
            if cart_item:
                return cart_item
            else:
                return
        return

    def _add_comment_to_cart_item(
            self,
            cart_item_data: str,
            cart_item: CartItem,
            method: str,
    ) -> dict:
        """
            Добавляет комментарием к позиции корзины.
        """

        cart_item_comment = cart_item_data.get('cart_item_comment')
        if cart_item and method == 'delete':
            cart_item.comment = None
            cart_item.save()
            return {
                'cart_item': cart_item,
                'message': self.comment_message_delete,
            }
        if cart_item and method == 'post':
            cart_item.comment = cart_item_comment
            cart_item.save()
            return {
                'cart_item': cart_item,
                'message': self.comment_message_success,
            }
        return {}

    def handle_cart_item_quantity(
            self,
            cart_item_data: dict,
            method: str,
    ) -> dict:
        """
            Работает с количеcтвом позиции корзины.
        """

        cart_item = self._get_cart_item_by_cart_item_id(
            cart_item_data=cart_item_data,
        )
        if cart_item and method == 'delete':
            cart_item.delete()
            return {
                'cart_item': None,
                'message': self.quantity_message_delete,
            }
        self._update_cart_item(
            cart_item_data=cart_item_data,
            cart_item=cart_item,
        )
        return {
            'cart_item': cart_item,
            'message': self.quantity_message_success,
        }

    def handle_cart_item_is_selected(
            self,
            cart_item_data: dict,
            method: str,
    ) -> dict:
        """
            Работает с is_selected позиции корзины.
        """

        shop_id = cart_item_data.get('shop_id')
        cart_id = cart_item_data.get('cart_id')
        all_cart_items = cart_item_data.get('all_cart_items')

        if shop_id:
            filter_data = {
                'shop__id': int(shop_id),
                'carts__id': int(cart_id),
                'state': self.CHECKBOX_STATE,
            }
            cart_items = self.filter_cart_item(filter_data=filter_data)
            for cart_item in cart_items:
                self.set_is_selected(cart_item=cart_item, method=method)
        elif all_cart_items:
            self._handle_all_cart_items_selected(
                cart_item_data=cart_item_data,
                method=method,
            )
        else:
            cart_item = self._get_cart_item_by_cart_item_id(
                cart_item_data=cart_item_data,
            )
            self.set_is_selected(cart_item=cart_item, method=method)

        user = cart_item_data.get('user')
        cart_info = self.cart.get_cart_info(user=user)

        return cart_info

    def delete_cart_items(
            self,
            cart_item_data: dict,
    ) -> None:
        """
            Удаляет позиции козрины.
        """

        shop_name = cart_item_data.get('shop_name')
        cart_id = cart_item_data.get('cart_id')

        filter_data = {
            'shop__name': str(shop_name),
            'carts__id': int(cart_id),
            'is_selected': True,
        }
        cart_items = self.filter_cart_item(filter_data=filter_data)
        if cart_items.count() == 1:
            message = self.quantity_message_delete
        else:
            message = self.message_delete
        for cart_item in cart_items:
            cart_item.delete()
        return {
            'ok': True,
            'message': message,
        }

    def filter_cart_item(self, filter_data: dict) -> QuerySet:
        """
            Фильтрует позиции козрины.
        """

        cart_items = self.model.objects.filter(**filter_data)
        return cart_items

    def set_is_selected(self, cart_item: CartItem, method: str) -> None:
        """
            Устанавливает is_selected.
        """

        cart_item.is_selected = True if method == 'post' else False

        cart_item.save()
        return

    def _handle_all_cart_items_selected(
            self,
            cart_item_data: dict,
            method: str,
    ) -> None:
        """
            Устанавливает is_selected позиций в корзине .
        """

        cart = self.cart.get_cart(user=cart_item_data.get('user'))
        for cart_item in cart.get_cart_items:
            if cart_item.state == self.CHECKBOX_STATE:
                self.set_is_selected(cart_item=cart_item, method=method)
        return

    def _add_cart_item_to_cart(
            self,
            cart_item: CartItem,
            cart_item_data: dict,
    ) -> None:
        """
            Добавляет позицию корзины в корзину.
        """

        try:
            cart = self.cart.get_cart(user=cart_item_data.get('user'))
            cart_item.carts.add(cart)
            cart_item.save()
        except Exception as ex:
            LOGGER.warning(f'{ex}')
            return
        else:
            return

    def remove_cart_items_from_cart(self, cart: Cart) -> None:
        """
            Убирает выбранные позиции из корзины.
        """

        cart_items = self.model.objects.filter(
            is_selected=True,
            carts=cart,
            max_quantity__gte=1,
        )
        for cart_item in cart_items:
            cart_item.carts.remove(cart)
            cart_item.is_selected = False
            cart_item.save()

        return

    def remove_valid_cart_items_from_cart(
            self,
            valid_cart_items: list,
            cart: Cart,
    ) -> None:
        """
            Убирает выбранные позиции из корзины для валидных магазинов.
        """

        for cart_item in valid_cart_items:
            cart_item.carts.remove(cart)
            cart_item.save()

        return

    def set_wait_state(
            self,
            cart_id_int: int,
    ) -> CartItem:
        """
            Устанавливает WAIT состояние.
        """

        cart_item = self.get_cart_item_by_id(
            id=cart_id_int,
        )
        cart_item.state = self.WAIT_STATE
        cart_item.save()
        return

    def get_cart_item_by_id(
            self,
            id: str,
    ) -> CartItem:
        """
            Получает позицию корзины по id.
        """

        return self.model.objects.filter(id=int(id)).first()

    def recalculate_cart_item(
            self,
            cart_item_data: dict,
    ) -> dict:
        """
            Заново проценивает данные для позиции.
        """

        cart_id_list = cart_item_data.get('cart_id_list')
        city_id = cart_item_data.get('city_id')
        user = cart_item_data.get('user')

        task_recalculate_cart_item.apply_async(
            args=[cart_id_list, city_id, user.id],
            serializer="json",
        )
        return

    def set_cart_items_from_cookie(
            self,
            cart_items_data: dict,
    ) -> None:
        """
            Заполняет позиции корзины из куки.
        """

        for cart_item_data in cart_items_data.get('cart_items_list_cookie'):
            cart_item_data.update({'user': cart_items_data.get('user')})
            self.handle_cart_item(cart_item_data)
        return

    def cart_item_sorter(self, cart_item: CartItem) -> int:
        """Сортировщик по интернет магазину"""

        return cart_item.shop.web_shop.id
