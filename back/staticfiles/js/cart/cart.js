// устанавливает цвет фона для иконки корзины
let setBgColorForCartIcon = (cart_icon_id) => {
    let gray_color = 'rgba(209, 213, 219)'
    let white_color = '#fff'
    
    document.querySelector(`#${cart_icon_id}`).style.backgroundColor = gray_color;
    document.querySelector(`#${cart_icon_id}_mobile`).style.backgroundColor = gray_color;
    
    setTimeout(function () {
        document.querySelector(`#${cart_icon_id}`).style.backgroundColor = white_color;
        document.querySelector(`#${cart_icon_id}_mobile`).style.backgroundColor = white_color;
    }, 500)
}
// 


// валидирует количество для позиции
let validateQuantityInput = (element) => {
    setTimeout(function() {
        let cart_icon_id = element.getAttribute("data-cart_icon_id");
        let offer_quantity = element.getAttribute("data-quantity");
    
        // валидация для количества товаров в корзину; если пользователь указал товаров больше чем есть в предложениях - красные борта
        if (parseInt(element.value) > offer_quantity) {
            element.style.borderColor = 'red';
            window.quantityReady = false;
        }
        else if (element.value == 0 || element.value == '') {
            element.style.borderColor = 'rgba(209, 213, 219)';  // gray
            window.quantityReady = true;

            setBgColorForCartIcon(cart_icon_id);
        }
        else if (parseInt(element.value) <= offer_quantity && parseInt(element.value) >= 0) {
            element.style.borderColor = 'rgba(209, 213, 219)';
            window.quantityReady = true;

            setBgColorForCartIcon(cart_icon_id);
        }
    }, 250);
}


// увеличивает счетчик для позиции корзины на клик иконки с корзиной
let incrementCartItemCount = (unique_id, element) => {
    let unique_ids = document.querySelectorAll(`.input_${unique_id}`);
    for (let i = 0; i < unique_ids.length; i++) {
        const element = unique_ids[i];
        element.value++;
    }
}
//


// добавляет количество для позиции корзины на клик корзины
let addCartItemCount = (element) => {
    let cart_icon_id = element.getAttribute("data-cart_icon_id");
    let viewpoint = element.getAttribute("data-viewpoint");
    let unique_id = element.getAttribute("data-unique_id");
    
    setBgColorForCartIcon(cart_icon_id);
    
    incrementCartItemCount(unique_id, element);

    let trigger_cart_element = document.querySelector(`#order_item_id${unique_id}${viewpoint}`);
    triggerCart(trigger_cart_element);
}
// 


// на изменение количества в инпуте
window.input_values = 0;
window.cart_items_array = new Array();
let triggerCart = (element) => {
    let offer_quantity = element.getAttribute("data-quantity");

    validateQuantityInput(element);

    sendDataForOrderItem(element, offer_quantity);
}


// синхронизация интутов с количетвом товаров на десктопе и мобилке
let syncDesctopMobileCartItemsInputs = (element, cart_item_quantity) => {
    let unique_id = element.getAttribute('data-unique_id');
    document.querySelector(`#${unique_id}`).value = cart_item_quantity;
    document.querySelector(`#${unique_id}_mobile`).value = cart_item_quantity;

}


// выводит на экран количество товаров в корзине (хедер, футор)
let displayOrderItemsCount = (cart_quantities) => {
    setCartOrderCountDisplayedParents(cart_quantities.cart_items_count);

    let cart_order_count_displayeds = document.querySelectorAll('.cart_order_count_displayed');
    for (let index = 0; index < cart_order_count_displayeds.length; index++) {
        const cart_order_count = cart_order_count_displayeds[index];
        cart_order_count.innerHTML = cart_quantities.cart_items_count;
    }
}


// собирает order_item объект
let build_order_item_object = (element, offer_quantity) => {
    let order_item_object = {}
    order_item_object.product_name = element.getAttribute("data-product_name");
    order_item_object.article = element.getAttribute("data-article");
    order_item_object.brand = element.getAttribute("data-brand");
    order_item_object.shop_name = element.getAttribute("data-shop_name");
    order_item_object.price = element.getAttribute("data-price");
    order_item_object.delivery_period = element.getAttribute("data-delivery_period");
    order_item_object.warehouse_quantity = offer_quantity;

    return order_item_object;
}


// формирует позицию корзины для Cookie
let formCartItemCookie = (element, product_image_url, order_item_object) => {
    let unique_offer_id = element.getAttribute('data-unique_offer_id');

    let one_cart_item_obj = {};

    one_cart_item_obj.id = Date.now();

    one_cart_item_obj.unique_offer_id = unique_offer_id;
    one_cart_item_obj.cart_item_quantity = element.value;
    one_cart_item_obj.image_url = product_image_url;
    one_cart_item_obj.warehouse_data = order_item_object;

    one_cart_item_obj.comment = '';
    one_cart_item_obj.is_selected = false;

    let cost = parseInt(one_cart_item_obj.cart_item_quantity) * parseFloat(one_cart_item_obj.warehouse_data.price);
    one_cart_item_obj.cost = one_cart_item_obj.cart_item_quantity ? cost.toFixed(2) : '0,00';
    return one_cart_item_obj;
}


// получает список без настоящей(current) позиции
let filterCartItemsArray = (element) => {
    let unique_offer_id = element.getAttribute('data-unique_offer_id');

    let cartItemsListCookie = getCartItemsListCookie('cart_items_list');
    if (cartItemsListCookie) {
        let cartItemsList = JSON.parse(cartItemsListCookie);
        window.cart_items_array = cartItemsList.filter(obj => obj.unique_offer_id != unique_offer_id);
    }
    else {
        window.cart_items_array = window.cart_items_array.filter(obj => obj.unique_offer_id != unique_offer_id);
    }

}


// пополняет список с позициями козрины позицией
let pushCartItemInArray = (one_cart_item_obj) => {
    window.cart_items_array.unshift(one_cart_item_obj);

    let cart_item_count = 0;
    for (let index = 0; index < window.cart_items_array.length; index++) {
        const cart_item = window.cart_items_array[index];
        cart_item_count += parseInt(cart_item.cart_item_quantity)
    }

    return cart_item_count;
}


// устанавливает Cookie для списка с позициями корзины
let setCartItemsListCookie = (cart_items_list) => {
    setTimeout(function(){
        const d = new Date();
        d.setTime(d.getTime() + (1*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        if (cart_items_list) {
            // document.cookie = 'cart_items_list' + "=" + JSON.stringify(cart_items_list) + ";" + expires + ";path=/";
            document.cookie = 'cart_items_list=' + "=" + JSON.stringify(cart_items_list) + ";" + expires + ";path=/";
        }
        else {
            // document.cookie = 'cart_items_list' + "=" + JSON.stringify(window.cart_items_array) + ";" + expires + ";path=/";
            document.cookie = 'cart_items_list=' + "=" + JSON.stringify(window.cart_items_array) + ";" + expires + ";path=/";
        }
    }, 100)
    
    if (cart_items_list && cart_items_list.length == 0) {
        setTimeout(function() {
            // let cookie_name = 'cart_items_list';
            let cookie_name = 'cart_items_list=';
            removeCartItemsCookie(cookie_name);
        }, 150)
    }
}


// запрос на добавление позиции в корзину
let sendDataForOrderItem = (element, offer_quantity) => {
    let order_item_object = build_order_item_object(element, offer_quantity);

    let product_image_url = getProductImageUrl();
    product_image_url = String(product_image_url);

    if (is_authenticated == 'True') {
        let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        let url = `${window.location.origin}/cart/api/v0/send-data-for-cart-item/`;
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'cart_item_quantity': element.value,
                'image_url': product_image_url,
                'warehouse_data': order_item_object,
            })
        }
        setTimeout(function() {
            if (window.quantityReady) {
                fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    displayOrderItemsCount(data.cart_quantities);
                    syncDesctopMobileCartItemsInputs(element, data.cart_quantities.cart_item_quantity);
            
                })
            }
        }, 250)
    }
    else if (is_authenticated == 'False') {
        setTimeout(function() {
            if (window.quantityReady) {
                let one_cart_item_obj = formCartItemCookie(element, product_image_url, order_item_object);

                filterCartItemsArray(element);

                let cart_item_count = pushCartItemInArray(one_cart_item_obj);
                
                setCartItemsListCookie();
                
                displayOrderItemsCount({cart_items_count: cart_item_count});
                syncDesctopMobileCartItemsInputs(element, element.value);
            }
        }, 250)
    }
}


// получает ссылку для позиции корзины со страницы с информацией о товаре
let getProductImageUrl = () => {
    let image_url = document.querySelector('#product_image_url');
    if (image_url) {
        return image_url.src;
    }
    else {
        return '';
    }
}


// открывает форму с добавлением комментария
let showAddCommentForm = (element) => {
    document.querySelector('#cart_item_comment_form').style.display = 'block';
    document.querySelector('#overlay').style.display = 'block';

    window.cart_item_id = element.getAttribute("data-cart_item_id");
    document.querySelector('#cart_item_comment_input').value = (element.getAttribute("data-cart_item_comment") == 'None') ? '' : element.getAttribute("data-cart_item_comment");
}


// закрывает форму с добавлением комментария
let closeCartItemCommentForm = () => {
    document.querySelector('#cart_item_comment_form').style.display = 'none';
    document.querySelector('#overlay').style.display = 'none';
    document.querySelector('#cart_item_comment_input').value = '';
}


// удаляет или обновляет комментарий к позиции корзины
let handleCartItemComment = (method) => {
    document.querySelector('#cart_item_comment_form').style.display = 'none';
    document.querySelector('#overlay').style.display = 'none';

    let cart_item_comment = document.querySelector('#cart_item_comment_input').value;

    let url = `${window.location.origin}/cart/api/v0/send-data-for-cart-item-comment/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'cart_item_id': window.cart_item_id,
            'cart_item_comment': cart_item_comment,
        })
    }
    if (is_authenticated == 'True') {
        fetch(url, options)
        .then(response => response.json())
        .then(data => {
            window.location.href = window.location.href;
        })
    }
    else if (is_authenticated == 'False') {
        if (method == 'DELETE') {
            handleCartUpdateFromCookie(window.cart_item_id, null, '', null, null, null);
        }
        else if (method == 'POST') {
            handleCartUpdateFromCookie(window.cart_item_id, null, cart_item_comment, null, null, null);
        }
    }
}
// 


// добавляет комментрарий к позиции заказа
let addCartItemComment = () => {
    handleCartItemComment("POST");
}
// 


// удаляет комментрарий к позиции заказа
let deleteCartItemComment = () => {
    handleCartItemComment("DELETE");
}
//


// выделяет или очищает чекбоксы позиции в корзине
window.cartItemsIdSet = new Set();
let selectAllCartItemsHelper = (cart_check_header_status, select_all_cart_items_btn_text) => {
    let cart_check_header = document.querySelector('#cart_check_header');
    let select_all_cart_items_btn = document.querySelector('#select_all_cart_items_btn1');
    let cart_item_checks = document.querySelectorAll('.cart_item_check');

    cart_check_header.checked = cart_check_header_status;
    for (const cart_item_check of cart_item_checks) {
        let cart_item_id = cart_item_check.getAttribute('data-cart_item_id');

        if (cart_check_header_status) {
            window.cartItemsIdSet.add(cart_item_id);
        }
        else {
            window.cartItemsIdSet.delete(cart_item_id);
        }

        cart_item_check.checked = cart_check_header_status;
    }
    window.cart_items_all_checked = cart_check_header_status;
    select_all_cart_items_btn.innerHTML = select_all_cart_items_btn_text;

    let select_cart_items_for_one_shop_btns = document.querySelectorAll('.select_cart_items_for_one_shop_btn1');

    for (let index = 0; index < select_cart_items_for_one_shop_btns.length; index++) {
        const select_cart_items_for_one_shop_btn = select_cart_items_for_one_shop_btns[index];
        if (cart_check_header_status) {
            select_cart_items_for_one_shop_btn.innerHTML = 'Очистить все в магазине';
        }
        else {
            select_cart_items_for_one_shop_btn.innerHTML = 'Выбрать все в магазине';
        }
    }
}
let selectAllCartItems = () => {
    if (window.cart_items_all_checked == false || window.cart_items_all_checked == undefined) {
        selectAllCartItemsHelper(true, 'Очистить все');

        document.querySelector('#cart_items_count_total').innerHTML = `<span class="stem-light">Выбрано:</span> ${cart_items_number} позиции (${cart_items_count_total} шт)`;
        document.querySelector('#cart_cost_total').innerHTML = `<span class="stem-light">на сумму:</span> ${cart_cost_total} Р`;
        document.querySelector('#main_total').innerHTML = `${cart_cost_total} Р`;
        
        let all_cart_items = true;
        selectCartItemSelfHelper('POST', null, null, null, all_cart_items);

    }
    else if (window.cart_items_all_checked == true){
        selectAllCartItemsHelper(false, 'Выбрать все')
        document.querySelector('#cart_items_count_total').innerHTML = '<span class="stem-light">Выбрано:</span> 0 позиции (0 шт)';
        document.querySelector('#cart_cost_total').innerHTML = '<span class="stem-light">на сумму:</span> 0,00 Р';
        document.querySelector('#main_total').innerHTML = '0,00 Р';

        let all_cart_items = true;
        selectCartItemSelfHelper('DELETE', null, null, null, all_cart_items);
    }
}
// 


let setCartTotalCount = () => {
    
}


// открывает кнопку "К офомлению" заказа
let showMakeOrderBtn = (data) => {
    if (parseInt(data.cart_info.selected_cart_items_number) > 0) {
        document.querySelector('#make_order_btn').style.display = 'block';
    }
    else {
        document.querySelector('#make_order_btn').style.display = 'none';
    }
}


// апи; выделяет позицию корзины (саму себя)
let selectCartItemSelfHelper = (method, cart_item_id, shop_id, is_selected, all_cart_items) => {
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let url = `${window.location.origin}/cart/api/v0/send-data-for-cart-item-is-selected/`;
    
    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'cart_item_id': cart_item_id,
            'shop_id': shop_id,
            'is_selected': is_selected,
            'cart_id': cart_id,
            'all_cart_items': all_cart_items,
        })
    }
    if (is_authenticated == 'True') {
        fetch(url, options)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#cart_items_count_total').innerHTML = `<span class="stem-light">Выбрано:</span> ${data.cart_info.selected_cart_items_number} позиции (${data.cart_info.selected_cart_items_count} шт)`;
            document.querySelector('#cart_cost_total').innerHTML = `<span class="stem-light">на сумму:</span> ${data.cart_info.total_cost_for_selected} Р`;
            document.querySelector('#main_total').innerHTML = `${data.cart_info.total_cost_for_selected} Р`;
            showMakeOrderBtn(data);
        })
    }
    else if (is_authenticated == 'False') {
        if (all_cart_items == true) {
            handleCartUpdateFromCookie(null, null, null, null, null, true);
        }
        else if (all_cart_items == false) {
            handleCartUpdateFromCookie(null, null, null, null, null, false);
        }
        else {
            handleCartUpdateFromCookie(cart_item_id, null, null, is_selected, null, null);
        }
    }
}


// выделяет позицию корзины (сам себя)
let selectCartItemSelf = (element) => {
    if (element.checked) {
        let cart_item_id = element.getAttribute('data-cart_item_id');
        let is_selected = true;
        selectCartItemSelfHelper('POST', cart_item_id, null, is_selected, null);
        window.cartItemsIdSet.add(cart_item_id);
    }
    else {
        let is_selected = false;
        let cart_item_id = element.getAttribute('data-cart_item_id');
        selectCartItemSelfHelper('DELETE', cart_item_id, null, is_selected, null);
        window.cartItemsIdSet.delete(cart_item_id);
    }
}


// выделяет позиции корзины для магазина
window.cart_items_checked_for_one_shop = new Set();
let selectShopCartItemsHelper = (element, data, cart_items_checked_for_one_shop_status, cart_items_checked_for_one_shop_btn_text) => {
    let cart_item_checks = document.querySelectorAll(`.cart_item_check_${data.shop_id}`);

    if (window.cart_items_all_checked == true) {
        for (let index = 0; index < cart_item_checks.length; index++) {
            const cart_item_check = cart_item_checks[index];
            let cart_item_id = cart_item_check.getAttribute('data-cart_item_id');

            cart_item_check.checked = false;
            window.cartItemsIdSet.delete(cart_item_id);
        }
        window.cart_items_all_checked = false;
        document.querySelector('#select_all_cart_items_btn1').innerHTML = 'Выбрать все';
        document.querySelector('#cart_check_header').checked = false;

        element.innerHTML = 'Выбрать все в магазине';
        window.cart_items_checked_for_one_shop.delete(`shop_${data.shop_id}`);
    }
    else if (window.cart_items_all_checked == false || window.cart_items_all_checked == undefined){
        for (let index = 0; index < cart_item_checks.length; index++) {
            const cart_item_check = cart_item_checks[index];
            let cart_item_id = cart_item_check.getAttribute('data-cart_item_id');

            cart_item_check.checked = cart_items_checked_for_one_shop_status;
            if (cart_items_checked_for_one_shop_status) {
                window.cartItemsIdSet.add(cart_item_id);
            }
            else {
                window.cartItemsIdSet.delete(cart_item_id);
            }
        }

        element.innerHTML = cart_items_checked_for_one_shop_btn_text;

        if (cart_items_checked_for_one_shop_status) {
            window.cart_items_checked_for_one_shop.add(`shop_${data.shop_id}`);
        }
        else {
            window.cart_items_checked_for_one_shop.delete(`shop_${data.shop_id}`);
        }
    }
}


// апи; выбирает позиции корзины для конкретного магазина
let selectShopCartItems = (element) => {
    let shop_name = element.getAttribute('data-shop_name');
    shop_name = shop_name.replaceAll(' ', '---');

    let url = `${window.location.origin}/api/v0/get-shop-id-by-name/?shop_name=${shop_name}`;

    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        if (window.cart_items_checked_for_one_shop.has(`shop_${data.shop_id}`)) {
            let cart_items_checked_for_one_shop_status = false;            
            selectShopCartItemsHelper(element, data, cart_items_checked_for_one_shop_status, 'Выбрать все в магазине');

            let is_selected = false;
            selectCartItemSelfHelper('DELETE', null, data.shop_id, is_selected, null);
        }
        else {
            let cart_items_checked_for_one_shop_status = true;
            selectShopCartItemsHelper(element, data, cart_items_checked_for_one_shop_status, 'Очистить все в магазине');

            let is_selected = true;
            selectCartItemSelfHelper('POST', null, data.shop_id, is_selected, null);
        }
    })
}


// апи для удаления позиции козрины
let deleteCartItems = () => {
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let url = `${window.location.origin}/cart/api/v0/send-data-to-delete-cart-items/`;
    
    let options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'shop_name': window.shop_to_delete,
            'cart_id': cart_id,
        })
    }
    if (is_authenticated == 'True') {
        fetch(url, options)
        .then(response => response.json())
        .then(data => {
            window.location.href = window.location.href;
        })
    }
    else if (is_authenticated == 'False') {
        handleCartUpdateFromCookie(null, null, null, null, 'delete', null);
    }
}


// закрывает попап для удаления
let closeCartItemDeletePopup = () => {
    document.querySelector('#cart_delete_popup').style.display = 'none';
    document.querySelector('#overlay').style.display = 'none';
}


// открывает попап для удаления
let showDeleteCartItemsPopup = (element) => {
    document.querySelector('#cart_delete_popup').style.display = 'block';
    document.querySelector('#overlay').style.display = 'block';
    window.shop_to_delete = element.getAttribute('data-shop_name');
}


// закрывает попап c предложением авторизоваться
let closeCookieAuthorizePopup = () => {
    document.querySelector('#cookie_authorize_popup').style.display = 'none';
    document.querySelector('#overlay').style.display = 'none';
}


// переадресавывает на страницу с оформление заказа
let goToCreateOrderPage = () => {
    if (is_authenticated == 'True') {
        if (window.quantityReady || window.quantityReady == undefined) {
            window.location.href = `${window.location.origin}/profile/user/cart/create-order/`;
        }
    }
    else if (is_authenticated == 'False') {
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('#cookie_authorize_popup').style.display = 'block';
    }
}


// устанавливает гифку загрузки для позиции при проценки
let setLoadingGif = (id) => {
    document.querySelector(`#cart_item_state_${id}`).innerHTML = `<img id="gif_spin" class="block mx-auto w-6" style="text-align: center;" src="${window.location.origin}/static/images/giphy.gif" alt="gif spin">`;
    document.querySelector(`#cart_item_state_mobile_${id}`).innerHTML = `<img id="gif_spin" class="block mx-auto w-6" style="text-align: center;" src="${window.location.origin}/static/images/giphy.gif" alt="gif spin">`;
}

const reCalculateTimeout = 120000;

// проверяет WAIT состояния
let checkWaitStates = () => {
    let url = `${window.location.origin}/cart/api/v0/check-wait-states/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'cart_id': cart_id,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        if (data.wait_states) {
            setTimeout(
                function() {
                    window.location.href = window.location.href;
                },
                reCalculateTimeout,
                )
        }
    })
}

// setTimeout(function(){
//     if (window.location.pathname == '/profile/user/cart/' && is_authenticated == 'True') {
//         checkWaitStates()
//     }
// }, 1000)


// проверяет процененную позицию корзины
let checkRecalculatedCartItem = () => {
    setTimeout(
        function() {
            window.location.href = window.location.href;
        },
        reCalculateTimeout,
        )
}


// устанавливает список с id для повторной проценки
window.cart_id_list = new Array();
let setCartIdList = () => {
    let recalculate_prices = document.querySelectorAll('.recalculate_price');
    for (const recalculate_price of recalculate_prices) {
        let cart_item_id = recalculate_price.getAttribute('data-id');
        window.cart_id_list.push(cart_item_id)
    }
}


// заново проценивает данные для позиции API
let reCalculateCartItemAPI = () => {
    setCartIdList();

    let url = `${window.location.origin}/cart/api/v0/recalculate-cart-item/`;
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    setTimeout(function () {
        city_id = getCityID();

        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'cart_id_list': window.cart_id_list,
                'city_id': city_id,
            })
        }
        if (window.cart_id_list.length > 0) {
            fetch(url, options)
            .then(response => response.json())
            .then(data => {
                checkRecalculatedCartItem();
            })
        }
    }, 500)
};
reCalculateCartItemAPI();


// заново проценивает данные для позиции
let reCalculateCartItem = (element) => {
    let city_id = localStorage.getItem('cityId')
    if (city_id == null){
        overlay.style.display = 'block'
        cities_popup.style.display = 'block'
        getRegions()
    } else {
        let cart_item_id = element.getAttribute("data-cart_item_id");
        let id = element.getAttribute("data-id");

        setLoadingGif(id);
        
        reCalculateCartItemAPI(id, city_id);
    }
};


// получает количество выбранных позиций
let getCartItemsSelected = (cartItemsList) => {
    let cart_items_selected = 0;
    for (const iterator of cartItemsList) {
        if (iterator && iterator.is_selected) {
            cart_items_selected++
        }
    }

    return cart_items_selected;
}


// получает количество выбранных позиций (шт)
let getCartItemsCountSelected = (cartItemsList) => {
    let cart_items_count_selected = 0;
    for (const iterator of cartItemsList) {
        if (iterator && iterator.is_selected) {
            cart_items_count_selected += parseInt(iterator.cart_item_quantity);
        }
    }

    return cart_items_count_selected;
}


// получает сумму для выбранных позиций
let getSelectedCost = (cartItemsList) => {
    let selected_cost = 0;
    for (const iterator of cartItemsList) {
        if (iterator && iterator.is_selected) {
            selected_cost += parseFloat(iterator.cost);
        }
    }

    return selected_cost;
}


// отрисовывает позиции корзины в HTML
let getCartItemListHtml = (cartItemsList) => {
    let cart_items_list_html = '';

    cartItemsList = cartItemsList.sort(function(a,b){return new Date(b.id) - new Date(a.id);});

    for (const cart_item of cartItemsList) {
        let cart_item_one = `
        <tr id="" class="">
            <td class="w-5/12 py-2">
                <div style="justify-content: start;" class="flex">
                    <img class="w-2/12" src="${cart_item.image_url}" alt="">
                    <span class="w-10/12 inline-block p-3 py-2 text-align-left">
                        <span class="block stem-medium">${cart_item.warehouse_data.brand} ${cart_item.warehouse_data.article}</span>
                        ${cart_item.warehouse_data.product_name}
                    </span>
                </div>
            </td>
            <td>
                <span class="block p-3 py-2" style="text-align: center;">
                    <input id="" type="number" min="0.0" value="${cart_item.cart_item_quantity}" class="w-16 h-8 p-2 inline border rounded border-gray-300 focus:outline-none text-xs sm:text-sm text-gray-600" data-cart_item_id="${cart_item.unique_offer_id}" data-max_quantity="${cart_item.warehouse_data.warehouse_quantity}" onkeyup="updateCartItemQuantity(this)">
                </span>
            </td>

            <td>
                <span class="block p-3 py-2" style="text-align: center;">
                    ${cart_item.warehouse_data.price}
                </span>
            </td>

            <td>
                <span class="block p-3 py-2 stem-medium" style="text-align: center;">
                    ${cart_item.cost}
                </span>
            </td>

            <td>
                <span class="block p-3 py-2" style="text-align: center;">
                    ${cart_item.warehouse_data.delivery_period} ч
                </span>
            </td>

            <!-- <td>
                <span class="block p-3 py-5" style="text-align: center;">
                    Стоимость<br>доставки
                </span>
            </td> -->

            <td>
                <span>
                    ${cart_item.comment
                        ?
                        `<img class="block w-5 mx-auto cursor-pointer" src="${window.location.origin}/static/images/comment-icon.svg" alt="комментарий" data-cart_item_id="${cart_item.unique_offer_id}" data-cart_item_comment="${cart_item.comment}" title="${cart_item.comment}" onclick="showAddCommentForm(this)">`
                        :
                        `<img class="block w-5 mx-auto cursor-pointer" src="${window.location.origin}/static/images/comment-icon-gray.svg" alt="комментарий" data-cart_item_id="${cart_item.unique_offer_id}" data-cart_item_comment="${cart_item.comment}" onclick="showAddCommentForm(this)">`
                     }
                </span>
            </td>

            <td id="cart_item_state_{cart_item}">
                <input type="checkbox" ${cart_item.is_selected ? 'checked' : '' } name="" class="cart_item_check_${cart_item.shop} cart_item_check block w-10 mx-auto" id="" data-cart_item_id="${cart_item.unique_offer_id}" onclick="selectCartItemSelf(this)">
            </td>
        </tr>`;
        
    cart_items_list_html += cart_item_one;
    }

    return cart_items_list_html;
}


// отрисовывает позиции корзины в HTML (мобильная)
let getCartItemListHtmlMobile = (cartItemsList) => {
    let cart_items_list_html_mobile = '';

    for (const cart_item of cartItemsList) {
        let cart_item_one_mobile = `
        <tr id="" class="">
            <td class="w-3/12 py-2">
                <img class="" src="${cart_item.image_url}" alt="">
            </td>
            <td>
                <span class="block p-2" style="text-align: left;">
                    <span class="block stem-medium">${cart_item.warehouse_data.brand}} ${cart_item.warehouse_data.article}</span>
                    <span class="block">${cart_item.warehouse_data.product_name}</span>

                    <span class="block stem-medium pt-0.5">
                        Сумма: ${cart_item.cost}
                    </span>

                    <span class="block pt-0.5">
                        Доставка : ${cart_item.delivery_period} ч
                    </span>

                    <span>
                        <input id="" type="number" min="0.0" value="${cart_item.cart_item_quantity}" class="inline-block w-14 mt-1 p-1 px-2 border rounded border-gray-300 focus:outline-none text-xs sm:text-sm text-gray-600" data-cart_item_id="${cart_item.unique_offer_id}" data-max_quantity="${cart_item.warehouse_data.warehouse_quantity}" onkeyup="updateCartItemQuantity(this)">
                    </span>

                </span>
            </td>

            <td>
                <span class="block p-3 py-2" style="text-align: center;">

                    <span id="cart_item_state_mobile_{cart_item.id}">
                        <input type="checkbox" ${cart_item.is_selected ? 'checked' : '' } name="" class="cart_item_check_${cart_item.shop} cart_item_check block w-10 mx-auto" id="" data-cart_item_id="${cart_item.unique_offer_id}" onclick="selectCartItemSelf(this)">
                    </span>

                    <span>
                        ${cart_item.comment
                            ?
                            `<img class="block mt-3 w-4 mx-auto" src="${window.location.origin}/static/images/comment-icon.svg" alt="комментарий" data-cart_item_id="${cart_item.unique_offer_id}" data-cart_item_comment="${cart_item.comment}" onclick="showAddCommentForm(this)">`
                            :
                            `<img class="block mt-3 w-4 mx-auto" src="${window.location.origin}/static/images/comment-icon-gray.svg" alt="комментарий" data-cart_item_id="${cart_item.unique_offer_id}" data-cart_item_comment="${cart_item.comment}" onclick="showAddCommentForm(this)">`
                         }
                    </span>
                </span>
            </td>
        </tr>`;

    cart_items_list_html_mobile += cart_item_one_mobile;

    }

    return cart_items_list_html_mobile;
}


// отрисовывает позиции корзины из куки
let renderCartItemsDataFromCookie = () => {
    setTimeout(function() {
        let cartItemsListCookie = getCartItemsListCookie('cart_items_list');
    
        if (cartItemsListCookie) {
            let cart_data_cookie = document.querySelector('#cart_data_cookie');
    
            let cartItemsList = JSON.parse(cartItemsListCookie);    

            let cart_items_selected = getCartItemsSelected(cartItemsList);

            let cart_items_count_selected = getCartItemsCountSelected(cartItemsList);

            let selected_cost = getSelectedCost(cartItemsList);

            let cart_items_list_html = getCartItemListHtml(cartItemsList);

            let cart_items_list_html_mobile = getCartItemListHtmlMobile(cartItemsList);


            cart_data_cookie.innerHTML = `    
            <!-- десктопная версия корзины -->
            <table id="" class="hidden sm:table w-full text-xs sm:text-sm py-5 lg:px-5">
                <tr class="w-full bg-white">
                    <th colspan="20" style="text-align: right;"><span class="cart_table_header block pt-5 pb-2 bg-white text-sm sm:text-base stem-medium cursor-pointer"></span></th>
                </tr>
    
                <tr id="cart_table_header" class="cart_table_header bg-gray-100">
    
                    <th>
                        <span class="block p-3 py-5 stem-medium text-align-left">
                            <span class="block">Магазин</span>
                            <span class="block">Бренд Артикул</span>
                            <span class="block">Описание</span>
                        </span>
                    </th>
    
                    <th>
                        <span class="block p-3 py-5 stem-medium text-align-center">Кол-во</span>
                    </th>
    
                    <th>
                        <span class="block p-3 py-5 stem-medium text-align-center">Цена</span>
                    </th>
    
                    <th>
                        <span class="block p-3 py-5 stem-medium text-align-center">Сумма</span>
                    </th>
    
                    <th>
                        <span><img class="block w-7 mx-auto" src="${window.location.origin}/static/images/Truck-Background.svg" alt="грузовик"></span>
                    </th>
    
                    <!-- <th>
                        <span class="block p-3 py-5 stem-medium text-align-center">Стоимость<br>доставки</span>
                    </th> -->
    
                    <th>
                        <span><img class="block w-5 mx-auto" src="${window.location.origin}/static/images/comment-icon.svg" alt="комментарий"></span>
                    </th>
    
                    <th>
                    </th>
                </tr>

                ${cart_items_list_html}

                <tr class="w-full bg-white">
                    <td colspan="20">
                        <div class="flex justify-end" style="justify-content: end;">
                            <button id="" class="block my-5 mx-2 border py-2 px-5 text-sm stem-medium rounded-md border-red-300 bg-red-500 hover:bg-red-300 text-white" data-shop_name="{shop_name}" onclick="showDeleteCartItemsPopup(this)">Удалить</button>
                        </div>
                    </td>
                </tr>

            </table>
            <!--  -->
    
    
            <!-- мобильная версия корзины -->
            <table id="" class="sm:hidden w-full text-xs sm:text-sm py-5 lg:px-5">
                ${cart_items_list_html_mobile}

                <tr class="w-full bg-white">
                    <td colspan="20">
                        <div class="flex justify-end" style="justify-content: end;">
                            <button id="" class="block my-5 mx-2 border py-2 px-5 text-sm stem-medium rounded-md border-red-300 bg-red-500 hover:bg-red-300 text-white" data-shop_name="{shop_name}" onclick="showDeleteCartItemsPopup(this)">Удалить</button>
                        </div>
                    </td>
                </tr>

            </table>
            <!--  -->
    
    
            <!-- Итого -->
            <div class="stem-medium text-xs sm:text-sm mt-10">
                <div class="flex"><p id="cart_items_count_total" style="text-align: right;" class="w-5/12 mr-1 sm:mr-3"><span class="stem-light">Выбрано:</span> ${cart_items_selected} позиции (${cart_items_count_selected} шт)</p><p id="cart_cost_total" class="w-5/12 ml-1 sm:ml-3 text-align-left"><span class="stem-light">на сумму:</span> ${selected_cost.toFixed(2)} Р</p></div>
    
                <div class="flex"><p style="text-align: right;" class="w-5/12 mr-1 sm:mr-3"><span class="stem-light">Итого:</span></p><p id="main_total" class="w-5/12 ml-1 sm:ml-3 text-align-left">${selected_cost.toFixed(2)} Р</p></div>
    
                <div class="flex">
                    <span id="make_order_btn" class="my-5 mx-2 border py-2 px-5 text-sm rounded-md border-red-300 bg-red-500 hover:bg-red-300 text-white stem-medium cursor-pointer" data-shop_name="{shop_name}"
                    style="display: ${cart_items_selected ? 'block' : 'none'};" target="_blank" onclick="goToCreateOrderPage()">К офомлению</span>
                </div>
            </div>
            <!--  -->`;
        }
    }, 100)
}

setTimeout(function() {
    if (window.location.pathname == '/profile/user/cart/' && is_authenticated == 'False') {
        renderCartItemsDataFromCookie();
    }
}, 600)


// убирает баннер с информацией
setTimeout(function() {
    let info_banner = document.querySelector('#info_banner');
    if (info_banner) {
        info_banner.style.display = 'none';
    }
}, 6000)
