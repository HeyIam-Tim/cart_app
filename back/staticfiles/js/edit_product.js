let id_quantity = document.querySelector('#id_quantity');
let id_price = document.querySelector('#id_price');
let select = document.querySelector('select');
let id_external_id = document.querySelector('#id_external_id');
let id_url = document.querySelector('#id_url');
let id_tags = document.querySelector('#id_tags');
let close_icon_ap = document.querySelector('#close_icon_ap');


// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        window.location.href = `/profile/shops/${shop_id}/products/`;
    }
})


// set placeholders
if (id_quantity) {
    id_quantity.placeholder = 'Количество *';
}

if (id_price) {
    id_price.placeholder = 'Цена';
}

if (select) {
    select.children[0].innerHTML = 'Выберите категорию';
}

if (id_external_id) {
    id_external_id.placeholder = 'Артикул';
}

if (id_url) {
    id_url.placeholder = 'Ссылка';
}

if (id_tags) {
    id_tags.placeholder = 'Тэги';
}


// добавляет или редактирует товар и склад
let editProduct = () => {
    let product_name = document.querySelector('#id_product_name');
    let quantity = document.querySelector('#id_quantity');
    let article = document.querySelector('#id_article').value;
    let price = document.querySelector('#id_price').value;
    let url = document.querySelector('#id_url').value;
    let tags = document.querySelector('#id_tags').value;

    let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    if (product_name.value == '' || quantity.value == '') {
        product_name.style.borderColor = 'red';
        quantity.style.borderColor = 'red';
    }
    else {
        let apiUrl = `${window.location.origin}/api/v0/product-create-api/`;
        options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfmiddlewaretoken,
        },
        body: JSON.stringify({
            'name': product_name.value,
            'article': article,
            'shop_id': shop_id,
            'warehouse_id': window.warehouse_id,
            'quantity': quantity.value,
            'price': price,
            'url': url,
            'tags': tags,
        })
        }
        fetch(apiUrl, options)
        .then(response => response.json())
        .then(data => {
            window.location.href = `/profile/shops/${shop_id}/products/`;
        })
    }
}
