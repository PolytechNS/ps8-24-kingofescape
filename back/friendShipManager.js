const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("./env/env.js");
const jwt = require('jsonwebtoken');
const secretKey = "ps8-koe";

async function getUsers(response) {
    const client = new MongoClient(urlAdressDb);
    try {
        await client.connect();
        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");

        const users = await usersCollection.find().toArray();
        response.setHeader('Content-Type', 'application/json');
        response.statusCode = 200;
        response.end(JSON.stringify(users));
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({message: 'Error retrieving users'}));
    } finally {
        await client.close();
    }
}

async function sendFriendRequest(request, response) {
    let body = '';
    for await (const chunk of request) {
        body += chunk;
    }
    const token = request.headers.authorization?.split(' ')[1];
    console.log(token+"777")

    try {

        if (!token) {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({message: 'No token provided'}));
            return;
        }
        const decoded = jwt.verify(token, secretKey); // Verify the token
        const senderUsername = decoded.username; // Extract the sender's username from the token
        console.log(decoded+"9999");
        console.log("Token received:", token+"888");
        const json = JSON.parse(body);
        const recipientUsername = json.recipient;

        console.log("Friend request sent from:", senderUsername, "to:", recipientUsername);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({message: 'Friend request sent successfully'}));
    } catch (error) {
        console.error('Error sending friend request:', error);

        if (error.name === 'JsonWebTokenError') {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({message: 'Invalid token'}));
        } else if (error.name === 'SyntaxError') {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({message: 'Invalid JSON in request body'}));
        } else {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({message: 'Error sending friend request'}));
        }
    }
}

exports.sendR = {sendFriendRequest};

exports.users = getUsers;
