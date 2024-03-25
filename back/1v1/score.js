const {MongoClient} = require('mongodb');
const {urlAdressDb} = require('../env/env.js');
const jwt = require('jsonwebtoken');

async function getScores(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try {
        const username = json.username;
        const scores = await users.collection("Scores").find({username: username}).toArray();
        response.statusCode = 200;
        response.end(JSON.stringify(scores));
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error getting scores');
    }
}

async function getScoresAllUsers(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try {
        const scores = await users.collection("Scores").find().sort({ score: -1 }).toArray();
        response.statusCode = 200;
        response.end(JSON.stringify(scores));
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error getting scores');
    }
}

async function setScore(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try {
        const username = json.username;
        const score = json.score;
        await users.collection("Scores").updateOne({username: username}, {$set: {score: score}}, upsert=false);
        response.statusCode = 200;
        response.end('Score set');
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error setting score');
    }
}

async function addScore(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try {
        const username = json.username;
        const score = json.score;
        await users.collection("Scores").insertOne({username: username, score: score});
        response.statusCode = 200;
        response.end('Score added');
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error adding score');
    }
}

exports.addScore = addScore;
exports.getScores = getScores;
exports.getScoresAllUsers = getScoresAllUsers;
exports.setScore = setScore;