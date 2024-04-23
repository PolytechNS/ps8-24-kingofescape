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

async function setToken(response, responseError) {
    if (response.status === 200) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);

        let res = await response.text();
        document.cookie = `token=${res}; expires=${currentDate.toUTCString()}; path=/`;
        window.location.reload();
    }
    else {
        if (responseError !== undefined)
            document.getElementById('texteError').innerHTML = responseError;
        else
            document.getElementById('texteError').innerHTML = await response.text();
    }

}

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (username !== "" && password !== "") {
        let url = `${apiURL}api/login/`+ username +'/' + password;

        fetch(url, {
            method: 'get'
        }).then(async (response) => {
            await setToken(response, "Invalid username or password")
        });
    }
}

function signIn() {
    let url = `${apiURL}api/signin`;
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
        await setToken(response);
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

function create() {
    let create = document.getElementById("create");
    let signIn = document.getElementById("signin");
    let login = document.getElementById("popup-login");
    let inputMail = document.getElementById("inputMail");
    let logint = document.getElementById("logint");

    create.style.display = "none";
    signIn.style.display = "block";
    login.style.display = "none";
    inputMail.style.display = "block";
    logint.style.display = "block";
}

function logint() {
    let create = document.getElementById("create");
    let signIn = document.getElementById("signin");
    let login = document.getElementById("popup-login");
    let inputMail = document.getElementById("inputMail");
    let logint = document.getElementById("logint");

    create.style.display = "block";
    signIn.style.display = "none";
    login.style.display = "block";
    inputMail.style.display = "none";
    logint.style.display = "none";
}

startPage();