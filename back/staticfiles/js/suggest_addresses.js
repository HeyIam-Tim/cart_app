let address_box = document.querySelector("#address_box");
let address = document.querySelector("#address");

let suggestAddress = (element) => {
  if (element.value.length >= 3) {
    window.suggested_address = undefined;

    var token = daDataApiKey;

    var url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    var query = element.value;

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({ query: query, count: 5 }),
    };

    setTimeout(function timer() {
      fetch(url, options)
        .then((response) => response.json())
        .then((result) => {
          if (result.suggestions.length >= 1) {
            address_box.style.display = "block";
            address_box.innerHTML = "";
            address.style.marginBottom = "3px";

            for (const address_suggest of result.suggestions) {
              address_box.innerHTML += `<p id="" class="p-1 m-0 text-left cursor-pointer" name="" data-address="${address_suggest.value}" onclick="grabAddress(this)">${address_suggest.value}</p>`;
            }
          } else {
            address_box.style.display = "none";
            if (window.location.pathname == 'profile/create-shop/') {
              address.style.marginBottom = "25px";
            }
          }
        })
        .catch((error) => console.log("error", error));
    }, 100);
  } else {
    address_box.style.display = "none";
    if (window.location.pathname == 'profile/create-shop/') {
      address.style.marginBottom = "25px";
    }
  }
};


let grabAddress = (element) => {
  let address_suggest = element.getAttribute("data-address");
  address_box.style.display = "none";
  if (window.location.pathname == 'profile/create-shop/') {
    address.style.marginBottom = "25px";
  }

  address.value = address_suggest;
  window.suggested_address = address_suggest;
};
