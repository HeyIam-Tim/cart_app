//история поиска
let search_history = document.querySelector(".history-form")
let search_history_content = document.querySelector(".history-content")
let historyIcon = document.querySelector(".history-icon")
let openedHistory = false;
let initialized = false;


const openHistoryForm = () => {
    openedHistory = !openedHistory;

    search_history.style.display = openedHistory ? "block" : "none";

    if (openHistoryForm){
        search_history_content.innerHTML = "";

        const raw = localStorage.getItem("history");
    //    localStorage.setItem("history", "");

        let history;
        if (raw != null && raw != ""){
            history = JSON.parse(raw);

            for (let item of history){
                const field = `<div class="history-option"><a onclick="updateLocalHistory('${ item.title }', '${item.ref}')" href="${item.ref}">${item.title}</a></div>`;
        
                search_history_content.innerHTML += field;
            }
        }
        else{
            search_history_content.innerHTML += `<a style="color: rgb(200, 200, 200)">История пустая</a>`;
        }
    }
}

window.addEventListener('click', function(e){
    if (!search_history.contains(e.target) && !historyIcon.contains(e.target)){
        search_history.style.display =  "none";
        openedHistory = false;
    }
});