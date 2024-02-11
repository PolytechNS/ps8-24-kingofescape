import {Coordinate} from "../logic/coordinate.js";
import {Wall} from "../logic/wall.js";
import {createTable, printWall, printPlayer, removePlayer} from "./affichage_jeu.js";
import {GameManager} from "../logic/gameManager.js";

let gameManager = new GameManager();
createTable(new Coordinate(0, 4), true, move, placeWall);


function endGame() {
    if (gameManager.isEndGame()) {
        window.alert("Partie terminée !\nLe joueur " + (gameManager.isPlayerOne() ? "1" : "2") + " a gagné");
        let s = window.location.href;
        let url = s.split("?")[0];
        let index = url.lastIndexOf("/");
        let newUrl = url.substring(0, index - 13);
        newUrl += "index.html";
        window.location.href = newUrl;
    }
}

function move(idDiv) {
    let split = idDiv.split(' ');
    let x = Number.parseInt(split[1]);
    let y = Number.parseInt(split[2]);
    let newCoordinate = new Coordinate(x, y);
    let isMove = gameManager.moveCharacters(newCoordinate);
    let isPlayerOne = gameManager.isPlayerOne();

    if (isMove) {
        removePlayer(isPlayerOne);
        printPlayer(newCoordinate, isPlayerOne);
        endGame();
    }
    else if (gameManager.actionRealise !== undefined) {
        window.alert("Mouvement réalisé");
    }
    else {
        window.alert("Impossible de se déplacer ici");
    }
}


function beginTurn() {
    let isPlayerOne = gameManager.isPlayerOne();
    let coordinate = isPlayerOne ? gameManager.gameState1.character.coordinate : gameManager.gameState2.character.coordinate;
    printPlayer(coordinate, isPlayerOne);

    if (gameManager.getOtherPlayer(isPlayerOne) !== undefined) {
        let coordinate2 = !isPlayerOne ? gameManager.gameState1.character.coordinate : gameManager.gameState2.character.coordinate;
        printPlayer(coordinate2, !isPlayerOne);
    }
}

export function endTurn() {
    let isPlayerOne = gameManager.isPlayerOne();
    removePlayer(true);
    removePlayer(false);
    gameManager.update(isPlayerOne);
    beginTurn();
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
        endGame();
    }
    else if (gameManager.actionRealise !== undefined) {
        window.alert("Placement réalisé");
    }
    else {
        window.alert("Impossible de poser un mur");
    }
}