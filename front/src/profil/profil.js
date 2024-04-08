async function loadProfil() {
    const result = verifyLogin();

    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                document.getElementById("name").innerHTML = await response.text();
                console.log(response.text());
                let scoresResponse = await fetch('http://localhost:8000/api/getScoresAllUsers', {
                    method: 'get'
                });
                if (scoresResponse.status === 200) {
                    let res = await scoresResponse.text();
                    let json = JSON.parse(res);
                    for (let i = 0; i < json.length; i++) {
                        if (json[i].username === document.getElementById("name").innerHTML) {
                            let backgroundImage = getBackgroundImageBasedOnScore(json[i].score);
                            document.getElementById("imguser").style.backgroundImage = `url('${backgroundImage}')`;
                            break;
                        }
                    }
                }
            } else {
                window.alert("Please connect !");
                changePage('mode/mode.html')
            }
        });
    } else {
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
function getBackgroundImageBasedOnScore(score) {
    if (score < 100) {
        return '../picture/littleprince.png';
    } else if (score >= 100 && score < 300) {
        return '../picture/teenprince.png';
    } else if (score >= 300 && score <= 500) {
        return '../picture/avatar2.png';
    } else if (score > 500 && score <= 700) {
        return '../picture/beforeking.png';
    }
    else if (score > 700) {
        return '../picture/king5.png';
    }
}




async function deleteAccount() {
    const name = document.getElementById("name").innerHTML;
    const score = await fetchData(`${apiURL}api/deleteScore/`, name);
    const state = await fetchData(`${apiURL}api/deleteStat/`, name);
    const account = await fetchData(`${apiURL}api/deleteAccount/`, name);
    logout();
}

loadProfil();