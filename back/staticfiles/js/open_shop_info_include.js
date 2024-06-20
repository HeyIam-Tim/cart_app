// открывает попап с информацией о магазине
let openShopPage = (element) => {
    document.querySelector("#shop_name").innerHTML = element.getAttribute("data-shop_name");
    document.querySelector("#shop_address").innerHTML = element.getAttribute("data-address");

    let shop_site = element.getAttribute("data-site");
    if (shop_site !== 'Не указан') {
      let site_html = `<a href="https://${shop_site}" target="_blank" class="text-blue-500">${shop_site}</a>`
      document.querySelector("#shop_site").innerHTML = site_html;
    }
    else {
      document.querySelector("#shop_site").innerHTML = shop_site;
    }

    let shop_phone = element.getAttribute("data-phone");
    document.querySelector("#shop_phone").innerHTML = shop_phone;
    document.querySelector("#shop_phone").href = `tel:${shop_phone}`;

    document.querySelector("#shop_email").innerHTML = element.getAttribute("data-email");
    document.querySelector("#shop_description").innerHTML = element.getAttribute("data-description");
    document.querySelector("#shop_opening_hours").innerHTML = element.getAttribute("data-opening_hours");

    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('#shop_info_popup').style.display = 'block';


    // яндекс карта
    let map = document.querySelector("#map");
    map.innerHTML = '';
    let lat = element.getAttribute("data-lat");
    let lon = element.getAttribute("data-lon");
    if (lat && lon) {
      map.style.display = 'block';
      let center = [lat.replace(',', '.'), lon.replace(',', '.')];
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