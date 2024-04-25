const chatFriend = io.connect('http://localhost:8000/api/chatFriend');

chatFriend.on('connect', () => {
    console.log('connecté au serveur.');
    chatFriend.on('msg1', (message) => {
        var element = document.getElementById('chatContent');
        var paragraph = document.createElement('p');
        paragraph.textContent = message;
        element.appendChild(paragraph);
    });
});

function sendText() {
    var messageInput = document.getElementById('message');
    var text = messageInput.value;
    console.log('text send: ' + text);
    chatFriend.emit('msg', text);
    messageInput.value = "";
};

export {sendText};