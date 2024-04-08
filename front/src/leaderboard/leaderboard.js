function affichePlayer(position, username, score, isThisPlayer= false) {
    let linePlayer = document.createElement('div');
    let leaderBoard = document.getElementById('leaderboard');
    let positionPlayer;

    if (position <= 3)
        positionPlayer = document.createElement('div');
    else {
        positionPlayer = document.createElement('p');
        positionPlayer.innerHTML = position;
    }

    if (isThisPlayer === true)
        linePlayer.classList.add((position <= 3)? `player${position}` : 'player');

    let elementUsername = document.createElement('p');
    let elementScore = document.createElement('p');

    elementUsername.innerHTML = username;
    elementScore.innerHTML = score;
    linePlayer.appendChild(positionPlayer);
    linePlayer.appendChild(elementUsername);
    linePlayer.appendChild(elementScore);
    leaderBoard.appendChild(linePlayer);
}

let name;

function redirection() {
    window.alert('You need to be connected to access this page');
    changePage('mode/mode.html');
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

function getLeaderboard() {
    fetch(`${apiURL}api/getScoresAllUsers`, {
        method: 'get'
    }).then(async (response) => {
        if (response.status === 200) {
            let res = await response.text();
            let json = JSON.parse(res);
            let numberPlayerPrint = 0;
            let playerIsPrint = false;

            for (let i = 0; i < json.length; i++) {
                if (name === json[i].username) {
                    affichePlayer(i + 1, json[i].username, json[i].score, true);
                    playerIsPrint = true;
                    numberPlayerPrint++;
                }
                else if (numberPlayerPrint >= 5 && playerIsPrint === true)
                    break;
                else if (numberPlayerPrint < 5) {
                    affichePlayer(i + 1, json[i].username, json[i].score);
                    numberPlayerPrint++;
                }
            }
        }
    });
}

verifyConnect();
getLeaderboard();