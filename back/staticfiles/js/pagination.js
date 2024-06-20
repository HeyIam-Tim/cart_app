OFFERS_ON_ONE_PAGE = 10;


// клик правой стрелки пагинации
let clickRightPaginatorArrow = () => {
    if (window.paginator_key == undefined) {
        window.paginator_key = 'page_2';
        let page_2 = document.querySelector(`#${window.paginator_key}`);
        showAnalogsWithDeliveryFromOnePage(page_2);
    }
    else {
        handleAnalogsWithDeliveryPaginatorArrowClicks('plus');
    }
}


// клик правой стрелки пагинации в наличии
let clickInStockRightPaginatorArrow = () => {
    if (window.in_stock_paginator_key == undefined) {
        window.in_stock_paginator_key = 'in_stock_page_2';
        let page_2 = document.querySelector(`#${window.in_stock_paginator_key}`);
        showOriginalsInStockFromOnePage(page_2);
    }
    else {
        handleOriginalsInStockPaginatorArrowClicks('plus');
    }
}


// клик правой стрелки пагинации аналоги в наличии
let clickAnalogsInStockRightPaginatorArrow = () => {
    if (window.analogs_in_stock_paginator_key == undefined) {
        window.analogs_in_stock_paginator_key = 'analogs_in_stock_page_2';
        let page_2 = document.querySelector(`#${window.analogs_in_stock_paginator_key}`);
        showAnalogsInStockFromOnePage(page_2);
    }
    else {
        handleAnalogsInStockPaginatorArrowClicks('plus');
    }
}


// клик правой стрелки пагинации запрашиваемые артикулы с доставкой
let clickOriginalsWithDeliveryRightPaginatorArrow = () => {
    if (window.originals_with_delivery_paginator_key == undefined) {
        window.originals_with_delivery_paginator_key = 'originals_with_delivery_page_2';
        let page_2 = document.querySelector(`#${window.originals_with_delivery_paginator_key}`);
        showOriginalsWithDeliveryFromOnePage(page_2);
    }
    else {
        handleOriginalsWithDeliveryPaginatorArrowClicks('plus');
    }
}


// клик левой стрелки пагинации
let clickLeftPaginatorArrow = () => {
    if (window.paginator_key != undefined) {
        handleAnalogsWithDeliveryPaginatorArrowClicks('minus');
    }
}


// клик левой стрелки пагинации в наличии
let clickInStockLeftPaginatorArrow = () => {
    if (window.in_stock_paginator_key != undefined) {
        handleOriginalsInStockPaginatorArrowClicks('minus');
    }
}


// клик левой стрелки пагинации аналоги в наличии
let clickAnalogsInStockLeftPaginatorArrow = () => {
    if (window.analogs_in_stock_paginator_key != undefined) {
        handleAnalogsInStockPaginatorArrowClicks('minus');
    }
}


// клик левой стрелки пагинации запрашиваемые артикулы с доставкой
let clickOriginalsWithDeliveryLeftPaginatorArrow = () => {
    if (window.originals_with_delivery_paginator_key != undefined) {
        handleOriginalsWithDeliveryPaginatorArrowClicks('minus');
    }
}
//


// работает с кликами стрелок пагинаций; запрашиваемые артикулы в наличии
let handleOriginalsInStockPaginatorArrowClicks = (math_action) => {

    let paginator_key = window.in_stock_paginator_key;
    let data_paginator_page = 'in_stock_paginator_page';
    let paginator = window.in_stock_paginator;
    let key_page = 'in_stock_page';
    let showFromOnePage = showOriginalsInStockFromOnePage;
    let renderPagination = renderOriginalsInStockPagination;

    handlePaginatorArrowClicksBase(math_action, paginator_key, data_paginator_page, paginator, key_page, showFromOnePage, renderPagination);

}
// 


// работает с кликами стрелок пагинаций; запрашиваемые артикулы с доставкой
let handleOriginalsWithDeliveryPaginatorArrowClicks = (math_action) => {

    let paginator_key = window.originals_with_delivery_paginator_key;
    let data_paginator_page = 'originals_with_delivery_paginator_page';
    let paginator = window.originals_with_delivery_paginator;
    let key_page = 'originals_with_delivery_page';
    let showFromOnePage = showOriginalsWithDeliveryFromOnePage;
    let renderPagination = renderOriginalsWithDeliveryPagination;

    handlePaginatorArrowClicksBase(math_action, paginator_key, data_paginator_page, paginator, key_page, showFromOnePage, renderPagination);

}
// 


// работает с кликами стрелок пагинаций; аналоги в наличии
let handleAnalogsInStockPaginatorArrowClicks = (math_action) => {

    let paginator_key = window.analogs_in_stock_paginator_key;
    let data_paginator_page = 'analogs_in_stock_paginator_page';
    let paginator = window.analogs_in_stock_paginator;
    let key_page = 'analogs_in_stock_page';
    let showFromOnePage = showAnalogsInStockFromOnePage;
    let renderPagination = renderAnalogsInStockPagination;

    handlePaginatorArrowClicksBase(math_action, paginator_key, data_paginator_page, paginator, key_page, showFromOnePage, renderPagination);

}
// 


// работает с кликами стрелок пагинаций; аналоги с доставкой
let handleAnalogsWithDeliveryPaginatorArrowClicks = (math_action) => {

    let paginator_key = window.paginator_key;
    let data_paginator_page = 'paginator_page';
    let paginator = window.paginator;
    let key_page = 'page';
    let showFromOnePage = showAnalogsWithDeliveryFromOnePage;
    let renderPagination = renderAnalogsWithDeliveryPagination;

    handlePaginatorArrowClicksBase(math_action, paginator_key, data_paginator_page, paginator, key_page, showFromOnePage, renderPagination);

}
// 


// (базовая) работает с кликами стрелок пагинаций
let handlePaginatorArrowClicksBase = (math_action, paginator_key, data_paginator_page, paginator, key_page, showFromOnePage, renderPagination) => {
    let current_page_number = document.querySelector(`#${paginator_key}`);
    let paginator_page = current_page_number.getAttribute(`data-${data_paginator_page}`);

    let procede_page_int = 1
    if (math_action == 'plus') {
        procede_page_int = parseInt(paginator_page) + 1;
    }
    else if (math_action == 'minus') {
        procede_page_int = parseInt(paginator_page) - 1;
    }

    if (Object.keys(paginator).length >= procede_page_int && procede_page_int >= 1) {
        let procede_page_number = `${key_page}_${procede_page_int}`;
        paginator_key = procede_page_number;

        let procede_page = document.querySelector(`#${procede_page_number}`);
        showFromOnePage(procede_page);
    }

    const currentPage = procede_page_int;
    renderPagination(currentPage);
}
// 


// выводит блок с запрашиваемым артикулом в наличии для одной страницы
let showOriginalsInStockFromOnePage = (element) => {

    let paginator_key = element.getAttribute("data-paginator_key");
    window.in_stock_paginator_key = paginator_key;
    let page_offers = window.in_stock_paginator[`${paginator_key}`];

    let table_originals = document.querySelector('#table_originals');
    table_originals.innerHTML = '';
    table_originals.innerHTML = get_table_block_title(original_article_title);

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

    table_originals.innerHTML += get_table_header('sortOriginalArticlePrices', sorting_icon_price, 'sortOriginalArticleByDeliveryPeriod', sorting_icon_delivery_period);

    let paginator_type = 'in_stock_paginator';
    let table = table_originals;
    renderOffersFromOnePage(element, paginator_type, page_offers, table);

    const currentPage = parseInt(element.getAttribute("data-current_page"));
    renderAnalogsWithDeliveryPagination(currentPage);

}
// 

// выводит блок с запрашиваемым артикулом с доставкой для одной страницы
let showOriginalsWithDeliveryFromOnePage = (element) => {

    let paginator_key = element.getAttribute("data-paginator_key");

    window.originals_with_delivery_paginator_key = paginator_key;
    
    let page_offers = window.originals_with_delivery_paginator[`${paginator_key}`];
    let table_originals_with_delivery = document.querySelector('#table_originals_with_delivery');

    table_originals_with_delivery.innerHTML = '';
    table_originals_with_delivery.innerHTML = get_table_block_title(originals_with_delivery_title);

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

    table_originals_with_delivery.innerHTML += get_table_header('sortOriginalsWithDeliveryPrices', sorting_icon_price, 'sortOriginalsWithDeliveryByDeliveryPeriod', sorting_icon_delivery_period);

    let paginator_type = 'originals_with_delivery_paginator';
    let table = table_originals_with_delivery;
    renderOffersFromOnePage(element, paginator_type, page_offers, table);

    const currentPage = parseInt(element.getAttribute("data-current_page"));

    renderOriginalsWithDeliveryPagination(currentPage);

}
// 

// выводит блок с аналогами в наличии для одной страницы
let showAnalogsInStockFromOnePage = (element) => {

    let paginator_key = element.getAttribute("data-paginator_key");

    window.analogs_in_stock_paginator_key = paginator_key;

    let city_id = element.getAttribute("data-city_id");

    let page_offers = window.analogs_in_stock_paginator[`${paginator_key}`];
    let table_crosses = document.querySelector('#table_crosses');

    table_crosses.innerHTML = '';
    table_crosses.innerHTML = get_table_block_title(cross_article_title);

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

    table_crosses.innerHTML += get_table_header('sortCrossesArticlePrices', sorting_icon_price, 'sortCrossesArticleByDeliveryPeriod', sorting_icon_delivery_period);

    let paginator_type = 'analogs_in_stock_paginator';
    let table = table_crosses;
    renderOffersFromOnePage(element, paginator_type, page_offers, table);

    const currentPage = parseInt(element.getAttribute("data-current_page"));

    renderAnalogsInStockPagination(currentPage);

}
// 

// выводит блок с аналогами с доставкой для одной страницы
let showAnalogsWithDeliveryFromOnePage = (element) => {

    let paginator_key = element.getAttribute("data-paginator_key");
    window.paginator_key = paginator_key;

    let city_id = element.getAttribute("data-city_id");

    let page_offers = window.paginator[`${paginator_key}`];
    let table_delivery = document.querySelector('#table_delivery');

    table_delivery.innerHTML = '';
    table_delivery.innerHTML = get_table_block_title(delivery_article_title);

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

    table_delivery.innerHTML += get_table_header('sortDeliveryPrices', sorting_icon_price, 'sortDeliveryByDeliveryPeriod', sorting_icon_delivery_period);

    let paginator_type = 'paginator';
    let table = table_delivery;
    renderOffersFromOnePage(element, paginator_type, page_offers, table);

    const currentPage = parseInt(element.getAttribute("data-current_page"));
    renderAnalogsWithDeliveryPagination(currentPage);
}
// 


// выводит предложения из одной страницы
let renderOffersFromOnePage = (element, paginator_type, page_offers, table) => {
    let paginators = document.querySelectorAll(`.${paginator_type}`);
    for (let i = 0; i < paginators.length; i++) {
        let page_number = paginators[i];
        page_number.style.backgroundColor = 'white';
        page_number.style.padding = '0px';
        page_number.style.borderRadius = '0px';
    };

    element.style.backgroundColor = 'rgba(209, 213, 219)';
    element.style.padding = '0.5rem 0.75rem';
    element.style.borderRadius = '0.25rem';

    for (let i = 0; i < page_offers.length; i++) {
        let offer = page_offers[i];

        let order_item_id = Date.now().toString(16) + Date.now().toString(16);

        let public_shop_href = get_public_shop_href(offer);
        let cross_link = get_cross_link(offer);

        let one_offer = get_one_offer(public_shop_href, offer, cross_link, city_id, order_item_id);

        table.innerHTML += one_offer;
    }

}
// 


// создает пагинацию
const generatePageNumbers = (currentPage, totalPaginatorPages) => {
    const totalPages = Math.ceil(totalPaginatorPages)

    let pageNumbers = [1, ]
    let startPage = Math.max(1, currentPage - 5)
    let endPage = Math.min(currentPage + 5, totalPages)

    if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) {
        pageNumbers.push("...")
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
        pageNumbers.push("...")
        }
        pageNumbers.push(totalPages)
    }

    return pageNumbers;
}
//


// выводит пагинацию с запрашиваемым артикулом в наличии
let renderOriginalsInStockPagination = (currentPage) => {

    let paginator_html = 'in_stock_pagination';
    let onclickLeftArrow = 'clickInStockLeftPaginatorArrow';
    let base_paginator = window.in_stock_paginator;
    let block_type = 'in_stock_paginator';
    let page_key = 'in_stock_page';
    let onclickRightArrow = 'clickInStockRightPaginatorArrow';
    let onclickShowOnePage = 'showOriginalsInStockFromOnePage';

    renderPaginationBase(currentPage, paginator_html, onclickLeftArrow, base_paginator, block_type, page_key, onclickRightArrow, onclickShowOnePage);

};
//


// выводит пагинацию для запрашиваемых артикулов с доставкой
let renderOriginalsWithDeliveryPagination = (currentPage) => {

    let paginator_html = 'originals_with_delivery_pagination';
    let onclickLeftArrow = 'clickOriginalsWithDeliveryLeftPaginatorArrow';
    let base_paginator = window.originals_with_delivery_paginator;
    let block_type = 'originals_with_delivery_paginator';
    let page_key = 'originals_with_delivery_page';
    let onclickRightArrow = 'clickOriginalsWithDeliveryRightPaginatorArrow';
    let onclickShowOnePage = 'showOriginalsWithDeliveryFromOnePage';

    renderPaginationBase(currentPage, paginator_html, onclickLeftArrow, base_paginator, block_type, page_key, onclickRightArrow, onclickShowOnePage);

};
//


// выводит пагинацию для аналогов в наличии
let renderAnalogsInStockPagination = (currentPage) => {

    let paginator_html = 'analogs_in_stock_pagination';
    let onclickLeftArrow = 'clickAnalogsInStockLeftPaginatorArrow';
    let base_paginator = window.analogs_in_stock_paginator;
    let block_type = 'analogs_in_stock_paginator';
    let page_key = 'analogs_in_stock_page';
    let onclickRightArrow = 'clickAnalogsInStockRightPaginatorArrow';
    let onclickShowOnePage = 'showAnalogsInStockFromOnePage';

    renderPaginationBase(currentPage, paginator_html, onclickLeftArrow, base_paginator, block_type, page_key, onclickRightArrow, onclickShowOnePage);

};
//


// выводит пагинацию для аналогов с доставкой
let renderAnalogsWithDeliveryPagination = (currentPage) => {

    let paginator_html = 'pagination';
    let onclickLeftArrow = 'clickLeftPaginatorArrow';
    let block_type = 'paginator';
    let base_paginator = window.paginator;
    let page_key = 'page';
    let onclickRightArrow = 'clickRightPaginatorArrow';
    let onclickShowOnePage = 'showAnalogsWithDeliveryFromOnePage';

    renderPaginationBase(currentPage, paginator_html, onclickLeftArrow, base_paginator, block_type, page_key, onclickRightArrow, onclickShowOnePage);

};
//


// выводит базовую струруктуру для пагинации
let renderPaginationBase = (currentPage, paginator_html, onclickLeftArrow, base_paginator, block_type, page_key, onclickRightArrow, onclickShowOnePage) => {
    document.querySelector(`#${paginator_html}`).innerHTML = '';

    let left_paginator_arrow = `<img id="" class="block pb-0.5 mr-2 w-2.5 cursor-pointer" src="${window.location.origin}/static/images/left-pagintor-arrow.svg" alt="left_paginator_arrow" onclick="${onclickLeftArrow}()">`;
    document.querySelector(`#${paginator_html}`).innerHTML += `${left_paginator_arrow}`;

    const totalPaginatorPages = Object.keys(base_paginator).length;
    const pageNumbers = generatePageNumbers(currentPage, totalPaginatorPages);

    for (let i = 1; i < pageNumbers.length; i++) {
        const page = pageNumbers[i];
        if (page == '...') {
            document.querySelector(`#${paginator_html}`).innerHTML += `<span class="block ${block_type} mx-2">${page}</span>`;
        }
        else {
            document.querySelector(`#${paginator_html}`).innerHTML += `<span id="${page_key}_${page}" data-paginator_key="${page_key}_${page}" data-current_page="${page}" data-city_id="${city_id}" data-${block_type}_page="${page}" class="block ${block_type} mx-2 cursor-pointer ${page == currentPage ? 'bg-gray-300 p-1 px-2 rounded' : '' }" onclick="${onclickShowOnePage}(this)">${page}</span>`;
        }
    }

    let right_pagintor_arrow = `<img id="" class="block pb-0.5 ml-2 w-2.5 cursor-pointer" src="${window.location.origin}/static/images/right-pagintor-arrow.svg" alt="right_pagintor_arrow" onclick="${onclickRightArrow}()">`;
    document.querySelector(`#${paginator_html}`).innerHTML += `${right_pagintor_arrow}`;
};
//


// пагинация
let handle_pagination = (city_id) => {

    handle_pagination_originals_in_stock();

    handle_pagination_originals_with_delivery();

    handle_pagination_analogs_in_stock();

    handle_pagination_analogs_with_delivery();
}


// пагинация для запрашиваемого артикула в наличии
let handle_pagination_originals_in_stock = () => {

    window.in_stock_paginator = {};
    let base_paginator = window.in_stock_paginator;
    let base_offers = window.arrayOriginalArticleOffersAll;
    let page_key = 'in_stock_page';

    handle_pagination_base(base_paginator, base_offers, page_key, renderOriginalsInStockPagination);

}
// 


// пагинация для запрашиваемого артикула с доставкой
let handle_pagination_originals_with_delivery = () => {

    window.originals_with_delivery_paginator = {};
    let base_paginator = window.originals_with_delivery_paginator;
    let base_offers = window.arrayOriginalsWithDeliveryAll;
    let page_key = 'originals_with_delivery_page';

    handle_pagination_base(base_paginator, base_offers, page_key, renderOriginalsWithDeliveryPagination);

}
// 


// пагинация для аналогов в наличии
let handle_pagination_analogs_in_stock = () => {

    window.analogs_in_stock_paginator = {};
    let base_paginator = window.analogs_in_stock_paginator;
    let base_offers = window.arrayCrossArticleOffersAll;
    let page_key = 'analogs_in_stock_page';

    handle_pagination_base(base_paginator, base_offers, page_key, renderAnalogsInStockPagination);

}
// 


// пагинация для аналогов с доставкой
let handle_pagination_analogs_with_delivery = () => {

    window.paginator = {};
    let base_paginator = window.paginator;
    let base_offers = window.arrayDeliveryOffersAll;
    let page_key = 'page';

    handle_pagination_base(base_paginator, base_offers, page_key, renderAnalogsWithDeliveryPagination);

}
//


// формирует базовую струруктуру для пагинации
let handle_pagination_base = (base_paginator, base_offers, page_key, render_pagination_base) => {
    let counter = 0;

    let paginator_page_counter = 0;
    let offers_on_one_page = OFFERS_ON_ONE_PAGE;

    let first_page = new Array();
    let one_page = new Array();

    for (let i = 0; i < base_offers.length; i++) {
        const offer = base_offers[i];

        counter += 1;

        if (!counter % offers_on_one_page == 0 && first_page.length < offers_on_one_page) {
            paginator_page_counter = 1;
            first_page.push(offer);
            base_paginator[`${page_key}_${paginator_page_counter}`] = first_page;
        }

        if (counter > offers_on_one_page) {
            one_page.push(offer);
        }

        if (counter % offers_on_one_page == 0 && first_page.length != 0 && counter > offers_on_one_page){
            paginator_page_counter += 1;
    
            base_paginator[`${page_key}_${paginator_page_counter}`] = one_page;
            one_page = [];
        }

        if (!counter % offers_on_one_page == 0 && first_page.length != 0 && counter > offers_on_one_page && counter - counter < offers_on_one_page){
            base_paginator[`${page_key}_${paginator_page_counter + 1}`] = one_page;
        }

    }

    const currentPage = 1;
    render_pagination_base(currentPage);
}
