const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("./env/env.js");
const jwt = require('jsonwebtoken');
const secretKey = "ps8-koe";
const client = new MongoClient(urlAdressDb);
let isConnected = false; // Custom flag to track connection status
async function connectToMongoDB() {
    if (isConnected) {
        return;
    }

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
        response.setHeader('Content-Type', 'application/json');
        response.statusCode = 200;
        response.end(JSON.stringify(users));
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({message: 'Error retrieving users'}));
    } f
}
async function getFriendsList(token, response) {
    try {
            await  connectToMongoDB();
        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");
        const decoded = jwt.verify(token, secretKey);
        const Username = decoded.username;
        const user = await usersCollection.findOne({ username: Username }, { projection: { friends: 1, _id: 0 } });
        console.log(user+"88");
        console.log(Username+"99");
        if (user) {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 200;
            response.end(JSON.stringify(user.friends));
        } else {
            throw new Error('Utilisateur non trouvé');
        }
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ message: 'Erreur lors de la récupération de la liste d\'amis' }));
    }
}

async function getNotifications(token, response) {
    try {
        await connectToMongoDB();

        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Friendrequest");
        const decoded = jwt.verify(token, secretKey);
        const Username = decoded.username;
        console.log(decoded+"9999");
        console.log("Token received:", token+"888");
        const notifications = await notificationsCollection.find({ recipient: Username }).toArray();
        console.log(notifications);
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
async function sendFriendRequest(json,response){

    console.log(json.token);


    try {

        if (!json.token){
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({message: 'No token provided'}));
            return;
        }
        const decoded = jwt.verify(json.token, secretKey); // Verify the token
        const senderUsername = decoded.username; // Extract the sender's username from the token
        console.log(decoded+"9999");
        console.log("Token received:", json.token+"888");
        const recipientUsername = json.recipient;
        await  connectToMongoDB();
        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Friendrequest");
        const existingRequest = await checkExistingRequest(senderUsername, recipientUsername);
        if (existingRequest) {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ message: 'Une demande d\'ami a déjà été envoyée à cet utilisateur' }));
            return;
        }
        const notification = {
            recipient: recipientUsername,
            sender: senderUsername,
            message: `You have received a friend request from ${senderUsername}`,
            timestamp: new Date(),
            read: false
        };
         notificationsCollection.insertOne(notification);
        const unreadNotifications = await notificationsCollection.find({
            recipient: recipientUsername,
            read: false
        }).toArray();

        console.log("Notifications non lues pour l'utilisateur", recipientUsername + ":", unreadNotifications);


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
            // Ajoutez d'autres critères si nécessaire pour cibler spécifiquement la notification de demande d'ami
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


/**async function createNotificationsCollection() {

    try {

        await client.connect();


        const db = client.db('sample_mflix');
        await db.collection('Notifications');
        console.log("Collection 'Notifications' créée avec succès");
    } catch (error) {
        console.error("Erreur lors de la création de la collection:", error);
    } finally {

        await client.close();
    }
}

// Appeler la fonction pour créer la collection "Notifications"
createNotificationsCollection();
**/

exports.sendR = {sendFriendRequest};
exports.rejectR={rejectFriendRequest}
exports.Notifications=getNotifications
exports.friends=getFriendsList

exports.users = getUsers;
exports.acceptR={acceptFriendRequest};