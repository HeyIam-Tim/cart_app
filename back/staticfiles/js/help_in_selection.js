let help_in_selection_href = localStorage.getItem("help_in_selection_href");
if (help_in_selection_href != null && help_in_selection_href != '') {
    localStorage.removeItem('help_in_selection_href');
}


// шаблоный номер телефона
id_phone_number = document.querySelector('#id_phone_number');
phoneMask = IMask(id_phone_number, {mask: '+{7}(000)000-00-00'});


document.querySelector('#overlay').style.display = 'block';


// устанавливает ссылку для помощи в подборе
let setHelpInSelectionHref = () => {

    let href = `${window.location.origin}/help-in-selection/`
    localStorage.setItem("help_in_selection_href", href);

}


// ссылка для добавления автомобиля
let setAddCarLink = () => {
    document.querySelector('#vin_number_input_wrapper').style.display = 'none';
    document.querySelector('#add_car_link').style.display = 'block';
}


// получает VIN номера API
let getVinNumbersAPI = () => {
    let url = `${window.location.origin}/api/v0/vin-numbers-list/`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        if (data.length == 0) {
            window.vinNumbersList = [];
        }
        else {
            window.vinNumbersList = data;
            document.querySelector('#vin_number_input_wrapper').style.display = 'block';
        }
    })
}


// проверяет VIN номера в LS
let checkVinNumbersLocalStorage = () => {
    let vin_numbers_raw = localStorage.getItem("vin_numbers");

    if (vin_numbers_raw == null || vin_numbers_raw == '') {
        return [];
    }
    let vin_numbers = JSON.parse(vin_numbers_raw);
    return vin_numbers;
}


// валидирует VIN номер
let validateVinNumber = (vin_number_raw) => {
    if (vin_number_raw.length == 17) {
        return true;
    }

    document.querySelector('#vin_number_input').style.borderColor = 'red';
    document.querySelector('#help_in_selection_info').innerHTML += 'Введите корректный VIN номер; ';
    return false;
}


// валидирует Телефон
let validatePhone = (value) => {

    if (has_telegram_username == 'False' && has_phone == 'False') {

        if (value.length == 16) {
            return true;
        }

        document.querySelector('#id_phone_number').style.borderColor = 'red';
        document.querySelector('#help_in_selection_info').innerHTML += 'Введите корректный номер телефона; ';
    
        return false;
    }

    return true;

}


// валидирует Наименование детали
let validateProductName = (value) => {
    if (value.length > 0) {
        return true;
    }

    document.querySelector('#product_name_input').style.borderColor = 'red';
    document.querySelector('#help_in_selection_info').innerHTML += 'Наименование детали не может быть пустым; ';

    return false;
}


// отправляет данные для подбора на сервер API
let sendHelpInSelectionAPI = (helpInSelectonObj) => {
    offVinNumbersSuggests();

    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let url = `${window.location.origin}/api/v0/help-in-selection/`;
    
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'help_in_selecton': helpInSelectonObj,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        let message = data.status == 'success' ? 'Спасибо! <br> Ваша заявка успешно принята!' : 'Что-то пошло нитак';
        document.querySelector('#help_in_selection_message').innerHTML = message;

        setTimeout(() => {
            let href = localStorage.getItem('header_help_in_selection_href');
            window.location.href = href;
        }, 2000);
    })
}


// устанавливает серый цвет бортов
let setToGrayColor = () => {
    let requireds = document.querySelectorAll('.required');
    for (const required of requireds) {
        required.style.borderColor = 'rgba(209, 213, 219)';  // gray
    }
}


// отправляет данные для подбора на сервер
let sendHelpInSelectionData = () => {

    document.querySelector('#help_in_selection_info').innerHTML = '';

    setToGrayColor();

    // валидирует вин номер
    let vin_number_input = document.querySelector('#vin_number_input');
    let vin_number_value = vin_number_input.getAttribute('data-vin_number_cleaned');
    let is_vin_number = validateVinNumber(vin_number_value);
    if (is_vin_number) {
        setVinNumberLocalStorage(vin_number_value);
    }

    // валидирует телефон
    let phone_number_value = document.querySelector('#id_phone_number').value;
    let is_phone = validatePhone(phone_number_value);


    // валидирует Наименование детали
    let product_name_value = document.querySelector('#product_name_input').value;
    let is_product_name = validateProductName(product_name_value);

    if (is_vin_number == true && is_phone == true && is_product_name == true) {
        let helpInSelectonObj = {};
        helpInSelectonObj.vin_number = vin_number_value;
        helpInSelectonObj.phone = phone_number_value;
        helpInSelectonObj.product_name = product_name_value;

        helpInSelectonObj.comment = document.querySelector('#comment_input').value;
        helpInSelectonObj.criteria = document.querySelector('#criteria_input').value;

        helpInSelectonObj.has_telegram_username = has_telegram_username;
        helpInSelectonObj.has_phone = has_phone;

        sendHelpInSelectionAPI(helpInSelectonObj);
    }
}


// добавляет VIN номер в LS
let setVinNumberLocalStorage = (vin_number) => {

    let vin_number_obj = {}
    vin_number_obj.vin_number = vin_number.toUpperCase();
    vin_number_obj.car_name = '';
    
    let vinNumbersList = checkVinNumbersLocalStorage();

    vinNumbersList = vinNumbersList.filter(item => item.vin_number !== vin_number);

    let vin_numbers = [vin_number_obj, ...vinNumbersList];

    localStorage.setItem("vin_numbers", JSON.stringify(vin_numbers));
}


// ищет вин номер
let searchVinNumber = (element) => {
    let value = element.value;

    element.setAttribute('data-vin_number_cleaned', value);

    let vinNumbersList = window.vinNumbersList;

    vinNumbersList = vinNumbersList.filter(element => element.vin_number.toUpperCase().includes(value.toUpperCase()));

    renderVinNumbers(vinNumbersList);
}


// выводит вин номера
let renderVinNumbers = (vinNumbersList) => {

    if (vinNumbersList.length > 0) {

        let vin_numbers_suggests = document.querySelector('#vin_numbers_suggests');
        vin_numbers_suggests.innerHTML = '';
        vin_numbers_suggests.style.display = 'block';
    
        for(const vin_number_obj of vinNumbersList) {
    
            let car_name = ` (${vin_number_obj.car_name})`;
    
            let vin_number_html = `<li id="id_${vin_number_obj.vin_number}" class="w-full hover:bg-gray-300 rounded p-1.5 cursor-pointer" data-vin_number="${vin_number_obj.vin_number}" data-car_name="${vin_number_obj.car_name ? car_name : ''}" onclick="grabVinNumber(this)">${vin_number_obj.vin_number}${vin_number_obj.car_name ? car_name : ''}</li>`;
            vin_numbers_suggests.innerHTML += vin_number_html;
        }
    }
    else {
        offVinNumbersSuggests();
    }

}


// собирает уникальные подсказки
let getvinNumbersUnique = (vinNumbersList) => {

    let vinNumbersUniqueKeys = [];
    let vinNumbersUnique = [];

    for (const vin_number of vinNumbersList) {

        if (!vinNumbersUniqueKeys.includes(vin_number.vin_number)) {
            vinNumbersUniqueKeys.push(vin_number.vin_number);
            vinNumbersUnique.push(vin_number);
        }
    }

    return vinNumbersUnique;
}


// клик инпута для вин номеров
let clickVinNumbersInput = () => {

    let vinNumbersList = [];

    if (is_authenticated == 'True') {

        let vinNumbersListAPI = window.vinNumbersList;

        let vinNumbersListLocalStorage = checkVinNumbersLocalStorage();

        vinNumbersList = [...vinNumbersListAPI, ...vinNumbersListLocalStorage];

        let vinNumbersUnique = getvinNumbersUnique(vinNumbersList);

        vinNumbersList = vinNumbersUnique;
        window.vinNumbersList = vinNumbersUnique;

    }

    setTimeout(() => {
        vinNumbersList = window.vinNumbersList;

        renderVinNumbers(vinNumbersList);
    }, 250);

}


// выбирает вин номер из подсказки
let grabVinNumber = (element) => {
    let vin_number = element.getAttribute("data-vin_number");
    let car_name = element.getAttribute("data-car_name");

    document.querySelector('#vin_number_input').value = `${vin_number}${car_name}`;
    document.querySelector('#vin_number_input').setAttribute('data-vin_number_cleaned', vin_number);

    offVinNumbersSuggests();

}


// выключает подсказки с вин номерами
let offVinNumbersSuggests = () => {

    let vin_numbers_suggests = document.querySelector('#vin_numbers_suggests');
    vin_numbers_suggests.innerHTML = '';
    vin_numbers_suggests.style.display = 'none';

}


// выводит поля для помощи в подборе
let renderHelpInSelectionFields = () => {
    if (is_authenticated == 'True') {

        getVinNumbersAPI();

        setTimeout(() => {
            if (window.vinNumbersList.length == 0) {
                let vinNumbersListLocalStorage = checkVinNumbersLocalStorage();
    
                if (vinNumbersListLocalStorage.length > 0) {
                    document.querySelector('#vin_number_input_wrapper').style.display = 'block';
                    window.vinNumbersList = vinNumbersListLocalStorage;
                }
                else {
                    setAddCarLink();
                    window.vinNumbersList = [];
                }
            }
        }, 250);

        if (has_telegram_username == 'False' && has_phone == 'False') {
            document.querySelector('#phone_wrapper').style.display = 'block';
        }
    }
    else if (is_authenticated == 'False') {
        document.querySelector('#vin_number_input_wrapper').style.display = 'block';

        let vinNumbersList = checkVinNumbersLocalStorage();
        window.vinNumbersList = vinNumbersList;

        document.querySelector('#phone_wrapper').style.display = 'block';
    }

};


// закрывает форму
let closeHelpInSelection = () => {
    let href = localStorage.getItem('header_help_in_selection_href');
    window.location.href = href;
}


setTimeout(() => {
    renderHelpInSelectionFields();
}, 250);
