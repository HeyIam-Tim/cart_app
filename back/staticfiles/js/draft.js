
{/* <h2 id="cross_title" class="text-base cursor-pointer py-3 px-2 md:px-5 rounded-t block" onclick="crossTitle()">Аналоги</h2> */}
 

// <!-- таблица с кроссами -->
// <table id="crosses_table" class="hidden w-full md:max-w-2xl bg-gray-100 py-5 lg:px-5 overflow-x-scroll lg:overflow-x-hidden rounded"></table>
// <img id="spinner_crosses" class="mx-auto my-3 w-16 hidden" src="{% static 'images/giphy.gif' %}" alt="gif spin">

crosses_table = document.querySelector('#crosses_table')    
spinner_crosses = document.querySelector('#spinner_crosses')
cross_title = document.querySelector('#cross_title')  

if (cross_title.classList.contains(bgBashBoard)){
    cross_title.classList.remove(bgBashBoard);
}

if (cross_title.classList.contains(bgBashBoard)){
    cross_title.classList.remove(bgBashBoard);
}

if (! cross_title.classList.contains(bgBashBoard)){
    cross_title.classList.add(bgBashBoard);
}

if (cross_title.classList.contains(bgBashBoard)){
    cross_title.classList.remove(bgBashBoard);
}

// вкладка кроссы
let crossTitle = () => {
    product_applicability.style.display = 'none';
    offers_table.style.display = 'none';
    price_buttons.style.display = 'none';

    if (offers_title.classList.contains(bgBashBoard)){
        offers_title.classList.remove(bgBashBoard);
    }

    if (applicability_title.classList.contains(bgBashBoard)){
        applicability_title.classList.remove(bgBashBoard);
    }

    if (! gif_spin.classList.contains('hidden')) {
        gif_spin.classList.add('hidden');
    }

}


// вкладка описание
let descriptionTitle = () => {
    product_applicability.style.display = 'none';
    offers_table.style.display = 'none';
    // titles.style.display = 'none';
    product_info_detail.style.display = 'block';
    price_buttons.style.display = 'none';

    if (! description_title.classList.contains(bgBashBoard)){
        description_title.classList.add(bgBashBoard);
    }

    if (offers_title.classList.contains(bgBashBoard)){
        offers_title.classList.remove(bgBashBoard);
    }

    if (applicability_title.classList.contains(bgBashBoard)){
        applicability_title.classList.remove(bgBashBoard);
    }

    if (! gif_spin.classList.contains('hidden')) {
        gif_spin.classList.add('hidden');
    }

}


crosses_table.style.display = 'none';
spinner_crosses.classList.add('hidden');
crosses_table.style.display = 'none';
spinner_crosses.classList.add('hidden');
crosses_table.style.display = 'block';
crosses_table.style.display = 'none';
spinner_crosses.classList.add('hidden');

if (crosses_table.innerHTML == '' && spinner_crosses.classList.contains('hidden')) {
    spinner_crosses.classList.remove('hidden');
}
if (crosses_table.innerHTML != '') {
    spinner_crosses.classList.add('hidden');
}

// получает кроссы из фапи
let getCrossesFapi = () => {
    url = `${window.location.origin}/api/v0/crosses/?partnumber=${article}&brand=${brand}`
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        crosses_table.innerHTML = '';
        f_line = `
        <tr>
            <th class="p-3 md:px-11 md:py-3 pl-5">Наименование аналогов</th>
            <th class="p-3 md:px-11 md:py-3" style="text-align: center;">Бренд</th>
            <th class="p-3 md:px-11 md:py-3" style="text-align: center; width:30%;">Артикул</th>
        </tr>`
        crosses_table.innerHTML += f_line;
    
        for(cross of data.data) {
            one_cross = `
            <td class="p-2 md:px-10 md:py-3 pl-5"><a target="_blank" href="${window.location.origin}/product/?partnumber=${cross.article}&brand=${cross.brand}&pname=${cross.name}&pmodel=&pmodif=&product_id=&lr=">${cross.name}</a></td>
            <tr id="hover">
                <td class="p-2 md:px-10 md:py-3" style="text-align: center;"><a target="_blank" href="${window.location.origin}/product/?partnumber=${cross.article}&brand=${cross.brand}&pname=${cross.name}&pmodel=&pmodif=&product_id=&lr=">${cross.brand}</a></td>
                <td class="p-2 md:px-10 md:py-3" style="text-align: center; width:30%;"><a target="_blank" href="${window.location.origin}/product/?partnumber=${cross.article}&brand=${cross.brand}&pname=${cross.name}&pmodel=&pmodif=&product_id=&lr=">${cross.article}</a></td>
            </tr>`;
            crosses_table.innerHTML += one_cross;
            one_cross = '';
        }
        spinner_crosses.style.display = 'none';
    })
}


setTimeout(function() {getCrossesFapi()}, 500);