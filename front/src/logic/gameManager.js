import {Character, verifyMoves} from "./character.js";
import {initGraph} from "./graph.js";
import {Coordinate} from "./coordinate.js";
import {GameState}  from "./gameState.js";
import {VisibilityMatrix} from "./visibilityMatrix.js";

class GameManager {
    constructor() {
        this.graphe = initGraph();
        let player1 = new Character(new Coordinate(0, 4));
        let player2 = new Character(new Coordinate(8, 4));
        this.gameState1 = new GameState(player1);
        this.gameState2 = new GameState(player2);
        this.actionRealise = undefined;
        this.visibilityMatrix = new VisibilityMatrix(player1.coordinate, player2.coordinate);
    }

    placeWall(wall) {
        let isPlayerOne = this.isPlayerOne();
        let gameStateActual = isPlayerOne ? this.gameState1 : this.gameState2;

        if (this.actionRealise === undefined && gameStateActual.getRestantWall() > 0) {
            let coordinatePlayer1 = this.gameState1.character.coordinate;
            let coordinatePlayer2 = this.gameState2.character.coordinate;
            let isAdded = this.graphe.addWall(wall, coordinatePlayer1, coordinatePlayer2);

            if (isAdded) {
                gameStateActual.addWall(wall, isPlayerOne);
                this.actionRealise = wall;
                this.visibilityMatrix.updateMatrixWall(wall, isPlayerOne);
                return true;
            }
        }

        return false;
    }

    moveCharacters(newCoordinate) {
        if (this.actionRealise === undefined) {
            if (this.verifyMoves(newCoordinate)) {
                let boolPlayerOne = this.isPlayerOne();
                let gameStateActual = boolPlayerOne ? this.gameState1 : this.gameState2;

                this.visibilityMatrix.updateMoveCharacter(gameStateActual.character.coordinate, newCoordinate, boolPlayerOne);
                gameStateActual.character.move(newCoordinate);
                this.actionRealise = newCoordinate;
                return true;
            }
        }

        return false;
    }

    verifyMoves(newCoordinate) {
        let boolPlayerOne = this.isPlayerOne();
        let gameStateActual = boolPlayerOne ? this.gameState1 : this.gameState2;
        let otherGameState = boolPlayerOne ? this.gameState2 : this.gameState1;

        return verifyMoves(newCoordinate, gameStateActual.character.coordinate, this.graphe, otherGameState.character.coordinate)
    }

    update(isPlayerOne) {
        let gameStateActual = isPlayerOne ? this.gameState1 : this.gameState2;
        this.actionRealise = undefined;
        gameStateActual.turn++;
    }

    getOtherPlayer(isPlayerOne) {
        let gameStateActual = isPlayerOne ? this.gameState1 : this.gameState2;
        let gameStateOther = isPlayerOne ? this.gameState2 : this.gameState1;
        let coordinatePlayerActual = gameStateActual.character.coordinate;
        let coordinatePlayerOther = gameStateOther.character.coordinate;

        if ((coordinatePlayerActual.y === coordinatePlayerOther.y &&
                (coordinatePlayerActual.x === coordinatePlayerOther.x + 1 || coordinatePlayerActual.x === coordinatePlayerOther.x - 1))
            || (coordinatePlayerActual.x === coordinatePlayerOther.x &&
                (coordinatePlayerActual.y === coordinatePlayerOther.y + 1 || coordinatePlayerActual.y === coordinatePlayerOther.y - 1))){
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

        console.log("endGame", gameState1.character.coordinate.x, gameState2.character.coordinate.x);
        return gameState1.character.coordinate.x === 8
            || gameState2.character.coordinate.x === 0
            || (gameState1.turn >= 100 && gameState2.turn >= 100);
    }
}

export {GameManager};