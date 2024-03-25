const {MongoClient} = require("mongodb");
const GameManager = require("../logic/gameManager.js").gameManager;
const {urlAdressDb} = require("../env/env");

let users;

function connect() {
    const client = new MongoClient(urlAdressDb);
    client.connect().then(r => console.log("Connected to the database"));
    users = client.db('sample_mflix');
}

function transformGameState(gameState) {
    return [gameState.positionPlayer, gameState.walls];
}

function transformGraph(graph) {
    return [...graph.graph].map(key => [key[0], ...key[1]]);
}

function loadGraph(jsonGraph) {
    let map = new Map();
    jsonGraph.forEach(key => {
        map.set(key[0], new Set(key.slice(1)));
    });
    return map;
}

async function save(gameManager) {
    let save = {
        username: "Nico",
        gameStatePlayer1: transformGameState(gameManager.gameStatePlayer1),
        gameStatePlayer2: transformGameState(gameManager.gameStatePlayer2),
        graph: transformGraph(gameManager.graph),
        visibilityMatrix: gameManager.visibilityMatrix.matrix
    }
    console.log(save.gameStatePlayer1);
    console.log(save.gameStatePlayer2);
    let json = JSON.stringify(save);

    if (!users)
        connect();
    try {
        //const user = await users.collection("Save").;
        await users.collection("Save").deleteOne({username: "Nico"});
        await users.collection("Save").insertOne(save);
        return json;

        /*if (user) {
            response.statusCode = 404;
            response.end('User already exists');
        } else {
            await users.collection("Users").insertOne({username: username, password: token});
            response.statusCode = 200;
            response.end(token);
        }*/
    } catch (error) {
        console.log(error);
    }
}

async function load() {
    if (!users)
        connect();

    let json = await users.collection("Save").findOne({username: "Nico"});

    let gameStatePlayer1 = json.gameStatePlayer1;
    let gameStatePlayer2 = json.gameStatePlayer2;
    let graph = loadGraph(json.graph);
    let visibilityMatrix = json.visibilityMatrix;

    return [gameStatePlayer1, gameStatePlayer2, graph, visibilityMatrix];
}

let gameManager = new GameManager("11", "99");
gameManager.playAction({ action: "wall" , value: ["19", 0]}, 1);
save(gameManager).then((json) => {
    console.log(json);
    load()
});
exports.save = {save, load};