const {MongoClient} = require('mongodb');
const {urlAdressDb} = require('../env/env.js');

let users = undefined;

function connect() {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    users = client.db('sample_mflix');
}

async function getScoreTable(username) {
    if(users === undefined)
        connect();

    try {
        const scores = await users.collection("Scores").find({username: username}).toArray();
        return [200, scores[0]];
    } catch (error) {
        console.log(error);
        return [500, -1];
    }
}

async function setScoreTable(username, score) {
    if(users === undefined)
        connect();
    try {
        await users.collection("Scores").updateOne({username: username}, {$set: {score: score}}, upsert=false);
        return 200;
    } catch (error) {
        console.log(error);
        return 500;
    }
}

function getScores(json, response) {
    getScoreTable(json.username).then(([status, scores]) => {
       response.statusCode = status;
       response.end(JSON.stringify(scores));
    });
}

async function getScoresAllUsers(json, response) {
    if(users === undefined)
        connect();

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

function setScore(json, response) {
    setScoreTable(json.username, json.score).then(status => {
      if (status === 200) {
          response.statusCode = 200;
          response.end('Score set');
      }
      else {
          response.statusCode = 500;
          response.end('Error setting score');
      }
    });
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

async function deleteScore(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try {
        const username = json.username;
        await users.collection("Scores").deleteOne({username: username});
        response.statusCode = 200;
        response.end('Score deleted');
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error deleting score');
    }
}

exports.addScore = addScore;
exports.getScores = getScores;
exports.getScoreTable = getScoreTable;
exports.setScoreTable = setScoreTable;
exports.getScoresAllUsers = getScoresAllUsers;
exports.setScore = setScore;
exports.deleteScore = deleteScore;