async function fetchData(adresse, name) {
    let response = await fetch(adresse + name);
    if (response.status === 200)
        return response.json();
    else
        return null;
}

async function getScore(name) {
    const score = await fetchData(`${apiURL}api/getScores/`, name);

    if (score != null) {
        document.getElementById("score").innerHTML = score.score;
        console.log(score);
    }
}

async function getStat(name) {
    const stat = await fetchData(`${apiURL}api/getStat/`, name);

    if (stat != null) {
        const win = Number.parseInt(stat.win);
        const total = Number.parseInt(stat.total);

        document.getElementById("totalGame").innerHTML = stat.total;
        document.getElementById("totalVictory").innerHTML = stat.win;
        document.getElementById("rateVictory").innerHTML = String((win === 0)? 0 : Math.round(100 * win / total)) + "%";
    }
}


function startPage() {
    let result = verifyLogin();

    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                const p = document.getElementById("name");
                const name = await response.text();
                p.innerHTML = name;
                getStat(name);
                getScore(name);
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

startPage();