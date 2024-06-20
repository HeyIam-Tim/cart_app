// устанавливает урл после авторизации если в гет параметрах есть '?next=...'
let setRedirectAfterAuthentication = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let sectionName = urlParams.get('next');

    if (sectionName) {localStorage.setItem('redirect_after_auth_to', `${window.location.origin}/${sectionName}`)};
}
setRedirectAfterAuthentication();


// закрывает форму для регистрации менеджера
let closeAdminGroupForm = () => {
    window.location.href = window.location.origin;
}


// применяет ключ
let applyKey = () => {
    let admin_group_key = document.querySelector('#admin_group_key');

    let keyLength = 36;
    if (admin_group_key.value.length == keyLength) {
        let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        let url = `${window.location.origin}/api/v0/admin-group-key/`;
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfmiddlewaretoken,
            },
            body: JSON.stringify({
                'admin_group_key': admin_group_key.value,
            })
        }
        fetch(url, options)
        .then(response => response.json())
        .then(data => {
            localStorage.removeItem('redirect_after_auth_to');
            window.location.href = `${window.location.origin}/admin/`;
        })

    }
    else {
        document.querySelector('#admin_group_info').innerHTML = `Ключ должен быть ${keyLength} символов.`
        admin_group_key.style.borderColor = 'red';
    }
}


// добавляет адаптацию к кнопкам "показать"
let checkErrorMessages = () => {
    let errorlists = document.querySelectorAll('.errorlist');
    for (let index = 0; index < errorlists.length; index++) {
        const element = errorlists[index];
        if (element.childNodes.length !== 0) {
            document.querySelector('#show_pass1').style.top = '30.5%';
            document.querySelector('#show_pass2').style.top = '38.5%';
        }
    }
}
checkErrorMessages();
