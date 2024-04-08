class Chat {
    constructor(gestionSocket) {
        this.gestionSocket = gestionSocket;
    }

    getMessage(message, numberPlayer) {
        console.log('message: ' + message);
        this.gestionSocket.emitSocket('message', message, 3 - numberPlayer);
    }
}

exports.chat = Chat;