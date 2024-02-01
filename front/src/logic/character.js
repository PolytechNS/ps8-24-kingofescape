function Character(coordinate) {
    this.coordinate = coordinate;

    this.move = function(coordinate) {
        this.coordinate = coordinate;
    }
}

function isInFront(oldCoordinate, secondPlayerCoordinate, newCoordinate) {
    let moveVerticalOldCoordinate = secondPlayerCoordinate.x - oldCoordinate.x;
    let moveHorizontalOldCoordinate = secondPlayerCoordinate.y - oldCoordinate.y;

    if (!((moveVerticalOldCoordinate !== 0 && moveHorizontalOldCoordinate === 0)
        || (moveHorizontalOldCoordinate !== 0 && moveVerticalOldCoordinate === 0)))
        return false;

    let moveVertical = newCoordinate.x - oldCoordinate.x;
    let moveHorizontal = newCoordinate.y - oldCoordinate.y;


    return (Math.abs(moveVerticalOldCoordinate) === 1 || Math.abs(moveHorizontalOldCoordinate) === 1)
        && ((moveVertical > 0 && moveVerticalOldCoordinate > 0) || (moveVertical < 0 && moveVerticalOldCoordinate < 0)
        || (moveHorizontal > 0 && moveHorizontalOldCoordinate > 0) || (moveHorizontal < 0 && moveHorizontalOldCoordinate < 0));
}


function verifyMoves(newCoordinate, oldCoordinate, graphe, secondPlayerCoordinate) {
    let moveVertical = newCoordinate.x - oldCoordinate.x;
    let moveHorizontal = newCoordinate.y - oldCoordinate.y;

    if (!((moveVertical !== 0 && moveHorizontal === 0) || (moveHorizontal !== 0 && moveVertical === 0)))
        return false;

    let inFront = isInFront(oldCoordinate, secondPlayerCoordinate, newCoordinate);
    let absMoveVertical = Math.abs(moveVertical);
    let absMoveHorizontal = Math.abs(moveHorizontal);

    if ((absMoveHorizontal === 1 || absMoveVertical  === 1 ) && !inFront)
        return graphe.verifyEdge(oldCoordinate.toNumber(), newCoordinate.toNumber());
    else if ((absMoveHorizontal === 2 || absMoveVertical === 2) && inFront)
        return graphe.verifyEdge(secondPlayerCoordinate.toNumber(), newCoordinate.toNumber());

    return false;
}

export {Character, verifyMoves}