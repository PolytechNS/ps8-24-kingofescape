

import { Coordinate } from './coordinate.js';
import { Wall } from './wall.js';

var socket = io();
socket.on('connect', () => {
    console.log('Connecté au serveur.');

    // Créer des instances de Coordinate
    const coord1 = new Coordinate(1, 2);
    const coord2 = new Coordinate(3, 4);

    // Créer une instance de Wall
    const wall = new Wall(coord1, coord2, true);



    // Envoyer l'objet wall au serveur
    socket.emit('newWall', wall);

});

socket.on('wallReceived', (confirmation) => {
    console.log(confirmation);
});
document.addEventListener('DOMContentLoaded', (event) => {
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', () => {
        // Créer des instances de Coordinate
        const coord1 = new Coordinate(8, 9);
        const coord2 = new Coordinate(5, 6);

        // Créer une instance de Wall
        const wall = new Wall(coord1, coord2, true);
        const wall2 = new Wall(coord1, coord2, true);

        // Envoyer l'objet wall au serveur
        socket.emit('newWall', wall, (response) => {
            console.log('Server response:', response);
        });
        socket.emit('newWall2', wall2, (response) => {
            console.log('Server response:', response);
        });
    });
});
