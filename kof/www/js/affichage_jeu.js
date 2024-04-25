/**
 * Fonction qui crée le plateau de jeu
 * @param coordinate - The coordinate of the player
 * @param isPlayerOne - true if the player is player one, false if it's player two.
 * @param move - The function move
 * @param placeWall - The function wall
 */
function createTable(coordinate, isPlayerOne , move, placeWall) {
    const table = document.getElementById('jeu');

    for (let i = 9; i >= 1; i--) {
        for (let j = 1; j <= 9; j++) {
            let divSquare = document.createElement('div');
            divSquare.id = 'I ' + String(j) + String(i);
            divSquare.className = 'square';
            divSquare.addEventListener('click', () => move(divSquare.id));
            table.appendChild(divSquare);

            if (j !== 9) {
                let divWallVertical = document.createElement('div');
                divWallVertical.id = 'V ' + String(j) + String(i);
                divWallVertical.addEventListener('click', () => placeWall(divWallVertical.id));
                table.appendChild(divWallVertical);
            }
        }

        for (let j = 1; j <= 9; j++) {
            if (i !== 1) {
                let divWallHorizontal = document.createElement('div');
                divWallHorizontal.id = 'H ' + String(j) + String(i);
                divWallHorizontal.addEventListener('click', () => placeWall(divWallHorizontal.id));
                table.appendChild(divWallHorizontal);
            }

            if (i !== 1 && j !== 9) {
                let divOSquare = document.createElement('div');
                divOSquare.id = 'O ' + String(j) + String(i);
                table.appendChild(divOSquare);
            }
        }
    }

    printPlayer(coordinate, isPlayerOne);
}

/**
 * Fonction qui affiche le joueur sur le plateau
 * @param coordinate - The coordinate of the player
 * @param isPlayerOne - true if the player is player one, false if it's player two.
 */
function printPlayer(coordinate, isPlayerOne) {
    let div = document.getElementById('I ' + coordinate);

    let newDivPlayer = document.createElement('div');
    newDivPlayer.className = isPlayerOne ? 'player1': 'player2';
    div.appendChild(newDivPlayer);
}

/**
 * Fonction qui affiche le mur sur le plateau
 * @param wall - The wall to place ['yx', 1 or 0].
 * @param isPlayerOne - true if the wall is placed by player one, false if it's placed by player two.
 */
function printWall(wall, isPlayerOne) {
    let div1;
    let div2;
    let div3 = document.getElementById('O ' + wall[0]);

    if (wall[1] === 1) {
        div1 = document.getElementById('V ' + wall[0]);
        div2 = document.getElementById('V ' + String(Number.parseInt(wall[0]) - 1));
    }
    else {
        div1 = document.getElementById('H ' + wall[0]);
        div2 = document.getElementById('H ' + String(Number.parseInt(wall[0]) + 10));
    }

    div1.className = isPlayerOne ? 'wallPlayer1': 'wallPlayer2';
    div2.className = isPlayerOne ? 'wallPlayer1': 'wallPlayer2';
    div3.className = isPlayerOne ? 'wallPlayer1': 'wallPlayer2';
}

/**
 * Fonction qui supprime le joueur sur le plateau
 * @param isPlayerOne - true if the player is player one, false if it's player two.
 */
function removePlayer(isPlayerOne) {
    let div = document.getElementsByClassName(isPlayerOne ? 'player1': 'player2')[0];

    if (div !== undefined)
        div.parentNode.removeChild(div);
}

/**
 * Fonction qui demande la coordonnée du joueur
 * @param numberJoueur - The number of the player
 * @param coordinateX - The coordinate X of the player to must have
 * @returns {string} - The coordinate of the player
 */
function getCoordinate(numberJoueur, coordinateX) {
    let coordinatePlayer;

    while(1) {
        coordinatePlayer = window.prompt(`Entrez la coordonnée du joueur${numberJoueur} entre 1${coordinateX} et 9${coordinateX}`);
        if (coordinatePlayer == null || coordinatePlayer.length !== 2 || coordinatePlayer[1] !== coordinateX)
            alertDialog("Invalid coordinate", "The coordinate must be between 1 and 9", "OK");
        else
            break;
    }

    return coordinatePlayer;
}

export {createTable, printPlayer, removePlayer, printWall, getCoordinate};