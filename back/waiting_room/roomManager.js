const game1v1 = require('../jeu1v1/game1v1.js').game1v1;
const jwt = require('jsonwebtoken');
const elo = require('../1v1/elo.js');
const getScoreTable = require('../1v1/score.js').getScoreTable;

let socketInGame;
let socketDisconnected;
let waitingPlayers = [];

class stockPoints {
    constructor(username1, username2) {
        this.username1 = [username1, undefined];
        this.username2 = [username2, undefined];

        this.getScore(username1, 1);
        this.getScore(username2, 2);
    }

    getScore(username, numberPlayer) {
        getScoreTable(username).then(([status, scores]) => {
            console.log(scores);
            if (status === 200) {
                if (numberPlayer === 1)
                    this.username1[1] = scores.score;
                else
                    this.username2[1] = scores.score;
            }
        });
    }
}

function verifyToken(token) {
    try {
        let data = jwt.verify(token, "ps8-koe", {algorithm: 'HS256', noTimestamp: true});
        return data.username;
    }
    catch (e) {
        return null;
    }
}

function endGame(nameRoom, isFirstPlayerWin) {
    if (socketInGame.has(nameRoom)) {
        let game = socketInGame.get(nameRoom);
        elo.calculeElo(game[1], (isFirstPlayerWin)? 1 : 0, game[0].gestionSocketPlayer);
        socketInGame.delete(nameRoom);
    }
}

function room(io) {
    socketInGame = new Map();
    socketDisconnected = new Map();
    const gameSocket1v1 = io.of('/api/1v1');

    gameSocket1v1.on("connection", (socket) => {
        console.log(`New player connected: ${socket.id}`);

        let usernamePlayer = verifyToken(socket.handshake.query.token);
        let room = socket.handshake.query.room;

        if (usernamePlayer === null) {
            socket.emit('errorConnect', 'You are not connect');
            socket.disconnect();
        }

        else if (room != null) {
            if (socketInGame.has(room)) {
                console.log(`Player ${socket.id} is in room ${room}`);
                socket.join(room);
                socket.emit('getUsername', usernamePlayer);

                let game = socketInGame.get(room)[0];
                if (game.reconnectPlayer(socket, usernamePlayer))
                    return;
            }

            socket.emit('errorConnect', 'Room not found');
            socket.disconnect();
        }

        else {
            socket.on('disconnect', () => {
                console.log(`Player ${socket.id} disconnected.`);
                waitingPlayers = waitingPlayers.filter(player => player[0].id !== socket.id);
                console.log(waitingPlayers);
            });
            waitingPlayers.push([socket, usernamePlayer]);
        }

        socket.emit('getUsername', usernamePlayer);

        if (waitingPlayers.length >= 2) {
            const player1 = waitingPlayers.shift();
            const player2 = waitingPlayers.shift();
            const room = `room_${player1[0].id}_${player2[0].id}`;

            player1[0].join(room);
            player2[0].join(room);
            gameSocket1v1.to(room).emit('matchFound', room);
            socketInGame.set(room, [new game1v1(player1, player2, function(isFirstPlayer){ endGame(room, isFirstPlayer) }), new stockPoints(player1[1], player2[1])]);
            console.log(`Starting game in room: ${room}`);
        }
    });
}

exports.room = room;
exports.deleteRoom = endGame;
