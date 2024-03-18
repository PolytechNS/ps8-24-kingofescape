import {createTable, printPlayer, printWall, getCoordinate, removePlayer} from "../js/affichage_jeu.js";

let aiPlay = getIAPlay();
let coordinatePlayer = getCoordinate(3 - aiPlay, (aiPlay === 1)? '9' : '1');
const socket = io.connect('http://localhost:8000/api/game');
const socketChat = io.connect('http://localhost:8000/api/chatInGame');

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
            window.alert('Veuillez entrer 1 ou 2');
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
        window.alert('C\'est à vous de jouer');

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
            window.alert(result.value);
        else if (result.action === "move") {
            removePlayer(aiPlay === 2);
            printPlayer(result.value, aiPlay === 2);
        }
        else
            printWall(result.value, aiPlay === 2);
    });

    socket.on('endGame', (result) => {
        window.alert(result);
    });

    socket.on('errorSetup', (result) => {
        window.alert(result);
        window.location.href = window.location.origin + '/src/mode/mode.html';
    });

    socketChat.on('message1', (id) => {
        var element = document.getElementById('chatContent');
        console.log("ID de l'élément cliqué dans chatcontent: " + id);
        element.innerHTML += "<img id='img_" + id + "' src='chatInGame/message/" + id + ".png' alt='" + id + "' width='150' height='150' />";

        setTimeout(function() {
            var imgToRemove = document.getElementById('img_' + id);
            if (imgToRemove) {
                imgToRemove.parentNode.removeChild(imgToRemove);
            }
        }, 3000); 
    });

});
function getIdOnClick(id) {
    console.log("ID de l element cliqué : " + id.target.id);
    socketChat.emit('message', id.target.id);
}


export {endTurn, getIdOnClick};