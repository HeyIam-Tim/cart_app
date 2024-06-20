let id_email = document.querySelector('#id_email')
let close_icon_rp = document.querySelector('#close_icon_rp')
let id_new_password1 = document.querySelector('#id_new_password1')
let id_new_password2 = document.querySelector('#id_new_password2')


// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        window.location.href = '/profile/login/';
    }
})


// close form on X icon on reset password
if (close_icon_rp) {
    close_icon_rp.addEventListener('click', function(){
        window.location.href = '/profile/login/';
    })
}


// set placeholders
if (id_email) {
    id_email.placeholder = 'Email';
}

if (id_new_password1) {
    id_new_password1.placeholder = 'Введите новый пароль';
}

if (id_new_password2) {
    id_new_password2.placeholder = 'Подтвердите пароль';
}


// overlay
if (overlay) {
    overlay.style.display = 'block';
}


// проверяет введеный пользователем емейл
let reset_password_btn = document.querySelector('#reset_password_btn');
reset_password_btn.addEventListener('click', function(e) {

    let id_email = document.querySelector('#id_email');

    let is_email = String(id_email.value)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    if (!is_email) {
        e.preventDefault();
        document.querySelector('#reset_password_info').innerHTML = 'Неверный емейл';
    }
})