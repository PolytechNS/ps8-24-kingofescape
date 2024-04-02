import {printPlayer, printWall, removePlayer} from "../js/affichage_jeu.js";
import {createTable, printAllWallPossible} from "./design1v1.js";

let numberPlayer;
let room = localStorage.getItem('room');
let socket;

function choosePositionInit(event) {
    let tab = event.target.id.split(' ');
    let position = tab.length === 1 ? tab[0] : tab[1];
    socket.emit('position', position);
    console.log('Position choisie : ' + position);
}

function removeChoosePosition() {
    let classChoose = document.getElementsByClassName('choose');

    while (classChoose.length !== 0)
        classChoose[0].parentNode.removeChild(classChoose[0]);
}

function addDivChoosePosition(position, functionName) {
    let divSquare = document.getElementById('I ' + position);
    let newDiv = document.createElement('div');
    newDiv.className = 'choose';
    newDiv.id = position;
    divSquare.appendChild(newDiv);
    divSquare.addEventListener('click', functionName);
}

function getPosition() {
    let positionI = String(numberPlayer === 1 ? 1 : 9);

    for (let j = 1; j <= 9; j++) {
        addDivChoosePosition(String(j) + positionI, choosePositionInit);
    }
}

function sendMoveDeplacement(event) {
    let tab = event.target.id.split(' ');
    let position = tab.length === 1 ? tab[0] : tab[1];
    socket.emit('move', {action: "move", value: position});
}

function printTableTurn(possibleMove, gameState) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let position = String(j + 1) + String(9 - i);

            if (possibleMove.includes(position))
                addDivChoosePosition(position, sendMoveDeplacement);

            if (gameState.board[i][j] === -1)
                document.getElementById('I ' + position).className = 'invisible';
            else if (gameState.board[i][j] === 0)
                document.getElementById('I ' + position).className= '';
            else if (gameState.board[i][j] === 1)
                printPlayer(position, numberPlayer === 1);
            else
                printPlayer(position, numberPlayer === 2);
        }
    }

    let color = (numberPlayer === 1)? 'wallPlayer1' : 'wallPlayer2';
    let colorOpponent = (numberPlayer === 1)? 'wallPlayer2' : 'wallPlayer1';

    for (let wall of gameState.ownWalls) {
        let div = document.getElementById(((wall[1] === 1)? 'V ' : 'H ') + wall[0]);
        if (div.className !== color)
            printWall(wall, color);
    }
    for (let wall of gameState.opponentWalls) {
        let div = document.getElementById(((wall[1] === 1)? 'V ' : 'H ') + wall[0]);
        if (div.className !== colorOpponent)
            printWall(wall, colorOpponent);
    }
}

function sentWall(event) {
    let tab = event.target.id.split(' ');
    let orientation = (tab[0] === 'V')? 1 : 0
    let position = tab[1];
    socket.emit('move', {action: "wall", value: [position, orientation]});
}


function endTurn() {
    socket.emit('endTurn');
}


createTable();
printAllWallPossible(sentWall);

if (room != null) {
    socket = io.connect('http://localhost:8000/api/1v1', {
        query: {
            token: getCookie("token"),
            room: room
        }
    });

    socket.on('connect', () => {
        console.log('Connecté au serveur.');

        socket.on('positionInit', (nPlayer) => {
            numberPlayer = nPlayer;
            getPosition();
        });

        socket.on('positionDepart', (infoPlayer) => {
            removeChoosePosition();
            numberPlayer = infoPlayer[0];
            printPlayer(infoPlayer[1], numberPlayer === 1);
        });

        socket.on('reload', (gameState) => {
            numberPlayer = gameState.numberPlayer;
            printTableTurn(gameState.possibleMoves, gameState.gameState)

            if (gameState.currentPlayer === numberPlayer)
                window.alert("C'est à vous de jouer");
        });

        socket.on('Info', (message) => {
           window.alert(message);
        });

        socket.on('StartTurn', (gameState) => {
            removePlayer(true);
            removePlayer(false);
            console.log(gameState);
            printTableTurn(gameState.possibleMoves, gameState.gameState);
        });

        socket.on('resultAction', (result) => {
           if (result.action === "move") {
               removePlayer(numberPlayer === 1);
               printPlayer(result.value, numberPlayer === 1);
           }
           else
               printWall(result.value, numberPlayer === 1);

            removeChoosePosition();
        });

        socket.on('endGame', (valueEndGame) => {
            socket.disconnect();

            localStorage.setItem('newElo', valueEndGame[1].elo);
            localStorage.setItem('score+', valueEndGame[1].earn);
            changePage(`${valueEndGame[0]}/${valueEndGame[0]}.html`);
        });

        socket.on('message', (id) => {
            let element = document.getElementById('chatContent');
            console.log("ID de l'élément cliqué dans chatcontent: " + id);
            element.innerHTML += "<img id='img_" + id + "' src='chatInGame/message/" + id + ".png' alt='" + id + "' width='150' height='150' />";

            setTimeout(function() {
                var imgToRemove = document.getElementById('img_' + id);
                if (imgToRemove) {
                    imgToRemove.parentNode.removeChild(imgToRemove);
                }
            }, 3000);
        });

        socket.on('errorConnect', (message) => {
            window.alert(message);
            changePage("mode/mode.html");
        })

        socket.on('error', (message) => {
            window.alert(message);
        });
    });
}

function getIdOnClick(id) {
    console.log("ID de l element cliqué : " + id.target.id);
    socket.emit('message', id.target.id);
}


export {getIdOnClick, endTurn};
