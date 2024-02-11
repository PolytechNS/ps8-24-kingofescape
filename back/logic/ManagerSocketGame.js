//const jwt ('jsonwebtoken');

//const io = new Server(server);
import {GameManagerIA} from "./gameManagerIA.js";
import {Coordinate} from "../../front/src/logic/coordinate.js";
import {Wall} from "../../front/src/logic/wall.js";
import {save, load} from "../save/save.js";
let game;

/*function verifyToken(socket) {
    let abc = true;
    console.log(socket);
    jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
        console.log(err);
        socket.decoded = decoded;
        abc = false;
    });
    return abc;
}*/

function initSocket(io) {
    const gameSocket = io.of("/api/game");

    gameSocket.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('setup', (socket) => {
            game = new GameManagerIA(2);
            /*if (verifyToken(socket)) {
                console.log("ok");
            }
            else {
                console.log("ko");
                socket.disconnect();
            }*/
        });

        socket.on('save', () => {
            // A terminer
            //let json = save('temp', game.gameManager);
            //load('temp', json);
        });

        socket.on('move', (json) => {
            let newCoordinate = new Coordinate(json.x, json.y);
            let isMove = game.moveCharacters(newCoordinate);

            if (isMove) {
                if (game.isEndGame()) {
                    socket.emit('endGame', 'ok');
                }
                socket.emit('updateBoardInTurn', {move: newCoordinate});
            }
            else {
                socket.emit('move', {status: 'Fail', error: 'Mouvement impossible'});
            }
        });

        socket.on('endTurn', () => {
            game.update(game.isPlayerOne());
            let move = game.playTurnAI();
            let player = game.getOtherPlayer(true);
            let coordinate = player === undefined ? undefined : player.coordinate;
            socket.emit('updateBoard', {ia: coordinate});
        });

        socket.on('placeWall', (json) => {
            let coordinate1 = new Coordinate(json.coordinate1.x, json.coordinate1.y);
            let coordinate4 = new Coordinate(json.coordinate4.x, json.coordinate4.y);
            console.log(typeof json.isVertical);
            let wall = new Wall(coordinate1, coordinate4, json.isVertical);
            let isPlace = game.placeWall(wall);

            if (isPlace) {
                socket.emit('updateBoardInTurn', {wall : wall});
            }
            else {
                socket.emit('placeWall', {status: 'Fail', error: 'Mur impossible'});
            }
        });
    });


}



export {initSocket};