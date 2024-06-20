// устанавливает поля для магазина в попап
let setDataForShopInPopup = (data) => {
    document.querySelector("#shop_name").innerHTML = data.name;
    document.querySelector("#shop_address").innerHTML = data.address;

    let shop_site = data.site;
    if (shop_site == 'null' || shop_site == null) {
        document.querySelector("#shop_site").innerHTML = 'не указан';
    }
    else {
        let site_html = `<a href="https://${shop_site}" target="_blank" class="text-blue-500">${shop_site}</a>`
        document.querySelector("#shop_site").innerHTML = site_html;
    }

    let shop_phone = data.phone_number;
    document.querySelector("#shop_phone").innerHTML = shop_phone == 'None' ? 'не указан' : shop_phone;
    document.querySelector("#shop_phone").href = `tel:${shop_phone}`;

    document.querySelector("#shop_email").innerHTML = data.email;
    document.querySelector("#shop_description").innerHTML = data.description;
    document.querySelector("#shop_opening_hours").innerHTML = data.opening_hours;
}

// устанавливает магазин на карте
let setShopOnMap = (data) => {
    // яндекс карта
    let map = document.querySelector("#map");
    map.innerHTML = '';
    let lat = data.lat;
    let lon = data.lon;
    if (lat && lon) {
        map.style.display = 'block';
        let center = [lat, lon];
        let zoom = 17;
        function init() {
        let map = new ymaps.Map('map', {
            center: center,
            zoom: zoom,
        });
        let placemark = new ymaps.Placemark(center, {}, {});
        map.geoObjects.add(placemark);
        }
        ymaps.ready(init);
        //  
    }
    else {
        map.style.display = 'none';
    }
}


// получает магазин по наименованию
let getShopByShopNameApi = (element) => {
    let shop_name = element.getAttribute("data-shop_name");
    let url = `${window.location.origin}/api/v0/get-shop-by-name/?shop_name=${shop_name}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        setDataForShopInPopup(data);
        setShopOnMap(data);
    })
}


// открывает страницу с магазином
let openShopPagePopup = () => {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('#shop_info_popup').style.display = 'block';
};


// открывает страницу с магазином
let handleShopPopup = (element) => {
    getShopByShopNameApi(element);
    openShopPagePopup();
}
