// The http module contains methods to handle http queries.
const http = require('http');
const fileQuery = require('./queryManagers/front.js');
const apiQuery = require('./queryManagers/api.js');
const { Server } = require("socket.io");
const gestionSocketIA = require('./jeu_ia/socketIAManager.js').gameIA;
const gestionSocketChatInGame = require('./chat/chat.js').gestionSocketChatInGame;
const gestionSocketChatFriend = require('./chatFriend/chatFriend.js').gestionSocketChatFriend;

const server = http.createServer(function (request, response) {

    // First, let's check the URL to see if it's a REST request or a file request.
    // We will remove all cases of "../" in the url for security purposes.
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });


    try {
        if (request.method === "OPTIONS") {
            apiQuery.addCors(response);
            response.end("Cors add");
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

gestionSocketIA(io);
gestionSocketChatInGame(io);
gestionSocketChatFriend(io);