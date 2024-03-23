function gestionSocketChatFriend(io){
    const socketChatFriend = io.of('/api/chatFriend');
    socketChatFriend.on('connection', (socket) => {
        socket.on('msg', (message) => {
            socketChatFriend.emit('msg1', message);
        });
    });
};
exports.gestionSocketChatFriend = gestionSocketChatFriend;
