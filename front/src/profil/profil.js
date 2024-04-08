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

loadProfil();