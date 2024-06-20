// открывает попап с адресами доставки
let openDeliveryAddressesPopup = () => {
    document.querySelector('#delivery_addresses_popup').style.display = 'block';
    document.querySelector('#overlay').style.display = 'block';
}
// 


// апи для работы с сartRecipient
let handleCartRecipientAPI = (method, cart_recipient_data) => {
    let url = `${window.location.origin}/cart/api/v0/recipient-data/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'cart_recipient_data': cart_recipient_data,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        window.location.href = window.location.href;
    })
}
//


// собирает данные для сartRecipient
let buildCartRecipientData = (element) => {
    let cartRecipientData = {};
    cartRecipientData.cart_recipient_id = element.getAttribute("data-cart_recipient_id");

    return cartRecipientData;
}
// 


// работает с сartRecipient
let handleCartRecipient = (element) => {
    let method = element.getAttribute("data-method");

    if (method == 'post') {
        document.querySelector('#delivery_addresses_popup').style.display = 'none';
        document.querySelector('#cart_address_delivery_form').style.display = 'block';

        window.cart_recipient_id = element.getAttribute("data-cart_recipient_id");
        document.querySelector('#address').value = element.getAttribute("data-address_delivery");
        document.querySelector('#cart_recipient_data_porch').value = element.getAttribute("data-porch");
        document.querySelector('#cart_recipient_data_floor').value = element.getAttribute("data-floor");
        document.querySelector('#cart_recipient_data_appartment').value = element.getAttribute("data-appartment");
        document.querySelector('#cart_recipient_data_door_code').value = element.getAttribute("data-door_code");
        document.querySelector('#cart_recipient_data_credentials').value = element.getAttribute("data-recipient_name");
        document.querySelector('#id_phone_number').value = element.getAttribute("data-phone");
        document.querySelector('#cart_recipient_data_email').value = element.getAttribute("data-email");
    }
    else {
        let cart_recipient_data = buildCartRecipientData(element);
        handleCartRecipientAPI(method, cart_recipient_data);
    }
}
//


// Устанавливает Итого
let checkIsPassport = () => {
    if (window.is_passport == 'False') {

        if (window.all_express_checked || window.all_express_checked == undefined) {
            return true;
        }

        document.querySelector('#pickup_form').style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('#passport_form_info').innerHTML = 'Заполните данные для доверенности или выберите другой способ доставки';

        window.location.href = window.location.origin + window.location.pathname + '#pickup_form';

        return false
    }
    return true;
}


// оформялет заказ
let CreateOrder = () => {
    if (window.quantityReady || window.quantityReady == undefined) {
        let url = `${window.location.origin}/cart/api/v0/create-order/`;
        let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'valid_shop_names': Array.from(window.valid_shop_names),
                'web_shop_handler': window.web_shop_handler,
                'shop_handler': window.shop_handler,
                // 'delivery_point_uuid': delivery_point_uuid,  # вход для фронтовика
            })
        }

        let is_passport_checked = checkIsPassport();

        if (favorite_address == 'True' && is_passport_checked || favorite_address == 'True' && window.all_express_checked || favorite_address == 'True' && window.all_express_checked == undefined) {
            fetch(url, options)
            .then(response => response.json())
            .then(data => {
                // window.location.href = `${window.location.origin}/profile/user/cart/orders/`;
                window.location.href = `${window.location.origin}/profile/user/cart/confirm-payment/?order_id=${data.data.order_id}`;
            })
        }
    }
}
//


// Устанавливает Итого
let setTotalCostsForOrder = (data) => {
    document.querySelector('#cart_items_quantity_info').innerHTML = `<span class="stem-light">Выбрано: </span>${data.cost_info.cart_items_count_all_valid} позиции (${data.cost_info.cart_items_number_all_valid} шт)<br class="block sm:hidden"><span class="stem-light"> на сумму:</span>`;
    document.querySelector('#total_cost_for_shop_all_valid').innerHTML = `${data.cost_info.total_cost_for_shop_all_valid} Р`;

    window.total_cost_for_shop_all_valid = data.cost_info.total_cost_for_shop_all_valid;

    renderMainTotal();
}


// собирает индексы с валидными магазинами
window.valid_shop_ids = new Set();
let setValidShopIds = (shop_index, delivery_price, type_id) => {
    if (delivery_price != 'Неверный адрес') {
        window.valid_shop_ids.add(`${type_id}${shop_index}`);
    }
}


// собирает наименования с валидными магазинами
window.valid_shop_names = new Array();
let setValidShopNames = () => {
    for (const iterator of window.valid_shop_ids) {
        
        let element = document.querySelector(`#${iterator}`);
        
        let shop_name = element.getAttribute('data-shop_name');
        if (shop_name == null) {
            shop_name = element.getAttribute('data-web_shop_name');
        }

        let delivery_to_datetime = element.getAttribute('data-delivery_to_datetime');
        let delivery_type = element.getAttribute('data-delivery_type');

        let delivery_cost = element.getAttribute('data-delivery_cost');
        if (delivery_cost) {
            delivery_cost = delivery_cost.split(' ')[0];
        }
        else {
            delivery_cost = 0;
            delivery_type = 0;
        }

        window.valid_shop_names.push(`${shop_name}---${delivery_cost}---${delivery_to_datetime}---${delivery_type}`);
    }

}


// убирает дублируемую цену для доставки
let removeDeliveryPrice = (shop_name, delivery_cost, delivery_to_datetime, delivery_type) => {
    window.valid_shop_names = window.valid_shop_names.filter(item => !item.startsWith(`${shop_name}`));
    window.valid_shop_names.push(`${shop_name}---${delivery_cost}---${delivery_to_datetime}---${delivery_type}`);
}


// выбор типа доставки
let chooseDeliveryType = (element) => {
    let delivery_cost = element.getAttribute('data-delivery_cost');

    let shop_name = element.getAttribute('data-shop_name');
    if (shop_name == null) {
        shop_name = element.getAttribute('data-web_shop_name');
    }

    let delivery_to_datetime = element.getAttribute('data-delivery_to_datetime');
    let delivery_type = element.getAttribute('data-delivery_type');

    let one_delivery_types = document.querySelectorAll('.one_delivery_type');

    let delivery_types_length_valid = 0;
    let delivery_types_count_checked = 0;

    let total_delivery_cost_chosen = 0;
    for (let index = 0; index < one_delivery_types.length; index++) {
        const element = one_delivery_types[index];
        if (element.checked == true) {
            let delivery_cost = element.getAttribute('data-delivery_cost');
            total_delivery_cost_chosen += parseFloat(delivery_cost);

            delivery_types_count_checked++;

            if (element.value == 'express') {
                delivery_types_length_valid++;
            }
        }

    }

    if (delivery_types_length_valid == delivery_types_count_checked) {
        window.all_express_checked = true;
    }
    else {
        window.all_express_checked = false;
    }

    renderMainTotal(total_delivery_cost_chosen);
    renderDeliveryPriceFull(total_delivery_cost_chosen);

    removeDeliveryPrice(shop_name, delivery_cost, delivery_to_datetime, delivery_type);

    if (delivery_type == '3') {
        choosePickupType();
    }
}


// выбор типа доставки === "Самовывоз"
let choosePickupType = (element) => {
    if (window.is_passport != 'True') {
        document.querySelector('#pickup_form').style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('#passport_form_info').innerHTML = '';

        window.location.href = window.location.origin + window.location.pathname + '#pickup_form';
    }
}


// суммирует стоимости express доставок 
let sumExpressDelivery = (delivery_type, shop_index, type_id) => {
    if (delivery_type.description == 'express') {
        window.total_delivery_cost += parseFloat(delivery_type.price);

        document.querySelector(`#${type_id}${shop_index}`).setAttribute("data-delivery_cost", `${delivery_type.price} P`);
        document.querySelector(`#${type_id}${shop_index}`).setAttribute("data-delivery_to_datetime", `${delivery_type.delivery_to_datetime}`);
        document.querySelector(`#${type_id}${shop_index}`).setAttribute("data-delivery_type", `${delivery_type.delivery_type.split('---')[1]}`);

    }
}


// выводит полную стоимость заказа с доставкой
let renderMainTotal = (total_delivery_cost_chosen) => {
    if (total_delivery_cost_chosen) {
        window.total_order_cost = parseFloat(window.total_cost_for_shop_all_valid) + parseFloat(total_delivery_cost_chosen);
    }

    else if (total_delivery_cost_chosen == 0) {
        window.total_order_cost = parseFloat(window.total_cost_for_shop_all_valid);
    }

    else {
        window.total_order_cost = parseFloat(window.total_cost_for_shop_all_valid) + parseFloat(window.total_delivery_cost);
    }

    window.total_order_cost += parseFloat(service_fee);

    document.querySelector('#main_total').innerHTML = `${window.total_order_cost.toFixed(2)} Р`;
}


// выводит полную стоимость доставки
let renderDeliveryPriceFull = (total_delivery_cost_chosen) => {
    if (total_delivery_cost_chosen) {
        document.querySelector('#delivery_price_full').innerHTML = `${total_delivery_cost_chosen.toFixed(2)} P`;
        document.querySelector('#delivery_price_time_expired').innerHTML = '(цена актуальна в <br class="sm:hidden"> течение 4 часов)';

    }

    else if (total_delivery_cost_chosen == 0) {
        document.querySelector('#delivery_price_full').innerHTML = `0 P`;
        document.querySelector('#delivery_price_time_expired').innerHTML = '';
    }

    else {
        document.querySelector('#delivery_price_full').innerHTML = `${window.total_delivery_cost.toFixed(2)} Р`;
        document.querySelector('#delivery_price_time_expired').innerHTML = '(цена актуальна в <br class="sm:hidden"> течение 4 часов)';
    }
}


// выводит типы доставок
let renderDeliveryTypes = (shop_index, shop_price, shop_name) => {
    let id_delivery_type = document.querySelector(`#id_delivery_type${shop_index}`);
    if (shop_price.delivery_types) {
        for (const delivery_type of shop_price.delivery_types) {
            // let onchange = delivery_type.description == 'pickup' ? "choosePickupType(this)" : "chooseDeliveryType(this)";
            let onchange = "chooseDeliveryType(this)";
    
            let price_radio = `
            <input type="radio" name="delivery_cost_arrival_${shop_index}" id="delivery_cost_arrival_${shop_index}" value="${delivery_type.description}" class="one_delivery_type"
    
            ${(delivery_type.description == 'express') ? 'checked' : ''}
    
            data-delivery_cost="${delivery_type.price}"
            data-shop_name="${shop_name}"
            data-delivery_to_datetime="${delivery_type.delivery_to_datetime}"
            data-delivery_type="${delivery_type.delivery_type.split('---')[1]}"
    
            onchange=${onchange}>`;
    
            // ошибка в адресе
            if (delivery_type.errors) {
                let delivery_type_HTML = `
                <p class="">
                    <span class="block mr-3 sm:mr-1"><span class="stem-light text-red-500 text-xs">${delivery_type.errors.message}</span></span>
                    <span class="mr-3 sm:mr-1"><span class="stem-light text-red-500 text-xs">${delivery_type.errors.message2}: </span><span class="stem-medium">${delivery_type.price} P</span></span>
    
                    ${price_radio}
    
                </p>`;
                id_delivery_type.innerHTML += delivery_type_HTML;
            }
            else {
                // выводит информацию для доставки
                let price_delivery = delivery_type.is_pickup ? '' : `<span class="stem-medium">${delivery_type.price} P</span>`;
    
                let delivery_info_inner_text = `<span class="">${delivery_type.delivery_type.split('---')[0]}: </span>${price_delivery}`;
    
                let delivery_type_HTML = `
                <p class="flex" style="justify-content: flex-end;">
                    <span class="mr-3 sm:mr-1">${delivery_info_inner_text}</span>
    
                    ${price_radio}
    
                </p>`;
                id_delivery_type.innerHTML += delivery_type_HTML;
    
            }
        
            sumExpressDelivery(delivery_type, shop_index, 'id_shop');
        }
    }

    renderDeliveryPriceFull();

}


// устанавливает информацию о стоимости
window.total_delivery_cost = 0;
let setCostInfo = (data) => {

    window.web_shop_handler = false;
    window.shop_handler = false;

    if (data.cost_info.cost_for_web_shops.length == 0) {
        window.shop_handler = true;
    }
    else {
        window.web_shop_handler = true;
    }

    for (const shop_price of data.cost_info.cost_for_shops) {
        let shop_index = shop_price.shop_prices.split('---')[0];
        let delivery_price = shop_price.shop_prices.split('---')[1];
        let cost_for_shop = shop_price.shop_prices.split('---')[2];
        let shop_name = shop_price.shop_prices.split('---')[3];

        document.querySelector(`#id_cost_for_shop${shop_index}`).innerHTML = `<span class="stem-medium">${cost_for_shop} P</span>`;

        renderDeliveryTypes(shop_index, shop_price, shop_name);

        if (data.cost_info.cost_for_web_shops.length == 0) {
            setValidShopIds(shop_index, delivery_price, 'id_shop');
        }

    }
    setCostInfoForWebShops(data);

    setTotalCostsForOrder(data);

    setValidShopNames();

}


// устанавливает типы доставок для интернет магазинов
let setDeliveryTypesForWebShops = (web_shop_info) => {
    let web_shop_index = web_shop_info.web_shop_index;
    let web_shop_site = web_shop_info.web_shop_site;
    
    let id_delivery_type_web_shop = document.querySelector(`#id_delivery_type_web_shop${web_shop_index}`);

    for (const delivery_type of web_shop_info.delivery_types) {

        // let onchange = delivery_type.description == 'pickup' ? "choosePickupType(this)" : "chooseDeliveryType(this)";
        let onchange = "chooseDeliveryType(this)";

        let price_radio = `
        <input type="radio" name="delivery_cost_arrival_${web_shop_index}" id="delivery_cost_arrival_${web_shop_index}" value="${delivery_type.description}" class="one_delivery_type"

        ${(delivery_type.description == 'express') ? 'checked' : ''}

        data-delivery_cost="${delivery_type.price}"
        data-web_shop_name="${web_shop_site}"
        data-delivery_to_datetime="${delivery_type.delivery_to_datetime}"
        data-delivery_type="${delivery_type.delivery_type.split('---')[1]}"

        onchange=${onchange}>`;

        // ошибка в адресе
        if (delivery_type.errors) {
            let delivery_type_HTML = `
            <p class="">
                <span class="block mr-3 sm:mr-1"><span class="stem-light text-red-500 text-xs">${delivery_type.errors.message}</span></span>
                <span class="mr-3 sm:mr-1"><span class="stem-light text-red-500 text-xs">${delivery_type.errors.message2}: </span><span class="stem-medium">${delivery_type.price} P</span></span>

                ${price_radio}

            </p>`;
            id_delivery_type_web_shop.innerHTML += delivery_type_HTML;
        }
        else {
            // выводит информацию для доставки
            let price_delivery = delivery_type.is_pickup ? '' : `<span class="stem-medium">${delivery_type.price} P</span>`;

            let delivery_info_inner_text = `<span class="">${delivery_type.delivery_type.split('---')[0]}: </span>${price_delivery}`;

            let delivery_type_HTML = `
            <p class="flex" style="justify-content: flex-end;">
                <span class="mr-3 sm:mr-1">${delivery_info_inner_text}</span>

                ${price_radio}

            </p>`;
            id_delivery_type_web_shop.innerHTML += delivery_type_HTML;

        }
    
        sumExpressDelivery(delivery_type, web_shop_index, 'id_web_shop');

        if (delivery_type.description == 'express') {
            setValidShopIds(web_shop_index, delivery_type.price, 'id_web_shop');

        }

    }

    renderDeliveryPriceFull();

}
// 


// устанавливает цены для интернет магазинов
let setCostInfoForWebShops = (data) => {
    for (const web_shop_info of data.cost_info.cost_for_web_shops) {
        setDeliveryTypesForWebShops(web_shop_info);
    }
}
// 


// получает информацию о стоимости
let getCostInfo = () => {
    let url = `${window.location.origin}/cart/api/v0/get-cost-info/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'shop_names': Array.from(window.shop_name_list),
            'web_shop_names': Array.from(window.web_shop_name_list),
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        if (Object.keys(data.cost_info).length > 0) {
            setCostInfo(data);
        }
    })
}
//


// устанавливает id для стоимость доставки для магазина
let setIdsForDeliveryForShop = () => {
    window.shop_name_list = new Set();
    let shop_names = document.querySelectorAll('.shop_name');
    for (let index = 0; index < shop_names.length; index++) {
        const element = shop_names[index];
        let shop_name = element.getAttribute('data-shop_name');
        element.id = `id_shop${index}`;

        let shop_data = {};
        shop_data.shop_name = shop_name;
        shop_data.index = index;

        window.shop_name_list.add(shop_data);
    }
}
//


// устанавливает id для стоимость доставки для интернет магазинов
let setIdsForDeliveryForWebShop = () => {
    window.web_shop_name_list = new Set();
    let web_shop_names = document.querySelectorAll('.web_shop_name');
    for (let index = 0; index < web_shop_names.length; index++) {
        const element = web_shop_names[index];
        let web_shop_name = element.getAttribute('data-web_shop_name');
        element.id = `id_web_shop${index}`;

        let web_shop_data = {};
        web_shop_data.web_shop_name = web_shop_name;
        web_shop_data.index = index;

        window.web_shop_name_list.add(web_shop_data);
    }
}
//


// устанавливает id для магазинов
let setIdsForOneShopCartItem = () => {
    let one_shop_cart_items = document.querySelectorAll('.one_shop_cart_item');
    for (let index = 0; index < one_shop_cart_items.length; index++) {
        const element = one_shop_cart_items[index];
        element.id = `id_one_shop_cart_item${index}`;
    }
}
//


// устанавливает id для стоимости товаров для магазина
let setIdsForTotalCostForShop = () => {
    let cost_for_shops = document.querySelectorAll('.cost_for_shop');
    for (let index = 0; index < cost_for_shops.length; index++) {
        const cost_for_shop = cost_for_shops[index];
        cost_for_shop.id = `id_cost_for_shop${index}`;
    }
}
//


// устанавливает id для полос под магазинами
let setIdsForShopUnderline = () => {
    let shop_underlines = document.querySelectorAll('.shop_underline');
    for (let index = 0; index < shop_underlines.length; index++) {
        const shop_underline = shop_underlines[index];
        shop_underline.id = `id_shop_underline${index}`;
    }
}


// устанавливает id для overlay магазинов
let setIdsForShopOverlay = () => {
    let shop_overlays = document.querySelectorAll('.shop_overlay');
    for (let index = 0; index < shop_overlays.length; index++) {
        const shop_overlay = shop_overlays[index];
        shop_overlay.id = `id_shop_overlay${index}`;
    }
}


// устанавливает id для типов доставки
let setIdsForDeliveryTypes = () => {
    let delivery_types = document.querySelectorAll('.delivery_types');
    for (let index = 0; index < delivery_types.length; index++) {
        const delivery_type = delivery_types[index];
        delivery_type.id = `id_delivery_type${index}`;
    }
}


// устанавливает id для типов доставки для интернет магазинов
let setIdsForDeliveryTypesForWebShops = () => {
    let delivery_types = document.querySelectorAll('.web_shop_delivery_types');
    for (let index = 0; index < delivery_types.length; index++) {
        const delivery_type = delivery_types[index];
        delivery_type.id = `id_delivery_type_web_shop${index}`;
    }
}


// устанавливает id для элементов для вывода информации
let setIds = () => {
    setIdsForDeliveryForShop();
    setIdsForDeliveryForWebShop();
    setIdsForTotalCostForShop();
    setIdsForShopUnderline();
    setIdsForOneShopCartItem();
    setIdsForShopOverlay();

    setIdsForDeliveryTypes();
    setIdsForDeliveryTypesForWebShops();

    getCostInfo();
}
// 

setIds();


// проверяет рабочее ли сейчас время | API
let checkWorkingHoursAPI = (city_id) => {
    let url = `${window.location.origin}/cart/api/v0/check-working-hours/?city_id=${city_id}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (!data.is_working_day) {
            setCreateOrderInActive();
            document.querySelector('#working_hours_info').style.display = 'block';
        }
    })
}


// проверяет рабочее ли сейчас время
let checkWorkingHours = () => {
    let city_id = localStorage.getItem('cityId')
    if (city_id == null){
        overlay.style.display = 'block'
        cities_popup.style.display = 'block'
        getRegions()
    } else {
        checkWorkingHoursAPI(city_id)
    }
}


// setTimeout(function() {
//     checkWorkingHours();
// }, 1000);


let setCreateOrderInActive = () => {
    let create_order_btn = document.querySelector('#create_order_btn');
    create_order_btn.removeAttribute("onclick");
    create_order_btn.style.opacity = "0.5";
}
