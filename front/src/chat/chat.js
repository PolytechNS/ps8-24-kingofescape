/*const socketChatFriend = io.connect('http://localhost:3001/chatFriend');

socketChatFriend.on('connect', () => {
    console.log('connecté au serveur.');
    socketChatFriend.on('mesg', (message) => {
        var element = document.createElement('chatContent');
        console.log('message: ' + message);
        element.insertBefore(document.createTextNode(message), element.firstChild);
    });
});*/

function sendText() {
    var messageInput = document.getElementById('message');
    var text = messageInput.value;
    console.log('text: ' + text);
    messageInput.value = "";
    displayMessage(text);
    //socketChatFriend.emit('message', text);
};

function displayMessage(message) {
    var element = document.getElementById('chatContent');
    console.log('message: ' + message);
    var paragraph = document.createElement('p');
    paragraph.textContent = message;
    element.appendChild(paragraph);
}
export {sendText, displayMessage};