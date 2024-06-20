// Открывает попап с авторизациями
let openAuthenticationsPopup = () => {
    city_id = getCityID();
    if (city_id) {
        overlay.style.display = 'block';

        if (is_anonymous == 'True') {
            document.querySelector('#authenticationsPopup').style.display = 'block';
            window.location.href = window.location.origin + window.location.pathname + window.location.search + '#get_offers_btns';

            document.querySelector('#authenticateViaTelegramPopup').style.display = 'none';
        }
        if (is_anonymous == 'False') {
            document.querySelector('#get_offers_btns').style.display = 'block';
            window.location.href = window.location.origin + window.location.pathname + window.location.search + '#get_offers_btns';

            document.querySelector('#authenticateViaTelegramPopup').style.display = 'none';
        }
    }
}


// Открывает форму для телеграма
let openTelegramRequestForm = () => {
    document.querySelector('#get_offers_btns').style.display = 'none';
    document.querySelector('#telegram_popup').style.display = 'block';
}


// Отправляет предложения в телеграм
let sendDataTelegram = () => {
    city_id = localStorage.getItem('cityId');
    if (city_id == null){
        locationCityClick()
    }

    vin = document.querySelector('#vin_number');

    text_info = document.querySelector('#text_info');
    quantity = document.querySelector('#quantity');
    comment = document.querySelector('#comment');
    is_compatible = document.querySelector('#is_compatible');
    telegram_btn = document.querySelector('#telegram_btn');
    message_telegram_popup = document.querySelector('#message_telegram_popup');

    // проверка совместимости
    if (is_compatible.checked == true && vin.value == '' || vin.value == '---') {
        let v_number = document.querySelector('#vin_number');
        v_number.classList.remove('border-gray-400');
        v_number.classList.add('border-red-600');

        window.is_compatible_for_back = false;
    }

    if (is_compatible.checked == true && vin.value !== '' && vin.value !== '---') {
        let v_number = document.querySelector('#vin_number');
        v_number.classList.remove('border-red-600');
        v_number.classList.add('border-gray-400');

        window.is_compatible_for_back = true;
    }

    if (is_compatible.checked == false) {
        window.is_compatible_for_back = true;
    }

    vin_number = testTextOnVINNumber(vin.value);

    if (quantity.value == '') {
        quantity.classList.remove('border-gray-400');
        quantity.classList.add('border-red-600');
        quantity_info.innerHTML = '';
        quantity_info.innerHTML = 'поле не может быть пустым';
    }

    if (quantity.value !== '' && window.is_compatible_for_back == true) {
        // telegram_btn.onclick = '';
        // telegram_btn.classList.remove("bg-red-700");
        // telegram_btn.classList.add("bg-red-400");
        // telegram_btn.style.cursor = 'default';

        telegram_popup.style.display = 'none';
        message_telegram_popup.style.display = 'block';

        csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

        url = `${window.location.origin}/api/v0/offers-telegram/`;

        options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'product_name': product_name,
                'article': article,
                'brand': brand,
                'vin_number': `${(vin_number !== false) ? vin_number : ''}`,
                'quantity': quantity.value,
                'comment': comment.value,
                'is_compatible': is_compatible.checked,
                'model_carbrand': window.model_carbrand,
                'car_brand_id': window.car_brand_id,
                'city_id': city_id,
            })
        }
        fetch(url, options)
        .then(response => response.json())
        .then(data => {data})
    }

}


// ищет модель
let searchCarBrandCarModel = (element) => {
    let car_model_suggest_box = document.querySelector('#car_model_suggest_box');

    if (element.value.length >= 1) {
        let url = `${window.location.origin}/api/v0/search-carbrand-model/?text=${element.value}`;
        fetch(url)
        .then(resp => resp.json())
        .then(data => {
            if (data.model_suggests.length >= 1) {
                car_model_suggest_box.style.display = "block";
                car_model_suggest_box.innerHTML = "";
                for (const car_model of data.model_suggests) {
                    car_model_suggest_box.innerHTML += `<p id="" class="m-0 p-0.5 px-4 mx-1 text-left cursor-pointer" name="" data-car_brand_id="${car_model.car_brand_id}" onclick="grabCarModel(this)">${car_model.name} (${car_model.car_brand})</p>`
                }
            } else {
                car_model_suggest_box.style.display = "none";
                window.model_carbrand = element.value;
            }
        })
    }
    else {
        car_model_suggest_box.style.display = "none";
    }

}


// выбирает модель
let grabCarModel = (element) => {
    let car_model_suggest_box = document.querySelector('#car_model_suggest_box');

    let car_model_input = document.querySelector('#car_model_input');
    car_model_input.value = element.innerHTML;

    let car_brand_id = element.getAttribute("data-car_brand_id");
    window.car_brand_id = car_brand_id;

    window.model_carbrand = element.innerHTML;

    car_model_suggest_box.style.display = "none";
}


// закрывает попап с заявкой
let closeTelegramPopup = () => {
    let telegram_popup = document.querySelector('#telegram_popup');
    telegram_popup.style.display = "none";
    overlay.style.display = "none";
}


// закрывает попап с авторизацие через телеграм
let closeTelegramAuthentication = () => {
    let telegram_authentication = document.querySelector('#telegram_authentication');
    telegram_authentication.style.display = "none";
    overlay.style.display = "none";
    localStorage.removeItem('auth_type');
    localStorage.removeItem('redirect_after_auth_to');
}


// закрывает попап "Предложения будут отправлены в teleram"
let closeMessageTelegarmPopup = () => {
    let message_telegram_popup = document.querySelector('#message_telegram_popup');
    message_telegram_popup.style.display = "none";
    overlay.style.display = "none";
}


let searchVinNumber = (element) => {
    let user_id = element.getAttribute("data-user_id");
    let vin_number_text = element.value;
    let vin_numbers_box = document.querySelector('#vin_numbers_box');

    let url = `${window.location.origin}/api/v0/search-vin-number/?user_id=${user_id}&vin_number_text=${vin_number_text}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        vin_numbers_box.innerHTML = "";
        if (data.cars.length >= 1) {
            vin_numbers_box.style.display = "block";
            vin_numbers_box.innerHTML = "";
            for (const car of data.cars) {
                vin_numbers_box.innerHTML += `<p id="" class="m-0 p-0.5 px-4 mx-1 text-left cursor-pointer" name="" data-vin_number="${car[1]}" data-car_name="${car[0]}" onclick="grabVinNumber(this)">${car[1]} (${car[0]})</p>`;
            }
        } else {
            vin_numbers_box.style.display = "none";
        }
    })
}


// выбирает вин номер
let grabVinNumber = (element) => {
    let data_vin_number = element.getAttribute("data-vin_number");
    let vin_numbers_box = document.querySelector('#vin_numbers_box');
    let vin_number = document.querySelector('#vin_number');
    vin_number.value = data_vin_number;

    vin_numbers_box.style.display = "none";
}
