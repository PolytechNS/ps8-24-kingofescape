const userSockets = {};

io.on('connection', (socket) => {
    socket.on('register-user', (userId) => {
        userSockets[userId] = socket.id;
    });


});

function sendMessageToUser(userId, message) {
    const socketId = userSockets[userId];
    if (socketId) {
        io.to(socketId).emit('new-message', message);
    }
}
