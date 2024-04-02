const { MongoClient } = require("mongodb");
const { urlAdressDb } = require("../env/env.js");

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
    } finally {
        await client.close();
    }
}

exports.addStat = addStat;
