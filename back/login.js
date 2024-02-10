const { MongoClient } = require("mongodb");
const {urlAdressDb} = require("./env/env.js");
const jwt = require('jsonwebtoken');


async function signin(json, response) {
    const client = new MongoClient(urlAdressDb);
    client.connect();
    const users = client.db('sample_mflix');

    try{
        const username = json.username;
        const password = json.password;
        const user = await users.collection("Users").findOne({username : username});

        const token = jwt.sign({username:username, password:password},"ps8-koe", {algorithm: 'HS256', noTimestamp: true});

        if (user) {
            response.statusCode = 404;
            response.end('User already exists');
            return;
        } else {
            await users.collection("Users").insertOne({username:username, password : token});
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

        console.log(user.password);
        console.log(token);

        if (user && user.password === token) {
            response.statusCode = 200;
            response.end(token);
        } else {
            response.statusCode = 404;
            response.end('Password does not corespond to the username');
            return;
        }
    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.end('Error creating user');
    }

}

exports.log = {signin, login};