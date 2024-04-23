const userSockets = new Map();
function gestionSocketNotification(io) {
    const notificationNamespace = io.of('/api/notifications');


    notificationNamespace.on('connection', (socket) => {
        const username = socket.handshake.query.username;
        userSockets.set(username, socket);
        console.log(`${username} connected for notifications`);

        socket.on('send-notification', ({ recipient, message }) => {
            const recipientSocket = userSockets.get(recipient);
            if (recipientSocket) {
                console.log(`Sending notification to ${recipient}: ${message}`);
                recipientSocket.emit('notification', { message });
            } else {
                console.log(`No active connection found for ${recipient}`);
            }
        });

        socket.on('disconnect', () => {
            userSockets.delete(username);
            console.log(`${username} disconnected from notifications`);
        });
    });
}
exports.gestionSocketNotification = gestionSocketNotification;
exports.userSockets = userSockets;