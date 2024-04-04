function gestionSocketFriendListUpdates(io) {
    const socketFriendListUpdates = io.of('/api/friendListUpdates');

    console.log("Socket.IO namespace '/api/friendListUpdates' initialized.");

    socketFriendListUpdates.on('connection', (socket) => {
        console.log(`A client connected to '/api/friendListUpdates'. Socket ID: ${socket.id}`);

        socket.on('update-friends', (data) => {
            console.log(`Received 'update-friends' event. Data:`, data);

            socketFriendListUpdates.emit('friends-list-updated', data.sender);
            console.log(`Emitted 'friends-list-updated' for sender: ${data.sender}`);

            socketFriendListUpdates.emit('friends-list-updated', data.friend);
            console.log(`Emitted 'friends-list-updated' for friend: ${data.friend}`);
        });
    });
}

exports.gestionSocketFriendListUpdates = gestionSocketFriendListUpdates;
