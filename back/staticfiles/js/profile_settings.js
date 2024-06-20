let edit_fields = document.querySelectorAll('.edit_field')
let usernames = document.querySelectorAll('.username')
let username1 = document.querySelectorAll('.username')[0]
let lp_email1 = document.querySelectorAll('.lp_email')[0]
let lp_edit_popup = document.querySelector('#lp_edit_popup')
let lp_edit_name = document.querySelector('#lp_edit_name')
let lp_edit_id = document.querySelector('#lp_edit_id')
let lp_edit_save = document.querySelector('#lp_edit_save')
let lp_messages = document.querySelector('#lp_messages')
let lp_success = document.querySelector('#lp_success')
let password1 = document.querySelector('#password1')
let password2 = document.querySelector('#password2')
let edit_photo = document.querySelector('#edit_photo')
let edit_photo_btn = document.querySelector('#edit_photo_btn')
let close_icon_lp = document.querySelector('#close_icon_lp')
let close_icon_ph = document.querySelector('#close_icon_ph')
let ul = document.querySelector('ul')
let lp_emails = document.querySelectorAll('.lp_email')
let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;


if (ul) {
    setTimeout(function() {
        ul.style.display = 'none';
        }, 4000);
}

for (let i = 0; i < edit_fields.length; i++) {
    const element = edit_fields[i];
    element.addEventListener('click', function(){
        overlay.style.display = 'block';
        lp_edit_popup.style.display = 'block';
        lp_edit_name.innerHTML = this.id
        lp_edit_id.placeholder = 'Введите ' + this.id
        if (element.id == 'Логин') {
            lp_edit_id.value = username1.innerHTML
        }
        else if (element.id == 'Email') {
            lp_edit_id.value = lp_email1.innerHTML
        }
        else if (element.id == 'Пароль') {
            password1.value = '*******';
            password2.value = '*******';
            lp_edit_id.value = '*******';
        }

        lp_edit_save.addEventListener('click', function(e){
            if (lp_edit_id.value != '') {
                url = `${window.location.origin}/api/v0/lk/`;
                if (element.id == 'Логин') {
                    if (lp_edit_id.value.length < 3) {
                        lp_messages.innerHTML = ''
                        lp_messages.innerHTML = 'Слишком короткое значение'
                    } else if (lp_edit_id.value.length > 30) {
                        lp_messages.innerHTML = ''
                        lp_messages.innerHTML = 'Слишком длинное значение'
                    } else {
                        fetch(url, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'X-CSRFToken': csrfmiddlewaretoken,
                            },
                            body: JSON.stringify({
                                'username': lp_edit_id.value,
                            })
                          })
                          .then(res => res.json())
                          .then(data => {
                              console.log(data)
                              window.location.href = '/profile/settings/';
                          })
                    }
                }
                else if (element.id == 'Email') {

                    let is_email = String(lp_edit_id.value)
                        .toLowerCase()
                        .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        );
                    if (!is_email) {
                        e.preventDefault();
                        lp_messages.innerHTML = 'Неверный емейл';
                    }
                    else {
                        if (lp_edit_id.value.length < 4) {
                            lp_messages.innerHTML = ''
                            lp_messages.innerHTML = 'Слишком короткое значение'
                        } else if (lp_edit_id.value.length > 30) {
                            lp_messages.innerHTML = ''
                            lp_messages.innerHTML = 'Слишком длинное значение'
                        } else if (lp_edit_id.value.includes('@')) {
                            fetch(url, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'X-CSRFToken': csrfmiddlewaretoken,
                                },
                                body: JSON.stringify({
                                    'email': lp_edit_id.value,
                                    // 'password1': null,
                                    // 'password2': null
                                })
                              })
                              .then(res => res.json())
                              .then(data => {
                                  console.log(data)
                                  window.location.href = '/profile/settings/';
                              })
                        } else {
                            lp_messages.innerHTML = ''
                            lp_messages.innerHTML = "Email должен содержать '@'"
                        }
                    }

                } else if (element.id == 'Пароль') {
                    if (password1.value.length < 4 || password2.value.length < 4) {
                        lp_messages.innerHTML = ''
                        lp_messages.innerHTML = 'Слишком короткое значение. Минимум 8 символов'
                        if (password1.value == '' || password2.value == '') {
                            lp_messages.innerHTML = ''
                            lp_messages.innerHTML = 'Поле не может быть пустым'
                        }
                    }
                    else if (password1.value.length > 30 || password2.value.length > 30) {
                        lp_messages.innerHTML = ''
                        lp_messages.innerHTML = 'Слишком длинное значение'
                    } else {
                        fetch(url, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'X-CSRFToken': csrfmiddlewaretoken,
                            },
                            body: JSON.stringify({
                                'password1': password1.value,
                                'password2': password2.value,
                            })
                          })
                          .then(res => res.json())
                          .then(data => {
                              window.location.href = '/profile/settings/';
                          })
                    }
                }
            } else {
                lp_messages.innerHTML = ''
                lp_messages.innerHTML = 'Поле не может быть пустым'
            }
        })

        if (element.id == 'Пароль') {
            lp_edit_popup.style.height = '300px'
            password1.style.display = 'block';
            password2.style.display = 'block';
            password1.value = '';
            password2.value = '';
            password1.placeholder = 'Введите новый пароль';
            password2.placeholder = 'Подтвердите новый пароль';
            lp_edit_id.style.display = 'none';
        }
        else if (element.id == 'Логин'){
            password1.style.display = 'none';
            password2.style.display = 'none';
            lp_edit_id.style.display = 'block';
            lp_edit_popup.style.height = '250px'
        }
        else if (element.id == 'Email'){
            password1.style.display = 'none';
            password2.style.display = 'none';
            lp_edit_id.style.display = 'block';
            lp_edit_popup.style.height = '250px'
        }
    })
}

// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        lp_edit_popup.style.display = 'none';
        overlay.style.display = 'none';
    }
})

if (close_icon_lp) {
    // close form on X icon
    close_icon_lp.addEventListener('click', function(){
        lp_edit_popup.style.display = 'none';
        overlay.style.display = 'none';
        lp_edit_id.value = '';
        lp_messages.innerHTML = '';
        password1.value = '';
        password2.value = '';
    })
}


if (edit_photo_btn) {
    edit_photo_btn.addEventListener('click', function(){
        overlay.style.display = 'block';
        edit_photo.style.display = 'block';
    })
}


// открывает попап с формой изменения логина
let changeLogin = (element) => {
    let info_message = 'Логин должен быть от 3 до 30 символов';
    document.querySelector('#form_info').innerHTML = info_message;
}


// открывает попап с формой изменения emaila
let changeEmail = (element) => {
    let info_message = 'Email должен быть от 3 до 30 символов';
    document.querySelector('#form_info').innerHTML = info_message;
}


// открывает попап с формой изменения пароля
let changePassword = (element) => {
    let info_message = 'Пароль должен содержать: A-Z, a-z, 0-9, спец символ и быть не менее 8 символов';
    document.querySelector('#form_info').innerHTML = info_message;
}
