import {Graph, initGraph} from "../../front/src/logic/graph.js";
import {Wall} from "../../front/src/logic/wall.js";
import {GameState} from "../../front/src/logic/gameState.js";
import {Character} from "../../front/src/logic/character.js";
import {Coordinate} from "../../front/src/logic/coordinate.js";

function save(token, gameManager) {
    let gameState1 = gameManager.gameState1;
    let gameState2 = gameManager.gameState2;
    let visibilityMatrix = gameManager.visibilityMatrix;
    console.log(gameManager);

    let jsonGameState1 = JSON.stringify(gameState1);
    let jsonGameState2 = JSON.stringify(gameState2);
    let jsonVisibilityMatrix = JSON.stringify(visibilityMatrix);
    let json = JSON.stringify({
        token: token,
        gameState1: jsonGameState1,
        gameState2: jsonGameState2,
        visibilityMatrix: jsonVisibilityMatrix });
    return json;
}

function load(token, json) {
    let jsonParse = JSON.parse(json);
    let gameState1Parse = JSON.parse(jsonParse.gameState1);
    let gameState2Parse = JSON.parse(jsonParse.gameState2);
    console.log(gameState1Parse);
    let coordinatePlayer1 = gameState1Parse.character;
    console.log(coordinatePlayer1.x, coordinatePlayer1.y);
    let gameState1 = new GameState(new Character(new Coordinate(coordinatePlayer1.x, coordinatePlayer1.y)));
    console.log(gameState1);
}

export {save, load};