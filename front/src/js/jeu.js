import {GameManager} from "../logic/gameManager.js";
import Coordinate from "../logic/coordinate.js";
import {Wall} from "../logic/wall.js";

let gameManager = new GameManager();
createTable();
/*const {token} = sessionStorage;
const socket = io.connect('http://localhost:8000/api/game', {
    query: {token}
})

//console.log(io());
let i = 0;
socket.on('connect', () => {
    console.log('Connecté au serveur.');

    socket.on('newPlayer', (player) => {
        console.log(i++);
        console.log('New player:', player);
    });
});*/


/*socket.on('connect_error', function(err) {
    socket.close();
});*/
//let gameManagerLocale = GameManager.constructor();

/*let test = new Character(new Coordinate(5, 5));*/
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

function createTable() {
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

    printPlayer(true);
    printPlayer(false);
}

function printPlayer(isPlayerOne) {
    let player = isPlayerOne ? gameManager.gameState1.character : gameManager.gameState2.character;
    let div = document.getElementById('I ' + player.coordinate.x + ' ' + player.coordinate.y);
    let newDivPlayer = document.createElement('div');
    newDivPlayer.className = isPlayerOne ? 'player1': 'player2';
    div.appendChild(newDivPlayer);
}

function removePlayer(isPlayerOne) {
    let div = document.getElementsByClassName(isPlayerOne ? 'player1': 'player2')[0];
    div.parentNode.removeChild(div);
}

function move(idDiv) {
    let split = idDiv.split(' ');
    let x = Number.parseInt(split[1]);
    let y = Number.parseInt(split[2]);
    let newCoordinate = new Coordinate(x, y);
    let isMove = gameManager.moveCharacters(newCoordinate);
    let isPlayerOne = !gameManager.isPlayerOne();

    if (isMove) {
        removePlayer(isPlayerOne);
        printPlayer(isPlayerOne);
    }
    else {
        window.alert("Impossible de se déplacer ici");
    }
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


function placeWall(idDiv) {
    let split = idDiv.split(' ');
    let letter = split[0];
    let x = Number.parseInt(split[1]);
    let y = Number.parseInt(split[2]);
    let wall = new Wall(new Coordinate(x, y), new Coordinate(x + 1, y + 1), letter === 'V');
    let isPlayerOne = gameManager.isPlayerOne();
    if (gameManager.placeWall(wall)) {
        printWall(wall, isPlayerOne);
    }
    else {
        window.alert("Impossible de poser un mur");
    }
}
/*socket.on('connect', () => {
    console.log('Connecté au serveur.');

    // Créer des instances de Coordinate
    const coord1 = new Coordinate(1, 2);
    const coord2 = new Coordinate(3, 4);

    // Créer une instance de Wall
    const wall = new Wall(coord1, coord2, true);



    // Envoyer l'objet wall au serveur
    socket.emit('newWall', wall);

});

socket.on('wallReceived', (confirmation) => {
    console.log(confirmation);
});
document.addEventListener('DOMContentLoaded', (event) => {
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', () => {
        // Créer des instances de Coordinate
        const coord1 = new Coordinate(8, 9);
        const coord2 = new Coordinate(5, 6);

        // Créer une instance de Wall
        const wall = new Wall(coord1, coord2, true);
        const wall2 = new Wall(coord1, coord2, true);

        // Envoyer l'objet wall au serveur
        socket.emit('newWall', wall, (response) => {
            console.log('Server response:', response);
        });
        socket.emit('newWall2', wall2, (response) => {
            console.log('Server response:', response);
        });
    });
});
*/