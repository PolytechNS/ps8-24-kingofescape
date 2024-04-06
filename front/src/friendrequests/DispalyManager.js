import {sendText, show} from "./friendRequests.js"
document.getElementById('send').addEventListener('click',sendText);
document.getElementById('message').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        sendText();
    }
});

document.getElementById('chatButton').addEventListener('click', () => show('grid', 'none', 'none'));
document.getElementById('friendButton').addEventListener('click', () => show('none', 'grid', 'none'));
document.getElementById('requestButton').addEventListener('click', () => show('none', 'none', 'grid'));

 // FriendRequest usage
    document.getElementById("addFriend").addEventListener("click", function() {
    const recipientUsername = document.getElementById("searchFriend").value;
    let token=document.cookie.split('=')[1];

    fetch('http://localhost:8000/api/sendFriendRequest', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
},
    body: JSON.stringify({ recipient: recipientUsername, token: token }),
})
    .then(response => response.json())
    .then(data => {
    alert(data.message);
})
    .catch((error) => {
    console.error('Error:', error);
});
});
