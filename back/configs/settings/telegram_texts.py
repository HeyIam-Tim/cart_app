PENDING_TIME_FOR_BUYERS = 24
PENDING_TIME_FOR_BUYERS_TEXT = f'В течение {PENDING_TIME_FOR_BUYERS} часов они пришлют предложения.'
CANCELING_FOR_BUYERS_TEXT = ('<b>❌ Заявка отменена {deleter}.</b>')
OFFERS_FROM_SELLER_SINGAL = 'Предложение от магазина: '
OFFERS_FROM_SELLER_PLURAL = 'Предложения от магазинов: '
COMPATIBLE_TEXT = '❗Требуется проверка совместимости'


def get_offers_text(shop_count: int, shop_names: str) -> str:
    """Возвращает текст с наименованиями магазинов, которые получили заявку."""

    shop_names_back = f'{OFFERS_FROM_SELLER_PLURAL}{shop_names[:-2]}' if shop_count > 1 else f'{OFFERS_FROM_SELLER_SINGAL}{shop_names[:-2]}'
    return str(shop_names_back)


GET_OFFERS_TEXT = get_offers_text


TEXT_MESSAGE_FOR_BUYERS = ("""
<b>Создана заявка на деталь «{product_name}»</b>

Артикул: {article}
Производитель детали: {brand}

Модель (Марка): {model_carbrand}

Её получили {receivers_count} продавцов.
{shop_infos}
{sellers_count}

{deleting}
""")

SHOP_INFO_TEXT = ("""
Магазин: «{shop_name}»
{address}
{phone}
{site}
""")


TEXT_MESSAGE_FOR_SELLERS = ("""
Запчасть: {product_name}
Артикул: {article}
Производитель детали: {brand}

VIN: {vin_number}
Модель (Марка): {model_carbrand}

Город: {city_name}

Количество: {quantity}
{comment}
{is_compatible}{deleter}
""")


TEXT_REPLY_TELEGRAM_REQUEST_SELLER = ("""
{text_message_for_sellers}
Клиент получил ваше предложение.{analogs_info}
Цена: {price} Р
Комментарий: {comment}
""")


TEXT_REPLY_TELEGRAM_REQUEST_BUYER = ("""
Запчасть: {product_name}
Артикул: {article}
Производитель детали: {brand}

VIN: {vin_number}
Модель (Марка): {model_carbrand}

{names_shop}

Цена: {price} Р
Комментарий: {comment}
""")

TEXT_SELLER_INFO = ("""
Запчасть: {product_name}
Артикул: {article}
Производитель детали: {brand}

VIN: {vin_number}
Модель (Марка): {model_carbrand}

Цена: {price} Р
Комментарий: {comment}

""")


TEXT_FOR_DELIVERY = ("""
Доставка №{delivery_count}
Адрес отправителя: {shop_address}
Имя отправителя: {delivery_shop_name}
Телефон отправителя: {delivery_phone_from}

Адрес получателя: {delivery_address}
Телефон получателя: {delivery_phone}
Подъезд: {porch}
Этаж: {floor}
Квартира: {appartment}
Домофон: {door_code}
Имя получателя: {credentials}

Состав доставки: {product_list}
Габариты: 43*54*90, не более 150 см в сумме
Вес: не более 30 кг
Стоимость доставки: {delivery_cost}Р
""")

TEXT_BOT_GREETING = """
<b>Что умеет этот бот?</b>

Сделайте запрос цены на сайте geozip.ru и
получите предложения здесь.
Кому отвечать выбирать вам - мы не
передаем ваши контакты продавцам."""


TEXT_ASK_PHONE = """
Для продолжения работы с ботом,
необходимо нажать кнопку
“Показать номер телефона”
"""


TEXT_ASK_DELIVERY_ADDRESS = """
Для того, чтобы рассчитать
стоимость доставки - нажмите
кнопку “Добавить адрес доставки”
"""

TEXT_SUPPORT = ("""
Для контакта с Поддержкой перейдите по ссылке:
{support_chat}
""")
