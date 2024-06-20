let id_name = document.querySelector('#id_name');
let close_icon_as = document.querySelector('#close_icon_as');
let name_field = document.querySelector('#name_field');
let address_field = document.querySelector('#address_field');
let warning = document.querySelector('.warning');
let error = document.querySelector('.error');


// highlight a border bottom by red on a shop name 
if (warning) {
    id_name.style.borderColor = '#cf1313'  // red color
    id_name.style.marginBottom = '0px';
}

// highlight a border bottom by red on a shop address
if (error) {
    id_address.style.borderColor = '#cf1313'  // red color
    id_address.style.marginBottom = '0px';
}


// // close forms on overlay click
// if (overlay) {
//     overlay.addEventListener('click', function(){
//         window.location.href = '/profile/business-account/'
//     })
// }


// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        window.location.href = '/profile/business-account/'
    }
})


// close form on X icon on edit shop
if (close_icon_as) {
    close_icon_as.addEventListener('click', function(){
        window.location.href = '/profile/business-account/';
    })
}


// api for name of a shop
id_name.addEventListener('keyup', function(){
    if (name_field) {
        name_field.style.display = 'none';
    }

    id_name.style.borderColor = '#DADCE0'  // gray color

    setTimeout(function(){
        url = `${window.location.origin}/api/v0/shop-name/?text=${id_name.value}`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data == false) {
                id_name.style.borderColor = 'rgb(54, 170, 9)'  // green color
            } else {
                id_name.style.borderColor = '#cf1313'  // red color
            }
        })
    }, 500)
})
