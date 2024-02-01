import Coordinate from "./coordinate.js";
import {Character, verifyMoves} from "./character.js";
import {initGraph} from "./graph.js";
import {GameState} from "./gameState.js";

class GameManager {
    constructor() {
        this.graphe = initGraph();
        let player1 = new Character(new Coordinate(0, 4));
        let player2 = new Character(new Coordinate(8, 4));
        this.gameState1 = new GameState(player1);
        this.gameState2 = new GameState(player2);
        //this.visibilityMatrix = new VisibilityMatrix(this.gameState1.character.coordinate, this.gameState2.character.coordinate);
    }

    placeWall(wall) {
        let coordinatePlayer1 = this.gameState1.character.coordinate;
        let coordinatePlayer2 = this.gameState2.character.coordinate;
        let isAdded = this.graphe.addWall(wall, coordinatePlayer1, coordinatePlayer2);

        if (isAdded) {
            let isPlayerOne = this.isPlayerOne();
            this.gameState1.addWall(wall, isPlayerOne);
            this.gameState2.addWall(wall, !isPlayerOne);
            //this.visibilityMatrix.updateMatrixWall(wall, isPlayerOne);
            this.update(isPlayerOne);
            return true;
        }
        return false;
    }

    moveCharacters(newCoordinate) {
        let boolPlayerOne = this.isPlayerOne();
        let gameStateActual =  boolPlayerOne? this.gameState1 : this.gameState2;
        let otherGameState = boolPlayerOne ? this.gameState2 : this.gameState1;

        if (verifyMoves(newCoordinate, gameStateActual.character.coordinate, this.graphe, otherGameState.character.coordinate)) {
            //this.visibilityMatrix.updateMoveCharacter(gameStateActual.character.coordinate, newCoordinate, boolPlayerOne);
            gameStateActual.character.move(newCoordinate);
            this.update(boolPlayerOne);
            return true;
        }

        return false;
    }

    update(isPlayerOne) {
        let gameStateActual = isPlayerOne ? this.gameState1 : this.gameState2;
        gameStateActual.turn++;
    }

    getOtherPlayer() {
        let gameStateActual = this.isPlayerOne() ? this.gameState1 : this.gameState2;
        let gameStateOther = this.isPlayerOne() ? this.gameState2 : this.gameState1;
        let coordinatePlayerActual = gameStateActual.character.coordinate;
        let coordinatePlayerOther = gameStateOther.character.coordinate;

        if (coordinatePlayerActual.x === coordinatePlayerOther.x + 1 || coordinatePlayerActual.x === coordinatePlayerOther.x - 1
        || coordinatePlayerActual.y === coordinatePlayerOther.y + 1 || coordinatePlayerActual.y === coordinatePlayerOther.y - 1) {
            return gameStateOther.character;
        }
        else if (this.visibilityMatrix.canSeeSquare(coordinatePlayerOther, this.isPlayerOne())) {
            return gameStateOther.character;
        }

        return undefined;
    }

    isPlayerOne() {
        return this.gameState1.turn === this.gameState2.turn;
    }

    isEndGame() {
        let gameState1 = this.gameState1;
        let gameState2 = this.gameState2;
        return gameState1.character.coordinate.x === 8
            || gameState2.character.coordinate.x === 0
            || (gameState1.turn >= 100 && gameState2.turn >= 100);
    }
}

export {GameManager};