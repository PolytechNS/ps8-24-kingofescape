const {Server} = require("socket.io");
const jwt = require('jsonwebtoken');

let gameManager;

/*const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    /* // Gérez ici vos événements personnalisés (par exemple, 'newWall')
    socket.on('newWall', (wall) => {
        console.log('Wall received:', wall);

        // Envoyez une réponse au client
        socket.emit('wallReceived', { status: 'Success' });
    });
});*/


/*function sentGameState(res) {
    let gameStateActual = gameManager.isPlayerOne() ? gameManager.gameState1 : gameManager.gameState2;
    gameStateActual.otherCharacter = gameManager.getOtherPlayer();
    console.log(gameManager);
    for (let line of gameManager.visibilityMatrix.visibilityMatrix) {
        console.log(line);
    }
    res.statusCode = 200;
    res.end(JSON.stringify(gameStateActual));
}*/


function verifyToken(socket) {
    let abc = true;
    console.log(socket);
    jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
        console.log(err);
        socket.decoded = decoded;
        abc = false;
    });
    return abc;
}

function initSocket(io) {
    let count = 0;
    const gameSocket = io.of("/api/game");

    gameSocket.on('connection', (socket) => {
        console.log('A user connected');
        gameSocket.on('setup', (socket) => {
            if (verifyToken(socket)) {
                console.log("ok");
            }
            else {
                console.log("ko");
                socket.disconnect();
            }
        });
    });
}

exports.game = {initSocket};