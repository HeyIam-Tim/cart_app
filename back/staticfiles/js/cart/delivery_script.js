// кнопка возврата товара
let returnDelivery = () => {
    let url = `${window.location.origin}/cart/api/v0/return-delivery/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    let options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'delivery_id': delivery_id,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        window.location.href = window.location.href;
    })
}


// проверяет прошел ли срок возврата товара (14 дней по умолчанию)
let checkDeliveryReturningTimeExpired = () => {
    let url = `${window.location.origin}/cart/api/v0/check-delivery-returning-time-expired/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    let options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'delivery_id': delivery_id,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        if (data.data.show_btn) {
            let return_delivery_btn = '<button id="cancell_delivery_btn" class="inline-block my-5 mx-2 border py-2 px-5 text-sm rounded-md border-red-300 bg-red-500 hover:bg-red-300 text-white stem-medium" data-delivery_id="{{delivery.id}}" onclick="returnDelivery(this)" style="text-align: right;">Вернуть товар</button>';
            document.querySelector('#id_return_delivery').innerHTML = return_delivery_btn;
            document.querySelector('#id_return_delivery_mobile').innerHTML = return_delivery_btn;
        }
    })
}


setTimeout(function() {
    checkDeliveryReturningTimeExpired();
}, 1000);
