const { MongoClient } = require("mongodb");
const {urlAdressDb} = require("./env/env.js");

// Function to connect to the server
async function run() {
    const client = new MongoClient(urlAdressDb);

    try {
        client.connect();
        console.log("Connected successfully to server");
        const dt = client.db('sample_mflix');

        // Pour créer la table Etudiant
        await dt.createCollection("Etudiant", function (err, res) {
            if (err) throw err;
            console.log("Collection créée !");
        });

        // Pour insérer un étudiant dans la table Etudiant
        const etudiant = { "nom":"Jean", "ville":"Paris" };
        await dt.collection("Etudiant").insertOne(etudiant, function (err, res) {
            if (err) throw err;
            console.log("Document inséré");
        });

        const query = { "nom": 'Jean'};
        console.log(await dt.collection("Etudiant").findOne(query));
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

module.exports = { run };