import {createTable, printPlayer, printWall, removePlayer} from "../js/affichage_jeu.js";
import {Coordinate} from "../logic/coordinate.js";
import {Wall} from "../logic/wall.js";

const socket = io.connect('/api/game');
let player2Affiche = false;

socket.on('connect', () => {
    console.log('Connecté au serveur.');
    socket.emit('setup');

    socket.on('updateBoardInTurn', (object) => {
        if (object.move !== undefined) {
            removePlayer(true);
            printPlayer(object.move, true);
        }
        else {
            printWall(object.wall, true)
        }

    });

    socket.on('updateBoard', (data) => {
        if (player2Affiche)
            removePlayer(false);

        if (data.ia !== undefined) {
            printPlayer(data.ia, false);
            player2Affiche = true;
        }
        else
            player2Affiche = false;

        window.alert('C\'est à vous de jouer');
    });

    socket.on('endGame', () => {
        window.alert('Partie terminée');
    });
});

function move(idDiv) {
    let split = idDiv.split(' ');
    let x = Number.parseInt(split[1]);
    let y = Number.parseInt(split[2]);
    let newCoordinate = new Coordinate(x, y);
    socket.emit('move', newCoordinate, (res) => {
        console.log(res);
    });

}

function endTurn() {
    socket.emit('endTurn');
}

function placeWall(idDiv) {
    let split = idDiv.split(' ');
    let letter = split[0];
    let x = Number.parseInt(split[1]);
    let y = Number.parseInt(split[2]);
    let wall = new Wall(new Coordinate(x, y), new Coordinate(x + 1, y + 1), letter === 'V');
    console.log(wall);
    socket.emit('placeWall', wall);
}


// A modifier quand on choisira le numéro du joueur
createTable(new Coordinate(0, 4), true, move, placeWall);

export {endTurn};