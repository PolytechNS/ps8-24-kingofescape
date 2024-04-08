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
async function fetchData(adresse, name) {
    let response = await fetch(adresse + name, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 200)
        return response;
    else
        return null;
}

async function deleteAccount() {
    const name = document.getElementById("name").innerHTML;
    const score = await fetchData('http://localhost:8000/api/deleteScore/', name);
    const state = await fetchData('http://localhost:8000/api/deleteStat/', name);
    const account = await fetchData('http://localhost:8000/api/deleteAccount/', name);
    logout();
}

loadProfil();