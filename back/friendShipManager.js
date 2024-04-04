const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("./env/env.js");
const jwt = require('jsonwebtoken');
const secretKey = "ps8-koe";
const client = new MongoClient(urlAdressDb);
let isConnected = false;

// Connects to MongoDB if not already connected
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

// Gets users from the database
async function getUsers(response) {
    try {
        await connectToMongoDB();
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
    }
}

// Fetches the friend list for a user based on the token
async function getFriendsList(token, response) {
    try {
        await connectToMongoDB();
        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");
        const decoded = jwt.verify(token, secretKey);
        const Username = decoded.username;

        const user = await usersCollection.findOne({ username: Username }, { projection: { friends: 1, _id: 0 } });
        if (user) {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 200;
            response.end(JSON.stringify(user.friends));
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ message: 'Error retrieving friend list' }));
    }
}
async function getNotifications(token, response) {
    try {
        await connectToMongoDB();
        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Friendrequest");
        const decoded = jwt.verify(token, secretKey);
        const Username = decoded.username;

        const notifications = await notificationsCollection.find({ recipient: Username }).toArray();
        response.setHeader('Content-Type', 'application/json');
        response.statusCode = 200;
        response.end(JSON.stringify(notifications));
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({message: 'Error retrieving notifications'}));
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

// Checks if there is an existing friend request
async function checkExistingRequest(sender, recipient) {
    await connectToMongoDB();
    const db = client.db('sample_mflix');
    const notificationsCollection = db.collection("Friendrequest");
    const existingRequest = await notificationsCollection.findOne({sender: sender, recipient: recipient});
    return existingRequest !== null;
}
    async function acceptFriendRequest(json, response) {
        try {
          await  connectToMongoDB();
            const db = client.db('sample_mflix');
            const usersCollection = db.collection("Users");
            const notificationsCollection = db.collection("Friendrequest");

            const senderUsername = json.sender;
            const recipientUsername = json.recipient;

            const senderUser = await usersCollection.findOne({username: senderUsername});
            const recipientUser = await usersCollection.findOne({username: recipientUsername});

            // Vérifier si les utilisateurs existent
            if (!senderUser) {
                console.error(`Expéditeur ${senderUsername} non trouvé`);
                throw new Error(`Expéditeur non trouvé`);
            }

            if (!recipientUser) {
                console.error(`Destinataire ${recipientUsername} non trouvé`);
                throw new Error(`Destinataire non trouvé`);
            }

            // Vérifier et mettre à jour la liste d'amis pour le destinataire
            if (!Array.isArray(recipientUser.friends)) {
                recipientUser.friends = [];
            }
            if (!recipientUser.friends.includes(senderUsername)) {
                await usersCollection.updateOne({username: recipientUsername}, {$push: {friends: senderUsername}});
            }

            // Vérifier et mettre à jour la liste d'amis pour l'expéditeur
            if (!Array.isArray(senderUser.friends)) {
                senderUser.friends = [];
            }
            if (!senderUser.friends.includes(recipientUsername)) {
                await usersCollection.updateOne({username: senderUsername}, {$push: {friends: recipientUsername}});
            }

            // Supprimer la notification de demande d'ami
            await notificationsCollection.deleteOne({recipient: recipientUsername, sender: senderUsername});

            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({
                success: true,
                message: 'Demande d\'ami acceptée et notification supprimée avec succès'
            }));

        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({success: false, message: error.message}));
        }
    }
async function removeFriend(json, response, io) {
    try {
        console.log("removeFriend function called. Data:", json);

        await connectToMongoDB();
        console.log("Connected to MongoDB.");

        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");
        const friendUsername = json.friendUsername;

        const decoded = jwt.verify(json.token, secretKey);
        const currentUsername = decoded.username;

        await usersCollection.updateOne(
            { username: currentUsername },
            { $pull: { friends: friendUsername } }
        );
        console.log(`Friend removed from ${currentUsername}'s friend list: ${friendUsername}`);

        await usersCollection.updateOne(
            { username: friendUsername },
            { $pull: { friends: currentUsername } }
        );
        console.log(`Friend removed from ${friendUsername}'s friend list: ${currentUsername}`);

        io.of('/api/friendListUpdates').emit('update-friends', { sender: currentUsername, friend: friendUsername });
        console.log(`Emitting 'update-friends' event for: ${currentUsername} and ${friendUsername}`);

        io.of('/api/friendListUpdates').emit('update-friends', { sender: friendUsername, friend: currentUsername });
        console.log(`Emitting 'update-friends' event for: ${friendUsername} and ${currentUsername}`);

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ message: 'Ami supprimé avec succès' }));

    } catch (error) {
        console.error('Erreur lors de la suppression de l\'ami:', error);
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ message: 'Erreur lors de la suppression de l\'ami' }));
    }
}



async function rejectFriendRequest(json, response) {
    try { await connectToMongoDB();

        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Friendrequest");
        const decoded = jwt.verify(json.token, secretKey);
        const sender= json.sender
        const recipient = json.recipient;


        // Supprimer la notification de demande d'ami
        await notificationsCollection.deleteOne({
            recipient: recipient,
            sender: sender,
        });

        // Répondre avec succès
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ success: true, message: 'Demande d\'ami rejetée avec succès et notification supprimée' }));

    } catch (error) {
        console.error('Erreur lors du rejet de la demande d\'ami:', error);
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({ success: false, message: 'Erreur lors du rejet de la demande d\'ami' }));
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

exports.sendR = {sendFriendRequest};
exports.rejectR={rejectFriendRequest}
exports.deleteF={removeFriend}
exports.Notifications=getNotifications
exports.friends=getFriendsList

exports.users = getUsers;
exports.acceptR={acceptFriendRequest};