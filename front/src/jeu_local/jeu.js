import {createTable, printPlayer, printWall, removePlayer, getCoordinate} from "../js/affichage_jeu.js";
import {GameLocal} from "../logic_front/gameLocal.js";

let game;
setup();

function setup() {
    let coordinatePlayer1 = getCoordinate(1, '1');
    let coordinatePlayer2 = getCoordinate(2,'9');
    game = new GameLocal(coordinatePlayer1, coordinatePlayer2);

    createTable(coordinatePlayer1, true, move, wall);
}

function move(divMoveId) {
    let isPlayerOne = game.numberPlayer() === 1;
    let position = divMoveId.split(' ')[1];

    try {
        game.doAction({action: "move", value: position});
        removePlayer(isPlayerOne);
        printPlayer(position, isPlayerOne);

        let s;
        switch (game.isEndGame()) {
            case 1:
                s = "Le joueur 1 a gagné";
                break;
            case 2:
                s = "Le joueur 2 a gagné";
                break;
            case 0:
                s = "Egalité";
                break;
        }
        if (s !== undefined)
            window.alert(s);
    } catch (e) {
        window.alert(e.message);
    }
}

function wall(divMoveId) {
    let split = divMoveId.split(' ');
    let wall = [split[1], (split[0] === 'V')? 1: 0];

    try {
        game.doAction({action: "wall", value: wall});
        printWall(wall, game.numberPlayer() === 1);
    } catch (e) {
        window.alert(e.message);
    }
}

function beginTurn() {
    let player = game.getPlayerSee();

    if (player[0] !== undefined)
        printPlayer(player[0], true);

    if (player[1] !== undefined)
        printPlayer(player[1], false);
}

function endTurn() {
    game.update();
    removePlayer(true);
    removePlayer(false);
    beginTurn();
}

export {endTurn, getCoordinate}