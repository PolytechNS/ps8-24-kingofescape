const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("../env/env.js");
const jwt = require('jsonwebtoken');
const {addScore} = require("../1v1/score.js");
const { addStat } = require("../sucess/sucess.js");

const {sendResponse, sendErrorResponse} = require("../friendshipManager/responsehelper");


async function signin(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try{
        const username = json.username;
        const password = json.password;
        const mail = json.mail;
        const user = await users.collection("Users").findOne({username : username});

        const token = jwt.sign({username:username, password:password},"ps8-koe", {algorithm: 'HS256', noTimestamp: true});

        if (user) {
            response.statusCode = 404;
            response.end('User already exists');
        } else {
            await users.collection("Users").insertOne({username:username, password : token, mail: mail});
            addScore({username: username, score: 0}, response);
            addStat({username: username, win: "0", lose: "0", total: "0"}, response);
            response.statusCode = 200;
            response.end(token);
        }
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error creating user');
    }
}

async function login(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try{
        const username = json.username;
        const password = json.password;
        const token = jwt.sign({username:username, password:password},"ps8-koe", {algorithm: 'HS256', noTimestamp: true});


        const user = await users.collection("Users").findOne({username : username});

        if (user && user.password === token) {
            response.statusCode = 200;
            response.end(token);
        } else {
            response.statusCode = 404;
            response.end('Password does not corespond to the username');
        }
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error creating user');
    }
}

function verifyLogin(token, response) {
    jwt.verify(token, "ps8-koe", {algorithm: 'HS256'}, function(err, decoded) {
        if (err) {
            response.statusCode = 404;
            response.end('Invalid token');
        } else {
            response.statusCode = 200;
            response.end(decoded.username);
        }
    });
}

async function deleteAccount(json, response) {
    const client = new MongoClient(urlAdressDb);
    await client.connect();
    const users = client.db('sample_mflix');

    try {
        const username = json.username;
        const user = await users.collection("Users").findOne({ username: username });

        if (user) {
            await users.collection("Users").deleteOne({ username: username });
            response.statusCode = 200;
            response.end('Account deleted successfully');
        } else {
            response.statusCode = 404;
            response.end('User not found');
        }
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error deleting user');
    }
}

exports.login = {signin, login, verifyLogin, deleteAccount};
async function getUsers(response) {
    try {

        const db = await getDatabase();
        const usersCollection = db.collection("Users");
        const users = await usersCollection.find().toArray();
        sendResponse(response, 200, users);
    } catch (error) {
        sendErrorResponse(response, error);
    }
}
exports.users = getUsers;

exports.login = {signin, login};