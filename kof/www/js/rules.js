function displayOff(mode) {
    let element = document.getElementById(mode);
    element.style.display = "none";
}

function startPage() {
    displayOff("modeContinue");
    let result = verifyLogin();

    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                let p = document.getElementById("name");
                p.innerHTML = await response.text();
            }
            else {
                displayOff("profile");
            }
        });
    }
    else {
        displayOff("profile");
    }
}