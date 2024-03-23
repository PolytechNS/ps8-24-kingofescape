import {printPlayer} from "../js/affichage_jeu.js";

let numberPlayer;
let room = localStorage.getItem('room');
let socket;

function createTable() {
    const table = document.getElementById('jeu');

    for (let i = 9; i >= 1; i--) {
        for (let j = 1; j <= 9; j++) {
            let divSquare = document.createElement('div');
            divSquare.id = 'I ' + String(j) + String(i);
            table.appendChild(divSquare);

            if (j !== 9) {
                let divWallVertical = document.createElement('div');
                divWallVertical.id = 'V ' + String(j) + String(i);
                table.appendChild(divWallVertical);
            }
        }

        for (let j = 1; j <= 9; j++) {
            if (i !== 1) {
                let divWallHorizontal = document.createElement('div');
                divWallHorizontal.id = 'H ' + String(j) + String(i);
                table.appendChild(divWallHorizontal);
            }

            if (i !== 1 && j !== 9) {
                let divOSquare = document.createElement('div');
                divOSquare.id = 'O ' + String(j) + String(i);
                table.appendChild(divOSquare);
            }
        }
    }
}


function choosePosition(event) {
    let tab = event.target.id.split(' ');
    let position = tab.length === 1 ? tab[0] : tab[1];
    socket.emit('position', position);
    console.log('Position choisie : ' + position);
}

function removeChoosePosition() {
    let positionI = String(numberPlayer === 1 ? 1 : 9);

    for (let j = 1; j <= 9; j++) {
        let id = 'I ' + String(j) + positionI;
        let div = document.getElementById(id);

        if (div.children.length !== 0) {
            div.removeEventListener('click', choosePosition);
            div.children.item(0).remove();
        }
    }
}

function getPosition() {
    let positionI = String(numberPlayer === 1 ? 1 : 9);

    for (let j = 1; j <= 9; j++) {
        let position = String(j) + positionI;
        let divSquare = document.getElementById('I ' + position);
        let newDiv = document.createElement('div');
        newDiv.className = 'choose';
        newDiv.id = position;
        divSquare.appendChild(newDiv);
        divSquare.addEventListener('click', choosePosition);
    }
}

createTable();

if (room != null) {
    socket = io.connect('http://localhost:8000/api/1v1', {
        query: {
            token: getCookie("token"),
            room: room
        }
    });

    socket.on('connect', () => {
        console.log('Connecté au serveur.');

        socket.on('positionInit', (nPlayer) => {
            numberPlayer = nPlayer;
            getPosition();
        });

        socket.on('positionDepart', (infoPlayer) => {
            removeChoosePosition();
            numberPlayer = infoPlayer[0];
            printPlayer(infoPlayer[1], numberPlayer);
        });

        socket.on('reload', (infoPlayer) => {
            removeChoosePosition();
            numberPlayer = infoPlayer[0];
            printPlayer(infoPlayer[1], numberPlayer);
        });

        socket.on('errorConnect', (message) => {
            window.alert(message);
            changePage("mode/mode.html");
        })

        socket.on('error', (message) => {
            window.alert(message);
        });
    });

}
// choosePosition();

/*let socketId = localStorage.getItem('idSocket');
let playerNumber = localStorage.getItem('playerNumber');
localStorage.removeItem('playerNumber');

let socket;

if (socketId !== null) {
    socket = io.connect('http://localhost:8000/api/1v1', {
        query: {
            "socket": socketId
        }
    });
    localStorage.setItem('idSocket', socket.id);
}
else {
    changePage("/waiting_room/waiting_room.html");
}

socket.on('connect', () => {
    console.log('Connecté au serveur.');
    promptInit();

    socket.on('errorInit', () => {
       window.alert('Erreur lors de l\'initialisation de la partie');
       promptInit();
    });
});

function promptInit() {
    let position = window.prompt('Vous voulez jouer en quelle position entre ' + ((playerNumber === '1')? '11 et 91' : '19 et 99') + ' ?');
    socket.emit('positionInit', position);
}*/


/*import {createTable, printPlayer, printWall, getCoordinate, removePlayer} from "../js/affichage_jeu.js";

let aiPlay = getIAPlay();
let coordinatePlayer = getCoordinate(3 - aiPlay, (aiPlay === 1)? '9' : '1');
const socket = io.connect('http://localhost:8000/api/game');
const socketChat = io.connect('http://localhost:8000/api/chatInGame');

/**
 * Get the number of the player that the AI will play
 * @returns {number} - The number of the player that the AI will play
 */
/*function getIAPlay() {
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
/*function move(divMoveId) {
    let position = divMoveId.split(' ')[1];
    socket.emit('move', {action: "move", value: position});
}

/**
 * Fonction qui affiche le mur sur le plateau
 * @param divMoveId - The id of the div where the wall will be placed
 */
/*function wall(divMoveId) {
    let split = divMoveId.split(' ');
    let wall = [split[1], (split[0] === 'V')? 1: 0];
    socket.emit('move', {action: "wall", value: wall});
}

/**
 * Fonction qui supprime le joueur sur le plateau
 */
/*function endTurn() {
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


export {getIdOnClick};
