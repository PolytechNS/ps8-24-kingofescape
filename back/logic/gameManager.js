const {GameState} = require("./gameState");
const {Character, verifyMoves} = require("./character");
const {Graph, initGraph} = require("./graph.js");
const {Coordinate} = require("./coordinate");
const {Wall} = require("./wall");
const {VisibilityMatrix} = require("./visibilityMatrix");

class GameManager {
    constructor() {
        this.graphe = Graph.initGraph();
        this.gameState1 = new GameState(new Character.Character(new Coordinate(0, 4)));
        this.gameState2 = new GameState(new Character.Character(new Coordinate(8, 4)));
        this.visibilityMatrix = new VisibilityMatrix(this.gameState1.character.coordinate, this.gameState2.character.coordinate);
    }

    placeWall(s) {
        let coordinate1Get = new Coordinate(s.wall.coordinate1.x, s.wall.coordinate1.y);
        let coordinate2Get = new Coordinate(s.wall.coordinate2.x, s.wall.coordinate2.y);
        let wall = new Wall(coordinate1Get, coordinate2Get, s.wall.isVertical);
        let coordinatePlayer1 = this.gameState1.character.coordinate;
        let coordinatePlayer2 = this.gameState2.character.coordinate;
        let isAdded = this.graphe.addWall(wall, coordinatePlayer1, coordinatePlayer2);

        if (isAdded) {
            let isPlayerOne = this.isPlayerOne();
            this.gameState1.addWall(wall, isPlayerOne);
            this.gameState2.addWall(wall, !isPlayerOne);
            this.visibilityMatrix.updateMatrixWall(wall, isPlayerOne);
            this.update(isPlayerOne);
            return true;
        }
        return false;
    }

    moveCharacters(s) {
        let newCoordinate = new Coordinate(s.Coordinate.x, s.Coordinate.y);
        console.log(newCoordinate);
        let boolPlayerOne = this.isPlayerOne();
        let gameStateActual =  boolPlayerOne? this.gameState1 : this.gameState2;
        let otherGameState = boolPlayerOne ? this.gameState2 : this.gameState1;

        if (Character.verifyMoves(newCoordinate, gameStateActual.character.coordinate, this.graphe, otherGameState.character.coordinate)) {
            this.visibilityMatrix.updateMoveCharacter(gameStateActual.character.coordinate, newCoordinate, boolPlayerOne);
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

exports.GameManager = GameManager;