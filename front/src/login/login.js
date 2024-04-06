function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let data = {username:username, password:password};
    let url = 'http://localhost:8000/api/login/'+ username +'/' + password;

    fetch(url, {
        method: 'get'
    }).then( async (response) => {
        let res = await response.text();
        localStorage.setItem('currentUser', username);
        document.cookie = "token=" + res + "; SameSite=None; Secure; path=/";
        window.location.href = window.location.origin + '/src/mode/mode.html';
    });
}

function signIn() {
    let url = 'http://localhost:8000/api/signin';
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let data = {username:username, password:password};

    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then( async (response) => {
        let res = await response.text();
        localStorage.setItem('currentUser', username);
        document.cookie = "token=" + res + "; SameSite=None; Secure; path=/";
        window.location.href = window.location.origin + '/src/mode/mode.html';
    });
}