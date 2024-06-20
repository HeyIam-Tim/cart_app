product_info_detail = document.querySelector('#product_info_detail')
titles = document.querySelector('#titles')

description_title = document.querySelector('#description_title')

gif_spin = document.querySelector('#gif_spin')

price_buttons = document.querySelector('#price_buttons')
table_title = document.querySelector('#table_title')
gif_spin_wrapper = document.querySelector('#gif_spin_wrapper')
message_popup = document.querySelector('#message_popup')
close_icon_email = document.querySelector('#close_icon_email')
popup_enter_email = document.querySelector('#popup_enter_email')
popup_confirm_email = document.querySelector('#popup_confirm_email')
entered_email = document.querySelector('#entered_email')
text_confirm_email = document.querySelector('#text_confirm_email')
enter_email_title = document.querySelector('#enter_email_title')
send_offers_email_btn = document.querySelector('#send_offers_email_btn')
authenticate_link = document.querySelector('#authenticate_link')
authenticate_user = document.querySelector('#authenticate_user')

telegram_popup = document.querySelector('#telegram_popup')
telegram_authentication = document.querySelector('#telegram_authentication')


let whiteSpace = '&nbsp;';


// устанавливает переадресацию
let setRedirect = () => {
    localStorage.setItem('redirect_after_auth_to', window.location.href);
};


// кнопка 'авторизоваться через Telegram'
let authenticateViaTelegram = (element) => {
    element.parentElement.parentElement.style.display = 'none';
    document.querySelector('#authenticateViaTelegramPopup').style.display = 'block';
    setRedirect();
}


// делает кнопку отправки предложений по емейл некликабельной
let unclickSendEmailOffersBtn = () => {
    send_offers_email_btn.onclick = '';
    send_offers_email_btn.classList.remove("bg-red-700");
    send_offers_email_btn.classList.add("bg-red-400");
    send_offers_email_btn.style.cursor = 'default';
}


let get_public_shop_href = (offer) => {
    let shop_name = offer.shop_name.replaceAll(' ', '%%%');
    let public_shop_href = `${window.location.origin}/public-shop/?shop_name=${shop_name}`;
    return public_shop_href;
}


let get_cross_link = (offer) => {
    let cross_link = `<a target="_blank" class="block stem-medium pt-1" href="${window.location.origin}/product/?partnumber=${offer.article}&brand=${offer.brand}&pname=${offer.product_name}&pmodel=&pmodif=&product_id=">${offer.brand}${whiteSpace}<span class="underline underline-offset-4">${offer.article}</span></a>`;
    return cross_link;
}


let get_one_offer = (public_shop_href, offer, cross_link, city_id, unique_id) => {
    let favourite_icon = (is_anonymous == 'True') ? '' : `<span class="block text-gray-300 cursor-pointer" onclick="chooseFavouriteOffer(this)"
    data-product_name="${offer.product_name}"
    data-article="${offer.article}"
    data-brand="${offer.brand}"
    data-shop_name="${offer.shop_name}"
    data-address="${offer.address}"
    data-phone="${offer.phone}"
    data-url="${offer.site}"
    data-quantity="${offer.quantity}"
    data-price="${offer.price}"
    data-delivery_period="${offer.delivery_period}">&#9733;</span>`;

    let favourite_icon_and_input_wrapper = `
    <td>
        <span class="p-3 block text-xl sm:text-2xl text-center">
            <span class="hide-cart flex flex-nowrap text-xl mb-1 sm:text-2xl text-gray-300 text-center">
                <input id="order_item_id${unique_id}_mobile" type="number" min="0" class="input_${unique_id} cart_count_value text-xs sm:text-sm text-gray-600 w-12 h-8 p-1 inline border border-gray-300 border-r-0 rounded-tl rounded-bl focus:outline-none" data-cart_icon_id="cart_icon_${unique_id}" onkeyup="triggerCart(this)"
                data-product_name="${offer.product_name}"
                data-article="${offer.article}"
                data-brand="${offer.brand}"
                data-shop_name="${offer.shop_name}"
                data-address="${offer.address}"
                data-phone="${offer.phone}"
                data-url="${offer.site}"
                data-quantity="${offer.quantity}"
                data-price="${offer.price}"
                data-delivery_period="${offer.delivery_period}"
                
                data-cart_icon_id="cart_icon_${unique_id}"
                data-unique_id="order_item_id${unique_id}"
                data-unique_offer_id="${offer.unique_offer_id}"
                >

                <img id="cart_icon_${unique_id}_mobile" class="inline w-7 h-8 p-0.5 border border-gray-300 rounded-tr rounded-br" src="${window.location.origin}/static/images/cart_plus.svg"
                data-cart_icon_id="cart_icon_${unique_id}"
                data-unique_id="${unique_id}"
                data-viewpoint="_mobile"
                data-quantity="${offer.quantity}"
                alt="cart-icon" onclick="addCartItemCount(this)">
            </span>
            ${favourite_icon}
    </td>`;

    let show_delivery_form_btn = (is_anonymous == 'True') ? '' : `<button data-delivery_product_name="${offer.product_name}" data-delivery_article="${offer.article}" data-delivery_brand="${offer.brand}" data-offer_price="${offer.price}" data-shop_address="${offer.address}" data-delivery_shop_name="${offer.shop_name}" data-delivery_phone_from="${offer.phone}" class="text-white p-1 md:px-2 bg-red-600 rounded" onclick="showDeliveryForm(this)">расчитать</button>`;

    let brand_article = `<span class="block pt-1 stem-medium">${offer.brand}${whiteSpace}${offer.article}</span>`;

    let one_offer =
        `<tr id="" class="row_offer border-b">
        <td><span class="relative pl-0 sm:pl-5 p-3 hidden sm:block text-align-left"><a href="#shop_info_popup" class="block underline underline-offset-4 cursor-pointer" title="${offer.domain}" onclick="handleShopPopup(this)" data-shop_name="${offer.shop_name}">${offer.shop_name}</a></span></td>
        <td><span class="p-3 text-align-left"><a href="#shop_info_popup" class="block sm:hidden underline underline-offset-4 cursor-pointer" title="${offer.domain}" onclick="handleShopPopup(this)" data-shop_name="${offer.shop_name}">${offer.shop_name}</a><a href="${public_shop_href}" target="_blank">${(offer.original == true) ? brand_article : cross_link}<span class="block pt-1">${offer.product_name}</span></a></span></td>
        <td><span class="p-3 text-center"><a href="${public_shop_href}" target="_blank"><span class="block sm:hidden pb-1">${offer.price}${whiteSpace}₽</span><span class="block text-center">${offer.quantity}${whiteSpace}шт</span><span class="block sm:hidden pt-1">${offer.delivery_period == 'В&nbsp;наличии' ? `${offer.delivery_period}` : `${whiteSpace}${offer.delivery_period}${whiteSpace}д${whiteSpace}`}</span></a></span></td>
        <td><span class="p-3 hidden sm:block text-center">${offer.price}${whiteSpace}₽</span></td>
        <td><span><a class="p-3 hidden sm:block text-center" href="${public_shop_href}" target="_blank">${offer.delivery_period == 'В&nbsp;наличии' ? `${offer.delivery_period}` : `${whiteSpace}${offer.delivery_period}${whiteSpace}д${whiteSpace}`}</a></span></td>
        ${favourite_icon_and_input_wrapper}

        <td>
            <span class="hidden sm:block p-3 block text-xl sm:text-2xl text-center">
                <span class="flex flex-nowrap text-xl mb-1 sm:text-2xl text-gray-300 text-center">
                    <input id="order_item_id${unique_id}" type="number" min="0" class="input_${unique_id} cart_count_value input_value w-12 h-8 p-1 inline border border-gray-300  rounded-tl rounded-bl focus:outline-none text-xs sm:text-sm text-gray-600"
                    onkeyup="triggerCart(this)"
                    data-product_name="${offer.product_name}"
                    data-article="${offer.article}"
                    data-brand="${offer.brand}"
                    data-shop_name="${offer.shop_name}"
                    data-address="${offer.address}"
                    data-phone="${offer.phone}"
                    data-url="${offer.site}"
                    data-quantity="${offer.quantity}"
                    data-price="${offer.price}"
                    data-delivery_period="${offer.delivery_period}"

                    data-cart_icon_id="cart_icon_${unique_id}"
                    data-unique_id="order_item_id${unique_id}"
                    data-unique_offer_id="${offer.unique_offer_id}"
                    >
                    <img id="cart_icon_${unique_id}" class="inline w-7 h-8 p-0.5 border border-gray-300 rounded-tr rounded-br cursor-pointer" src="${window.location.origin}/static/images/cart_plus.svg"
                    data-cart_icon_id="cart_icon_${unique_id}"
                    data-unique_id="${unique_id}"
                    data-viewpoint=""
                    data-quantity="${offer.quantity}"
                    alt="cart-icon" onclick="addCartItemCount(this)">
                </span>
            </span>
        </td
    </tr>`;
    return one_offer;
}


// Выводит предложения на страницу
let renderOffers = (data, city_id) => {
    off_waiting_for_offers(data.offers)

    if (window.offers == undefined) {
        window.offers = data.offers.length;
    }
    else {
        window.offers += data.offers.length;
    }

    let table_originals = document.querySelector('#table_originals');
    let table_crosses = document.querySelector('#table_crosses');
    let delivery_btn = document.querySelector('#delivery_btn');
    let table_originals_with_delivery = document.querySelector('#table_originals_with_delivery');

    let delivery_count = 0;
    let in_stock_count = 0;
    let analogs_in_stock_count = 0;
    let originals_with_delivery_count = 0;

    window.all_delivery = new Array();
    window.offers_in_stock = new Array();
    window.analogs_offers_in_stock = new Array();

    window.arrayDeliveryOffersMore = new Array();
    window.arrayDeliveryOffersAll = new Array();

    window.arrayOriginalArticleOffersMore = new Array();
    window.arrayOriginalArticleOffersAll = new Array();

    window.arrayCrossArticleOffersMore = new Array();
    window.arrayCrossArticleOffersAll = new Array();

    window.arrayOriginalsWithDeliveryAll = new Array();

    for (let i = 0; i < data.offers.length; i++) {
        const offer = data.offers[i];

        setTimeout(function timer() {
            let public_shop_href = get_public_shop_href(offer);
            let cross_link = get_cross_link(offer);

            let order_item_id = Date.now().toString(16) + Date.now().toString(16);

            let one_offer = get_one_offer(public_shop_href, offer, cross_link, city_id, order_item_id);

            // запрашиваемые артикулы в наличии
            if (offer.original == true && offer.delivery == false) {
                // offers_table.insertAdjacentHTML("afterbegin", table_header);
                // offers_table.insertAdjacentHTML("beforeend", one_offer);

                window.arrayOriginalArticleOffersAll.push(offer);

                in_stock_count += 1;
                if (in_stock_count <= 10) {
                    table_originals.innerHTML += one_offer;
                    window.arrayOriginalArticleOffers.push(offer);
                }
                else {
                    document.querySelector('#in_stock_pagination').style.display = 'flex';

                    window.offers_in_stock.push(one_offer);                    
                    window.arrayOriginalArticleOffersMore.push(offer);

                    gif_spin_wrapper.style.display = 'block';
                    gif_spin.style.display = 'none';
                }
            }
            //

            // запрашиваемые артикулы с доставкой
            if (offer.original == true && offer.delivery == true) {
                if (table_originals_with_delivery.style.display != 'table') {
                    table_originals_with_delivery.style.display = 'table';
                }

                window.arrayOriginalsWithDeliveryAll.push(offer);

                originals_with_delivery_count += 1;
                if (originals_with_delivery_count <=10) {
                    table_originals_with_delivery.innerHTML += one_offer;
                }
                else {
                    document.querySelector('#originals_with_delivery_pagination').style.display = 'flex';
                }
            }
            //

            // аналоги в наличии
            if (offer.original == false && offer.delivery == false) {
                if (table_crosses.style.display != 'table') {
                    table_crosses.style.display = 'table';
                }

                window.arrayCrossArticleOffersAll.push(offer);

                analogs_in_stock_count += 1;
                if (analogs_in_stock_count <= 10) {
                    table_crosses.innerHTML += one_offer;
                    window.arrayCrossArticleOffers.push(offer);
                }
                else {
                    document.querySelector('#analogs_in_stock_pagination').style.display = 'flex';

                    gif_spin_wrapper.style.display = 'block';
                    gif_spin.style.display = 'none';

                    window.analogs_offers_in_stock.push(one_offer);

                    window.arrayCrossArticleOffersMore.push(offer);
                }
            }
            //

            // аналоги с доставкой
            if (offer.original == false && offer.delivery == true) {
                delivery_btn.style.display = 'block';
                gif_spin_wrapper.style.display = 'block';
                gif_spin.style.display = 'none';

                delivery_count += 1;

                window.arrayDeliveryOffersAll.push(offer);

                if (delivery_count <= 10) {
                    table_delivery.innerHTML += one_offer;
                    window.arrayDeliveryOffers.push(offer);
                }
                else {
                    window.all_delivery.push(one_offer);
                    window.arrayDeliveryOffersMore.push(offer);
                }
            }
            //

            one_offer = '';

            let row_offers = document.querySelectorAll('.row_offer');
            if (row_offers.length == window.offers) {
                gif_spin_wrapper.style.display = 'block';
                gif_spin.style.display = 'none';
            }
        }, i * 1
        );
    }

    checkQuantityOriginArticles(data);

    setTimeout(() => {
        handle_pagination(data, city_id);
    }, 1000);
}

let checkQuantityOriginArticles = (data) => {
    let origin = false;
    for (let i = 0; i < data.offers.length; i++) {
        const offer = data.offers[i];
        if (offer.original == true && offer.delivery == false) {
            origin = true;
            break
        }
        else {
            origin = false;
        }
    }
    if (origin == false) {
        document.querySelector('#try_telegram').style.display = 'block';
        document.querySelector('#try_telegram').style.marginTop = '5px';
        document.querySelector('#telegram_btn').style.display = 'block';
        document.querySelector('#table_originals').innerHTML = get_table_block_title(original_article_title);

        document.querySelector('#table_delivery').style.display = 'table';
        document.querySelector('#pagination').style.display = 'flex';

        document.querySelector('#delivery_btn').innerHTML = 'Скрыть аналоги с доставкой';
        document.querySelector('#delivery_btn').classList.add('open');
    }
}


original_article_title = `Товары (${article}) в наличии`;
originals_with_delivery_title = `Товары (${article}) с доставкой`;

cross_article_title = 'Аналоги в наличии';
delivery_article_title = 'Аналоги с доставкой';

sorting_icon_up = '&#9650;';
sorting_icon_down = '&#9660;';


let get_table_block_title = (title) => {
    let table_block_title = `
        <tr class="w-full bg-white">
            <th class="pt-5 pb-2 bg-white text-sm sm:text-base stem-medium text-align-left" colspan="20">${title}</th>
        </tr>`;
    return table_block_title;
}


let get_table_header = (onclick_price, sorting_icon_price, onclick_delivery_period, sorting_icon_delivery_period) => {
    let favourite_column = `<th><span class="p-3 hidden sm:block text-2xl text-yellow-500 text-center cursor-pointer">${(is_anonymous == 'True') ? '' : '&#9733;'}</span></th>`;

    let table_header = `
    <tr id="table_title" class="bg-gray-100">
        <th><span class="pl-0 sm:pl-5 p-3 hidden sm:block stem-medium text-align-left">Магазин</span></th>
        <th><span class="pl-0 sm:pl-3 p-3 block stem-medium text-center align-left"><span class="block sm:hidden underline underline-offset-4 text-lighter">Магазин</span><span class="block pt-1">Бренд Артикул</span><span class="block text-lighter pt-1">Описание</span></span></th> 

        <th>
            <span class="p-3 stem-medium text-lighter text-center">
                <span class="block sm:hidden pb-1" onclick="${onclick_price}()">Цена${whiteSpace}за${whiteSpace}шт${whiteSpace}<span>${sorting_icon_price}</span></span>
                <span class="block">Наличие</span>
                <span class="inline-block sm:hidden pt-1" onclick="${onclick_delivery_period}()">
                    <img src="${window.location.origin}/static/images/Truck-Background.svg" class="w-5 mx-auto inline" alt="грузовик">
                    <span>${sorting_icon_delivery_period}</span>
                </span>
            </span>
        </th>

        <th><span class="p-3 hidden sm:block cursor-pointer stem-medium text-center" onclick="${onclick_price}()">Цена<span>${sorting_icon_price}</span></span></th>
        
        <th>
            <span class="cursor-pointer" onclick="${onclick_delivery_period}()">
                <img class="hidden sm:inline-block w-7 mx-auto" src="${window.location.origin}/static/images/Truck-Background.svg" alt="Время доставки" title="Время доставки"><span class="hidden sm:inline-block">${whiteSpace}<span>${sorting_icon_delivery_period}</span></span>
            </span>
        </th>

        ${favourite_column}

        <th>
            <span class="p-3 hidden sm:block text-2xl text-yellow-500 text-center cursor-pointer"></span>
        </th>
    </tr>`;
    return table_header;
}


// Показывает таблице с доставкой
let showDelivery = (element) => {
    if (!element.classList.contains('open')) {
        table_delivery.style.display = 'table';
        element.innerHTML = 'Скрыть аналоги с доставкой';

        element.classList.add('open');

        // document.querySelector('#more_delivery_btn').style.display = 'block';
        document.querySelector('#pagination').style.display = 'flex';
        if (Object.keys(window.paginator).length <= 1) {
            document.querySelector('#pagination').style.display = 'none';
        }
    }
    else {
        table_delivery.style.display = 'none';
        element.innerHTML = 'Показать аналоги с доставкой';

        element.classList.remove('open');

        // document.querySelector('#more_delivery_btn').style.display = 'none';
        document.querySelector('#pagination').style.display = 'none';

    }
}


// Показывает еще доставку
let showMoreDelivery = (element) => {
    let table_delivery = document.querySelector('#table_delivery');

    let delivery_sliced = window.all_delivery.splice(0, 10);
    let arrayDeliveryOffersMoreSliced = window.arrayDeliveryOffersMore.splice(0, 10);

    for (let i = 0; i < delivery_sliced.length; i++) {
        const iterator = delivery_sliced[i];

        setTimeout(function timer() {
            table_delivery.innerHTML += iterator;
        }, i * 50);
    }
    for (const iterator of arrayDeliveryOffersMoreSliced) {
        window.arrayDeliveryOffers.push(iterator);
    }

    if (window.all_delivery.length == 0) {
        element.style.display = 'none';
    }
}


let timeOutForOffers = () => {
    if (window.offers == 0 || window.offers == undefined) {
        let try_telegram = document.querySelector('#try_telegram');
        let gif_spin_wrapper = document.querySelector('#gif_spin_wrapper');
        let telegram_btn = document.querySelector('#telegram_btn');

        gif_spin_wrapper.style.display = 'none';
        telegram_btn.style.display = 'block';
        try_telegram.style.display = 'block';
    }
}


let getOffersDocpart = (city_id) => {
    let url = `${window.location.origin}/api/v0/get-offers-docpart/?city_id=${city_id}&article=${article}&brand=${brand}`;
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            renderOffers(data, city_id, city_location)
        })
}


let getOffers = () => {
    window.arrayOriginalArticleOffers = new Array();
    window.arrayCrossArticleOffers = new Array();
    window.arrayDeliveryOffers = new Array();

    let table_originals = document.querySelector('#table_originals');
    let table_crosses = document.querySelector('#table_crosses');
    let table_delivery = document.querySelector('#table_delivery');
    let table_originals_with_delivery = document.querySelector('#table_originals_with_delivery');

    city_location = localStorage.getItem('city_location');
    city_id = getCityID();
    if (city_id) {
        setTimeout(function () {
            timeOutForOffers();
        }, 60000)

        table_originals.innerHTML = get_table_block_title(original_article_title);
        window.original_delivery_period_ascending = true;
        table_originals.innerHTML += get_table_header('sortOriginalArticlePrices', sorting_icon_up, 'sortOriginalArticleByDeliveryPeriod', sorting_icon_down);

        table_crosses.innerHTML = get_table_block_title(cross_article_title);
        window.crosses_delivery_period_ascending = true;
        table_crosses.innerHTML += get_table_header('sortCrossesArticlePrices', sorting_icon_up, 'sortCrossesArticleByDeliveryPeriod', sorting_icon_down);

        table_delivery.innerHTML = get_table_block_title(delivery_article_title);
        window.delivery_delivery_period_ascending = true;
        table_delivery.innerHTML += get_table_header('sortDeliveryPrices', sorting_icon_up, 'sortDeliveryByDeliveryPeriod', sorting_icon_down);

        table_originals_with_delivery.innerHTML = get_table_block_title(originals_with_delivery_title);
        window.originals_with_delivery_delivery_period_ascending = true;
        table_originals_with_delivery.innerHTML += get_table_header('sortOriginalsWithDeliveryPrices', sorting_icon_up, 'sortOriginalsWithDeliveryByDeliveryPeriod', sorting_icon_down);

        gif_spin_wrapper.style.display = 'block';
        gif_spin.style.display = 'block';

        // let url = `${window.location.origin}/api/v0/get-offers/?product_name=${product_name ? product_name : ''}&article=${article}&brand=${brand}&city_id=${city_id}`;
        let url = `${window.location.origin}/api/v0/get-offers-async/?product_name=${product_name ? product_name : ''}&article=${article}&brand=${brand}&city_id=${city_id}&to_cache=True`;

        fetch(url)
        .then(resp => resp.json())
        .then(data => {
            if (data.call_websocket) {
                // получение предложений через вебсокеты
                const offers = new WebSocket((window.location.protocol == 'https:') ? (`wss://${window.location.host}/ws/offers/`) : `ws://${window.location.host}/ws/offers/`);

                setTimeout(function () {
                    offers.send(JSON.stringify({
                        'article': article,
                        'brand': brand,
                        'product_name': product_name,
                        'city_id': city_id,
                    }))
                }, 2500);

                offers.onmessage = function (e) {
                    let data = JSON.parse(e.data)
                    if (data.info == 'FINISHED') {
                        timeOutForOffers();
                        offers.close(1000, "Work complete");

                        // открывает попап с авторизацией или кнопками для предложений
                        if (window.offers == 0) {
                            openAuthenticationsPopup();
                        }
                        // 

                    }
                    else {
                        renderOffers(data, city_id, city_location)
                    }
                }
            }
            else {
                renderOffers(data, city_id, city_location);

                // открывает попап с авторизацией или кнопками для предложений
                if (window.offers == 0) {
                    openAuthenticationsPopup();
                }
                // 

            }
        })
    }

}


// (вспомогательная) сортирует запрашиваемый артикул в наличии по цене
let sortOriginalArticlePricesHelper = (is_reveresed, sorting_icon_delivery_period) => {

    let arrayOriginalArticleOffersSorted = localeComparePrices(window.arrayOriginalArticleOffersAll);
    
    table_originals.innerHTML = '';
    table_originals.innerHTML = get_table_block_title(original_article_title);
    
    let sorting_icon_price = '';

    if (is_reveresed) {
        arrayOriginalArticleOffersSorted  = arrayOriginalArticleOffersSorted.reverse();

        sorting_icon_price = sorting_icon_up;

    }
    else {
        sorting_icon_price = sorting_icon_down;

    }

    table_originals.innerHTML += get_table_header('sortOriginalArticlePrices', sorting_icon_price, 'sortOriginalArticleByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayOriginalArticleOffersSorted, table_originals);

    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_originals_in_stock();
    }, timeOut);

};
// 


// сортирует запрашиваемый артикул в наличии по цене
let sortOriginalArticlePrices = () => {

    let sorting_icon_delivery_period = '';
    if (window.original_delivery_period_ascending == undefined) {
        sorting_icon_delivery_period = sorting_icon_up;
    }
    else if (window.original_delivery_period_ascending == true) {
        sorting_icon_delivery_period = sorting_icon_down;
    }
    else {
        sorting_icon_delivery_period = sorting_icon_up;
    }

    if (window.original_price_ascending == undefined || window.original_price_ascending == false) {
        window.original_price_ascending = true;

        sortOriginalArticlePricesHelper(false, sorting_icon_delivery_period);

    }
    else if (window.original_price_ascending == true) {
        window.original_price_ascending = false;

        sortOriginalArticlePricesHelper(true, sorting_icon_delivery_period);

    }
}
// 


// (вспомогательная) сортирует запрашиваемый артикул с доставкой по цене
let sortOriginalsWithDeliveryPricesHelper = (is_reveresed, sorting_icon_delivery_period) => {

    let arrayOriginalsWithDeliverySorted = localeComparePrices(window.arrayOriginalsWithDeliveryAll);
    
    table_originals_with_delivery.innerHTML = '';
    table_originals_with_delivery.innerHTML = get_table_block_title(originals_with_delivery_title);
    
    let sorting_icon_price = '';

    if (is_reveresed) {
        arrayOriginalsWithDeliverySorted  = arrayOriginalsWithDeliverySorted.reverse();

        sorting_icon_price = sorting_icon_up;

    }
    else {
        sorting_icon_price = sorting_icon_down;

    }

    table_originals_with_delivery.innerHTML += get_table_header('sortOriginalsWithDeliveryPrices', sorting_icon_price, 'sortOriginalsWithDeliveryByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayOriginalsWithDeliverySorted, table_originals_with_delivery);

    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_originals_with_delivery();
    }, timeOut);

};
// 


// сортирует запрашиваемый артикул с доставкой по цене 
let sortOriginalsWithDeliveryPrices = () => {

    let sorting_icon_delivery_period = '';
    if (window.originals_with_delivery_delivery_period_ascending == undefined) {
        sorting_icon_delivery_period = sorting_icon_up;
    }
    else if (window.originals_with_delivery_delivery_period_ascending == true) {
        sorting_icon_delivery_period = sorting_icon_down;
    }
    else {
        sorting_icon_delivery_period = sorting_icon_up;
    }

    if (window.originals_with_delivery_price_ascending == undefined || window.originals_with_delivery_price_ascending == false) {
        window.originals_with_delivery_price_ascending = true;

        sortOriginalsWithDeliveryPricesHelper(false, sorting_icon_delivery_period);

    }
    else if (window.originals_with_delivery_price_ascending == true) {
        window.originals_with_delivery_price_ascending = false;

        sortOriginalsWithDeliveryPricesHelper(true, sorting_icon_delivery_period);

    }
}
// 


// (вспомогательная) сортирует аналоги в наличии по цене
let sortCrossesArticlePricesHelper = (is_reveresed, sorting_icon_delivery_period) => {

    let arrayCrossesArticleOffersSorted = localeComparePrices(window.arrayCrossArticleOffersAll);
    
    table_crosses.innerHTML = '';
    table_crosses.innerHTML = get_table_block_title(cross_article_title);
    
    let sorting_icon_price = '';

    if (is_reveresed) {
        arrayCrossesArticleOffersSorted  = arrayCrossesArticleOffersSorted.reverse();

        sorting_icon_price = sorting_icon_up;

    }
    else {
        sorting_icon_price = sorting_icon_down;

    }

    table_crosses.innerHTML += get_table_header('sortCrossesArticlePrices', sorting_icon_price, 'sortCrossesArticleByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayCrossesArticleOffersSorted, table_crosses);

    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_analogs_in_stock();
    }, timeOut);

};
// 


// сортирует аналоги в наличии по цене
let sortCrossesArticlePrices = () => {

    let sorting_icon_delivery_period = '';
    if (window.crosses_delivery_period_ascending == undefined) {
        sorting_icon_delivery_period = sorting_icon_up;
    }
    else if (window.crosses_delivery_period_ascending == true) {
        sorting_icon_delivery_period = sorting_icon_down;
    }
    else {
        sorting_icon_delivery_period = sorting_icon_up;
    }

    if (window.crosses_price_ascending == undefined || window.crosses_price_ascending == false) {
        window.crosses_price_ascending = true;

        sortCrossesArticlePricesHelper(false, sorting_icon_delivery_period);
    }
    else if (window.crosses_price_ascending == true) {
        window.crosses_price_ascending = false;

        sortCrossesArticlePricesHelper(true, sorting_icon_delivery_period);
    }
}
// 


// (вспомогательная) сортирует аналоги с доставкой по цене
let sortDeliveryPricesHelper = (is_reveresed, sorting_icon_delivery_period) => {

    let arrayDeliveryOffersSorted = localeComparePrices(window.arrayDeliveryOffersAll);
    
    table_delivery.innerHTML = '';
    table_delivery.innerHTML = get_table_block_title(delivery_article_title);
    
    let sorting_icon_price = '';

    if (is_reveresed) {
        arrayDeliveryOffersSorted  = arrayDeliveryOffersSorted.reverse();

        sorting_icon_price = sorting_icon_up;

    }
    else {
        sorting_icon_price = sorting_icon_down;

    }

    table_delivery.innerHTML += get_table_header('sortDeliveryPrices', sorting_icon_price, 'sortDeliveryByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayDeliveryOffersSorted, table_delivery);

    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_analogs_with_delivery();
    }, timeOut);

};
// 


// сортирует аналоги с доставкой по цене
let sortDeliveryPrices = () => {

    let sorting_icon_delivery_period = '';
    if (window.delivery_delivery_period_ascending == undefined) {
        sorting_icon_delivery_period = sorting_icon_up;
    }
    else if (window.delivery_delivery_period_ascending == true) {
        sorting_icon_delivery_period = sorting_icon_down;
    }
    else {
        sorting_icon_delivery_period = sorting_icon_up;
    }

    if (window.delivery_price_ascending == undefined || window.delivery_price_ascending == false) {
        window.delivery_price_ascending = true;

        sortDeliveryPricesHelper(false, sorting_icon_delivery_period);
    }
    else if (window.delivery_price_ascending == true) {
        window.delivery_price_ascending = false;

        sortDeliveryPricesHelper(true, sorting_icon_delivery_period);
    }
}
// 


// (вспомогательная) сортирует запрашиваемый артикул в наличии по времени доставки
let sortOriginalArticleByDeliveryPeriodHelper = (is_reveresed, sorting_icon_price) => {

    let arrayOriginalArticleOffersSorted = localeCompareDeliveries(window.arrayOriginalArticleOffersAll);
    
    table_originals.innerHTML = '';
    table_originals.innerHTML = get_table_block_title(original_article_title);
    
    let sorting_icon_delivery_period = '';

    if (is_reveresed) {
        arrayOriginalArticleOffersSorted  = arrayOriginalArticleOffersSorted.reverse();

        sorting_icon_delivery_period = sorting_icon_up;

    }
    else {
        sorting_icon_delivery_period = sorting_icon_down;

    }

    table_originals.innerHTML += get_table_header('sortOriginalArticlePrices', sorting_icon_price, 'sortOriginalArticleByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayOriginalArticleOffersSorted, table_originals);

    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_originals_in_stock();
    }, timeOut);

};
// 


// сортирует запрашиваемый артикул в наличии по времени доставки
let sortOriginalArticleByDeliveryPeriod = () => {

    let sorting_icon_price = '';
    if (window.original_price_ascending == undefined) {
        sorting_icon_price = sorting_icon_up;
    }
    else if (window.original_price_ascending == true) {
        sorting_icon_price = sorting_icon_down;
    }
    else {
        sorting_icon_price = sorting_icon_up;
    }

    if (window.original_delivery_period_ascending == undefined || window.original_delivery_period_ascending == false) {
        window.original_delivery_period_ascending = true;

        sortOriginalArticleByDeliveryPeriodHelper(false, sorting_icon_price);

    }
    else if (window.original_delivery_period_ascending == true) {
        window.original_delivery_period_ascending = false;

        sortOriginalArticleByDeliveryPeriodHelper(true, sorting_icon_price);

    }
}
// 


// (вспомогательная) сортирует запрашиваемый артикул с доставкой по времени доставки
let sortOriginalsWithDeliveryByDeliveryPeriodHelper = (is_reveresed, sorting_icon_price) => {

    let arrayOriginalsWithDeliverySorted = localeCompareDeliveries(window.arrayOriginalsWithDeliveryAll);
    
    table_originals_with_delivery.innerHTML = '';
    table_originals_with_delivery.innerHTML = get_table_block_title(originals_with_delivery_title);
    
    let sorting_icon_delivery_period = '';

    if (is_reveresed) {
        arrayOriginalsWithDeliverySorted  = arrayOriginalsWithDeliverySorted.reverse();

        sorting_icon_delivery_period = sorting_icon_up;

    }
    else {
        sorting_icon_delivery_period = sorting_icon_down;

    }

    table_originals_with_delivery.innerHTML += get_table_header('sortOriginalsWithDeliveryPrices', sorting_icon_price, 'sortOriginalsWithDeliveryByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayOriginalsWithDeliverySorted, table_originals_with_delivery);

    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_originals_with_delivery();
    }, timeOut);
};
// 


// сортирует запрашиваемый артикул с доставкой по времени доставки
let sortOriginalsWithDeliveryByDeliveryPeriod = () => {

    let sorting_icon_price = '';
    if (window.originals_with_delivery_price_ascending == undefined) {
        sorting_icon_price = sorting_icon_up;
    }
    else if (window.originals_with_delivery_price_ascending == true) {
        sorting_icon_price = sorting_icon_down;
    }
    else {
        sorting_icon_price = sorting_icon_up;
    }

    if (window.originals_with_delivery_delivery_period_ascending == undefined || window.originals_with_delivery_delivery_period_ascending == false) {
        window.originals_with_delivery_delivery_period_ascending = true;

        sortOriginalsWithDeliveryByDeliveryPeriodHelper(false, sorting_icon_price);

    }
    else if (window.originals_with_delivery_delivery_period_ascending == true) {
        window.originals_with_delivery_delivery_period_ascending = false;

        sortOriginalsWithDeliveryByDeliveryPeriodHelper(true, sorting_icon_price);

    }
}
// 


// (вспомогательная) сортирует аналоги в наличии по времени доставки
let sortCrossesArticleByDeliveryPeriodHelper = (is_reveresed, sorting_icon_price) => {

    let arrayCrossesArticleOffersSorted = localeCompareDeliveries(window.arrayCrossArticleOffersAll);
    
    table_crosses.innerHTML = '';
    table_crosses.innerHTML = get_table_block_title(cross_article_title);
    
    let sorting_icon_delivery_period = '';

    if (is_reveresed) {
        arrayCrossesArticleOffersSorted  = arrayCrossesArticleOffersSorted.reverse();

        sorting_icon_delivery_period = sorting_icon_up;

    }
    else {
        sorting_icon_delivery_period = sorting_icon_down;

    }

    table_crosses.innerHTML += get_table_header('sortCrossesArticlePrices', sorting_icon_price, 'sortCrossesArticleByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayCrossesArticleOffersSorted, table_crosses);

    // handle_pagination_in_stock({'offers': window.arrayCrossArticleOffersAll});
    // handle_pagination_analogs_in_stock({'offers': window.arrayCrossArticleOffersAll});
    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_analogs_in_stock();
    }, timeOut);

};
// 


// сортирует аналоги в наличии по времени доставки
let sortCrossesArticleByDeliveryPeriod = () => {

    let sorting_icon_price = '';
    if (window.crosses_price_ascending == undefined) {
        sorting_icon_price = sorting_icon_up;
    }
    else if (window.crosses_price_ascending == true) {
        sorting_icon_price = sorting_icon_down;
    }
    else {
        sorting_icon_price = sorting_icon_up;
    }

    if (window.crosses_delivery_period_ascending == undefined || window.crosses_delivery_period_ascending == false) {
        window.crosses_delivery_period_ascending = true;

        sortCrossesArticleByDeliveryPeriodHelper(false, sorting_icon_price);

    }
    else if (window.crosses_delivery_period_ascending == true) {
        window.crosses_delivery_period_ascending = false;

        sortCrossesArticleByDeliveryPeriodHelper(true, sorting_icon_price);

    }
}
// 


// (вспомогательная) сортирует аналоги с доставкой по времени доставки
let sortDeliveryByDeliveryPeriodHelper = (is_reveresed, sorting_icon_price) => {

    let arrayDeliveryArticleOffersSorted = localeCompareDeliveries(window.arrayDeliveryOffersAll);
    
    table_delivery.innerHTML = '';
    table_delivery.innerHTML = get_table_block_title(delivery_article_title);
    
    let sorting_icon_delivery_period = '';

    if (is_reveresed) {
        arrayDeliveryArticleOffersSorted  = arrayDeliveryArticleOffersSorted.reverse();

        sorting_icon_delivery_period = sorting_icon_up;

    }
    else {
        sorting_icon_delivery_period = sorting_icon_down;

    }

    table_delivery.innerHTML += get_table_header('sortDeliveryPrices', sorting_icon_price, 'sortDeliveryByDeliveryPeriod', sorting_icon_delivery_period);

    renderSortedOffers(arrayDeliveryArticleOffersSorted, table_delivery);

    let timeOut = 500;
    setTimeout(() => {
        handle_pagination_analogs_with_delivery();
    }, timeOut);

};
// 


// сортирует аналоги с доставкой по времени доставки
let sortDeliveryByDeliveryPeriod = () => {

    let sorting_icon_price = '';
    if (window.delivery_price_ascending == undefined) {
        sorting_icon_price = sorting_icon_up;
    }
    else if (window.delivery_price_ascending == true) {
        sorting_icon_price = sorting_icon_down;
    }
    else {
        sorting_icon_price = sorting_icon_up;
    }

    if (window.delivery_delivery_period_ascending == undefined || window.delivery_delivery_period_ascending == false) {
        window.delivery_delivery_period_ascending = true;

        sortDeliveryByDeliveryPeriodHelper(false, sorting_icon_price);

    }
    else if (window.delivery_delivery_period_ascending == true) {
        window.delivery_delivery_period_ascending = false;

        sortDeliveryByDeliveryPeriodHelper(true, sorting_icon_price);

    }
}
// 


let renderSortedOffers = (sortedOffers, table) => {
    analogs_in_stock_count = 0;

    let city_id = localStorage.getItem('cityId');

    for (const offer of sortedOffers) {
        let public_shop_href = get_public_shop_href(offer);
        let cross_link = get_cross_link(offer);
        let order_item_id = Date.now().toString(16) + Date.now().toString(16);

        let one_offer = get_one_offer(public_shop_href, offer, cross_link, city_id, order_item_id);

        analogs_in_stock_count += 1;
        if (analogs_in_stock_count <= 10) {
            table.innerHTML += one_offer;
            one_offer = '';
        }
        else {
            break
        }

    };
}


let localeComparePrices = (arrayOffers) => {
    let arrayOffersSorted = arrayOffers.sort((a, b) => a.price.localeCompare(b.price, undefined, { 'numeric': true }));
    return arrayOffersSorted;
}


// сравнивает сроки доставки
let localeCompareDeliveries = (arrayOffers) => {
    let arrayOffersSorted = arrayOffers.sort((a, b) => a.delivery_period.localeCompare(b.delivery_period, undefined, { 'numeric': true }));
    return arrayOffersSorted;
}
//


let checkShopsRegion = (city_id) => {
    let url = `${window.location.origin}/api/v0/check-shops-region/?city_id=${city_id}`;
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            if (data.shops_exist == true) {
                getOffers(true);
            }
            else {
                getOffers(false);
            }
        })
}


let getAllOffers = () => {
    setTimeout(function () {

    city_id = getCityID();
    if (city_id) {
        getOffers();  
    }

    }, 100)

}
getAllOffers()


// Отправляет предложения по email
let sendOffersEmail = () => {
    overlay.style.display = 'block';
    let confirm_sending_offers_to_email = document.querySelector('#confirm_sending_offers_to_email');

    document.querySelector('#get_offers_btns').style.display = 'none';

    city_id = getCityID();
    if (city_id) {
        if (email !== '' && email !== 'User' && email !== 'Anonymous' && is_verified == 'True') {
            confirm_sending_offers_to_email.style.display = 'block';
        }

        if (email !== '' && email !== 'User' && email !== 'Anonymous' && is_verified == 'False') {

            popup_confirm_email.style.display = 'block';

            text_confirm_email.innerHTML = `На ${email} отправлено письмо для подтверждения.`;

            let url = `${window.location.origin}/api/v0/send-offers-email/?article=${article}&brand=${brand}&product_name=${product_name}&city_id=${city_id}`;
            fetch(url)
                .then(resp => resp.json())
                .then(data => { data })

            // unclickSendEmailOffersBtn()
        }

        if (email == 'User' && is_verified == 'False') {
            popup_enter_email.style.display = 'block';

            let auth_email = localStorage.getItem('auth_email');
            if (auth_email == null) {
                localStorage.setItem('auth_email', 'email');
            }

            user_redirect_url = localStorage.getItem('user_redirect_url');
            if (user_redirect_url == null) {
                localStorage.setItem('user_redirect_url', window.location.href);
            }

        }

        // аноним, нет емейла
        if (email == 'Anonymous' && is_verified == 'False') {
            popup_enter_email.style.display = 'block';

            let auth_email = localStorage.getItem('auth_email');
            if (auth_email == null) {
                localStorage.setItem('auth_email', 'email');
            }

            user_redirect_url = localStorage.getItem('user_redirect_url');
            if (user_redirect_url == null) {
                localStorage.setItem('user_redirect_url', window.location.href);
            }

        }
    }
}


// Закрывает попап отправка предложений по email
let closePopupOffersEmail = () => {
    let confirm_sending_offers_to_email = document.querySelector('#confirm_sending_offers_to_email');

    message_popup.style.display = 'none';
    message_telegram_popup.style.display = 'none';
    telegram_popup.style.display = 'none';
    telegram_authentication.style.display = 'none';
    popup_enter_email.style.display = 'none';
    popup_confirm_email.style.display = 'none';
    overlay.style.display = 'none';

    confirm_sending_offers_to_email.style.display = 'none';
}


// Подтверждение email'а
let ConfirmEmail = () => {
    email = entered_email.value;
    if (email !== '' && isEmailValid(email)) {
        popup_enter_email.style.display = 'none';
        popup_confirm_email.style.display = 'block';

        check_email_url = `${window.location.origin}/api/v0/check-email/?email=${email}`
        fetch(check_email_url)
            .then(resp => resp.json())
            .then(data => {
                // аноним, емейл есть в бд, просит авторизоваться
                if (data.user == 'Anonymous' && data.is_email_verified == false || data.user == 'Anonymous' && data.is_email_verified == true) {
                    text_confirm_email.innerHTML = `Email: ${email} уже есть, пожалуйста, авторизуйтесь.`;

                    authenticate_link.innerHTML = 'ссылка для авторизации';
                    authenticate_link.href = `${window.location.origin}/profile/login/`;
                }

                // если есть юзер и емейл, просит ввести другой емейл
                if (data.user == 'User' && data.is_email_verified == true || data.user == 'User' && data.is_email_verified == false) {
                    popup_confirm_email.style.display = 'none';
                    popup_enter_email.style.display = 'block';
                    entered_email.style.borderColor = 'red';
                    enter_email_title.innerHTML = `Такой email уже есть, введите другой или авторизуйтесь с email: ${email}`;
                    enter_email_title.classList.add('text-red-600');
                    authenticate_user.innerHTML = 'ссылка для авторизации';
                    authenticate_user.href = `${window.location.origin}/profile/login/?article=${article}&brand=${brand}&product_name=${product_name}`;
                    popup_enter_email.style.height = '270px';
                }

                if (data.user == false && data.is_email_verified == false) {
                    text_confirm_email.innerHTML = `На ${email} отправлено письмо для подтверждения.`;

                    url = `${window.location.origin}/api/v0/send-offers-email/?article=${article}&brand=${brand}&product_name=${product_name}&city_id=${city_id}&email=${email}&no_user=true`
                    fetch(url)
                        .then(resp => resp.json())
                        .then(data => { data })
                }
            })

        // unclickSendEmailOffersBtn()
    } else {
        entered_email.style.borderColor = 'red';
        enter_email_title.innerHTML = 'Введите корректный email:';
        enter_email_title.classList.add('text-red-600');
    }
}


function isEmailValid(value) {
    // валидирует переданный текст на email

    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    return EMAIL_REGEXP.test(value);
}


// Закрывает попап/плажку с подтверждением отправки предложений на емейл
let closeConfirmSendingOffersToEmail = () => {
    let confirm_sending_offers_to_email = document.querySelector('#confirm_sending_offers_to_email');
    confirm_sending_offers_to_email.style.display = 'none';
    overlay.style.display = 'none';
}


// Закрывает попап/плажку с подтверждением отправки предложений на емейл
let sendOffersEmailBtn = (element) => {
    message_popup.style.display = 'block';

    let url = `${window.location.origin}/api/v0/send-offers-email/?article=${article}&brand=${brand}&product_name=${product_name}&city_id=${city_id}`;
    fetch(url)
        .then(resp => resp.json())
        .then(data => { data })

    // unclickSendEmailOffersBtn()

    element.parentElement.parentElement.style.display = 'none';
}


// убирает плажку "Подождите, идет опрос складов..."
let off_waiting_for_offers = (data) => {
    if (data !== undefined && data.length > 0) {
        document.querySelector('#waiting_for_offers').style.display = 'none';
    }
    if (data.length == 0) {
        document.querySelector('#gif_spin_wrapper').style.display = 'none';

    }
}

// выводит крестик в поле запроса
let showCloseIcon = () => {
    let search_product_input = document.querySelector('#search_product_input').value;
    if (search_product_input) {
        document.querySelector('#x-close').style.display = 'block';
    }
}

setTimeout(() => {
    showCloseIcon();
}, 200);


// устанавливает ссылку на изображение товара
let setProductImageLink = (data) => {
    if (data.status) {
        let src = `${data.data.link}?${data.data.parameters_str}`;
        document.querySelector('#product_image_url').src = src

        document.querySelector('#search_product_image_text').innerHTML = 'Показать ещё';
    }
    document.querySelector('#search_product_image').href = `https://www.google.com/search?q=${article}%2B${brand}&tbm=isch`;
}


// получает ссылку на изображение товара
let getProductImageLink = () => {
    let url = `${window.location.origin}/api/v0/get-product-image-link/?article=${article}&brand=${brand}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        setProductImageLink(data);
    })
}

productImageLinkTimeOut = 500;
setTimeout(() => {
    getProductImageLink();
}, productImageLinkTimeOut);
