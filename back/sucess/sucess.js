const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("../env/env.js");

let users = undefined;

function connect() {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    users = client.db('sample_mflix');
}

async function addStat(json, response) {
    const client = new MongoClient(urlAdressDb);

    try {
        await client.connect();
        const db = client.db('sample_mflix');
        const { username, win, lose, total } = json;
        await db.collection("Stats").insertOne({ username, win, lose, total });
        response.statusCode = 200;
        response.end('Stat added');
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.end('Error adding stat');
    }
}

function getStat(json, response) {
    getStatTable(json.username).then(([status, stats]) => {

        response.statusCode = status;
        response.end(JSON.stringify(stats));
    });
}

function setStat(json, response) {
    setStatTable(json.username, json.win, json.lose, json.total).then(status => {
        if (status === 200) {
            response.statusCode = 200;
            response.end('Stat updated');
        } else {
            response.statusCode = 500;
            response.end('Error updating stat');
        }
    });
}

async function setStatTable(username, win, lose, total) {
    console.log(username, win, lose, total);
    console.log(typeof win, typeof lose, typeof total)
    if (users === undefined) 
        connect(); 
    try {
        await users.collection("Stats").updateOne({ username: username }, { $set: { win, lose, total } }, { upsert: false });
        return 200;
    } catch (error) {
        console.log(error);
        return 500;
    }
}

async function getStatTable(username) {
    if (users === undefined) 
        connect(); 
    try {
        const stats = await users.collection("Stats").find({ username: username }).toArray();
        console.log(stats);
        return [200, stats[0]];
    } catch (error) {
        console.log(error);
        return [500, -1];
    }
}

exports.addStat = addStat;
exports.getStat = getStat;
exports.setStat = setStat;
exports.setStatTable = setStatTable;
exports.getStatTable = getStatTable;