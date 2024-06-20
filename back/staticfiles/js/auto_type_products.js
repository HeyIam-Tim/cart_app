// подсказки товаров при вводе в поисковую строку
let autoTypeProducts = (element) => {
    let cityid = localStorage.getItem('cityId')
    if (cityid == null || cityid == 'null') {
        locationCityClick()
    }
    else {
        const minimalSearchCharacters = 2;
        const maxSearchCharacters = 30;

        let search_input_info = document.querySelector('#search_input_info');

        document.getElementById("history-form-wrapper").style.display = element.value.length === 0 ? "block" : "none"
    
        if (element.value.length <= minimalSearchCharacters) {

            renderHelpInSelectionLink('block');

            resetSearcInput();

            const searcInputInfoText = `Поисковый запрос должен быть более ${minimalSearchCharacters} символов`;
            search_input_info.innerHTML = searcInputInfoText;

            if (element.value.length == 0) {
                search_input_info.innerHTML = '';
            }
        }
        else {
            search_input_info.innerHTML = '';

            xclose.style.display = 'block';
            let url = `${window.location.origin}/api/v0/search-product-suggests/?text=${element.value}`;
            fetch(url)
            .then(resp => resp.json())
            .then(data => {
                if (data.product_suggests.length == 0) {

                    renderHelpInSelectionLink('block');

                    input_prods.style.display = 'none';
                    input_prods.innerHTML = '';
                }
                else {

                    renderHelpInSelectionLink('none');

                    input_prods.style.display = 'block';
                    input_prods.innerHTML = '';
                    for (let prod of data.product_suggests) {
                        const title = `${prod.article ? prod.article : prod.article__name} - ${prod.name} - ${prod.brand ? prod.brand : prod.brand__name}`
                        let one_prod_href = `${window.location.origin}/product/?partnumber=${prod.article ? prod.article : prod.article__name}&brand=${prod.brand ? prod.brand : prod.brand__name}&pname=${prod.name}&pmodel=&pmodif=&product_id=`;
                    
                        input_prods.innerHTML += `<a onclick="updateLocalHistory('${ title }', '${one_prod_href}')" href="${one_prod_href}" class="prod_li block" title=${prod.name}>${title}</a>`;
                    }
                }
            })
        }

        if (element.value.length >= maxSearchCharacters) {
            resetSearcInput();

            const searcInputInfoText = `Поисковый запрос должен быть менее ${maxSearchCharacters} символов`;
            search_input_info.innerHTML = searcInputInfoText;
        }
    }
}


// ресетит подсказки
let resetSearcInput = () => {
    input_prods.style.display = 'none';  
    input_prods.innerHTML = '';
    xclose.style.display = 'none';
}


// выводит ссылку для помощи в подборе
let renderHelpInSelectionLink = (display) => {
    if (document.querySelector('#help_in_selection_link')) {
        document.querySelector('#help_in_selection_link').style.display = display;
    }
}
