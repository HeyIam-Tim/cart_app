// выводит статусы на страницу
let setStatusValueOnPage = (data) => {
    document.querySelector(`#DS_${yandex_delivery_id}`).innerHTML = data.data.status;
    document.querySelector(`#DS_${yandex_delivery_id}_mobile`).innerHTML = `статус: ${data.data.status}`;
}


// удаляет кнопки "Отменить доставку"
let removeCancellDeliveryBtn = () => {
    document.querySelector('#cancell_delivery_btn').style.display = 'none';
    document.querySelector('#cancell_delivery_btn_mobile').style.display = 'none';
}


// обновляет историю доставки
let updateDeliveryHistory = (data) => {
    document.querySelector('#delivery_end').innerHTML = `${data.data.delivery_end} - завершена (Доставлен)`;
    document.querySelector('#delivery_end_mobile').innerHTML = `${data.data.delivery_end} - завершена (Доставлен)`;
}


// проверяет время окончания доставки
let checkDeliveryEnd = () => {
    let url = `${window.location.origin}/cart/api/v0/get-delivery-end/`;
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
        if (data.data.delivery_end) {
            updateDeliveryHistory(data);

            removeCancellDeliveryBtn();

            setStatusValueOnPage(data);
        }
    })
}


if (delivery_end == 'None') {
    checkDeliveryEnd();
}
