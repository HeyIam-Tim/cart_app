let overlay = document.querySelector('#overlay')
let close_icon = document.querySelector('#close-icon')
let close_icon_r = document.querySelector('#close-icon-r')
let cities_popup = document.querySelector('#cities_popup')
let search_city = document.querySelector('#search_city')
let city_header = document.querySelector('#city_header')
let city_header_m = document.querySelector('#city_header_m')
let search_product_input = document.querySelector('#search_product_input')
let list_city = document.querySelector('#city_list')
let cc_area = document.querySelector('#cc_area')
let autocomplete_p = document.querySelectorAll('#autocomplete')[0]
let autocomplete = document.querySelectorAll('#autocomplete')[1]
let shop_success = document.querySelector('#shop_success');
let search_inf = document.querySelector('#search_inf')
let search_pw = document.querySelector('#search_pw')
let result_table = document.querySelector('#result_table')
let region_list = document.querySelector('#region_list')
let search_submit = document.querySelector('#search_submit')
let autocomplete_list = document.querySelector('#autocomplete-result-list-2')
let errorlist = document.querySelectorAll('.errorlist')[0]
let input_prods = document.querySelector('#input_prod')

// show password
let show_pass1 = document.querySelector('#show_pass1')
let show_pass2 = document.querySelector('#show_pass2')
let show_passL = document.querySelector('#show_passL')
let id_password1 = document.querySelector('#id_password1')
let id_password2 = document.querySelector('#id_password2')
let id_password = document.querySelector('#id_password')
let xclose = document.querySelector('#x-close')

let table = document.querySelector('table')
let text_offers = document.querySelector('#text-offers')
let gif_spin = document.querySelector('#gif_spin')


// отрабатывает на клик главного контейнера (закрывает все попапы)
let mainContainerClick = (element) => {
    let close_on_click_main_containers = document.querySelectorAll('.close_on_click_main_container');
    for (let index = 0; index < close_on_click_main_containers.length; index++) {
        const item = close_on_click_main_containers[index];
        item.style.display = 'none';
    }
}


// отображает/убирает корзину в хедере и футоре
let setCartOrderCountDisplayedParents = (cart_items_count) => {
    let cart_order_count_displayed_parents = document.querySelectorAll('.cart_order_count_displayed_parent');
    for (let index = 0; index < cart_order_count_displayed_parents.length; index++) {
        const cart_order_count_displayed_parent = cart_order_count_displayed_parents[index];
        if (parseInt(cart_items_count) > 0) {
            cart_order_count_displayed_parent.style.display = 'inline-block'
        }
        else if (parseInt(cart_items_count) == 0) {
            cart_order_count_displayed_parent.style.display = 'none'
        };
    }

    let cart_order_count_displayeds = document.querySelectorAll('.cart_order_count_displayed');
    for (let index = 0; index < cart_order_count_displayeds.length; index++) {
        const cart_order_count = cart_order_count_displayeds[index];
        cart_order_count.innerHTML = cart_items_count;
    }

}

setTimeout(function() {
    if (isAnonymous == 'False') {
        setCartOrderCountDisplayedParents(cart_items_count);
    }
}, 200)


// получает Cookie для списка с позициями корзины
let getCartItemsListCookie = (cookie_name) => {
    let cookie = {};
    document.cookie.split('; ').forEach(function(el) {
      let key = el.split('==')[0];
      let value = el.split('==')[1];
      cookie[key.trim()] = value;
    })
    return cookie[cookie_name];
}


// удаляет Cookie для списка с позициями корзины
let removeCartItemsCookie = (cookie_name) => {
    document.cookie = `${cookie_name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    return
}

// подсчитывает количество(шт) позиций в куках
let countCartItemsQuantityInCookie = () => {
    let cartItemsListCookie = getCartItemsListCookie('cart_items_list');

    if (cartItemsListCookie) {
        let input_values_count = 0;

        let cartItemsList = JSON.parse(cartItemsListCookie);
        for (let index = 0; index < cartItemsList.length; index++) {
            const cart_item = cartItemsList[index];
            if (cart_item) {
                input_values_count += parseInt(cart_item.cart_item_quantity);
            }
        }

        return input_values_count;
    }
}

if (isAnonymous == 'True') {
    let input_values_count = countCartItemsQuantityInCookie();

    if (input_values_count) {
        setCartOrderCountDisplayedParents(input_values_count);
    }
}


// error list
if (errorlist) {
    for (let i = 0; i < errorlist.children.length; i++) {
        const element = errorlist.children[i];
        element.childNodes[0].remove()
    }
}


// timeouts for events
if (shop_success) {
    setTimeout(function() {
        shop_success.style.display = 'none';
    }, 4000);
}



// get a city location from localSrorage
let city_location = localStorage.getItem('city_location')


// get a cityId from localSrorage
let cityId = localStorage.getItem('cityId')


// set a city location into header from localSrorage
if (city_header) {
    if (city_location == null) {
        city_header.innerHTML = ''
        city_header.innerHTML = 'Выбрать город'
    } else {
        city_header.innerHTML = ''
        city_header.innerHTML = city_location
    }
}


// set a city location into header from localSrorage mobile vervion
if (city_header_m) {
    if (city_location == null) {
        city_header_m.innerHTML = ''
        city_header_m.innerHTML = 'Выбрать город'
    } else {
        city_header_m.innerHTML = ''
        city_header_m.innerHTML = city_location
    }
}


// on location city click
let locationCityClick = () => {
    if (window.location.pathname == '/products/') {
        web_products.style.height = '700px';
        web_products.style.zIndex = 'auto';
    }
    overlay.style.display = 'block'
    cities_popup.style.display = 'block'
    getRegions()
}

function closeSlideMenu(){
    document.getElementById('side-menu').style.width = '0';
}
// on location city click mobile version
let locationCityClickM = () => {
    if (window.location.pathname == '/products/') {
        web_products.style.height = '700px';
        web_products.style.zIndex = 'auto';
    }
    closeSlideMenu()
    overlay.style.display = 'block'
    cities_popup.style.display = 'block'
    getRegions()
}


// set localStorage with a given city and id
let setCityLocation = (cityId, city) => {
    localStorage.setItem('city_location', city)
    localStorage.setItem('cityId', cityId)
}


// устанавливает город по умолчанию
let setDefaultCity = () => {

    let city_id = localStorage.getItem('cityId');
    if (city_id == null) {
        let default_city_id = window.location.protocol == 'http:' ? 13569 : 5787;
        let default_city_name = 'Оренбург';
    
        setCityLocation(default_city_id, default_city_name);
        document.querySelector('#city_header').innerHTML = default_city_name;
    }
}

setDefaultCity();


// закрывает попап
let closePopup = (element) => {
    element.parentElement.style.display = 'none';
    overlay.style.display = 'none';

    if (window.location.pathname == '/profile/user/cart/confirm-payment/') {
        window.location.href = `${window.location.origin}/profile/user/cart/`;
    }
}


if (overlay) {
    // close form on overlay click
    overlay.addEventListener('click', function(e){
        overlay.style.display = 'none';

        if (window.location.pathname == '/profile/info-business-account/'){
            closeFormBA();
        }

        // закрывает попап с городами
        let cities_popup = document.querySelector('#cities_popup');
        if (cities_popup) {
            cities_popup.style.display = 'none'
            search_city.value = ''
            cc_area.style.opacity = '1'
            region_list.innerHTML = ''
            list_city.innerHTML = ''

            input_cities = document.querySelector('#input_cities');
            if (input_cities) {
                input_cities.style.display = 'none';
            }
        }

        let message_popup = document.querySelector('#message_popup');
        if (message_popup) {
            message_popup.style.display = 'none';
        }

        let message_telegram_popup = document.querySelector('#message_telegram_popup');
        if (message_telegram_popup) {
            message_telegram_popup.style.display = 'none';

        }

        // закрывает попап с авторизацией через телеграм
        let telegram_authentication = document.querySelector('#telegram_authentication');
        if (telegram_authentication) {
            telegram_authentication.style.display = 'none';
            localStorage.removeItem('auth_type');
            localStorage.removeItem('redirect_after_auth_to');        
        }

        let popup_enter_email = document.querySelector('#popup_enter_email');
        if (popup_enter_email) {
            popup_enter_email.style.display = 'none';

        }

        let popup_confirm_email = document.querySelector('#popup_confirm_email');
        if (popup_confirm_email) {
            popup_confirm_email.style.display = 'none';

        }

        let lp_edit_popup = document.querySelector('#lp_edit_popup');
        if (lp_edit_popup) {
            lp_edit_popup.style.display = 'none';

        }

        // Закрывает попап/плажку с подтверждением отправки предложений на емейл
        let confirm_sending_offers_to_email = document.querySelector('#confirm_sending_offers_to_email');
        if (confirm_sending_offers_to_email) {
            confirm_sending_offers_to_email.style.display = 'none';
        }

        // Закрывает форму с доставкой
        let delivery_form = document.querySelector('#delivery_form');
        if (delivery_form) {
            closeDeliveryForm();
        }

        // Закрывает попап для информации магазина
        let shop_info_popup = document.querySelector('#shop_info_popup');
        if (shop_info_popup) {
            shop_info_popup.style.display = 'none';
        }

        // Закрывает попап для telegram
        let telegram_popup = document.querySelector('#telegram_popup');
        if (telegram_popup) {
            telegram_popup.style.display = 'none';
        }

        // Закрывает попап login
        let login_popup = document.querySelector('#login_popup');
        if (login_popup) {
            window.location.href = '/';
        }

        // Закрывает попап register
        let register_popup = document.querySelector('#register_popup');
        if (register_popup) {
            window.location.href = '/';
        }

        // Закрывает попап reset password
        let reset_password = document.querySelector('#reset_password');
        if (reset_password) {
            window.location.href = '/profile/login/';
        }

        // Закрывает попап подтверждения удаления товара/ов
        let delete_confirmation = document.querySelector('#delete_confirmation');
        if (delete_confirmation) {
            delete_confirmation.style.display = 'none';
        }

        // Закрывает попап редактирования товара
        let product_form = document.querySelector('#product_form');
        if (product_form) {
            product_form.style.display = 'none';
        }

        // Закрывает форму с добавлением адреса доставки
        let cart_address_delivery_form = document.querySelector('#cart_address_delivery_form');
        if (cart_address_delivery_form) {
            cart_address_delivery_form.style.display = 'none';
            closeCartRecipientDataForm();
        }

        // Закрывает форму с комментарием для позиции в корзине
        let cart_item_comment_form = document.querySelector('#cart_item_comment_form');
        if (cart_item_comment_form) {
            cart_item_comment_form.style.display = 'none';
        }
        // Закрывает форму с удалением для позиции в корзине
        let cart_delete_popup = document.querySelector('#cart_delete_popup');
        if (cart_delete_popup) {
            cart_delete_popup.style.display = 'none';
        }

        // Закрывает форму с удалением интернет магазина
        let delete_web_shop_popup = document.querySelector('#delete_web_shop_popup');
        if (delete_web_shop_popup) {
            delete_web_shop_popup.style.display = 'none';
        }

        let close_popups = document.querySelectorAll('.close_popup');
        for (let index = 0; index < close_popups.length; index++) {
            const close_popup = close_popups[index];
            close_popup.style.display = 'none';
        }

        let help_in_selection_form = document.querySelector('#help_in_selection_form');
        if (help_in_selection_form) {
            let href = localStorage.getItem('header_help_in_selection_href');
            window.location.href = href;
        }
    })
}


if (close_icon) {
    // close form on X icon on login
    close_icon.addEventListener('click', function(){
        let pathname = window.location.pathname;
        if (pathname == '/profile/login/' || pathname == '/profile/register/'){
            window.location.href = '/'
        } else {
            login_popup.style.display = 'none'
            register_popup.style.display = 'none'
            overlay.style.display = 'none'

        }

    })
}

if (close_icon_r) {
    // close form on X icon on register
    close_icon_r.addEventListener('click', function(){
        let pathname = window.location.pathname;
        if (pathname == '/profile/login/' || pathname == '/profile/register/'){
            window.location.href = '/'
        } else {
            login_popup.style.display = 'none'
            register_popup.style.display = 'none'
            overlay.style.display = 'none'

        }
    })
}


// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        overlay.style.display = 'none'

        // закрывает попап с городами
        let cities_popup = document.querySelector('#cities_popup');
        if (cities_popup) {
            cities_popup.style.display = 'none'
            search_city.value = ''
            cc_area.style.opacity = '1'
            region_list.innerHTML = ''
            list_city.innerHTML = ''

            input_cities = document.querySelector('#input_cities');
            if (input_cities) {
                input_cities.style.display = 'none';
            }
        }

        // Закрывает форму с доставкой
        let delivery_form = document.querySelector('#delivery_form');
        if (delivery_form) {
            closeDeliveryForm();
        }

        // Закрывает попап для информации магазина
        let shop_info_popup = document.querySelector('#shop_info_popup');
        if (shop_info_popup) {
            shop_info_popup.style.display = 'none';
        }

        // Закрывает попап для telegram
        let telegram_popup = document.querySelector('#telegram_popup');
        if (telegram_popup) {
            telegram_popup.style.display = 'none';
        }

        // закрывает попап с авторизацией через телеграм
        let telegram_authentication = document.querySelector('#telegram_authentication');
        if (telegram_authentication) {
            telegram_authentication.style.display = 'none';
            localStorage.removeItem('auth_type');
            localStorage.removeItem('redirect_after_auth_to');
        }

        // Закрывает попап login
        let login_popup = document.querySelector('#login_popup');
        if (login_popup) {
            window.location.href = '/'
        }

        // Закрывает попап register
        let register_popup = document.querySelector('#register_popup');
        if (register_popup) {
            window.location.href = '/'
        }

        // Закрывает попап подтверждения удаления товара/ов
        let delete_confirmation = document.querySelector('#delete_confirmation');
        if (delete_confirmation) {
            delete_confirmation.style.display = 'none';
        }

        // Закрывает попап редактирования товара
        let product_form = document.querySelector('#product_form');
        if (product_form) {
            product_form.style.display = 'none';
        }

        // Закрывает попап форма для интернет магазина
        let add_web_shop_form = document.querySelector('#add_web_shop_form');
        if (add_web_shop_form) {
            add_web_shop_form.style.display = 'none';
        }

        // Закрывает форму с добавлением адреса доставки
        let cart_address_delivery_form = document.querySelector('#cart_address_delivery_form');
        if (cart_address_delivery_form) {
            cart_address_delivery_form.style.display = 'none';
            closeCartRecipientDataForm();
        }

        // Закрывает форму с комментарием для позиции в корзине
        let cart_item_comment_form = document.querySelector('#cart_item_comment_form');
        if (cart_item_comment_form) {
            cart_item_comment_form.style.display = 'none';
        }

        // Закрывает форму с удалением для позиции в корзине
        let cart_delete_popup = document.querySelector('#cart_delete_popup');
        if (cart_delete_popup) {
            cart_delete_popup.style.display = 'none';
        }

        // Закрывает форму с удалением интернет магазина
        let delete_web_shop_popup = document.querySelector('#delete_web_shop_popup');
        if (delete_web_shop_popup) {
            delete_web_shop_popup.style.display = 'none';
        }

        let close_popups = document.querySelectorAll('.close_popup');
        for (let index = 0; index < close_popups.length; index++) {
            const close_popup = close_popups[index];
            close_popup.style.display = 'none';
        }

        let help_in_selection_form = document.querySelector('#help_in_selection_form');
        if (help_in_selection_form) {
            let href = localStorage.getItem('header_help_in_selection_href');
            window.location.href = href;
        }

    }
})


// get all regions
let getRegions = () => { 
    let url = `${window.location.origin}/api/v0/get-regions/`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        for(region of data) {
            let one_region = `<span id="${region.id}" class="region">${region.name}</span>`;
            region_list.innerHTML += one_region
        }
        getCities()
    })
}


// get cities based on a region
let getCities = () => {
    if (region_list) {
        for (let i = 0; i < region_list.children.length; i++) {
            const region = region_list.children[i];
            region.addEventListener('click', function(){
                regionId = this.id

                let url = `${window.location.origin}/api/v0/regions/?region_id=${regionId}`;
                fetch(url)
                .then(resp => resp.json())
                .then(data => {

                    // list cities
                    list_city.innerHTML = ''
                    for(city of data.cities) {
                        let one_city = `<span id="${city.id}" class="city">${city.name}</span>`
                        list_city.innerHTML += one_city
                    }

                    for (let i = 0; i < list_city.children.length; i++) {
                        const element = list_city.children[i];
                        element.addEventListener('click', function(){

                            setCityLocation(element.id, element.innerHTML)

                            // window.location.href = window.location.href;
                            location.reload();

                            window.textSearchSuggest = undefined;
                        })
                    }
                })
            })
        }
    }
}

function updateLocalHistory(title, ref=""){
    const raw = localStorage.getItem("history");
   
    let history;
    if (raw != null && raw != ""){
        history = JSON.parse(raw);
    }
    else{
        history = [];
    }

    if (ref === ""){
        let cityId = localStorage.getItem('cityId')
        ref = `/products/?text=${title}&city_id=${cityId}&brand_id=`;
    }

    const currentOption = {title: title, ref: ref};

    if (history.length > 0){
        history = history.filter(option => option.title !== title);

        history = [currentOption, ...history].slice(0, 10);
    }
    else{
        history = [currentOption];
    }

    localStorage.setItem("history", JSON.stringify(history));
}

// on search submit
if (search_submit) {
    const minimalSearchCharacters = 2;
    const maxSearchCharacters = 30;

    search_submit.addEventListener('click', function(e){
        updateLocalHistory(search_product_input.value);
        e.preventDefault()

        let textSearch = search_product_input.value;
        let cityid = localStorage.getItem('cityId')
        
        textSearch = String(textSearch).trim()

        if (cityid == null) {
            locationCityClick()
        }
        else if (minimalSearchCharacters < textSearch.length && textSearch.length < maxSearchCharacters) {

            if (window.location.pathname == '/' || window.location.pathname == '/product/') {
                handleSearchResultRouting((window.textSearchSuggest != undefined) ? window.textSearchSuggest : textSearch, cityid);
            }
        }

    })
}


// show all shops based on a city
let allShops = () => {
    let cityid = localStorage.getItem('cityId')
    if (cityid == null){
        closeSlideMenu()
        overlay.style.display = 'block'
        cities_popup.style.display = 'block'
        getRegions()
    } else {
        window.location.href = `/public-shop-list/?cityid=${cityid}`;
    }
}


let xClose = () => {
    xclose.style.display = 'none';
    search_product_input.value = '';
    input_prod.innerHTML = '';
    document.getElementById("history-form-wrapper").style.display = "block";
}

// скрывать крестик если ввод для поиска пустой
document.addEventListener('keyup', function(e){
    if (e.key == 'Backspace' || e.key == 'Delete') {
        if (search_product_input){
            if (search_product_input.value == '' && xclose) {
                xclose.style.display = 'none';
                input_prod.innerHTML = '';
            }
        }
    }
})


//
// делает проверки поискового текста
let handleSearchResultRouting = (text, cityid) => {
    testTextOnBrandName(text, cityid);
}


// проверяет если переданный текст является наименованием марки/бренда
let testTextOnBrandName = (text, cityid) => {
    vinNumber = testTextOnVINNumber(text);

    if (vinNumber != false) {
        vinNumberPopup('block');

        window.vinNumber = vinNumber;
    }
    else {
        SendToSerachResults(text, cityid)
    }
}


// переадресовывает поисковый запрос опираясь на содержимое поисковой стороки
let sendSearchRequest = (data, text, cityid) => {
    vinNumber = testTextOnVINNumber(text);
    if (data.brand == true && vinNumber == false) {
        // SendToSerachResults(text, cityid, data.fapi_brand_id)
        SendToAcatOnline(text);
        resetSeachSuggests()
    }
    else if (data.brand == false && vinNumber != false) {
        SendToCatalogVinNumber(vinNumber);
        resetSeachSuggests()
    }
    else if (data.brand == false && vinNumber == false) {
        SendToSerachResults(text, cityid)
    }
    window.textSearchSuggest = undefined;
}


// проверяет если переданный текст является ВИН номером
let testTextOnVINNumber = (text) => {
    textSpacesFree = noWhiteSpaces(text);
    if (textSpacesFree.length == 17 && /[OQI]/.test(textSpacesFree) == false) {
        return textSpacesFree
    }
    else{
        return false
    }
}


// отправляет на catalog по вин номеру
let SendToCatalogVinNumber = (text) => {
    window.open(`${window.location.origin}/catalog/cars/search?vin_number=${text}`, '_blank');
}


// отправляет на catalog
let SendToCatalog = (text) => {
    window.open(`${window.location.origin}/catalog/cars/search?vin_number=${text}`, '_blank');
}


// отправляет на страницу с результатами поиска
let SendToSerachResults = (textSearch, cityid, brand_id) => {
    window.location.href = `/products/?text=${(window.textSearchSuggest != undefined) ? window.textSearchSuggest : textSearch}&city_id=${cityid}&brand_id=${(brand_id != undefined) ? brand_id : ''}`;
}


// убирает все пробелы
let noWhiteSpaces = (text) => {
    return String(text).replace(/\s/g, '');
}


// ресетит строку поиска и подсказки товаров
let resetSeachSuggests = () => {
    search_product_input.value = '';
    input_prods.style.display = 'none';
}


// пользователь подтвердил артикул
let confirmArticle = () => {
    let city_id = localStorage.getItem('cityId')
    if (city_id == null){
        overlay.style.display = 'block'
        cities_popup.style.display = 'block'
        getRegions()
    } else {
        SendToSerachResults(window.vinNumber, city_id);
        resetSeachSuggests()
    }
}


// проверяет вин номер в бд
let checkVinNumberAPI = () => {
    let url = `${window.location.origin}/api/v0/search-vin-number/?user_id=${user_id}&vin_number_text=${window.vinNumber}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        if (data.cars.length > 0) {
            window.is_vin_number = true;
        }
        else {
            window.is_vin_number = false;
        }
    })
}


// пользователь подтвердил Vin номер
let confirmVinNumber = (element) => {
    let city_id = localStorage.getItem('cityId')
    if (city_id == null){
        overlay.style.display = 'block'
        cities_popup.style.display = 'block'
        getRegions()
    } else {

        if (is_authenticated == 'True') {
    
            checkVinNumberAPI();

            setTimeout(() => {
                if (window.is_vin_number == true) {
                    SendToCatalogVinNumber(window.vinNumber);
                    resetSeachSuggests();
                    vinNumberPopup('none');
                }
                else {
                    document.querySelector('#article_or_vin').style.display = 'none';
                    document.querySelector('#garage_or_vin').style.display = 'flex';

                    let action = element.getAttribute('data-action');
            
                    if (action == 'catalog') {
                        SendToCatalogVinNumber(window.vinNumber);
                        resetSeachSuggests();
                        vinNumberPopup('none');
                    }

                }
            }, 250);

        }
        if (is_authenticated == 'False') {
            SendToCatalogVinNumber(window.vinNumber);
            resetSeachSuggests();
            vinNumberPopup('none');
        }

    }
}


// для добавления вин номера в гараж
let addToGarage = () => {
    let city_id = localStorage.getItem('cityId')
    if (city_id == null){
        overlay.style.display = 'block'
        cities_popup.style.display = 'block'
        getRegions()
    } else {

        localStorage.setItem("show_add_car_form", 'True');
        localStorage.setItem("vin_number", window.vinNumber);
        localStorage.setItem("help_in_selection_href", `${window.location.origin}/catalog/cars/search?vin_number=${window.vinNumber}`);

        window.location.href = `${window.location.origin}/profile/garage/`;

    }
}


// пользователь подтвердил Vin номер
let vinNumberPopup = (action) => {
    document.querySelector('#vin_number_popup').style.display = action;
    document.querySelector('#overlay').style.display = action;
}


// закрывает попап с городами
let closeCityPopup = () => {
    document.querySelector('#cities_popup').style.display = 'none';
    overlay.style.display = 'none';
    cities_popup.style.display = 'none'
    search_city.value = ''
    cc_area.style.opacity = '1'
    region_list.innerHTML = ''
    list_city.innerHTML = ''

    input_cities = document.querySelector('#input_cities');
    if (input_cities) {
        input_cities.style.display = 'none';
    }
}


// получает id города из гет параметров
let getCityIDUri = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const city_id = urlParams.get('city_id');
    if (city_id) {
        setCityLocation(city_id, '');
        return city_id;
    }
    else {
        return false;
    }
};


// получает id города
let getCityID = () => {
    let city_id = localStorage.getItem('cityId');
    if (city_id == null) {
        let city_id_uri = getCityIDUri();
        if (city_id_uri) {
            return city_id_uri;
        }
        else {
            locationCityClick();
            return false;
        }
    }
    else {
        return city_id;
    }
};