from django.contrib import admin
from django.contrib import messages

from . import models
from cart.services.facades import YandexDelivery, FacadeOrder


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'created', 'updated']
    search_fields = ['cart__user__username', 'uuid']
    list_filter = ('status',)
    raw_id_fields = ['cart']
    list_select_related = ['cart']

    def user(self, obj: models.Order) -> str:
        return obj.cart.user
    actions = ['check_statuses']

    @ admin.action(description='Обновить статусы заказов')
    def check_statuses(self, request, queryset):
        facade_delivery = FacadeOrder()
        facade_delivery.check_order_statuses(orders=queryset)
        self.message_user(
            request, 'Статусы успешно обновлены', messages.SUCCESS)


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'article', 'brand', 'product_name',
                    'cart_item_quantity',
                    'is_selected', 'price', 'created', 'updated']
    search_fields = ['cart_item_id', 'cart_item_quantity', 'article', 'brand',
                     'product_name']
    raw_id_fields = ['shop', 'carts', 'orders', 'deliveries']
    list_select_related = ['shop']


@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created', 'updated']
    search_fields = ['user__username']
    raw_id_fields = ['user']
    list_select_related = ['user']


@admin.register(models.HistoryOrder)
class HistoryOrderAdmin(admin.ModelAdmin):
    list_display = ['order', 'history_point', 'created', 'updated']
    search_fields = ['history_point']
    raw_id_fields = ['order']
    list_select_related = ['order']


@admin.register(models.RecipientData)
class RecipientDataAdmin(admin.ModelAdmin):
    list_display = ['cart', 'recipient_name', 'address_delivery', 'phone',
                    'is_favorite', 'created', 'updated']
    search_fields = ['recipient_name', 'phone']
    raw_id_fields = ['cart']
    list_select_related = ['cart']


class CartItemInline(admin.StackedInline):
    model = models.CartItem
    extra = 0
    # list_display = ('id', 'cart_item_id')
    exclude = ['image_url',
               'cart_item_id',
               'carts',
               'delivery_period',
               'delivery_cost',
               'shop',
               'orders',
               'deliveries',
               'is_selected',
               ]
    readonly_fields = (
        'product_name',
        'brand',
        'article',
        'cart_item_quantity',
        'comment',
        'price',
    )
    can_delete = False
    verbose_name = 'Позиция доставки'
    verbose_name_plural = 'Позиции доставок'


@admin.register(models.Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        # 'уникальный_id_для_заказа',
        'yandex_delivery_id',
        'адрес_получателя',
        'наименование_отправителя',
        'адрес_отправителя',
        'наименования_позиций',
        'количество_позиций',
        'всего_товаров_шт',
        'status',
        'created',
        'updated',
    ]

    def уникальный_id_для_заказа(self, obj: models.Delivery) -> str:
        return obj.order_uuid

    def адрес_получателя(self, obj: models.Delivery) -> str:
        return obj.receiver_address

    def наименование_отправителя(self, obj: models.Delivery) -> str:
        return obj.sender_name

    def адрес_отправителя(self, obj: models.Delivery) -> str:
        return obj.sender_address

    def количество_позиций(self, obj: models.Delivery) -> str:
        return obj.get_cart_items_number

    def всего_товаров_шт(self, obj: models.Delivery) -> str:
        return obj.get_cart_items_count

    def наименования_позиций(self, obj: models.Delivery) -> str:
        return obj.product_names

    search_fields = ['id', 'order__uuid', ]
    raw_id_fields = ['order', 'recipient_address']
    list_select_related = ['order']
    readonly_fields = ['order_uuid', 'sender_name', 'receiver_name']
    list_filter = ('order__status', 'order')
    # inlines = [CartItemInline]
    actions = ['check_statuses']

    @ admin.action(description='Обновить статусы доставок')
    def check_statuses(self, request, queryset):
        yandex_delivery = YandexDelivery()
        yandex_delivery.request_delivery_info(deliveries=queryset)
        self.message_user(
            request, 'Статусы успешно обновлены', messages.SUCCESS)
