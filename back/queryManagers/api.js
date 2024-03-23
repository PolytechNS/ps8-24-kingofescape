// Main method, exported at the end of the file. It's the one that will be called when a REST request is received.
const { signin, login } = require("../login/login.js").login;
const getUsers = require("../friendShipManager.js").users;
const getNotifications = require("../friendShipManager").Notifications;
const { sendFriendRequest } = require("../friendShipManager").sendR;

const { acceptFriendRequest } = require("../friendShipManager").acceptR;
const { rejectFriendRequest } = require("../friendShipManager").rejectR;
const { addScore, getScores, getScoresAllUsers, setScore } = require("../1v1/score.js");

function manageRequest(request, response) {
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });

    if (filePath[2] !== "status") {
        let body = '';
        request.on('data', function(data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        let json;
        request.on('end', function() {
            console.log(filePath[2]);
            if (request.method === 'POST') {
                if (filePath[2] === 'signin') {
                    console.log(body);
                    json = JSON.parse(body);
                    console.log(json);
                    signin(json, response);
                }
                if (filePath[2] === 'sendFriendRequest') {
                    json = JSON.parse(body);
                    sendFriendRequest(json, response);
                }
                if (filePath[2] === 'acceptFriendRequest') {
                    json = JSON.parse(body);
                    acceptFriendRequest(json, response);
                }
                if (filePath[2] === 'rejectFriendRequest') {
                    json = JSON.parse(body);
                    rejectFriendRequest(json, response);
                }
                if (filePath[2] === 'addScore') {
                    json = JSON.parse(body);
                    addScore(json, response);
                }
            }

            if (request.method === 'GET') {
                if (filePath[2] === 'login') {
                    json = { username: filePath[3], password: filePath[4] };
                    login(json, response);
                }
                if (filePath[2] === 'users') {
                    getUsers(response);
                }
                if (filePath[2] === 'friendRequest') {
                    const token = request.headers.authorization.split(' ')[1];
                    getNotifications(token, response);
                }
                if (filePath[2] === 'getScores') {
                    json = { username: filePath[3] };
                    getScores(json, response);
                }
                if (filePath[2] === 'getScoresAllUsers') {
                    getScoresAllUsers(json, response);
                }
            }
            if (request.method === 'PUT') {
                if (filePath[2] === 'setScore') {
                    json = { username: filePath[3], score: filePath[4] };
                    setScore(json, response);
                }
            }
        });


    } else {
        response.statusCode = 200;
        response.end(`Ok`);
    }
}

/* This method is a helper in case you stumble upon CORS problems. It shouldn't be used as-is:
** Access-Control-Allow-Methods should only contain the authorized method for the url that has been targeted
** (for instance, some of your api urls may accept GET and POST request whereas some others will only accept PUT).
** Access-Control-Allow-Headers is an example of how to authorize some headers, the ones given in this example
** are probably not the ones you will need. */
function addCors(response) {
    // Website you wish to allow to connect to your server.
    response.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow.
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow.
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent to the API.
    response.setHeader('Access-Control-Allow-Credentials', true);
}

exports.manage = manageRequest;
exports.addCors = addCors;
