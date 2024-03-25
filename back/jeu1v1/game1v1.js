const GameManager = require("../logic/gameManager.js").gameManager;
const Arbitre = require("../logic/arbitre.js").arbitre;
const Chat = require("../chat/chat.js").chat;

class GestionSocketPlayer {
    constructor(player1, player2, game1v1) {
        this.player1 = player1; // [socket, username]
        this.player2 = player2;
        this.game1v1 = game1v1;

        this.initSocketStartGame(player1[0], 1);
        this.initSocketStartGame(player2[0], 2);
    }

    #initPosition(socket, numberPlayer, initPosition) {
        this.game1v1.setPositionPlayer(initPosition, numberPlayer);
        socket.removeAllListeners('position');
        socket.emit('positionDepart', [numberPlayer, initPosition]);
        this.game1v1.initGame();
    }

    initSocketStartGame(socket, numberPlayer) {
        socket.on('position', (initPosition) => {
            if ((numberPlayer === 1 && initPosition[1] === '1') || (numberPlayer === 2 && initPosition[1] === '9')) {
                this.#initPosition(socket, numberPlayer, initPosition);
            }
            else {
                socket.emit('errorInit');
            }
        });

        socket.removeAllListeners('disconnect');
        socket.on('disconnect', () => {
           if (numberPlayer === 1)
               this.player1[0] = null;
           else
               this.player2[0] = null;
        });
    }

    #initSocketPlayer(socket, numberPlayer) {
        socket.on('move', (move) => this.game1v1.playMove(move, numberPlayer));
        socket.on('endTurn', () => this.game1v1.endTurn(numberPlayer));
    }

    initSocketGame() {
        this.#initSocketPlayer(this.player1[0], 1);
        this.#initSocketPlayer(this.player2[0], 2);
    }

    #initSocketChat(numberPlayer) {
        this.chat = new Chat(this);

        if (numberPlayer === 1)
            this.player1[0].on('message', (message) => this.chat.getMessage(message, numberPlayer));
        else
            this.player2[0].on('message', (message) => this.chat.getMessage(message, numberPlayer));
    }

    #verifyInit(socket, numberPlayer) {
        let verifyInitPlayer1 = this.game1v1.initPosition1 !== null;
        let verifyInitPlayer2 = this.game1v1.initPosition2 !== null;

        if (verifyInitPlayer1 && verifyInitPlayer2) {
            this.#initSocketPlayer(socket, numberPlayer);
            this.#initSocketChat(numberPlayer);
            socket.emit('reload', this.game1v1.generateGameState(numberPlayer));
        }
        else if ((numberPlayer === 1 && verifyInitPlayer1) || (numberPlayer === 2 && verifyInitPlayer2))
            socket.emit('positionDepart', [numberPlayer, (numberPlayer === 1)? this.game1v1.initPosition1 : this.game1v1.initPosition2]);
        else {
            this.initSocketStartGame(socket, numberPlayer);
            this.#initSocketChat(numberPlayer);
            socket.emit('positionInit', numberPlayer);
        }
    }

    emitSocket(nameEvent, data, numberPlayer) {
        if (numberPlayer === 1)
            this.player1[0].emit(nameEvent, data);
        else
            this.player2[0].emit(nameEvent, data);
    }

    reconnectPlayer(socket, username) {
        if (this.player1[1] === username) {
            this.player1[0] = socket;
            this.#verifyInit(socket, 1);
        }
        else if (this.player2[1] === username) {
            this.player2[0] = socket;
            this.#verifyInit(socket, 2);
        }
        else {
            socket.emit('errorConnect' , 'Room not found');
            return false;
        }

        return true;
    }
}

class Game1v1 {
    constructor(player1, player2, functionEndGame) {
        this.initPosition1 = null;
        this.initPosition2 = null;
        this.gestionSocketPlayer = new GestionSocketPlayer(player1, player2, this);
        this.functionEndGame = functionEndGame;
    }

    setPositionPlayer(position, numberPlayer) {
        if (numberPlayer === 1)
            this.initPosition1 = position;
        else
            this.initPosition2 = position;
    }

    reconnectPlayer(socket, username) {
        return this.gestionSocketPlayer.reconnectPlayer(socket, username);
    }

    initGame() {
        if (this.initPosition1 !== null && this.initPosition2 !== null) {
            this.game = new GameManager(this.initPosition1, this.initPosition2);
            this.arbitre = new Arbitre();
            this.currentPlayer = 1;
            this.actionRealise = undefined;
            this.gestionSocketPlayer.initSocketGame();
            this.startTurn();
        }
    }

    playMove(move, numberPlayer) {
        if (this.currentPlayer !== numberPlayer)
            this.gestionSocketPlayer.emitSocket('error', 'Ce n\'est pas votre tour.', numberPlayer);
        else if (this.actionRealise !== undefined) {
            this.gestionSocketPlayer.emitSocket('error', 'Vous avez déjà joué.', numberPlayer);
        }
        else {
            try {
                this.game.playAction(move, numberPlayer);
                this.gestionSocketPlayer.emitSocket('resultAction', move, numberPlayer);

                let stateGame = this.arbitre.isEndGame(this.game.gameStatePlayer1.positionPlayer, this.game.gameStatePlayer2.positionPlayer);

                if (stateGame !== -1) {
                    this.gestionSocketPlayer.emitSocket('endGame', "win", stateGame);
                    this.gestionSocketPlayer.emitSocket('endGame', "lose", 3 - stateGame);
                    this.functionEndGame();
                }
            }
            catch (e) {
                console.log(e);
                this.gestionSocketPlayer.emitSocket('error', e.message, numberPlayer);
            }
        }
    }

    endTurn(numberPlayer) {
        if (this.currentPlayer === numberPlayer) {
            this.actionRealise = undefined;
            this.currentPlayer = 3 - this.currentPlayer;
            this.startTurn();
        }
        else
            this.gestionSocketPlayer.emitSocket('error', 'Ce n\'est pas votre tour.', numberPlayer);
    }

    generateGameState(numberPlayer) {
        let gameState = this.game.generateGameState(numberPlayer);
        let movePossible = (this.currentPlayer === numberPlayer)? this.game.getPossibleMove(numberPlayer === 1) : [];
        return {
            gameState: gameState,
            possibleMoves: movePossible,
            numberPlayer: numberPlayer,
            currentPlayer: this.currentPlayer
        };
    }

    startTurn() {
        if (this.game !== undefined) {
            this.gestionSocketPlayer.emitSocket('StartTurn', this.generateGameState(this.currentPlayer), this.currentPlayer);
            this.gestionSocketPlayer.emitSocket('Info', "C'est au tour de l'adversaire", 3 - this.currentPlayer);
        }
    }
}

exports.game1v1 = Game1v1;