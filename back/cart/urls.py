from django.urls import path
from . import views
from .api.v0 import api_views


app_name = 'cart'

urlpatterns = [
    path('profile/user/cart/', views.CartView.as_view(), name='cart'),
    path('profile/user/cart/create-order/', views.CreateOrdersView.as_view(),
         name='create-order'),
    path('profile/user/cart/orders/', views.Orders.as_view(),
         name='orders'),
    path('profile/user/cart/orders/<str:pk>/', views.Order.as_view(),
         name='order'),
    path('profile/user/cart/deliveries/<str:pk>/', views.Delivery.as_view(),
         name='delivery'),
    path('profile/user/cart/confirm-payment/', views.ConfirmPayment.as_view(),
         name='confirm-payment'),

    path('cart/api/v0/send-data-for-cart-item/',
         api_views.DataForCartItem.as_view(),
         name='send-data-for-cart-item-api'),
    path('cart/api/v0/send-data-for-cart-recipient-data/',
         api_views.DataForRecipientData.as_view(),
         name='send-data-for-cart-recipient-data-api'),
    path('cart/api/v0/send-data-for-cart-item-comment/',
         api_views.DataForCartItemComment.as_view(),
         name='send-data-for-cart-item-comment'),
    path('cart/api/v0/send-data-for-update-cart-item/quantity/',
         api_views.DataForUpdateCartItemQuantity.as_view(),
         name='send-data-for-cart-item-comment'),
    path('cart/api/v0/send-data-for-cart-item-is-selected/',
         api_views.DataForUpdateCartItemIsSelected.as_view(),
         name='send-data-for-cart-item-is-selected'),
    path('cart/api/v0/send-data-to-delete-cart-items/',
         api_views.DeleteCartItems.as_view(), name='delete-cart-items'),
    path('cart/api/v0/recipient-data/',
         api_views.RecipientData.as_view(), name='recipient-data'),
    path('cart/api/v0/create-order/',
         api_views.CreateOrder.as_view(), name='create-order-api'),
    path('cart/api/v0/get-cost-info/',
         api_views.CostInfo.as_view(), name='cost-info'),

    path('cart/api/v0/delete-order/',
         api_views.DeleteOrder.as_view(), name='delete-order'),

    path('cart/api/v0/cancell-delivery/',
         api_views.CancellDelivery.as_view(), name='cancell-delivery'),
    path('cart/api/v0/check-divery-status/',
         api_views.CheckDeliveryStatus.as_view(), name='check-divery-status'),
    path('cart/api/v0/get-delivery-end/',
         api_views.GetDeliveryEnd.as_view(), name='get-delivery-end'),

    path('cart/api/v0/recalculate-cart-item/',
         api_views.ReCalculateCartItem.as_view(),
         name='recalculate-cart-item'),

    path('cart/api/v0/get-cartitems-count/',
         api_views.GetCartItemsCount.as_view(),
         name='get-cartitems-count'),
    path('cart/api/v0/check-working-hours/',
         api_views.CheckWorkingHours.as_view(),
         name='check-working-hours'),
    path('cart/api/v0/check-wait-states/',
         api_views.CheckWaitStates.as_view(),
         name='check-wait-states'),
    path('cart/api/v0/set-cart-items-from-cookie/',
         api_views.SetCartItemsFromCookie.as_view(),
         name='set-cart-items-from-cookie'),
    path('cart/api/v0/catalog-price/',
         api_views.CatalogPrice.as_view(),
         name='catalog-price'),

    path('cart/api/v0/payment-notification/', api_views.PaymentNotification.as_view(),
         name='payment-notification'),

    path('cart/api/v0/check-delivery-returning-time-expired/',
         api_views.CheckDeliveryReturningTimeExpired.as_view(),
         name='check-delivery-returning-time-expired'),

    path('cart/api/v0/return-delivery/', api_views.ReturnDelivery.as_view(),
         name='return-delivery'),

    path('cart/api/v0/get-receipts/', api_views.GetReceipts.as_view(),
         name='get-receipts'),
]
