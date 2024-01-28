const coordinate = require('./coordinate.js');

class Character {

    constructor(coordinate) {
        this.coordinate = coordinate;
    }

    move(coordinate) {
        this.coordinate = coordinate;
    }
}

function verifyMoves(newCoordinate, oldCoordinate, graphe, secondPlayerCoordinate) {
    let moveHorizontal = newCoordinate.x - oldCoordinate.x;
    let moveVertical = newCoordinate.y - oldCoordinate.y;

    if ((moveVertical !== 0 && moveHorizontal !== 0) || (moveVertical === 0 && moveHorizontal === 0)) {
        return false;
    }

    let gapMoveCharacterX = newCoordinate.x - secondPlayerCoordinate.x;
    let gapMoveCharacterY = newCoordinate.y - secondPlayerCoordinate.y;
    let calculGapToDo = 1;

    if (Math.abs(gapMoveCharacterX) === 1 && Math.abs(gapMoveCharacterY) === 0 ||
        Math.abs(gapMoveCharacterX) === 0 && Math.abs(gapMoveCharacterY) === 1) {
        calculGapToDo = 2;
    }

    if ((moveVertical === 0 && (moveHorizontal === calculGapToDo || moveHorizontal === -calculGapToDo))
        || (moveHorizontal === 0 && (moveVertical === calculGapToDo || moveVertical === -calculGapToDo)))
        return graphe.verifyEdge(oldCoordinate.toNumber(), newCoordinate.toNumber());

    return false;
}

exports.Character = {Character, verifyMoves};