let id_name = document.querySelector('#id_name');
let warning = document.querySelector('.warning');
let li = document.querySelector('li');
let close_icon_ns = document.querySelector('#close_icon_ns');
let close_icon_sa = document.querySelector('#close_icon_sa');


// close form on overlay click
if (overlay) {
    overlay.addEventListener('click', function(){
        window.location.href = `/profile/shops/${shop}/settings/`;
    })
}


// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        window.location.href = `/profile/shops/${shop}/settings/`;
    }
})


if (close_icon_ns) {
    // close form on X icon
    close_icon_ns.addEventListener('click', function(){
        window.location.href = `/profile/shops/${shop}/settings/`;
    })
}


if (close_icon_sa) {
    // close form on X icon
    close_icon_sa.addEventListener('click', function(){
        window.location.href = `/profile/shops/${shop}/settings/`;
    })
}


// highlight a border bottom by red on a shop name 
if (warning) {
    id_name.style.borderColor = '#cf1313'  // red color
    id_address.style.borderColor = '#cf1313'  // red color
}


// api for name of a shop
if (id_name) {
    id_name.addEventListener('keyup', function(){
        id_name.style.borderColor = '#DADCE0'  // gray color
        li.style.display = 'none';
    
        setTimeout(function(){
            url = `../../../api/v0/shop-name/?name=${id_name.value}`
            fetch(url)
            .then(res => res.json())
            .then(data => {
                // highlighht a border bottom with green or red colors
                if (data.name == false) {
                    id_name.style.borderColor = 'rgb(54, 170, 9)'  // green color
                } else {
                    id_name.style.borderColor = '#cf1313'  // red color
                }
            })
        }, 1500)
    })
}

