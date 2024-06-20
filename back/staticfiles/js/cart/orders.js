// удаляет заказ
let deleteOrder = (element) => {
    let order_id = element.getAttribute("data-order_id");
    deleteOrderAPI(order_id=order_id);
}


// апи для удаления заказа
let deleteOrderAPI = (order_id) => {
    let url = `${window.location.origin}/cart/api/v0/delete-order/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'order_id': order_id,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        window.location.href = window.location.href;
    })
}


// проверяет статусы доставок
let checkDeliveryStatuses = () => {
    let url = `${window.location.origin}/cart/api/v0/check-divery-status/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'user_id': user_id,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        for (const delivery_status of data.data.delivery_statuses) {
            document.querySelector(`#DS_${delivery_status.yandex_delivery_id}`).innerHTML = delivery_status.status_ru;
            document.querySelector(`#DS_${delivery_status.yandex_delivery_id}_mobile`).innerHTML = `статус: ${delivery_status.status_ru}`;
        }
    })
}
//


// checkDeliveryStatuses();
