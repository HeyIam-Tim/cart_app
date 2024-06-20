// выводит чеки
let renderReceipts = (data) => {
    let receiptsContainer = document.querySelector('#receipts');

    if (data.receipts) {
        document.querySelector('#receipts_info').style.display = 'none';
    }

    for (const receipt of data.receipts) {
        receiptsContainer.innerHTML += `
        <div id="receipts_info" class="p-3 py-1 pb-1">
            &#x2022; <a href="${receipt}" class="text-blue-500" target="_blank">ссылка на чек</a>
        </div>`;
    }
}


// получает чеки по апи
let getReceiptsAPI = () => {
    let url = `${window.location.origin}/cart/api/v0/get-receipts/?order_id=${order_id}`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        renderReceipts(data);
    })
}


// работает с чеками
let handleReceipts = () => {
    getReceiptsAPI();
}


// вызов чеков
setTimeout(() => {
    handleReceipts()
}, 1000);
