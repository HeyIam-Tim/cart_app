// отменяет доставку
let cancellDelivery = (element) => {
    let delivery_id = element.getAttribute("data-delivery_id");
    cancellDeliveryAPI(delivery_id=delivery_id);
}


// апи для отмены достваки
let cancellDeliveryAPI = (delivery_id) => {
    let url = `${window.location.origin}/cart/api/v0/cancell-delivery/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let options = {
        method: 'PUT',
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