"""
Django local for blizko_project project.

Generated by 'django-admin startproject' using Django 3.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of local and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from .local import MEDIA_ROOT, DEBUG, TELEGRAM_BOT_TOKEN_BUYER, \
    TELEGRAM_BOT_TOKEN_SELLER, LOGURU_FILE, TELEGRAM_RECEIVERS_LOCAL
from .local import *  # NOQA
import os
from enum import Enum
from loguru import logger
import telebot

SITE_ID = 1
DEBUG = False
# Application definition
INSTALLED_APPS = [
    # 'channels',
    'cacheops',

    'admin_tools',
    'admin_tools.theming',
    'admin_tools.menu',
    'admin_tools.dashboard',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_filters',
    'rest_framework',
    'rest_framework.authtoken',
    'taggit',
    'social_django',
    'ckeditor',
    'debug_toolbar',
    'template_profiler_panel',
    'corsheaders',
    'django.contrib.sites',
    'django.contrib.sitemaps',

    'phone_field',

    'daphne',

    'core',
    # 'abcp.apps.AbcpConfig',
    'api',
    'zzap.apps.ZzapConfig',
    'autorus.apps.AutorusConfig',
    'gatewayapp',
    'cart',
    'delivery_app',
    'handbookapp',
    'offerapp',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

ROOT_URLCONF = 'configs.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 'DIRS': [],
        'DIRS': [os.path.join(BASE_DIR, "templates")],  # NOQA
        # 'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
                'admin_tools.template_loaders.Loader',
            ],
        },
    },
]

WSGI_APPLICATION = 'configs.wsgi.application'
ASGI_APPLICATION = 'configs.asgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

STATIC_URL = '/static/'

# on collectstatic command
STATIC_ROOT = os.path.join(BASE_DIR, "static")  # NOQA

# static dirs in development
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "staticfiles"),  # NOQA
]

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        # NOQA
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        # NOQA
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        # NOQA
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        # NOQA
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

# LANGUAGE_CODE = 'en-us'
LANGUAGE_CODE = 'ru'

# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Yekaterinburg'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_URL = '/'

MEDIA_URL = '/media/'

# Redis
REDIS_HOST = '127.0.0.1'
REDIS_PORT = 6379
REDIS_DB = 0

# Redis cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

CACHEOPS_REDIS = {
    'host': '127.0.0.1',  # сервер redis доступен локально
    'port': 6379,  # порт по умолчанию
    'db': 0,  # можно выбрать номер БД
    'socket_timeout': 3,
}

CACHEOPS = {
    'core.shop': {'ops': 'all', 'timeout': 60 * 60},
    'core.webshop': {'ops': 'all', 'timeout': 60 * 60},
    'core.city': {'ops': 'get', 'timeout': 60 * 60},
    'core.product': {'ops': 'filter', 'timeout': 60 * 60},
}

# Celery Configuration
CELERY_TIMEZONE = "Europe/Moscow"
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 60 * 60
CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        # 'rest_framework.authentication.TokenAuthentication'
    ]
}

# django-admin-tools
ADMIN_TOOLS_INDEX_DASHBOARD = 'configs.settings.output_file.CustomIndexDashboard'  # NOQA

# telegram variables
TELEGRAM_URL = 'https://telegram.org/js/telegram-widget.js?21'
SOCIAL_AUTH_TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN_BUYER

# social_django
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'social_core.backends.vk.VKOAuth2',
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    # 'social_core.backends.telegram.TelegramAuth'
)

# CML configurations
CML_RESPONSE_SUCCESS = 'success'
CML_RESPONSE_PROGRESS = 'progress'
CML_RESPONSE_ERROR = 'failure'
CML_MAX_EXEC_TIME = 0
CML_USE_ZIP = False
CML_FILE_LIMIT = 0
CML_UPLOAD_ROOT = os.path.join(MEDIA_ROOT, 'cml')

# debug_toolbar
if DEBUG:
    def show_toolbar(request):
        return True


    DEBUG_TOOLBAR_CONFIG = {
        'SHOW_TOOLBAR_CALLBACK': show_toolbar,
    }

    DEBUG_TOOLBAR_PANELS = [
        'debug_toolbar.panels.versions.VersionsPanel',
        'debug_toolbar.panels.timer.TimerPanel',
        'debug_toolbar.panels.settings.SettingsPanel',
        'debug_toolbar.panels.headers.HeadersPanel',
        'debug_toolbar.panels.request.RequestPanel',
        'debug_toolbar.panels.sql.SQLPanel',
        'debug_toolbar.panels.templates.TemplatesPanel',
        'debug_toolbar.panels.staticfiles.StaticFilesPanel',
        'debug_toolbar.panels.cache.CachePanel',
        'debug_toolbar.panels.signals.SignalsPanel',
        'debug_toolbar.panels.logging.LoggingPanel',
        'debug_toolbar.panels.redirects.RedirectsPanel',
        'debug_toolbar.panels.profiling.ProfilingPanel',
        'template_profiler_panel.panels.template.TemplateProfilerPanel',
    ]

# mqtt
MQTT_SERVER = 'geozip.ru'
MQTT_PORT = 1883
MQTT_TOPIC = "geozip"
MQTT_TOPIC_REQUEST = "geozip/request"
MQTT_TOPIC_RESPONSE = "geozip/response"
MQTT_TOPIC_ACCEPT_REQUEST = "geozip/accept/request"
MQTT_TOPIC_ACCEPT_RESPONSE = "geozip/accept/response"

# переменные для ядра проекта
# CORE_URL = 'https://geozip.ru'
CORE_URL = 'http://127.0.0.0.1:8000'
# для zzap сервера
ZZAP_SERVER_URL = 'https://geozip.ru'


class AppName(Enum):
    """Список наименований для приложений"""
    CORE_APP_NAME = 'core'
    ZZAP_APP_NAME = 'zzap'
    AUTORUS_APP_NAME = 'autorus'
    SCRAPER_APP_NAME = 'scraper'


# fapi
FAPI_URL = 'https://fapi.iisis.ru/fapi/v2'
FAPI_STATIC_URL = 'https://static.fapi.iisis.ru/fapi/v2'
FAPI_TOKEN = ''  # установить в local.py

# autorus
AUTORUS_URL = 'https://api.autorus.ru/gw/search/v1/parts/prices'

# reatilrocket
RETAILROCKET_URL = 'https://api.retailrocket.ru/api/1.0/partner'

# loguru
LOGURU_FORMAT = '{time} {level} {message}'
LOGURU_LEVEL = 'DEBUG'

# abcp
ABCP_URL = 'http://abcp50333.public.api.abcp.ru'
ABCP_SITE = 'https://drandulet.net'
ABCP_DOMAIN = 'drandulet.net'
ABCP_SHOP_NAME = 'Drandulet'
ORENBURG_REGION_ID = 47

# loguru
LOGURU_FORMAT = '{time} {level} {message}'
LOGURU_LEVEL = 'DEBUG'
logger.add(LOGURU_FILE, level=LOGURU_LEVEL, rotation='10 MB',
           compression='zip')
LOGGER = logger

# список микросервисов
MICROSERVICES_LIST = [('scraper', 2), ('autorus', 2), ('zzap', 15)]

# телеграм бот
BOT_BUYER = telebot.TeleBot(TELEGRAM_BOT_TOKEN_BUYER)
BOT_BUYER_NAME = 'BUYER'
BOT_SELLER = telebot.TeleBot(TELEGRAM_BOT_TOKEN_SELLER)
BOT_SELLER_NAME = 'SELLER'
TELEGRAM_SUPPORT_CHAT = 'https://t.me/+vdo9K44Y0SNiNDZi'

# CMSES
NONE_CMS = 0
ABCP = 1
DOCPART = 2
ARMTEK_CMS = 3
AUTOEURO_CMS = 4
PART_KOM_CMS = 5
AUTOTRADE_CMS = 6

# acat
ACAT_TYPES_AND_MARKS_URL = 'https://acat.online/api2/catalogs?lang=ru'
ACAT_MODELS_URL = 'https://acat.online/api2/catalogs/models?lang=ru'
URL_ACAT_MODELS = 'https://acat.online/api2/catalogs/models?'
ACAT_MODIFICATIONS_URL = 'https://acat.online/api2/catalogs/modifications?'
ACAT_GROUPS_URL = 'https://acat.online/api2/catalogs/groups?'
ACAT_PARTS_URL = 'https://acat.online/api2/catalogs/parts?'
ACAT_SCHEME_URL = 'https://acat.online/api2/catalogs/scheme?'
ACAT_SEARCH_URL = 'https://acat.online/api2/catalogs/search?'
ACAT_SEARCHPART2_URL = 'https://acat.online/api2/catalogs/searchParts2?'
ACAT_TOKEN = ''  # local.py

# yandex
YANDEX_CALCULATE_DELIVERY_URL = 'https://b2b.taxi.yandex.net/b2b/cargo/integration/v2/offers/calculate'  # NOQA
GEOCODE_URL = 'https://geocode-maps.yandex.ru/1.x/'

# docpart
DOCPART_DRANDULET_DOMAIN = 'drandulet.net'

# список для переадресации next=''
NEXT_TO_LIST = ['catalog', 'catalog/']

# Лимит запросов в час для каталога оригинальных запчастей
CATALOG_LIMIT = 500
# телеграм чаты для получателей
TELEGRAM_RECEIVERS = [] + TELEGRAM_RECEIVERS_LOCAL

# категории каталогов
CATALOG_CATEGORIES = [
    ("cars", "Оригинальные запчасти", "catalog/cars"),
    ("spares_shiny", "Шины", "catalog/spares/shiny"),
    ("spares_oil", "Масла и автохимия", "catalog/spares/oil"),
    ("spares_disky", "Диски", "catalog/spares/disky"),
    ("spares_accumulator", "Аккумуляторы", "catalog/spares/accumulator"),
    ("spares_accessories", "Автоаксессуары", "catalog/spares/accessories"),
    ("spares_kolpaki", "Колпаки", "catalog/spares/kolpaki"),
    ("spares_to", "Каталог ТО", "catalog/spares/to"),
    ("spares_bolty", "Болты, гайки", "catalog/spares/bolty"),
]

# поставщики
AUTOEURO = 'autoeuro.ru'
PART_KOM = 'part-kom.ru'
DRANDULET = 'drandulet.net'
ARMTEK = 'armtek.ru'
AUTOTRADE = 'autotrade.su'

# телефоно менеджера
MANAGER_PHONE = '+7(995)276-58-01'

# сервер Paykeeper
SERVER_PAYKEEPER = 'https://geozip.server.paykeeper.ru'

# Delivery common
# максимальный период доставки
MAX_DELIVERY_PERIOD = 10
# стоимость самовывоза по умолчанию
TYPE_DELIVERY_PICKUP_PRICE_DEFAULT = 0

# базовая структура ответа
BASE_RESPONSE_STRUCTURE = {'status': False, 'data': {}, 'errors': []}

# подсчет доставки для:
# CALCULATE_DELIVERY_FOR = 'SHOP'  # магазина
CALCULATE_DELIVERY_FOR = 'WEB_SHOP'  # поставщика

# двигатель доставки
DELIVERY_DRIVER_NAME = 'CDEK'
# DELIVERY_DRIVER_NAME = 'YANDEX'


# сервисный сбор
SERVICE_FEE = '199.99'
# коммисия %
COMMISSION = 5
# наценка
MARGIN = 1.03

# стоимость доставки по умолчанию
DELIVERY_PRICE_DEFAULT = 500

# ссылка на эквайринг для оплаты
ACTION_HTML_FOR_PAYMENT = 'https://geozip.server.paykeeper.ru/create/'
if DEBUG:
    ACTION_HTML_FOR_PAYMENT = 'https://demo.paykeeper.ru/create/'



create table employe (
    id int primary key,
    name text,
    hire_date datetime not null,
    fire_date datetime
);

---

-- feb 2024

select *
from employe
where fire_date >= '2024-02-01' and hire_date < '2024-03-01';
