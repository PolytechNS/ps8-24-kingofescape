function login() {

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var data = {username:username, password:password};
    let url = 'http://localhost:8000/api/login/'+ username +'/' + password;

    fetch(url, {
        method: 'get'
    }).then( async (response) => {
        let res = await response.text();
        document.cookie = "token=" + res + "; SameSite=None; Secure";
        newUrl = "http://localhost:8000/src/mode/mode.html";
        window.location.href = newUrl;
    });
}

function signIn() {
    let url = 'http://localhost:8000/api/signin';
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var data = {username:username, password:password};

    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then( async (response) => {
        let res = await response.text();
        document.cookie = "token=" + res + "; SameSite=None; Secure";
        newUrl = "http://localhost:8000/src/mode/mode.html";
        window.location.href = newUrl;
    });
}