function affichePlayer(position, username, score) {
    let linePlayer = document.createElement('div');
    let leaderBoard = document.getElementById('leaderboard');
    let positionPlayer;

    if (position <= 3)
        positionPlayer = document.createElement('div');
    else {
        positionPlayer = document.createElement('p');
        positionPlayer.innerHTML = position;
    }

    let elementUsername = document.createElement('p');
    let elementScore = document.createElement('p');

    elementUsername.innerHTML = username;
    elementScore.innerHTML = score;
    linePlayer.appendChild(positionPlayer);
    linePlayer.appendChild(elementUsername);
    linePlayer.appendChild(elementScore);
    leaderBoard.appendChild(linePlayer);
}

affichePlayer(1, 'toto', 1000);
affichePlayer(2, 'toto', 900);
affichePlayer(3, 'toto', 800);
affichePlayer(4, 'toto', 700);
affichePlayer(5, 'toto', 600);