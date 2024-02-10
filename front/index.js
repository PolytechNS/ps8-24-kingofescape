const sqlite3 = require('sqlite3').verbose();
function login() {
    let url = 'http://localhost:8000/api/login';
    let data = {username: 'exemple' , mdp: 'exemple'};

    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then( async (response) => {
        let res = await response.text();
        localStorage.setItem('token', res);
    });
}

function changePage() {
    let s = window.location.href;
    let url = s.split("?")[0];
    let index = url.lastIndexOf("/");
    let newUrl = url.substring(0, index + 1);
    newUrl += "src/jeu/jeu.html";
    window.location.href = newUrl;
}