# Generated by Django 3.2.7 on 2024-04-01 09:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0006_rename_model_brand_telegramrequestbuyer_model_carbrand'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, null=True, verbose_name='Добавлен')),
                ('updated', models.DateTimeField(auto_now=True, null=True, verbose_name='Изменен')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cart', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Корзина',
                'verbose_name_plural': 'Корзины',
                'ordering': ('-created',),
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, null=True, verbose_name='Добавлен')),
                ('updated', models.DateTimeField(auto_now=True, null=True, verbose_name='Изменен')),
                ('uuid', models.UUIDField(blank=True, default=uuid.uuid4, null=True, verbose_name='Уникальный id для Заказа')),
                ('status', models.PositiveSmallIntegerField(choices=[(0, 'Новый'), (4, 'Оплачен'), (1, 'В пути'), (2, 'Выполнен'), (3, 'Отменен'), (4, 'Оплачен')], default=0, verbose_name='Статус')),
                ('clean_telegram_messages', models.TextField(blank=True, default='', null=True, verbose_name='Телеграм сообщения')),
                ('paykeeper_id', models.PositiveIntegerField(blank=True, null=True, verbose_name='Id платежа в системе Paykeeper')),
                ('receipt_history', models.TextField(blank=True, default='', null=True, verbose_name='Ссылки на чеки Paykeeper')),
                ('cart', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='cart.cart', verbose_name='Корзина')),
            ],
            options={
                'verbose_name': 'Заказ',
                'verbose_name_plural': 'Заказы',
                'ordering': ('-created',),
            },
        ),
        migrations.CreateModel(
            name='RecipientData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, null=True, verbose_name='Добавлен')),
                ('updated', models.DateTimeField(auto_now=True, null=True, verbose_name='Изменен')),
                ('address_delivery', models.CharField(blank=True, max_length=255, null=True, verbose_name='Адрес доставки')),
                ('porch', models.CharField(blank=True, max_length=15, null=True, verbose_name='Подъезд')),
                ('floor', models.CharField(blank=True, max_length=15, null=True, verbose_name='Этаж')),
                ('appartment', models.CharField(blank=True, max_length=15, null=True, verbose_name='Квартира')),
                ('door_code', models.CharField(blank=True, max_length=15, null=True, verbose_name='Домофон')),
                ('postal_code', models.CharField(blank=True, max_length=20, null=True, verbose_name='Почтовый индекс')),
                ('recipient_name', models.CharField(blank=True, max_length=127, null=True, verbose_name='ФИО получателя')),
                ('email', models.EmailField(blank=True, max_length=63, null=True, verbose_name='Емейл')),
                ('phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='Телефон получателя')),
                ('longitude', models.CharField(blank=True, max_length=20, null=True, verbose_name='Долгота')),
                ('latitude', models.CharField(blank=True, max_length=20, null=True, verbose_name='Широта')),
                ('is_favorite', models.BooleanField(blank=True, default=False, null=True, verbose_name='Выбранный адрес')),
                ('is_valid_address', models.BooleanField(blank=True, default=False, null=True, verbose_name='Правильный адрес')),
                ('cart', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to='cart.cart', verbose_name='Корзина')),
                ('order', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='address', to='cart.order', verbose_name='Заказ')),
            ],
            options={
                'verbose_name': 'Данные получателя',
                'verbose_name_plural': 'Данные получателей',
            },
        ),
        migrations.CreateModel(
            name='HistoryOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, null=True, verbose_name='Добавлен')),
                ('updated', models.DateTimeField(auto_now=True, null=True, verbose_name='Изменен')),
                ('history_point', models.CharField(blank=True, max_length=63, null=True, verbose_name='Пункт истроии')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='cart.order', verbose_name='Заказ')),
            ],
            options={
                'verbose_name': 'История заказа',
                'verbose_name_plural': 'История заказов',
            },
        ),
        migrations.CreateModel(
            name='Delivery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, null=True, verbose_name='Добавлен')),
                ('updated', models.DateTimeField(auto_now=True, null=True, verbose_name='Изменен')),
                ('uuid', models.UUIDField(blank=True, default=uuid.uuid4, null=True, verbose_name='Уникальный id для Доставки')),
                ('delivery_cost', models.FloatField(blank=True, null=True, verbose_name='Стоимость доставки')),
                ('delivery_period', models.CharField(blank=True, max_length=63, null=True, verbose_name='Срок доставки')),
                ('delivery_end', models.DateTimeField(blank=True, null=True, verbose_name='Время завершения доставки')),
                ('order_cost', models.FloatField(blank=True, null=True, verbose_name='Стоимость заказа')),
                ('width', models.CharField(blank=True, default='0,6', max_length=15, null=True, verbose_name='Ширина')),
                ('height', models.CharField(blank=True, default='0,5', max_length=15, null=True, verbose_name='Высота')),
                ('length', models.CharField(blank=True, default='1', max_length=15, null=True, verbose_name='Длина')),
                ('weight', models.CharField(blank=True, default='', max_length=15, null=True, verbose_name='Вес')),
                ('status', models.PositiveSmallIntegerField(choices=[(0, 'Новый'), (1, 'В пути'), (2, 'Доставлен'), (3, 'Отменен')], default=0, verbose_name='Статус')),
                ('yandex_delivery_id', models.CharField(blank=True, default='', max_length=35, null=True, verbose_name='Яндекс ID')),
                ('delivery_type', models.PositiveSmallIntegerField(choices=[(0, 'Экспресс'), (1, 'Экспресс +30 мин'), (2, 'За 2 часа'), (3, 'Самовывоз')], default=0, verbose_name='Тип доставки')),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='deliveries', to='cart.order', verbose_name='Заказ')),
                ('recipient_address', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='deliveries', to='cart.recipientdata', verbose_name='Данные получателя')),
            ],
            options={
                'verbose_name': 'Доставка',
                'verbose_name_plural': 'Доставки',
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, null=True, verbose_name='Добавлен')),
                ('updated', models.DateTimeField(auto_now=True, null=True, verbose_name='Изменен')),
                ('cart_item_id', models.TextField(blank=True, null=True, unique=True, verbose_name='Хеш позиции корзины')),
                ('product_name', models.CharField(blank=True, max_length=255, null=True, verbose_name='Наименование товара')),
                ('article', models.CharField(blank=True, max_length=63, null=True, verbose_name='Артикул')),
                ('brand', models.CharField(blank=True, max_length=63, null=True, verbose_name='Бренд')),
                ('old_price', models.FloatField(blank=True, null=True, verbose_name='Старая цена')),
                ('price', models.FloatField(blank=True, null=True, verbose_name='Цена')),
                ('delivery_period', models.CharField(blank=True, max_length=63, null=True, verbose_name='Срок доставки')),
                ('cart_item_quantity', models.FloatField(blank=True, null=True, verbose_name='Количество для позиции')),
                ('max_quantity', models.FloatField(blank=True, null=True, verbose_name='Максимальное количество')),
                ('delivery_cost', models.FloatField(blank=True, null=True, verbose_name='Стоимость доставки')),
                ('image_url', models.TextField(blank=True, null=True, verbose_name='Ссылка на изображение')),
                ('comment', models.TextField(blank=True, null=True, verbose_name='Комментарий')),
                ('is_selected', models.BooleanField(blank=True, default=False, null=True, verbose_name='Выбран (чекбокс)')),
                ('state', models.PositiveSmallIntegerField(choices=[(0, 'Проценка'), (1, 'Ожидание'), (2, 'Чекбокс')], default=2, verbose_name='Состояние')),
                ('carts', models.ManyToManyField(blank=True, related_name='cart_items', to='cart.Cart', verbose_name='Корзины')),
                ('deliveries', models.ManyToManyField(blank=True, related_name='cart_items', to='cart.Delivery', verbose_name='Доставки')),
                ('orders', models.ManyToManyField(blank=True, related_name='cart_items', to='cart.Order', verbose_name='Заказы')),
                ('shop', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cart_items', to='core.shop', verbose_name='Магазин')),
            ],
            options={
                'verbose_name': 'Позиция корзины',
                'verbose_name_plural': 'Позиции корзин',
                'ordering': ('-created',),
            },
        ),
    ]
