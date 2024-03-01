const GameIA = require('./gameIA.js').gameIA;
const jwt = require('jsonwebtoken');
/**
 * Sent the move of IA to the player
 * @param move - The move that the IA has done
 * @param game - The gameIA
 * @param socket - The socket of the player
 */
function sentUpdateBoard(move, game, socket) {
    let players = game.getPlayerSee();

    let gameState = {
        player1 : players[0],
        player2 : players[1],
        wall : undefined,
    };

    if( move.action === "wall")
        gameState.wall = move.value;

    socket.emit('updateBoard', gameState);
}

/**
 * Verify if the game is finished and sent the result to the player if the game is finished
 * @param move - The move that the player/IA has done
 * @param game - The gameIA
 * @param socket - The socket of the player
 * @param aiPlay - The number of the player who is the IA
 */
function endGame(game, socket, move, aiPlay) {
    let endGame = game.isEndGame();

    if (move.action === "move" && endGame !== -1) {
        let s;

        switch (endGame) {
            case 1:
                s = (aiPlay === 1)? "L'IA à gagner" : "Vous avez gagné";
                break;
            case 2:
                s = (aiPlay === 2)? "L'IA à gagner" : "Vous avez gagné";
                break;
            case 0:
                s = "Egalité";
                break;
        }
        socket.emit('endGame', s);
    }
}

function gestionToken(token, socket) {
    if (token === undefined) {
        socket.emit('endGame', "Vous n'êtes pas connecter");
        socket.disconnect();
    }

    try {
        jwt.verify(token, "ps8-koe", {algorithm: 'HS256', noTimestamp: true});
    }
    catch (e) {
        socket.emit('endGame', "Vous n'êtes pas connecter");
        socket.disconnect();
    }
}

/**
 * Gestion de la socket pour le jeu IA
 * @param io - The socket io
 */
function gestionSocketGameIA(io) {
    const gameSocket = io.of('/api/game');

    gameSocket.on('connection', (socket) => {
        let game;
        let aiPlay;
        console.log('connecté au serveur');

        socket.on('setup', (data) => {
            aiPlay = data.AIplays;
            let coordinatePlayer1 = aiPlay === 1 ? "31" : data.coordinatePlayer;
            let coordinatePlayer2 = aiPlay === 2 ? "69" : data.coordinatePlayer;

            game = new GameIA(coordinatePlayer1, coordinatePlayer2);
            gestionToken(data.token, socket);
            if (aiPlay === 1) {
                setTimeout(() => {
                    let move = game.playIA();
                    sentUpdateBoard(move, game, socket);
                }, 1000);
            }
        });

        socket.on('move', (move) => {
            try {
                game.playAction(move);
                socket.emit('resultAction', move);
                endGame(game, socket, move, aiPlay);
            } catch (e) {
                socket.emit('resultAction', {action: "error", value: e.message});
            }
        });

        socket.on('endTurn', () => {
            if (game.currentPlayer !== aiPlay) {
                game.update();
                let move = game.playIA();
                sentUpdateBoard(move, game, socket);
                endGame(game, socket, move, aiPlay);
            }
        });
    });
}

exports.gameIA = gestionSocketGameIA;