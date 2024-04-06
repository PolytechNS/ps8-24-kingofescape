const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("./env/env.js");
const jwt = require('jsonwebtoken');
const secretKey = "ps8-koe";
const { sendResponse, sendErrorResponse } = require('./friendshipManager/responsehelper.js');
const client = new MongoClient(urlAdressDb);
let isConnected = false;

async function connectToMongoDB() {
    if (isConnected) return;

    try {
        await client.connect();
        isConnected = true;
        console.log('Connected to MongoDB.');
        client.on('close', () => {
            isConnected = false;
            console.log('MongoDB connection closed.');
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        isConnected = false;
        throw error;
    }
}

async function getUsers(response) {
    try {
     await connectToMongoDB();
        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");
        const users = await usersCollection.find().toArray();
        sendResponse(response, 200, users);
    } catch (error) {
        sendErrorResponse(response, error);
    }
}

async function getFriendsList(token, response) {
    try {
        const decoded = jwt.verify(token, secretKey);
        await connectToMongoDB();
        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");

        const user = await usersCollection.findOne({ username: decoded.username }, { projection: { friends: 1, _id: 0 } });
        if (user) {
            sendResponse(response, 200, user.friends);
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        sendErrorResponse(response, error);
    }
}
async function getFriendrequests(token, response) {
    try {
        const decoded = jwt.verify(token, secretKey);
        await connectToMongoDB();
        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Friendrequest");

        const notifications = await notificationsCollection.find({ recipient: decoded.username }).toArray();
        sendResponse(response, 200, notifications);
    } catch (error) {
        sendErrorResponse(response, error);
    }
}


// Handles sending a friend request
async function sendFriendRequest(json, response) {
    try {
        if (!json.token) {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({message: 'No token provided'}));
            return;
        }
        const decoded = jwt.verify(json.token, secretKey);
        const senderUsername = decoded.username;
        const recipientUsername = json.recipient;

        await connectToMongoDB();
        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Friendrequest");

        const existingRequest = await checkExistingRequest(senderUsername, recipientUsername);
        if (existingRequest) {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ message: 'Friend request already sent to this user' }));
            return;
        }

        const notification = {
            recipient: recipientUsername,
            sender: senderUsername,
            message: `You have received a friend request from ${senderUsername}`,
            timestamp: new Date(),
            read: false
        };

        await notificationsCollection.insertOne(notification);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({message: 'Friend request sent successfully'}));
    } catch (error) {
        console.error('Error sending friend request:', error);
        standardizeErrorResponse(error, response);
    }
}

async function checkExistingRequest(sender, recipient) {
    await connectToMongoDB();
    const db = client.db('sample_mflix');


    const notificationsCollection = db.collection("Friendrequest");
    const existingRequest = await notificationsCollection.findOne({ sender: sender, recipient: recipient });
    if (existingRequest) {
        return true; // Il existe déjà une demande d'ami
    }

    const usersCollection = db.collection("Users");
    const recipientUser = await usersCollection.findOne({ username: recipient }, { projection: { friends: 1, _id: 0 } });
    if (recipientUser && recipientUser.friends.includes(sender)) {
        return true;
    }

    return false;
}
    async function acceptFriendRequest(json, response) {
            try {
                await connectToMongoDB();
                const db = client.db('sample_mflix');
                const usersCollection = db.collection("Users");
                const notificationsCollection = db.collection("Friendrequest");

                const { sender, recipient } = json;
                const senderUser = await usersCollection.findOne({ username: sender });
                const recipientUser = await usersCollection.findOne({ username: recipient });

                if (!senderUser || !recipientUser) {
                    throw new Error(`One or both users not found`);
                }

                const updateFriendsList = async (username, newFriend) => {
                    const user = await usersCollection.findOne({ username: username });
                    if (!user.friends.includes(newFriend)) {
                        await usersCollection.updateOne({ username: username }, { $push: { friends: newFriend } });
                    }
                };

                await updateFriendsList(sender, recipient);
                await updateFriendsList(recipient, sender);

                await notificationsCollection.deleteOne({ recipient: recipient, sender: sender });

                sendResponse(response, 200, {
                    success: true,
                    message: "Friend request accepted successfully and notification removed"
                });
            } catch (error) {
                sendErrorResponse(response, error);
            }
    }

async function removeFriend(json, response, io) {
    try {
     await connectToMongoDB();
        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");

        const { friendUsername, token } = json;
        const decoded = jwt.verify(token, secretKey);
        const currentUsername = decoded.username;

        const updateFriendList2 = async (username, friendToRemove) => {
            await usersCollection.updateOne(
                { username: username },
                { $pull: { friends: friendToRemove } }
            );
            io.of('/api/friendListUpdates').emit('update-friends', { sender: username, friend: friendToRemove });
        };

        await updateFriendList2(currentUsername, friendUsername);
        await updateFriendList2(friendUsername, currentUsername);

        sendResponse(response, 200, { message: 'Friend removed successfully' });
    } catch (error) {
        sendErrorResponse(response, error);
    }
}



async function rejectFriendRequest(json, response) {
    try { await connectToMongoDB();

        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Friendrequest");
        const sender= json.sender
        const recipient = json.recipient;

        await notificationsCollection.deleteOne({
            recipient: recipient,
            sender: sender,
        });

                sendResponse(response, 200, {'success': true, 'message': 'Friend request rejected successfully and notification removed'});


    } catch (error) {
        console.error('Erreur lors du rejet de la demande d\'ami:', error);
        sendErrorResponse(response, error);
    }
}

function standardizeErrorResponse(error, response) {
    if (error.name === 'JsonWebTokenError') {
        response.writeHead(401, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({message: 'Invalid token'}));
    } else if (error.name === 'SyntaxError') {
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({message: 'Invalid JSON in request body'}));
    } else {
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({message: error.message || 'Error processing request'}));
    }
}

exports.sendFriendRequest = {sendFriendRequest};
exports.rejectFriendRequest={rejectFriendRequest}
exports.removeFriend={removeFriend}
exports.Notifications=getFriendrequests
exports.friends=getFriendsList

exports.users = getUsers;
exports.acceptFriendRequest={acceptFriendRequest};