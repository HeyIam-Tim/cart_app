// валидирует ФИО
let validate_full_name = (value) => {
    if (value == '') {
        document.querySelector('#full_name').style.borderColor = 'red';
        return false;
    }

    document.querySelector('#full_name').style.borderColor = 'rgba(156, 163, 175)';
    return true;
}
// 


// валидирует Паспорт: серия номер
let validate_series_number = (value) => {
    if (value == '') {
        document.querySelector('#series_number').style.borderColor = 'red';
        return false;
    }

    else if (value.length != 11) {
        document.querySelector('#series_number').style.borderColor = 'red';
        return false;
    }

    document.querySelector('#series_number').style.borderColor = 'rgba(156, 163, 175)';
    return true;
}
// 


// валидирует Кем выдан
let validate_issuer = (value) => {
    if (value == '') {
        document.querySelector('#issuer').style.borderColor = 'red';
        return false;
    }

    document.querySelector('#issuer').style.borderColor = 'rgba(156, 163, 175)';
    return true;
}
// 


// валидирует Дата выдачи
let validate_date_of_issue = (value) => {
    if (value == '') {
        document.querySelector('#date_of_issue').style.borderColor = 'red';
        return false;
    }

    document.querySelector('#date_of_issue').style.borderColor = 'rgba(156, 163, 175)';
    return true;
}
// 


// добавляет паспорт API§§
let addPassportAPI = (full_name, series_number, issuer, date_of_issue) => {
    let url = `${window.location.origin}/api/v0/passport/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'full_name': full_name.value,
            'series_number': series_number.value,
            'issuer': issuer.value,
            'date_of_issue': date_of_issue.value,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        if (data[0]) {
            closePassportForm();
            renderPassportMessage(data[1]);

            window.is_passport = 'True';
        }
        else {
            document.querySelector('#passport_form_info').innerHTML = data[1];
        }
    })
}
// 


// добавляет паспорт
let addPassport = () => {
    let full_name = document.querySelector('#full_name');
    let is_valid_full_name = validate_full_name(full_name.value);

    let series_number = document.querySelector('#series_number');
    let is_valid_series_number = validate_series_number(series_number.value);

    let issuer = document.querySelector('#issuer');
    let is_valid_issuer = validate_issuer(issuer.value);

    let date_of_issue = document.querySelector('#date_of_issue');
    let is_valid_date_of_issue = validate_date_of_issue(date_of_issue.value);

    if (is_valid_full_name && is_valid_series_number && is_valid_issuer && is_valid_date_of_issue) {
        addPassportAPI(full_name, series_number, issuer, date_of_issue);
    }
}
//


// закрывает форму с паспортом
let closePassportForm = () => {
    document.querySelector('#pickup_form').style.display = 'none';
    document.querySelector('#overlay').style.display = 'none';
}
//


// выводит сообщение для паспорта
let renderPassportMessage = (message) => {
    document.querySelector('#cart_recipient_data_info').innerHTML = message;
    document.querySelector('#cart_recipient_data_info').style.color = 'green';
    setTimeout(function() {
        document.querySelector('#cart_recipient_data_info').innerHTML = '';
        document.querySelector('#cart_recipient_data_info').style.color = 'rgba(156, 163, 175)';
    }, 5000)
}
//


// закрывает форму с паспортом
let closePickUpForm = () => {
    window.location.href = window.location.origin + window.location.pathname;
}
//
