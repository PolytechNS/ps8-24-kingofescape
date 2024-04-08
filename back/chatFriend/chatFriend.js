let mysocket ;
function gestionSocketChatFriend(io) {
    const socketChatFriend = io.of('/api/chatFriend');
    mysocket = new Map();
    socketChatFriend.on('connection', (socket) => {
        let username = socket.handshake.query.username;
        mysocket.set(username, socket);
        socket.on('friend', (friend) => {
            let friendwant = friend;
            let socketFriend = mysocket.get(friendwant); 
            if (socketFriend === undefined) {
                console.log('Error: socketFriend is not defined');
                return;
            }
            socketFriend.join(`bindfriends_${friendwant}_${username}`);
            socket.join(`bindfriends_${friendwant}_${username}`);
            socketChatFriend.to(`bindfriends_${friendwant}_${username}`).emit('matchFound', `bindfriends_${friendwant}_${username}`); 
        });
        
        socket.on('msg', (data) => {
            const { room, text, user } = data
            socketChatFriend.to(room).emit('msg1', {text, user}); 
        });

    });

}
exports.gestionSocketChatFriend = gestionSocketChatFriend;
