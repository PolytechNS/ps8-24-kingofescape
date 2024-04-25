function redirection() {
    alertDialog("Not connect", 'You need to be connected to access this page', "OK");
    changePage('mode.html');
}

function verifyConnect() {
    let result = verifyLogin();

    if (result == null) {
        redirection();
    }

    else (result.then(async (response) => {
        if (response.status !== 200)
            redirection();
        else {
            name = await response.text();
            document.getElementById("name").innerHTML = name;
        }
    }));
}

function displayVibration() {
    let vibration = localStorage.getItem("vibration");

    if (vibration === "true")
        document.getElementById("imageVibration").src = "./picture/vibration-mode.png";
    else if (vibration === null)
        document.getElementById("imageVibration").src = "./picture/vibration-mode.png";
    else
        document.getElementById("imageVibration").src = "./picture/vibration-mode-off.png";
}

function changeVibration() {
    let vibration = localStorage.getItem("vibration");

    if (vibration === "true")
        localStorage.setItem("vibration", "false");
    else if (vibration === null)
        localStorage.setItem("vibration", "false");
    else
        localStorage.setItem("vibration", "true");

    displayVibration();
}

verifyConnect();
displayVibration();