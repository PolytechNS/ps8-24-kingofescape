const GameManager = require("./gameManager").GameManager;

let gameManager;

function init() {
    gameManager = new GameManager();
}

function sentEndGame(res) {
    res.statusCode = 200;
    res.end("Partie terminée");
}

function sentGameState(res) {
    let gameStateActual = gameManager.isPlayerOne() ? gameManager.gameState1 : gameManager.gameState2;
    gameStateActual.otherCharacter = gameManager.getOtherPlayer();
    console.log(gameManager);
    for (let line of gameManager.visibilityMatrix.visibilityMatrix) {
        console.log(line);
    }
    res.statusCode = 200;
    res.end(JSON.stringify(gameStateActual));
}

function placeWall(s, res) {
    if (!gameManager.isEndGame()) {
        let isPlaced = gameManager.placeWall(s);
        if (isPlaced)
            sentGameState(res)
        else {
            res.statusCode = 400;
            res.end("Mur non posé");
        }
    }
    else
        sentEndGame(res);
}

function moveCharacter(s, res) {
    if (!gameManager.isEndGame()) {
        let isMoved = gameManager.moveCharacters(s);

        if (isMoved)
            sentGameState(res);
        else {
            res.statusCode = 400;
            res.end("Déplacement non effectué");
        }
    }
    else
        sentEndGame(res);
}

exports.game = {placeWall, init, moveCharacter};