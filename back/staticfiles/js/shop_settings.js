let shop_name = document.querySelector('#shop_name');
let es_name_popup = document.querySelector('#es_name_popup');
let close_icon_ns = document.querySelector('#close_icon_ns');
let id_name = document.querySelector('#id_name');
let shop_address = document.querySelector('#shop_address');
let sa_name_popup = document.querySelector('#sa_name_popup');
let close_icon_sa = document.querySelector('#close_icon_sa');
let phone_popup = document.querySelector('#phone_popup');
let close_icon_sn = document.querySelector('#close_icon_sn');
let close_icon_ss = document.querySelector('#close_icon_ss');
let shop_city = document.querySelector('#shop_city');
let s_city_popup = document.querySelector('#s_city_popup');
let s_site_popup = document.querySelector('#s_site_popup');
let shop_site = document.querySelector('#shop_site');
let close_icon_site = document.querySelector('#close_icon_site');


if (overlay) {
    // close form on overlay click
    overlay.addEventListener('click', function(){
        overlay.style.display = 'none';
        es_name_popup.style.display = 'none';
        sa_name_popup.style.display = 'none';
        phone_popup.style.display = 'none';
        id_phone_number.value = '';
        s_city_popup.style.display = 'none';
        s_site_popup.style.display = 'none';
    })
}


// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        overlay.style.display = 'none';
        es_name_popup.style.display = 'none';
        sa_name_popup.style.display = 'none';
        phone_popup.style.display = 'none';
        id_phone_number.value = '';
        s_city_popup.style.display = 'none';
        s_site_popup.style.display = 'none';
    }
})


if (close_icon_ns) {
    // close form on X icon a name shop
    close_icon_ns.addEventListener('click', function(){
        overlay.style.display = 'none';
        es_name_popup.style.display = 'none';
        phone_popup.style.display = 'none';
    })
}

if (close_icon_sa) {
    // close form on X icon address
    close_icon_sa.addEventListener('click', function(){
        overlay.style.display = 'none';
        sa_name_popup.style.display = 'none';
    })
}

if (close_icon_sn) {
    // close form on X icon number
    close_icon_sn.addEventListener('click', function(){
        overlay.style.display = 'none';
        phone_popup.style.display = 'none';
        id_phone_number.value = '';
    })
}


if (close_icon_c) {
    // close form on X icon city
    close_icon_c.addEventListener('click', function(){
        overlay.style.display = 'none';
        s_city_popup.style.display = 'none';
        s_site_popup.style.display = 'none';
    })
}


if (close_icon_site) {
    // close form on X icon city
    close_icon_site.addEventListener('click', function(){
        overlay.style.display = 'none';
        s_site_popup.style.display = 'none';
    })
}

// on click of update a shop name button
shop_name.addEventListener('click', function(){
    overlay.style.display = 'block';
    es_name_popup.style.display = 'block';
    id_name.style.borderColor = '#DADCE0'  // gray color
})


// api for name of a shop
id_name.addEventListener('keyup', function(){
    id_name.style.borderColor = '#DADCE0'  // gray color

    setTimeout(function(){
        url = `${window.location.origin}/api/v0/shop-name/?text=${id_name.value}`;
        fetch(url)
        .then(res => res.json())
        .then(data => {
            // highlighht a border bottom with green or red colors
            if (data == false) {
                id_name.style.borderColor = 'rgb(54, 170, 9)'  // green color
            } else {
                id_name.style.borderColor = '#cf1313'  // red color
            }
        })
    }, 500)
})


// on click of update a shop city button
shop_city.addEventListener('click', function(){
    overlay.style.display = 'block';
    s_city_popup.style.display = 'block';
})


// on click of update a shop site button
shop_site.addEventListener('click', function(){
    overlay.style.display = 'block';
    s_site_popup.style.display = 'block';
})


// on click of update a shop address button
shop_address.addEventListener('click', function(){
    overlay.style.display = 'block';
    sa_name_popup.style.display = 'block';
})


// on click of update a shop phone number button
shop_phone.addEventListener('click', function(){
    overlay.style.display = 'block';
    phone_popup.style.display = 'block';
})
