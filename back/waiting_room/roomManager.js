/*const http = require('http');
const socketIo = require('socket.io');

const PORT = 8000;
const server = http.createServer();
const io = socketIo(server);*/

let waitingPlayers = [];

function room(io) {
    io.on("connection", (socket) => {
        const oldId = socket.handshake.query.id;
        if (oldId) {
            console.log(`Player reconnected: ${oldId}`);
            // Ajouter une logique pour gérer la reconnexion si nécessaire
        } else {
            console.log(`New player connected: ${socket.id}`);
        }

        socket.on('findMatch', () => {
            console.log(`Player ${socket.id} searching for a match...`);
            waitingPlayers.push(socket);

            if (waitingPlayers.length >= 2) {
                const player1 = waitingPlayers.shift();
                const player2 = waitingPlayers.shift();
                const room = `room_${player1.id}_${player2.id}`;
                player1.join(room);
                player2.join(room);
                io.to(room).emit('startGame', room);
                console.log(`Starting game in room: ${room}`);
            } else {
                socket.emit('waitingForMatch');
            }
        });

        socket.on('disconnect', () => {
            waitingPlayers = waitingPlayers.filter(player => player.id !== socket.id);
            console.log(`Player ${socket.id} disconnected.`);
        });
    });
}

// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });

exports.room = room;
