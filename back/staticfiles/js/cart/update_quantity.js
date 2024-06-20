// устанавливает обновлянную позицию в начало
let setCartItemAtBegging = (cartItemsList, cart_item_id, cart_item) => {
    let cart_item_list = cartItemsList.filter(obj => obj.unique_offer_id != cart_item_id);
    cart_item_list.unshift(cart_item);
    return cart_item_list;
}


// устанавливает количество для позиции для куки
let setCartItemNewDataForCookie = (cartItemsList, cart_item_id, cart_item_quantity, cart_item_comment, is_selected) => {
    let cart_item = cartItemsList.filter(obj => obj.unique_offer_id === cart_item_id)[0];

    if (cart_item_quantity) {
        cart_item.cart_item_quantity = cart_item_quantity;

        let cost = parseInt(cart_item.cart_item_quantity) * parseFloat(cart_item.warehouse_data.price);
        cart_item.cost = cart_item.cart_item_quantity ? cost.toFixed(2) : '0,00';

        return cart_item;
    }
    else if (cart_item_comment || cart_item_comment == '') {
        cart_item.comment = cart_item_comment.replaceAll(';', '.');
        return cart_item;
    }
    else if (is_selected == true) {
        cart_item.is_selected = true;
        return cart_item;
    }
    else if (is_selected == false) {
        cart_item.is_selected = false;
        return cart_item;
    }
}


// получает количетво товаров (шт) в куках после обновления
let getCartItemCount = (cart_item_list) => {
    let cart_item_count = 0;

    for (let index = 0; index < cart_item_list.length; index++) {
        const cart_item = cart_item_list[index];
        if (cart_item) {
            cart_item_count += parseInt(cart_item.cart_item_quantity)
        }
    }

    return cart_item_count;
}


// устаналивает информацию(плашку) об обнолении позиции
let setCartItemUpdateInfo = () => {
    let cart_item_update_info = document.querySelector('#cart_item_update_info');
    cart_item_update_info.innerHTML = 'Позиция успешно обновилась';

    setTimeout(function() {
        cart_item_update_info.innerHTML = '';
    }, 3000);
}


// удаляет позиици корзины из куки
let deleteCartItmesCookie = (cartItemsList, action) => {
    if (action == 'delete') {
        let cart_item_list = cartItemsList.filter(obj => obj.is_selected === false);

        closeCartItemDeletePopup();

        return cart_item_list;
    }
    else {
        return cartItemsList;
    }
}


// обновляет корзину после изменения количества позиции в куках
let handleCartUpdateFromCookie = (cart_item_id, cart_item_quantity, cart_item_comment, is_selected, action, is_selected_all) => {
    let cartItemsListCookie = getCartItemsListCookie('cart_items_list');

    if (cartItemsListCookie) {
        let cartItemsList = JSON.parse(cartItemsListCookie);
    
        let cart_item = setCartItemNewDataForCookie(cartItemsList, cart_item_id, cart_item_quantity, cart_item_comment, is_selected);

        let cart_item_list = setCartItemAtBegging(cartItemsList, cart_item_id, cart_item);
        
        cart_item_list = deleteCartItmesCookie(cartItemsList, action);

        let cart_item_count = getCartItemCount(cart_item_list);
    
        setCartItemsListCookie(cart_item_list);
    
        renderCartItemsDataFromCookie();
    
        displayOrderItemsCount({cart_items_count: cart_item_count});
    
        setCartItemUpdateInfo();
    }
}


// обновляет или удаляет количество для позиции корзины
let handleCartItemQuantity = (method, element) => {
    let cart_item_id = element.getAttribute('data-cart_item_id');
    let max_quantity = element.getAttribute('data-max_quantity');
    let is_selected = element.getAttribute('data-is_selected');

    let cart_item_quantity = element.value;

    if (parseInt(element.value) > parseInt(max_quantity)) {
        element.style.borderColor = 'red';
        window.quantityReady = false;
    }
    else if (parseInt(element.value) == 0) {
        element.style.borderColor = 'red';
        window.quantityReady = false;
    }
    else if (element.value == '') {
        element.style.borderColor = 'red';
        window.quantityReady = false;
    }
    else {
        element.style.borderColor = 'rgba(209, 213, 219)';  // gray

        window.quantityReady = true;

        let url = `${window.location.origin}/cart/api/v0/send-data-for-update-cart-item/quantity/`;
        let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    
        let options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'cart_item_id': cart_item_id,
                'cart_item_quantity': cart_item_quantity,
                'is_selected': (is_selected == 'True') ? true : false,
            })
        }

        if (is_authenticated == 'True') {
            fetch(url, options)
            .then(response => response.json())
            .then(data => {
                setTimeout(function(){
                    window.location.href = window.location.href;
                }, 250);
            })
        }

        else if (is_authenticated == 'False') {
            handleCartUpdateFromCookie(cart_item_id, cart_item_quantity, null, null, null, null);
        }
    }
}


// обновляет количество для позиции корзины
let updateCartItemQuantity = (element) => {
    let cart_item_quantity = element.value;

    if (parseInt(cart_item_quantity) >= 0) {
        handleCartItemQuantity('POST', element);
    }
    // if (parseInt(cart_item_quantity) == 0) {
    //     handleCartItemQuantity('DELETE', element);
    // }

    if (cart_item_quantity == '') {
        handleCartItemQuantity('POST', element);
    }
}
//