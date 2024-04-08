function loadProfil() {
    const result = verifyLogin();

    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                document.getElementById("name").innerHTML = await response.text();
            }
            else {
                window.alert("Please connect !");
                changePage('mode/mode.html')
            }
        });
    }
    else {
        window.alert("Please connect !");
        changePage('mode/mode.html')
    }
}

function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    changePage('mode/mode.html');
}

function deleteAccount() {
}

loadProfil();