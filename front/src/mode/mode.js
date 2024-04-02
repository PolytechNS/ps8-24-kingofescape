function displayOff(mode) {
    let element = document.getElementById(mode);
    element.style.display = "none";
}

function displayOffAllConnect() {
    displayOff("modeIA");
    displayOff("modeMultiplayer");
    displayOff("friends");
    displayOff("success");
    displayOff("profile");
}

function togglePopup() {
    document.getElementById("popup-overlay").classList.toggle("open");
}

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (username !== "" && password !== "") {
        let url = 'http://localhost:8000/api/login/'+ username +'/' + password;

        fetch(url, {
            method: 'get'
        }).then(async (response) => {
            if (response.status === 200) {
                let res = await response.text();
                document.cookie = "token=" + res + "; SameSite=None; Secure; path=/";
                window.location.reload()
            } else {
                document.getElementById('texteError').innerHTML = "Invalid username or password";
            }
        });
    }
}

function signIn() {
    let url = 'http://localhost:8000/api/signin';
    let mail = document.getElementById("inputMail").value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let data = {mail: mail, username:username, password:password};

    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then( async (response) => {
        if (response.status === 200) {
            let res = await response.text();
            document.cookie = "token=" + res + "; SameSite=None; Secure; path=/";
            window.location.reload();
        }
        else {
            document.getElementById('texteError').innerHTML = await response.text();
        }
    });
}
function startPage() {
    displayOff("modeContinue");
    let result = verifyLogin();

    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                displayOff("login");
                let p = document.getElementById("name");
                p.innerHTML = await response.text();
            }
            else {
                displayOffAllConnect();
            }
        });
    }
    else {
        displayOffAllConnect();
    }
}

startPage();