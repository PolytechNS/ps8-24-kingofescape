class GestionSocketPlayer {
    constructor(player1, player2, game1v1) {
        this.player1 = player1; // [socket, username]
        this.player2 = player2;
        this.game1v1 = game1v1;

        this.initSocketStartGame(player1[0], 1);
        this.initSocketStartGame(player2[0], 2);
    }

    initSocketStartGame(socket, numberPlayer) {
        socket.emit('startGame', numberPlayer);

        socket.on('position', (initPosition) => {
            if (numberPlayer === 1 && initPosition[1] === '1') {
                this.game1v1.setPositionPlayer(initPosition, numberPlayer);
                socket.removeAllListeners('position');
                socket.emit('positionDepart', [numberPlayer, initPosition]);
            }
            else if (numberPlayer === 2 && initPosition[1] === '9') {
                this.game1v1.setPositionPlayer(initPosition, numberPlayer);
                socket.removeAllListeners('position');
                socket.emit('positionDepart', [numberPlayer, initPosition]);
            }
            else
                socket.emit('errorInit');
        });

        socket.removeAllListeners('disconnect');
        socket.on('disconnect', () => {
           if (numberPlayer === 1)
               this.player1[0] = null;
           else
               this.player2[0] = null;
        });
    }

    #verifyInit(socket, numberPlayer) {
        let verifyInitPlayer1 = this.game1v1.initPosition1 !== null;
        let verifyInitPlayer2 = this.game1v1.initPosition2 !== null;

        if (verifyInitPlayer1 && verifyInitPlayer2)
            socket.emit('reload', [numberPlayer, (numberPlayer === 1)? this.game1v1.initPosition1 : this.game1v1.initPosition2]);
        else if ((numberPlayer === 1 && verifyInitPlayer1) || (numberPlayer === 2 && verifyInitPlayer2))
            socket.emit('positionDepart', [numberPlayer, (numberPlayer === 1)? this.game1v1.initPosition1 : this.game1v1.initPosition2]);
        else {
            this.initSocketStartGame(socket, numberPlayer);
            socket.emit('positionInit', numberPlayer);
        }
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

    disconnectPlayer(socket, nameRoom) {
        socket.leave(nameRoom);
    }
}

class Game1v1 {
    constructor(player1, player2) {
        this.initPosition1 = null;
        this.initPosition2 = null;
        this.gestionSocketPlayer = new GestionSocketPlayer(player1, player2, this);
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

    disconnectPlayer(socket, nameRoom) {
        this.gestionSocketPlayer.disconnectPlayer(socket, nameRoom);
    }
}

exports.game1v1 = Game1v1;