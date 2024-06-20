// выбирает город из подсказок
let chooseCityName = (element) => {
    setCityLocation(element.dataset.cityid, element.dataset.cityname);

    if (window.location.pathname == '/public-shop-list/') {
        window.location.href = `${window.location.origin}/public-shop-list/?cityid=${element.dataset.cityid}`;
    }
    else {
        location.reload();
    }
}


// подсказки при поиске города
input_cities = document.querySelector('#input_cities');
let searchCityName = () => {
    if (search_city.value.length > 1) {
        cc_area.style.opacity = '0';
        input_cities.style.display = 'block';
        url = `${window.location.origin}/api/v0/search-city/?city=${search_city.value}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            input_cities.innerHTML = '';
            for(city of data.data) {
                one_city = `<li class="prod_li" data-cityid="${city.id}" data-cityname="${city.name}" onclick="chooseCityName(this)">${city.name} (${city.region_id__name})</li>`;
                input_cities.innerHTML += one_city;
                one_city = '';
            }
        })
    }
    else {
        cc_area.style.opacity = '1';
        input_cities.style.display = 'none';
    }
}
