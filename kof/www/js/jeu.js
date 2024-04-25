import {printPlayer, printWall, removePlayer, getCoordinate} from "./affichage_jeu.js";
import {GameLocal} from "./gameLocal.js";
import {createTable, printAllWallPossible} from "./design1v1.js";

let game;
let positionPlayersY = [undefined, undefined];

setup();
verifyConnect();

function verifyConnect() {
    let result = verifyLogin();

    if (result !== null) {
        result.then(async (response) => {
            if (response.status === 200) {
                document.getElementById("blankHeader").style.display = "none";
                let p = document.getElementById("name");
                p.innerHTML = await response.text();
            }
            else
                document.getElementById("profile").style.display = "none";
        });
    }
    else
        document.getElementById("profile").style.display = "none";
}


function setup() {
    createTable();
    getPosition(1);
}

function removeChoosePosition() {
    let classChoose = document.getElementsByClassName('choose');

    while (classChoose.length !== 0)
        classChoose[0].parentNode.removeChild(classChoose[0]);
}

function choosePositionInit(event) {
    let tab = event.target.id.split(' ');
    let position = tab.length === 1 ? tab[0] : tab[1];

    removeChoosePosition();
    if (positionPlayersY[0] === undefined) {
        positionPlayersY[0] = position;
        getPosition(2);
    }
    else if (positionPlayersY[1] === undefined){
        positionPlayersY[1] = position;
        game = new GameLocal(positionPlayersY[0], positionPlayersY[1]);
        printAllWallPossible(sentWall);
        beginTurn();
    }
}

function addDivChoosePosition(position, functionName) {
    let divSquare = document.getElementById('I ' + position);
    let newDiv = document.createElement('div');
    newDiv.className = 'choose';
    newDiv.id = position;
    divSquare.appendChild(newDiv);
    divSquare.addEventListener('click', functionName);
}

function getPosition(numberPlayer) {
    let positionI = String(numberPlayer === 1 ? 1 : 9);

    for (let j = 1; j <= 9; j++) {
        addDivChoosePosition(String(j) + positionI, choosePositionInit);
    }
}

function printTableTurn(possibleMove, gameState, numberPlayer) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let position = String(j + 1) + String(9 - i);

            if (possibleMove.includes(position))
                addDivChoosePosition(position, move);

            if (gameState.board[i][j] === -1)
                document.getElementById('I ' + position).className = 'invisible';
            else if (gameState.board[i][j] === 0)
                document.getElementById('I ' + position).className= 'square';
            else if (gameState.board[i][j] === 1) {
                document.getElementById('I ' + position).className= 'square';
                printPlayer(position, numberPlayer === 1);
            }
            else {
                document.getElementById('I ' + position).className= 'square';
                printPlayer(position, numberPlayer === 2);
            }
        }
    }
}


function sentWall(event) {
    let tab = event.target.id.split(' ');
    let orientation = (tab[0] === 'V')? 1 : 0
    let position = tab[1];
    let wall = [position, orientation];
    const isPlayerOne = game.numberPlayer() === 1;

    try {
        game.doAction({action: "wall", value: wall});
        printWall(wall, isPlayerOne);
        vibrate();
        removeChoosePosition();
        if (isPlayerOne) {
            document.getElementById("ownWallsContent").innerHTML = "Number of remaining walls : " + (10 - game.gameManager.gameStatePlayer1.walls.length);
        }
        else
            document.getElementById("opponentWallsContent").innerHTML = "Number of remaining walls : " + (10 - game.gameManager.gameStatePlayer2.walls.length);

    } catch (e) {
        alertDialog("Error to place Wall", e.message, "OK");
    }
}



function move(event) {
    let tab = event.target.id.split(' ');
    let position = tab.length === 1 ? tab[0] : tab[1];
    let isPlayerOne = game.numberPlayer() === 1;

    try {
        game.doAction({action: "move", value: position});
        removeChoosePosition();
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
        if (s !== undefined) {
            alertDialog("Error end Game", "Error end Game", "OK");
            changePage('mode/mode.html');
        }
    } catch (e) {
        alertDialog("Error on move", e.message, "OK");
    }
}

function beginTurn() {
    let possibleMoves = game.getPossibleMoves();
    let gameState = game.generateGameState();
    console.log(gameState);
    printTableTurn(possibleMoves, gameState, game.numberPlayer());
}

function endTurn() {
    game.update();
    removePlayer(true);
    removePlayer(false);
    removeChoosePosition();
    beginTurn();
}

export {endTurn, getCoordinate}