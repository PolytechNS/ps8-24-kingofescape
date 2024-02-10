// Main method, exported at the end of the file. It's the one that will be called when a REST request is received.
const {placeWall, init, moveCharacter} = require("../logic/ManagerSocketGame").game;
const {signin, login} = require("../login.js").log;
const jwt = require('jsonwebtoken');

function manageRequest(request, response) {
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });

    if (filePath[2] !== "status") {
        let body = '';
        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        let json;
        request.on('end', function () {
            if(request.method === 'POST') {
                if (filePath[2] === 'signin') {
                    console.log(body);
                    json = JSON.parse(body);
                    console.log(json);
                    signin(json, response);
                    /*const token = jwt.sign(json, 'secretKey');
                    response.setHeader('Access-Control-Allow-Origin', '*');
                    response.statusCode = 200;
                    response.end(token);*/
                }
    
            }
            if (request.method === 'GET') {
                if (filePath[2] === 'login') {
                    json = {username: filePath[3], password: filePath[4]};
                    /*const token = jwt.sign(json, 'secretKey');
                    response.setHeader('Access-Control-Allow-Origin', '*');
                    response.statusCode = 200;
                    response.end(token);*/
                    login(json, response);
                }
            }
        });
        
    }
    else {
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