from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
import debug_toolbar


urlpatterns = [
    path('api_schema/', get_schema_view(
        title='API Schema', description='Guide for the REST API'),
        name='api_schema'),

    path('swagger-ui/', TemplateView.as_view(template_name='swagger_docs.html',
         extra_context={'schema_url': 'api_schema'}), name='swagger-ui'),

    path("favicon.ico", RedirectView.as_view(
        url=staticfiles_storage.url("images/favicongeo.ico")),),

    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('', include('api.v0.urls', namespace='api')),
    path('', include('zzap.urls', namespace='zzap')),
    path('', include('cart.urls', namespace='cart')),
    path('', include('delivery_app.urls', namespace='delivery_app')),
    path('admin_tools/', include('admin_tools.urls')),
    path('social-auth/', include('social_django.urls', namespace='social')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# debug_toolbar
if settings.DEBUG:
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
