import {createTable, printPlayer, printWall, getCoordinate, removePlayer} from "../js/affichage_jeu.js";

notifyBattery();
let aiPlay = getIAPlay();
let coordinatePlayer = getCoordinate(3 - aiPlay, (aiPlay === 1)? '9' : '1');
const socket = io.connect(`${apiURL}api/game`);

/**
 * Get the number of the player that the AI will play
 * @returns {number} - The number of the player that the AI will play
 */
function getIAPlay() {
    let aiPlay;

    while (true) {
        aiPlay = window.prompt('L\'IA joue en numéro 1 ou 2 ?');

        if (aiPlay === '1' || aiPlay === '2')
            break;
        else
            alertDialog('Error Number Player', 'Please enter 1 or 2', 'OK');
    }

    return Number.parseInt(aiPlay);
}

/**
 * Fonction qui affiche le joueur sur le plateau
 * @param divMoveId - The id of the div where the player will be placed
 */
function move(divMoveId) {
    let position = divMoveId.split(' ')[1];
    socket.emit('move', {action: "move", value: position});
}

/**
 * Fonction qui affiche le mur sur le plateau
 * @param divMoveId - The id of the div where the wall will be placed
 */
function wall(divMoveId) {
    let split = divMoveId.split(' ');
    let wall = [split[1], (split[0] === 'V')? 1: 0];
    socket.emit('move', {action: "wall", value: wall});
}

/**
 * Fonction qui supprime le joueur sur le plateau
 */
function endTurn() {
    socket.emit('endTurn');
}

socket.on('connect', () => {
    console.log('Connecté au serveur.');
    let token = document.cookie.split('=')[1];
    socket.emit('setup',{AIplays: aiPlay, coordinatePlayer: coordinatePlayer, token: token});
    createTable(coordinatePlayer, aiPlay === 2, move, wall);

    socket.on('updateBoard', (gameState) => {
        alertDialog("Your turn", "It's your turn", "OK");

        removePlayer(true);
        removePlayer(false);
        if (gameState.player1 !== undefined)
            printPlayer(gameState.player1, true);
        if (gameState.player2 !== undefined)
            printPlayer(gameState.player2, false);
        if (gameState.wall !== undefined)
            printWall(gameState.wall, aiPlay === 1);
    });

    socket.on('resultAction', (result) => {
        if (result.action === "error")
            alertDialog("Error action", result.value, "OK");
        else if (result.action === "move") {
            removePlayer(aiPlay === 2);
            printPlayer(result.value, aiPlay === 2);
        }
        else {
            vibrate();
            printWall(result.value, aiPlay === 2);
        }
    });

    socket.on('endGame', (result) => {
        alertDialog("End Game", result, "OK");
    });

    socket.on('errorSetup', (result) => {
        alertDialog("Error launch", result, "OK");
        window.location.href = window.location.origin + '/src/mode/mode.html';
    });
});

export {endTurn};