function sendResponse(response, statusCode, data) {
    if (response && typeof response.writeHead === 'function') {
        response.writeHead(statusCode, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(data));
    } else {
        console.error('Invalid response object provided');
        // Handle the error or return a different type of response
    }
}

function sendErrorResponse(response, error) {
    if (error.name === 'JsonWebTokenError') {
        sendResponse(response, 401, { message: 'Invalid token' });
    } else if (error.name === 'SyntaxError') {
        sendResponse(response, 400, { message: 'Invalid JSON in request body' });
    } else {
        sendResponse(response, 500, { message: error.message || 'Error processing request' });
    }
}

exports.sendResponse = sendResponse;
exports.sendErrorResponse = sendErrorResponse;
