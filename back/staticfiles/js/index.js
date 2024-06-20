// помещает username в localStorage
let setUsernameLocalStorage = () => {
    if (is_anonymous == 'False') {
        localStorage.setItem('username', user_name);
        localStorage.setItem('is_authenticated', true);
    }
    else {
        localStorage.removeItem('username');
        if (localStorage.getItem('is_authenticated') != undefined){
            localStorage.setItem('is_authenticated', false);
        }
    }
}
setTimeout(function(){
    setUsernameLocalStorage();
}, 250);


// отправляет данные для позиций корзины из куки на сервер
let sendCartItemsCookieToServer = (redirect_after_auth_to) => {
    setTimeout(function() {
        let cookie_name = 'cart_items_list';
        let cartItemsListCookie = getCartItemsListCookie(cookie_name);
        cartItemsListCookie = JSON.parse(cartItemsListCookie);

        let url = `${window.location.origin}/cart/api/v0/set-cart-items-from-cookie/`;
        let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'cart_items_list_cookie': cartItemsListCookie,
            })
        }
        fetch(url, options)
        .then(response => response.json())
        .then(data => {
            setTimeout(function(){
                window.localStorage.removeItem('redirect_after_auth_to');

                removeCartItemsCookie(cookie_name);

                window.location.href = redirect_after_auth_to;
            }, 100);
        })
    }, 500)
}


// переадресовывает после авторизации/регистрации
let redirectAfterAuthentication = () => {
    let redirect_after_auth_to = window.localStorage.getItem('redirect_after_auth_to');
    if (redirect_after_auth_to && is_anonymous == 'False'){
        if (redirect_after_auth_to == `${window.location.origin}/profile/user/cart/`) {
            sendCartItemsCookieToServer(redirect_after_auth_to);
        }
    };
}


setTimeout(function(){
    redirectAfterAuthentication();
}, 250);


// переадресовывает на страницу, где пользователь авторизовывался
setTimeout(() => {
    let redirect_after_auth_to = localStorage.getItem('redirect_after_auth_to');
    if (redirect_after_auth_to !== null) {
        localStorage.removeItem('redirect_after_auth_to');
        window.location.href = redirect_after_auth_to;
    }

}, 500);
