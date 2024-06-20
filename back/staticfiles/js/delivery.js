// открывает форму с доставкой
let showDeliveryForm = (element) => {    
    let delivery_form = document.querySelector('#delivery_form');
    overlay.style.display = 'block';
    delivery_form.style.display = 'block';
    window.offer_price = element.getAttribute("data-offer_price");
    window.shop_address = element.getAttribute("data-shop_address");

    window.delivery_phone_from = element.getAttribute("data-delivery_phone_from");
    window.delivery_shop_name = element.getAttribute("data-delivery_shop_name");
    window.delivery_brand = element.getAttribute("data-delivery_brand");
    window.delivery_article = element.getAttribute("data-delivery_article");
    window.delivery_product_name = element.getAttribute("data-delivery_product_name");
}


// закрывает форму с доставкой
let closeDeliveryForm = () => {
    let delivery_form = document.querySelector('#delivery_form');
    overlay.style.display = 'none';
    delivery_form.style.display = 'none';
    document.querySelector('#credentials').value = '';
    document.querySelector('#delivery_quantity').value = '';
    document.querySelector('#length').value = '';
    document.querySelector('#width').value = '';
    document.querySelector('#height').value = '';
    document.querySelector('#weight').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('#delivery_comment').value = '';
    document.querySelector('#delivery_recipient_phone').value = '';

    document.querySelector('#order_price_info').innerHTML = '';
    document.querySelector('#delivery_price_info').innerHTML = '';

    let deliveries = document.querySelectorAll('.delivery');
    for (let index = 0; index < deliveries.length; index++) {
        const element = deliveries[index];
        element.value = '';
        
    }
}


// отправляет данные для подсчета доставки на сервер
let sendDeliveryData = () => {
    let credentials = document.querySelector('#credentials');
    let delivery_quantity = document.querySelector('#delivery_quantity');
    let length = document.querySelector('#length');
    let width = document.querySelector('#width');
    let height = document.querySelector('#height');
    let weight = document.querySelector('#weight');
    let delivery_address = document.querySelector('#address');
    let delivery_comment = document.querySelector('#delivery_comment');
    let delivery_recipient_phone = document.querySelector('#delivery_recipient_phone');

    let porch = document.querySelector('#porch');
    let floor = document.querySelector('#floor');
    let appartment = document.querySelector('#appartment');
    let door_code = document.querySelector('#door_code');
    let courier_comment = document.querySelector('#courier_comment');

    //// валидации
    // количество
    if (credentials.value == '') {
        credentials.style.borderColor = 'red';
    }
    else {
        window.credentials = true;
    }

    // количество
    if (delivery_quantity.value == '' || delivery_quantity.value <= 0) {
        delivery_quantity.style.borderColor = 'red';
    }
    else {
        window.delivery_quantity = true;
    }

    // длина
    if (length.value == '' || length.value <= 0 || length.value > 1) {
        length.style.borderColor = 'red';
    }
    else {
        window.length = true;
    }

    // ширина
    if (width.value == '' || width.value <= 0 || width.value > 0.6) {
        width.style.borderColor = 'red';
    }
    else {
        window.width = true;
    }

    // высота
    if (height.value == '' || height.value <= 0 || height.value > 0.5) {
        height.style.borderColor = 'red';
    }
    else {
        window.height = true;
    }
    
    // адрес
    if (delivery_address.value == '') {
        delivery_address.style.borderColor = 'red';
    }
    else {
        
        // координаты для адреса покупателя
        let coordinates_url = `https://geocode-maps.yandex.ru/1.x/?apikey=05f2b19b-9f85-4fbd-aa82-c4f50f8f16d5&format=json&results=5&geocode=${delivery_address.value}`;
        fetch(coordinates_url)
        .then(resp => resp.json())
        .then(data => {
            let coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ");
            window.longitude_recipient = coordinates[0];
            window.latitude_recipient = coordinates[1];
            window.delivery_address = true;
        })

        // координаты для адреса магазина
        let shop_coordinates_url = `https://geocode-maps.yandex.ru/1.x/?apikey=05f2b19b-9f85-4fbd-aa82-c4f50f8f16d5&format=json&results=5&geocode=${window.shop_address}`;
        fetch(shop_coordinates_url)
        .then(resp => resp.json())
        .then(data => {
            let coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ");
            window.longitude_shop_address = coordinates[0];
            window.latitude_shop_address = coordinates[1];
        })   
    }

    // телефон получателя
    if (delivery_recipient_phone.value == '') {
        delivery_recipient_phone.style.borderColor = 'red';
    }
    else {
        window.delivery_recipient_phone = true;
    }

    // апи на сервер с данными для подсчета доставки
    if (window.delivery_quantity == true && window.length == true && window.width == true && window.height == true && window.delivery_address == true && window.delivery_recipient_phone == true && window.credentials == true) {
        let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        let url = `${window.location.origin}/api/v0/send-data-for-delivery/`;
    
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'user_id': user_id,

                'product_name': window.delivery_product_name,
                'article': window.delivery_article,
                'brand': window.delivery_brand,

                'delivery_shop_name': window.delivery_shop_name,
                'shop_address': window.shop_address,
                'delivery_phone_from': window.delivery_phone_from,
                'longitude_shop_address': window.longitude_shop_address,
                'latitude_shop_address': window.latitude_shop_address,
                'offer_price': window.offer_price,

                'credentials': credentials.value,
                'delivery_recipient_phone': delivery_recipient_phone.value,
                'delivery_quantity': delivery_quantity.value,
                'length': length.value,
                'width': width.value,
                'height': height.value,
                'weight': (weight.value == '') ? 0 : weight.value,
                                
                'delivery_address': delivery_address.value,
                'longitude_recipient': window.longitude_recipient,
                'latitude_recipient': window.latitude_recipient,
                'porch': porch.value,
                'floor': floor.value,
                'appartment': appartment.value,
                'door_code': door_code.value,
                'courier_comment': courier_comment.value,

                'delivery_comment': delivery_comment.value,
            })
        }
        fetch(url, options)
        .then(response => response.json())
        .then(data => {data
            let order_price_info = document.querySelector('#order_price_info');
            let delivery_price_info = document.querySelector('#delivery_price_info');

            order_price_info.innerHTML = `Сумма заказа: ${data.order_price}р`;
            delivery_price_info.innerHTML = `Сумма доставки: ${data.delivery_price}р`;
        })
    } 

}
