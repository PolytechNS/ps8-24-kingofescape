// This function doesn't handle walls.
import {Coordinate} from "../../front/src/logic/coordinate.js";

function computeMove(gameManager, iaPlay) {
    let gameState = (iaPlay === 1) ? gameManager.gameState1 : gameManager.gameState2;
    let pos = gameState.character.coordinate.toNumber();
    let possibleMoves = [];
    // Check if moving left is possible.
    if (pos > 20 && gameManager.verifyMoves(Coordinate.toNumberCoordinate(pos - 10))) possibleMoves.push(pos-10);
    // Check if moving right is possible.
    if (pos < 90 && gameManager.verifyMoves(Coordinate.toNumberCoordinate(pos + 10))) possibleMoves.push(pos+10);
    // Check if moving down is possible.
    if (pos % 10 !== 1 && gameManager.verifyMoves(Coordinate.toNumberCoordinate(pos - 1))) possibleMoves.push(pos-1);
    // Check if moving up is possible.
    if (pos % 10 !== 9 && gameManager.verifyMoves(Coordinate.toNumberCoordinate(pos + 1))) possibleMoves.push(pos+1);

    // Get a random integer between 0 and possibleMoves.length-1
    let moveIndex = Math.floor(Math.random()*possibleMoves.length);
    return Coordinate.toNumberCoordinate(possibleMoves[moveIndex]);
}

export {computeMove};