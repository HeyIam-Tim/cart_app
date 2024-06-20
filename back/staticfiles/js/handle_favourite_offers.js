// окрашивает выбранное избранное предложение
let chooseFavouriteOffer = (element, garage) => {
    // let product_id = element.getAttribute("data-product_id");
    let product_name = element.getAttribute("data-product_name");
    let article = element.getAttribute("data-article");
    let brand = element.getAttribute("data-brand");
    let shop_name = element.getAttribute("data-shop_name");
    let address = element.getAttribute("data-address");
    let phone = element.getAttribute("data-phone");
    let url = element.getAttribute("data-url");
    let quantity = element.getAttribute("data-quantity");
    let price = element.getAttribute("data-price");
    let delivery_period = element.getAttribute("data-delivery_period");

    let favourite_offer_id = element.getAttribute("data-favourite_offer_id");

    if (element.classList.contains('text-gray-300')) {
        element.classList.remove('text-gray-300');
        element.classList.add('text-yellow-500');

        // addOrDeleteFavouriteOffer('POST', product_id, null, shop_name, address, phone, url, quantity, price, delivery_period);
        addOrDeleteFavouriteOffer('POST', product_name, article, brand, null, shop_name, address, phone, url, quantity, price, delivery_period);

    }
    else {
        element.classList.remove('text-yellow-500');
        element.classList.add('text-gray-300');

        if (garage) {
            let favourite_offer_html = document.querySelector(`#favourite_offer-${favourite_offer_id}`);
            let favourite_offers_table = document.querySelector('#favourite_offers_table');
            let favourite_offer_info = document.querySelector('#favourite_offer_info');
            
            favourite_offer_html.remove();
            
            let favourites = document.querySelectorAll('.favourite_offer');
            if (favourites.length == 0) {
                favourite_offers_table.remove();
                favourite_offer_info.style.display = 'block';
            }
            addOrDeleteFavouriteOffer('DELETE', null, null, null, favourite_offer_id);
        }
        else{
            // addOrDeleteFavouriteOffer('DELETE', product_id, null, shop_name, address, phone, url, quantity, price, delivery_period);
            addOrDeleteFavouriteOffer('DELETE', product_name, article, brand, null, shop_name, address, phone, url, quantity, price, delivery_period);
        }
    }
}


// добаляет или удаляет предложение из избранного
// let addOrDeleteFavouriteOffer = (method, product_id, favourite_offer_id, shop_name, address, phone, url, quantity, price, delivery_period) => {
let addOrDeleteFavouriteOffer = (method, product_name, article, brand, favourite_offer_id, shop_name, address, phone, url, quantity, price, delivery_period) => {
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    let url_api = `${window.location.origin}/api/v0/favourite-offer/`;

    options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            // 'product_id': product_id,
            'product_name': product_name,
            'article': article,
            'brand': brand,
            'shop_name': shop_name,
            'address': address,
            'phone': phone,
            'quantity': quantity,
            'price': price,
            'url': url,
            'delivery_period': delivery_period,
            'favourite_offer_id': favourite_offer_id,
        })
    }
    fetch(url_api, options)
    .then(response => response.json())
    .then(data => {data})
}
