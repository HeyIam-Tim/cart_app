// окрашивает выбранный избранный товар
let chooseFavourite = (element, garage) => {
    let product_id = element.getAttribute("data-product_id");

    if (element.classList.contains('text-gray-300')) {
        element.classList.remove('text-gray-300');
        element.classList.add('text-yellow-500');

        addOrDeleteFavouriteProduct('POST', product_id);

    }
    else {
        element.classList.remove('text-yellow-500');
        element.classList.add('text-gray-300');

        if (garage) {
            let favourite_product_id = document.querySelector(`#favourite-${product_id}`);
            let favourite_table = document.querySelector('#favourite_table');
            let favourite_info = document.querySelector('#favourite_info');
            
            favourite_product_id.remove();
            
            let favourites = document.querySelectorAll('.favourite');
            if (favourites.length == 0) {
                favourite_table.remove();
                favourite_info.style.display = 'block';
            }
        }

        addOrDeleteFavouriteProduct('DELETE', product_id);
    }
}


// добаляет или удаляет товар из избранного
let addOrDeleteFavouriteProduct = (method, product_id) => {
    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

    let url = `${window.location.origin}/api/v0/favourite-product/`;

    options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'product_id': product_id,
        })
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {data})
}
