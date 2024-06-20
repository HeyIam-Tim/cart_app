const grayColor = 'rgba(156, 163, 175)';
const redColor = 'red';


// собирает cart_recipient_data объект
let buildCartRecipientDataObject = () => {
    let cart_recipient_data = {};
    cart_recipient_data.address_delivery = window.suggested_address;
    cart_recipient_data.recipient_name = document.querySelector('#cart_recipient_data_credentials').value;
    cart_recipient_data.phone = document.querySelector('#id_phone_number').value;
    cart_recipient_data.porch = document.querySelector('#cart_recipient_data_porch').value;
    cart_recipient_data.floor = document.querySelector('#cart_recipient_data_floor').value;
    cart_recipient_data.appartment = document.querySelector('#cart_recipient_data_appartment').value;
    cart_recipient_data.door_code = document.querySelector('#cart_recipient_data_door_code').value;

    cart_recipient_data.email = document.querySelector('#cart_recipient_data_email').value;

    cart_recipient_data.cart_recipient_id = window.cart_recipient_id;

    return cart_recipient_data;
}
//


// очищает инпуты с добавлением данных для получателя
let cleanCartRecipientDataForm = () => {
    let cart_recipient_inputs = document.querySelectorAll('.cart_recipient_input');
    for (let index = 0; index < cart_recipient_inputs.length; index++) {
        const element = cart_recipient_inputs[index];
        element.value = '';
        element.style.borderColor = grayColor;
    }
}


// закрывает форму с добавлением данных для получателя
let closeCartRecipientDataForm = () => {
    closeCartRecipientDataFormOnly();
    cleanCartRecipientDataForm();
    if (window.location.pathname == '/delivery-address/' && delivery_address == 'True') {
        tg.close()
    }
    else {
        window.location.href = window.location.href;
    }
}


// закрывает только форму с добавлением данных для получателя
let closeCartRecipientDataFormOnly = () => {
    document.querySelector('#cart_address_delivery_form').style.display = 'none';
    document.querySelector('#overlay').style.display = 'none';
}


// запрос на добавление данных для получателя
let sendDataForCartRecepientData = () => {
    let cart_recipient_data = buildCartRecipientDataObject();
    if (cart_recipient_data.recipient_name != '' && cart_recipient_data.phone != '' && cart_recipient_data.phone.length == 16 && window.suggested_address != undefined && window.email) {
        let url = `${window.location.origin}/cart/api/v0/recipient-data/`;
        let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    
        let options = {
            method: "POST",
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
            if (delivery_address == 'True') {
                tg.close()
            }
            else {
                window.location.href = window.location.href;
            }
        })
    }
}
//


// валидирует обязательные поля
let validRequiredFields = () => {
    let cart_recipient_requireds = document.querySelectorAll('.cart_recipient_required');
    for (let index = 0; index < cart_recipient_requireds.length; index++) {
        const element = cart_recipient_requireds[index];
        if (element.value == '') {
            element.style.borderColor = redColor
        }
        else {
            element.style.borderColor = grayColor;
        }

    }
}
//


// валидирует телефон
let validPhoneNumber = () => {
    if (document.querySelector('#id_phone_number').value.length != 16) {
        document.querySelector('#id_phone_number').style.borderColor = redColor;
    }
    else {
        document.querySelector('#id_phone_number').style.borderColor = grayColor;
    }
}
//


// валидирует адрес
let validAddress = () => {
    if (window.suggested_address == undefined) {
        document.querySelector('#address').style.borderColor = redColor;
        document.querySelector('#cart_form_info').innerHTML = 'Выберите адрес из подсказки';
    }
    else {
        document.querySelector('#address').style.borderColor = grayColor;
        document.querySelector('#cart_form_info').innerHTML = '';
    }
}
//


// валидирует емейл
let validateEmail = () => {
    let email = document.querySelector('#cart_recipient_data_email').value;
    let is_email = String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (is_email) {
        window.email = true;
        document.querySelector('#cart_form_info').innerHTML = '';
        document.querySelector('#cart_recipient_data_email').style.borderColor = grayColor;
    }
    else {
        window.email = false;
        document.querySelector('#cart_form_info').innerHTML = 'Неверный формат емейла';
        document.querySelector('#cart_recipient_data_email').style.borderColor = redColor;
    }
}
//


// валидирует инпуты для данных получателя
let validCartRecipientDataForm = () => {    
    validRequiredFields();
    validPhoneNumber();
    validAddress();
    validateEmail();
}
//


// кнопка "Добавить адрес"
let addCartRecipientData = () => {
    validCartRecipientDataForm();
    sendDataForCartRecepientData();
}
//


// открывает форму с добавлением данных для получателя
let showCartRecipientDataForm = () => {
    document.querySelector('#cart_address_delivery_form').style.display = 'block';
    document.querySelector('#overlay').style.display = 'block';
    
    if (document.querySelector('#delivery_addresses_popup')){
        document.querySelector('#delivery_addresses_popup').style.display = 'none';
    }
}
