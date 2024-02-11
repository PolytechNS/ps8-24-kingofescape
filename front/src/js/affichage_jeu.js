function detectLetter(x, y) {
    if (x % 2 === 1 && y % 2 === 1)
        return  'O';
    else if (x % 2 === 0 && y % 2 === 0)
        return  'I';
    else if (x % 2 === 0 && y % 2 === 1)
        return 'V';
    else
        return 'H';
}

function createTable(coordinate, isPlayerOne , move, placeWall) {
    const table = document.getElementById('jeu');

    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 17; j++) {
            const letter = detectLetter(i, j);
            const div = document.createElement('div');

            if (letter === 'I')
                div.addEventListener('click', () => move(div.id));
            else if (letter === 'H' || letter === 'V')
                div.addEventListener('click', () => placeWall(div.id));

            div.id = letter + ' ' + Math.floor(i / 2) + ' ' + Math.floor(j / 2);
            table.appendChild(div);
        }
    }

    printPlayer(coordinate, isPlayerOne);
}

function printPlayer(coordinate, isPlayerOne) {
    console.log(coordinate, isPlayerOne);
    let div = document.getElementById('I ' + coordinate.x + ' ' + coordinate.y);
    let newDivPlayer = document.createElement('div');
    newDivPlayer.className = isPlayerOne ? 'player1': 'player2';
    div.appendChild(newDivPlayer);
}

function printWall(wall, isPlayerOne) {
    let div1;
    let div2;
    let div3 = document.getElementById('O ' + wall.coordinate1.x + ' ' + wall.coordinate1.y);

    if (wall.isVertical) {
        div1 = document.getElementById('V ' + wall.coordinate1.x + ' ' + wall.coordinate1.y);
        div2 = document.getElementById('V ' + wall.coordinate4.x + ' ' + wall.coordinate1.y);
    }
    else {
        div1 = document.getElementById('H ' + wall.coordinate1.x + ' ' + wall.coordinate1.y);
        div2 = document.getElementById('H ' + wall.coordinate1.x + ' ' + wall.coordinate4.y);
    }

    div1.className = isPlayerOne ? 'wallPlayer1': 'wallPlayer2';
    div2.className = isPlayerOne ? 'wallPlayer1': 'wallPlayer2';
    div3.className = isPlayerOne ? 'wallPlayer1': 'wallPlayer2';
}

function removePlayer(isPlayerOne) {
    let div = document.getElementsByClassName(isPlayerOne ? 'player1': 'player2')[0];

    if (div !== undefined)
        div.parentNode.removeChild(div);
}

export {createTable, printPlayer, removePlayer, printWall};