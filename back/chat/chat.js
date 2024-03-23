function gestionSocketChatInGame(io){
    const chatInGameSocket = io.of('/api/chatInGame');
    chatInGameSocket.on('connection', (socket) => {
        socket.on('message', (message) => {
            console.log('message: ' + message);
            chatInGameSocket.emit('message1', message);
        });
    });
};
exports.gestionSocketChatInGame = gestionSocketChatInGame;