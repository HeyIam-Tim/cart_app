let ba_short_name = document.querySelectorAll('#ba_short_name')[0]
let ba_short_nameM = document.querySelectorAll('#ba_short_name')[1]

let ba_full_name = document.querySelectorAll('#ba_full_name')[0]
let ba_full_nameM = document.querySelectorAll('#ba_full_name')[1]

let ba_ogrn_ogrnip = document.querySelectorAll('#ba_ogrn_ogrnip')[0]
let ba_ogrn_ogrnipM = document.querySelectorAll('#ba_ogrn_ogrnip')[1]

let OKPO = document.querySelectorAll('#OKPO')[0]
let OKPOM = document.querySelectorAll('#OKPO')[1]

let OKVED = document.querySelectorAll('#OKVED')[0]
let OKVEDM = document.querySelectorAll('#OKVED')[1]

let checking_account = document.querySelectorAll('#checking_account')[0]
let checking_accountM = document.querySelectorAll('#checking_account')[1]

let bank_name = document.querySelectorAll('#bank_name')[0]
let bank_nameM = document.querySelectorAll('#bank_name')[1]

let corr_account = document.querySelectorAll('#corr_account')[0]
let corr_accountM = document.querySelectorAll('#corr_account')[1]

let BIK = document.querySelectorAll('#BIK')[0]
let BIKM = document.querySelectorAll('#BIK')[1]

let phone_number = document.querySelectorAll('#phone_number')[0]
let phone_numberM = document.querySelectorAll('#phone_number')[1]

let email = document.querySelectorAll('#email')[0]
let emailM = document.querySelectorAll('#email')[1]

let contact_person = document.querySelectorAll('#contact_person')[0]
let contact_personM = document.querySelectorAll('#contact_person')[1]


let ba_short_name_pu = document.querySelector('#ba_short_name_pu')
let ba_full_name_pu = document.querySelector('#ba_full_name_pu')
let ba_ogrn_ogrnip_pu = document.querySelector('#ba_ogrn_ogrnip_pu')
let OKPO_pu = document.querySelector('#OKPO_pu')
let OKVED_pu = document.querySelector('#OKVED_pu')
let checking_account_pu = document.querySelector('#checking_account_pu')
let bank_name_pu = document.querySelector('#bank_name_pu')
let corr_account_pu = document.querySelector('#corr_account_pu')
let BIK_pu = document.querySelector('#BIK_pu')
let phone_number_pu = document.querySelector('#phone_number_pu')
let email_pu = document.querySelector('#email_pu')
let contact_person_pu = document.querySelector('#contact_person_pu')

let shop_login_pu = document.querySelector('#shop_login_pu')
let shop_password_pu = document.querySelector('#shop_password_pu')

let close_icon_sn = document.querySelector('#close_icon_sn')
let close_icon_fn = document.querySelector('#close_icon_fn')
let close_icon_oo = document.querySelector('#close_icon_oo')
let close_icon_ok = document.querySelector('#close_icon_ok')
let close_icon_okv = document.querySelector('#close_icon_okv')
let close_icon_ca = document.querySelector('#close_icon_ca')
let close_icon_bn = document.querySelector('#close_icon_bn')
let close_icon_corr = document.querySelector('#close_icon_corr')
let close_icon_bik = document.querySelector('#close_icon_bik')
let close_icon_pn = document.querySelector('#close_icon_pn')
let close_icon_em = document.querySelector('#close_icon_em')
let close_icon_cp = document.querySelector('#close_icon_cp')

let close_icon_shop_login = document.querySelector('#close_icon_shop_login');
let close_icon_shop_password = document.querySelector('#close_icon_shop_password');

let shop_warning = document.querySelector('#shop_warning')


// BIK suggestions
let btn_BIK = document.querySelector('#btn_BIK')
let id_BIK = document.querySelector('#id_BIK')
let bik_validation = document.querySelector('#bik_validation')
let csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value



// timeouts for events
if (shop_warning) {
    setTimeout(function() {
        shop_warning.style.display = 'none';
    }, 4000);
}


// close on escape button
document.addEventListener('keyup', function(e){
    if (e.key == 'Escape') {
        ba_short_name_pu.style.display = 'none';
        ba_full_name_pu.style.display = 'none';
        ba_ogrn_ogrnip_pu.style.display = 'none';
        OKPO_pu.style.display = 'none';
        OKVED_pu.style.display = 'none';
        checking_account_pu.style.display = 'none';
        bank_name_pu.style.display = 'none';
        corr_account_pu.style.display = 'none';
        BIK_pu.style.display = 'none';
        phone_number_pu.style.display = 'none';
        email_pu.style.display = 'none';
        contact_person_pu.style.display = 'none';

        overlay.style.display = 'none';
    }
})


// close form on X icon short name
if (close_icon_sn) {
    close_icon_sn.addEventListener('click', function(){
        ba_short_name_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon full name
if (close_icon_fn) {
    close_icon_fn.addEventListener('click', function(){
        ba_full_name_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon ogrn_ogrnip
if (close_icon_oo) {
    close_icon_oo.addEventListener('click', function(){
        ba_ogrn_ogrnip_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon OKPO
if (close_icon_ok) {
    close_icon_ok.addEventListener('click', function(){
        OKPO_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon OKVED
if (close_icon_okv) {
    close_icon_okv.addEventListener('click', function(){
        OKVED_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon checking_account
if (close_icon_ca) {
    close_icon_ca.addEventListener('click', function(){
        checking_account_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon bank_name
if (close_icon_bn) {
    close_icon_bn.addEventListener('click', function(){
        bank_name_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon corr_account
if (close_icon_corr) {
    close_icon_corr.addEventListener('click', function(){
        corr_account_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon BIK
if (close_icon_bik) {
    close_icon_bik.addEventListener('click', function(){
        BIK_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon phone_number
if (close_icon_pn) {
    close_icon_pn.addEventListener('click', function(){
        phone_number_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon email
if (close_icon_em) {
    close_icon_em.addEventListener('click', function(){
        email_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon contact_person
if (close_icon_cp) {
    close_icon_cp.addEventListener('click', function(){
        contact_person_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon contact_person
if (close_icon_shop_login) {
    close_icon_shop_login.addEventListener('click', function(){
        shop_login_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}


// close form on X icon contact_person
if (close_icon_shop_password) {
    close_icon_shop_password.addEventListener('click', function(){
        shop_password_pu.style.display = 'none';
        overlay.style.display = 'none';
    })
}



// short name
ba_short_name.addEventListener('click', function(){
    overlay.style.display = 'block';
    ba_short_name_pu.style.display = 'block';
})

// short name mobile
ba_short_nameM.addEventListener('click', function(){
    overlay.style.display = 'block';
    ba_short_name_pu.style.display = 'block';
})


// full name
ba_full_name.addEventListener('click', function(){
    overlay.style.display = 'block';
    ba_full_name_pu.style.display = 'block';
})


// full name mobile
ba_full_nameM.addEventListener('click', function(){
    overlay.style.display = 'block';
    ba_full_name_pu.style.display = 'block';
})


// ogrn_ogrnip
ba_ogrn_ogrnip.addEventListener('click', function(){
    overlay.style.display = 'block';
    ba_ogrn_ogrnip_pu.style.display = 'block';
})


// ogrn_ogrnip mobile
ba_ogrn_ogrnipM.addEventListener('click', function(){
    overlay.style.display = 'block';
    ba_ogrn_ogrnip_pu.style.display = 'block';
})


// OKPO
OKPO.addEventListener('click', function(){
    overlay.style.display = 'block';
    OKPO_pu.style.display = 'block';
})


// OKPO mobile
OKPOM.addEventListener('click', function(){
    overlay.style.display = 'block';
    OKPO_pu.style.display = 'block';
})


// OKVED
OKVED.addEventListener('click', function(){
    overlay.style.display = 'block';
    OKVED_pu.style.display = 'block';
})


// OKVED mobile
OKVEDM.addEventListener('click', function(){
    overlay.style.display = 'block';
    OKVED_pu.style.display = 'block';
})


// checking_account
checking_account.addEventListener('click', function(){
    overlay.style.display = 'block';
    checking_account_pu.style.display = 'block';
})


// checking_account mobile
checking_accountM.addEventListener('click', function(){
    overlay.style.display = 'block';
    checking_account_pu.style.display = 'block';
})


// bank_name
bank_name.addEventListener('click', function(){
    overlay.style.display = 'block';
    bank_name_pu.style.display = 'block';
})


// bank_name mobile
bank_nameM.addEventListener('click', function(){
    overlay.style.display = 'block';
    bank_name_pu.style.display = 'block';
})


// corr_account
corr_account.addEventListener('click', function(){
    overlay.style.display = 'block';
    corr_account_pu.style.display = 'block';
})


// corr_account mobile
corr_accountM.addEventListener('click', function(){
    overlay.style.display = 'block';
    corr_account_pu.style.display = 'block';
})


// BIK
BIK.addEventListener('click', function(){
    overlay.style.display = 'block';
    BIK_pu.style.display = 'block';
})
// BIK mobile
BIKM.addEventListener('click', function(){
    overlay.style.display = 'block';
    BIK_pu.style.display = 'block';
})


// phone_number
phone_number.addEventListener('click', function(){
    overlay.style.display = 'block';
    phone_number_pu.style.display = 'block';
})


// phone_number mobile
phone_numberM.addEventListener('click', function(){
    overlay.style.display = 'block';
    phone_number_pu.style.display = 'block';
})


// email
email.addEventListener('click', function(){
    overlay.style.display = 'block';
    email_pu.style.display = 'block';
})


// email mobile
emailM.addEventListener('click', function(){
    overlay.style.display = 'block';
    email_pu.style.display = 'block';
})


// contact_person
contact_person.addEventListener('click', function(){
    overlay.style.display = 'block';
    contact_person_pu.style.display = 'block';
})


// contact_person mobile
contact_personM.addEventListener('click', function(){
    overlay.style.display = 'block';
    contact_person_pu.style.display = 'block';
})


// BIK suggestions

btn_BIK.addEventListener('click', function(e){
    e.preventDefault()

    if (id_BIK.value.length == 9) {
        setTimeout(function() {
            var daDataUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank";
            var token = daDataApiKey;
            var options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({query: id_BIK.value})
            }

            fetch(daDataUrl, options)
            .then(response => response.json())
            .then(data => {
                let nameBank = data.suggestions[0].value
                let corrAccount = data.suggestions[0].data.correspondent_account

                const urlBik = `${window.location.origin}/api/v0/bik-corr-bank/`;
                var optionsBik = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRFToken': csrfmiddlewaretoken,
                    },
                    body: JSON.stringify({
                        'BIK': id_BIK.value,
                        'bank_name': nameBank,
                        'corr_account': corrAccount,
                    })
                }
                fetch(urlBik, optionsBik)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    window.location.href = '/profile/info-business-account/';
                })

            })
            .catch(error => {
                console.log("error", error)
                bik_validation.innerHTML = 'БИК не найден'
            });
        }, 1000);
    } else if (id_BIK.value == ''){
        bik_validation.innerHTML = 'Укажите БИК'
    } else {
        bik_validation.innerHTML = 'БИК должен состоять только из 9 цифр'
    }
})


let closeFormBA = () => {
    ba_short_name_pu.style.display = 'none';
    ba_full_name_pu.style.display = 'none';
    ba_ogrn_ogrnip_pu.style.display = 'none';
    OKPO_pu.style.display = 'none';
    OKVED_pu.style.display = 'none';
    checking_account_pu.style.display = 'none';
    bank_name_pu.style.display = 'none';
    corr_account_pu.style.display = 'none';
    BIK_pu.style.display = 'none';
    phone_number_pu.style.display = 'none';
    email_pu.style.display = 'none';
    contact_person_pu.style.display = 'none';
    overlay.style.display = 'none';
}
