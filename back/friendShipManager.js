const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("./env/env.js");
const client = new MongoClient(urlAdressDb);
const jwt = require('jsonwebtoken');
const secretKey = "ps8-koe";
const { sendResponse, sendErrorResponse } = require('./friendshipManager/responsehelper.js');
const {userSockets}=require('./friendshipManager/FriendNotifManager.js');

let isConnected = false;
async function getDatabase() {
    await connectToMongoDB();
    return client.db('sample_mflix');
}

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

async function getFriendsList(token, response) {
    try {
        const decoded = jwt.verify(token, secretKey);
        const db = await getDatabase();
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
        const db = await getDatabase();
        const notificationsCollection = db.collection("Friendrequest");

        const notifications = await notificationsCollection.find({ recipient: decoded.username }).toArray();
        sendResponse(response, 200, notifications);
    } catch (error) {
        sendErrorResponse(response, error);
    }
}
async function acceptFriendRequest(json, response) {
    try {
        if (!json.sender || !json.recipient) {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ message: 'Sender or recipient not provided' }));
            return;
        }

        const db = await getDatabase();
        const usersCollection = db.collection("Users");
        const friendsrequests = db.collection("Friendrequest");

        const senderUser = await usersCollection.findOne({ username: json.sender });
        const recipientUser = await usersCollection.findOne({ username: json.recipient });
        if (!senderUser || !recipientUser) {
            response.writeHead(404, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ message: 'One or both users not found' }));
            return;
        }

        await updateFriendsList(json.sender, json.recipient, usersCollection);
        await updateFriendsList(json.recipient, json.sender, usersCollection);

        await friendsrequests.deleteOne({ recipient: json.recipient, sender: json.sender });

        sendResponse(response, 200, {
            success: true,
            message: "Friend request accepted successfully and notification removed"
        });
    } catch (error) {
        console.error('Error in acceptFriendRequest:', error);
        sendErrorResponse(response, error);
    }
}

async function updateFriendsList(username, newFriend, usersCollection) {
    const user = await usersCollection.findOne({ username: username });
    if (!user.friends || !Array.isArray(user.friends)) {
        user.friends = [];
    }
    if (!user.friends.includes(newFriend)) {
        await usersCollection.updateOne({ username: username }, { $push: { friends: newFriend } });
    }
}
async function sendFriendRequest(json, response) {
    try {
        if (!json.token) {
            response.writeHead(401, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({message: 'No token provided'}));
            return;
        }
        const db = await getDatabase();
        const decoded = jwt.verify(json.token, secretKey);
        const senderUsername = decoded.username;
        const recipientUsername = json.recipient;
        const Friendrequests = db.collection("Friendrequest");
        const existingRequest = await checkExistingRequest(senderUsername, recipientUsername);
        if (existingRequest) {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({ message: 'Friend request already sent or user is already your friend' }));
            return;
        }

        const notification = {
            recipient: recipientUsername,
            sender: senderUsername,
            message: `You have received a friend request from ${senderUsername}`,
            timestamp: new Date(),
            read: false
        };
        await Friendrequests.insertOne(notification);
        const senderSocket = userSockets.get(senderUsername);
        if (senderSocket) {
            senderSocket.emit('notification', { message: notification.message });
        }

        sendResponse(response, 200, {
            success: true,
            message: 'Friend request sent successfully'
        });
    } catch (error) {
        console.error('Error sending friend request:', error);
        sendErrorResponse(response, error);
    }
}




async function checkExistingRequest(sender, recipient) {
    const db = await getDatabase();
    const notificationsCollection = db.collection("Friendrequest");
    const existingRequest = await notificationsCollection.findOne({ sender: sender, recipient: recipient });
    if (existingRequest) {
        return true; // There's already an existing friend request
    }

    const usersCollection = db.collection("Users");
    const recipientUser = await usersCollection.findOne({ username: recipient }, { projection: { friends: 1, _id: 0 } });
    if (recipientUser && recipientUser.friends && recipientUser.friends.includes(sender)) {
        return true; // The sender is already a friend
    }

    return false;
}

async function removeFriend(json, response, io) {
    try {
        const db = await getDatabase();
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
    try { const db = await getDatabase();
        const FriendRequestCollection = db.collection("Friendrequest");
        const sender= json.sender
        const recipient = json.recipient;

        await FriendRequestCollection.deleteOne({
            recipient: recipient,
            sender: sender,
        });

                sendResponse(response, 200, {'success': true, 'message': 'Friend request rejected successfully and notification removed'});


    } catch (error) {
        console.error('Erreur lors du rejet de la demande d\'ami:', error);
        sendErrorResponse(response, error);
    }
}
async function deleteFriendRequests(json, response) {
    const db = await getDatabase();
    const friendRequestCollection = db.collection("Friendrequest");


    try {
        const username = json.username;
        await friendRequestCollection.deleteMany({
            $or: [{sender: username}, {recipient: username}]
        });
        response.statusCode = 200;
        response.end('requests deleted');
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error deleting from requesstsLIST');
    }

}

async function removefromfriendslists(json, response) {
    const db = await getDatabase();
    const usersCollection = db.collection("Users");

    try {
        const username = json.username;
        await usersCollection.updateMany(
            {},
            { $pull: { friends: username } }
        );
        response.statusCode = 200;
        response.end('Score deleted');
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error deleting from FRiendlsit');
    }
}


exports.sendFriendRequest = {sendFriendRequest};
exports.rejectFriendRequest={rejectFriendRequest};
exports.removeFriend={removeFriend};
exports.Notifications=getFriendrequests;
exports.friends=getFriendsList;
exports.acceptFriendRequest={acceptFriendRequest};
exports.deleteFriendRequests={deleteFriendRequests};
exports.removefromfriendslists={removefromfriendslists};