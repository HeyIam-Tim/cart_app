let telegram_authentication = document.querySelector('#telegram_authentication');
let telegram_popup = document.querySelector('#telegram_popup');


// рендерит результаты поиска на страницу
let render_search_results = (data, is_stop_search_results_gif) => {

    let search_result_table = document.querySelector('#search_result_table');
    if (window.search_result_count == undefined) {
        window.search_result_count = data.products.length;
    }
    else {
        window.search_result_count += data.products.length;
    }

    for (let i = 0; i < data.products.length; i++) {
        const product = data.products[i];

        setTimeout(function timer() {
            if (is_anonymous == 'False') {
                window.favourite = `<td style="text-align: center; padding: 0px;"><span class="block padding-search-table sm:p-4 text-lg sm:text-3xl ${product.favourite ? 'text-yellow-500' : 'text-gray-300'}" data-product_id="${product.prod_id}" onclick="chooseFavourite(this)">&#9733;</span></td>`;
                }
                // <i class="fa ${product.fapi_brand_id ? 'text-gray-500' : 'text-gray-300'} text-xs sm:text-base" data-fapi_brand_id="${product.fapi_brand_id}" data-article="${product.article}" onclick="${product.fapi_brand_id ? 'showProductImage(this)' : ''}">&#xf030;</i>

                let one_search_result = `
                    <tr id="hover" style="background-color:#fff;">
                        <td style="text-align: left; padding: 0px;">
                            <div class="flex flex-start" style="justify-content: flex-start">        
                                <a class="block sm:hidden padding-search-table sm:p-4 sm:pr-2" href="${window.location.origin}/product/?partnumber=${product.article}&brand=${product.brand}&pname=${product.name}&pmodel=&pmodif=&product_id=${product.prod_id}">${product.product_names ? product.product_names : ''}${product.name}</a>
                                <a class="hidden sm:block padding-search-table sm:p-4 sm:pr-2" href="${window.location.origin}/product/?partnumber=${product.article}&brand=${product.brand}&pname=${product.name}&pmodel=&pmodif=&product_id=${product.prod_id}">${product.product_names ? product.product_names : ''}${product.name}</a>
                            </div>
                        </td>
                        <td style="text-align: center; padding: 0px;">
                            <a class="block sm:hidden padding-search-table sm:p-4" href="${window.location.origin}/product/?partnumber=${product.article}&brand=${product.brand}&pname=${product.name}&pmodel=&pmodif=&product_id=${product.prod_id}">${product.brand}</a>
                            <a class="hidden sm:block padding-search-table sm:p-4" href="${window.location.origin}/product/?partnumber=${product.article}&brand=${product.brand}&pname=${product.name}&pmodel=&pmodif=&product_id=${product.prod_id}">${product.brand}</a>
                        </td>
                        <td style="text-align: center; padding: 0px;">
                            <a class="block sm:hidden padding-search-table sm:p-4" href="${window.location.origin}/product/?partnumber=${product.article}&brand=${product.brand}&pname=${product.name}&pmodel=&pmodif=&product_id=${product.prod_id}">${product.article}</a>
                            <a class="hidden sm:block padding-search-table sm:p-4" href="${window.location.origin}/product/?partnumber=${product.article}&brand=${product.brand}&pname=${product.name}&pmodel=&pmodif=&product_id=${product.prod_id}">${product.article}</a>
                        </td>
                        ${window.favourite ? window.favourite : ''}
                    </tr>`;

                search_result_table.innerHTML += one_search_result;

                if (is_stop_search_results_gif) {
                    stop_search_results_gif(window.search_result_count)
                }

        }, i * 100);
    }
}


// предлагает получить предложения в telegram
let show_telegram_request = (data) => {
    if (is_telegram == 'True' && window.search_result_count == 0) {
        document.querySelector('#telegram_request').style.display = 'block';

        document.querySelector('#gif_spin_wrapper').style.display = 'none';
    }
}


// останавливает гифку с загрузкой
let stop_search_results_gif = (search_result_count) => {
    let search_result_all = document.querySelector('#search_result_table').children.length - 1;
    if (search_result_count == search_result_all) {
        document.querySelector('#downloading_gif').style.display = 'none';
    }
}


// убирает плажку "Подождите, идет опрос складов..."
let stop_wait_search_results = (data, from) => {
    if (data.products.length > 0) {
        if (document.querySelector('#wait_search_results').style.display == '') {
            document.querySelector('#wait_search_results').style.display = 'none';
        }

    }

    else {
        if(from == 'external' && window.search_result_count == undefined || from == 'external' && window.search_result_count == 0) {
            document.querySelector('#gif_spin_wrapper').innerHTML = 'К сожалению не все продавцы настроили автоматическую выгрузку товаров.';
        }   
    }
}


// рендерит информацию о результатах поиска
let render_search_results_info = () => {
    document.querySelector('#search-info').innerHTML = `По запросу «${search}» найдено ${window.search_result_count} товар(ов)`;
}


// апи для результатов поиска
let seach_results_db = () => {
    let url = `${window.location.origin}/api/v0/search-results/?text=${search}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {

        if (data.products.length > 0) {
            document.querySelector('#downloading_gif').src = `${window.location.origin}/static/images/giphy.gif`;
            document.querySelector('#downloading_gif').style.width = "32px";
        }

        let is_stop_search_results_gif = true;
        let from = '';
        if (data.cached == true) {
            is_stop_search_results_gif = true;
            from = 'external';
        }
        else {
            is_stop_search_results_gif = false;
            from = '';
        }
        
        render_search_results(data, is_stop_search_results_gif);
        stop_wait_search_results(data, from);

        if (data.cached == false) {
            seach_results_api();
        }

    })
}


// апи для результатов поиска
let seach_results_api = () => {
    let url = `${window.location.origin}/api/v0/search-results/?text=${search}&api=true`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        render_search_results(data, true);
        render_search_results_info(data);
        stop_wait_search_results(data, 'external');
        show_telegram_request(data);
    })
}


// результаты поиска на страницу
let handle_search_results = () => {
    setTimeout(() => {
        let city_id = localStorage.getItem('cityId');
        if (city_id == null){
            setTimeout(function () {
                locationCityClick();
            }, 500)
    
            document.querySelector('#wait_search_results').style.display = 'none';
        }
        else {
            seach_results_db();
        }
    }, 100);
}


// получает результаты поиска на клик лупы
let getSearchResults = () => {
    let search_product_input = document.querySelector('#search_product_input').value;
    window.location.href = `${window.location.origin}/products/?text=${search_product_input}`;
}


// открывает попап с картинкой
let showProductImage = (element) => {
    let fapi_brand_id = element.getAttribute("data-fapi_brand_id");
    let article = element.getAttribute("data-article");

    document.querySelector('#product_image_popup').style.display = 'block';
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('#product_image_url').src = `https://static.fapi.iisis.ru/fapi/v2/imageList?imgd=true&width=200&mfi=${fapi_brand_id}&n=${article}`;
}


handle_search_results();



// Открывает форму для телеграма
let openTelegramRequestFormSearchResults = () => {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('#telegram_popup').style.display = 'block';
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
