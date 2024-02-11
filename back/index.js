// The http module contains methods to handle http queries.
import * as http from 'http';
// Let's import our logic.
import * as fileQuery from './queryManagers/front.js'
import * as apiQuery from './queryManagers/api.js'
import {Server} from "socket.io";
import {initSocket} from "./logic/ManagerSocketGame.js";
// Let's import our logic.
//const {initSocket} = require("./logic/ManagerSocketGame").game;
//import Server from "socket.io";
//const {run} = require("./exemple_DB.js");

const server = http.createServer(function (request, response) {

    // First, let's check the URL to see if it's a REST request or a file request.
    // We will remove all cases of "../" in the url for security purposes.
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });


    try {
        if (request.method === "OPTIONS") {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow.
            response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent to the API.
            response.setHeader('Access-Control-Allow-Credentials', true);
            response.statusCode = 200;
        }
        // If the URL starts by /api, then it's a REST request (you can change that if you want).
        else if (filePath[1] === "api") {
            apiQuery.manage(request, response);
            // If it doesn't start by /api, then it's a request for a file.
        }
        else {
            fileQuery.manage(request, response);
        }
    } catch(error) {
        console.log(`error while processing ${request.url}: ${error}`)
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
// For the server to be listening to request, it needs a port, which is set thanks to the listen function.
}).listen(8000);

const io = new Server(server, {
    cors: {
        origin: "*", methods: ["GET", "POST", "PUT", "PATCH"], allowedHeaders: "*", credentials: true
    }
});

initSocket(io);


/*
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        count--;
        console.log('User disconnected');
        console.log("count");
    });
    console.log(count);

    /* // Gérez ici vos événements personnalisés (par exemple, 'newWall')
    socket.on('newWall', (wall) => {
        console.log('Wall received:', wall);

        // Envoyez une réponse au client
        socket.emit('wallReceived', { status: 'Success' });
    });
});*/
