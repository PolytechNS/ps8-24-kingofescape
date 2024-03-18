const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("./env/env.js");
const jwt = require('jsonwebtoken');
const secretKey = "ps8-koe";
const client = new MongoClient(urlAdressDb);
async function getUsers(response) {

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
async function getNotifications(token, response) {
    try {
        await client.connect();
        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Notifications");
        const decoded = jwt.verify(token, secretKey);
        const Username = decoded.username;
        console.log(decoded+"9999");
        console.log("Token received:", token+"888");
        const notifications = await notificationsCollection.find({ recipient: Username }).toArray();
        response.setHeader('Content-Type', 'application/json');
        response.statusCode = 200;
        response.end(JSON.stringify(notifications));
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({message: 'Error retrieving notifications'}));
    } finally {
        await client.close();
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
        const client = new MongoClient(urlAdressDb);
        await client.connect();
        const db = client.db('sample_mflix');
        const notificationsCollection = db.collection("Notifications");
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

        await client.close();

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
    await client.connect();
    const db = client.db('sample_mflix');
    const notificationsCollection = db.collection("Notifications");
    const existingRequest = await notificationsCollection.findOne({ sender: sender, recipient: recipient });
    return existingRequest !== null;
}

async function acceptFriendRequest(json, response) {
    try {
        await client.connect();
        const db = client.db('sample_mflix');
        const usersCollection = db.collection("Users");
        const decoded = jwt.verify(json.token, secretKey);
        const  sender = decoded.sender;
        const recipient=decoded.recipient;
        // Recherche de l'utilisateur expéditeur dans la base de données
        const senderUser = await usersCollection.findOne({ username: sender });
        if (!senderUser) {
            return { success: false, message: 'Utilisateur expéditeur non trouvé' };
        }

        // Recherche de l'utilisateur destinataire dans la base de données
        const recipientUser = await usersCollection.findOne({ username: recipient });
        if (!recipientUser) {
            return { success: false, message: 'Utilisateur destinataire non trouvé' };
        }

        // Vérifiez si l'expéditeur est déjà dans la liste d'amis du destinataire pour éviter les doublons
        if (!recipientUser.friends.includes(sender)) {
            recipientUser.friends.push(sender); // Ajouter l'expéditeur dans la liste d'amis du destinataire
            await usersCollection.updateOne({ username: recipient }, { $set: { friends: recipientUser.friends } });
        }

        // Vérifiez si le destinataire est déjà dans la liste d'amis de l'expéditeur pour éviter les doublons
        if (!senderUser.friends.includes(recipient)) {
            senderUser.friends.push(recipient); // Ajouter le destinataire dans la liste d'amis de l'expéditeur
            await usersCollection.updateOne({ username: sender }, { $set: { friends: senderUser.friends } });
        }

        return { success: true, message: 'Demande d\'ami acceptée avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
        return { success: false, message: 'Erreur lors de l\'acceptation de la demande d\'ami' };
    } finally {
        await client.close();
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
exports.acceptR={acceptFriendRequest};
exports.Notifications=getNotifications


exports.users = getUsers;
