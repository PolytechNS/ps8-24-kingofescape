/**const chatFriend = io.connect('http://localhost:8000/api/chatFriend');
document.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
});
**/
function fetchNotifications() {
    let token = document.cookie.split('=')[1];
    const url = 'http://localhost:8000/api/friendRequest';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {


            data.forEach(notification => {
                const tr = document.createElement('tr');

                const nameTd = document.createElement('td');
                nameTd.textContent = notification.message;

                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'Accept';
                acceptButton.onclick = () => acceptFriendRequest(notification.sender, notification.recipient); // Set up onClick

                const declineButton = document.createElement('button');
                declineButton.textContent = 'Decline';
                declineButton.onclick = () => rejectFriendRequest(notification.sender,notification.recipient); // Set up onClick

                const acceptTd = document.createElement('td');
                acceptTd.appendChild(acceptButton);

                const declineTd = document.createElement('td');
                declineTd.appendChild(declineButton);

                tr.appendChild(nameTd);
                tr.appendChild(acceptTd);
                tr.appendChild(declineTd);

                friendRequestsTableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erreur:', error));
}
function fetchfriendlist() {
    let token = document.cookie.split('=')[1];
    const url = 'http://localhost:8000/api/friendlist/';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const friendListContainer = document.getElementById('listfriend');
            friendListContainer.innerHTML = ''; // Clear the existing list

            data.forEach(friend => {
                // Création du conteneur pour un ami
                const friendDiv = document.createElement('div');
                friendDiv.id = 'FriendsList';

                // Username de l'ami
                const usernameDiv = document.createElement('div');
                usernameDiv.id = 'usernameFriend';
                usernameDiv.textContent = friend;
                friendDiv.appendChild(usernameDiv);

                // Bouton de message
                const messageFriendDiv = document.createElement('div');
                messageFriendDiv.id = 'messageFriend';
                const messageIcon = document.createElement('img');
                messageIcon.src = '../picture/enveloppe.png';
                messageIcon.alt = 'message';
                messageIcon.id = 'messageenv';
                messageIcon.width = 30;
                messageIcon.height = 30;
                messageFriendDiv.appendChild(messageIcon);
                friendDiv.appendChild(messageFriendDiv);

                // Boutons combat et suppression
                // Ajouter des éléments similaires pour 'fightFriend' et 'deleteFriend'

                friendListContainer.appendChild(friendDiv);
            });
        })
        .catch(error => console.error('Erreur:', error));
}


function acceptFriendRequest(sender, recipient) {
    let token = document.cookie.split('=')[1];
    console.log(sender+"8888");
    // Envoi d'une requête POST pour accepter la demande d'ami
    fetch('http://localhost:8000/api/acceptFriendRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sender: sender, recipient: recipient, token: token }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchNotifications();
        })
        .catch(error => console.error('Erreur:', error));
}
function rejectFriendRequest(sender,recipient) {
    let token = document.cookie.split('=')[1];

    // Envoi d'une requête POST pour refuser la demande d'ami
    fetch('http://localhost:8000/api/rejectFriendRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sender: sender,recipient: recipient, token: token }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchNotifications();
        })
        .catch(error => console.error('Erreur:', error));
}

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

function showchat() {
    console.log('show chat');
    var element = document.getElementById('windowChat');
    element.style.display = 'grid';
    var element2 = document.getElementById('windowFriend');
    element2.style.display = 'none';
}

function showfriend() {
    var element = document.getElementById('windowChat');
    element.style.display = 'none';

    var element2 = document.getElementById('windowFriend');
    element2.style.display = 'grid';
}
function inviteForGame(friendUsername) {
    let token = document.cookie.split('=')[1];

    fetch('http://localhost:8000/api/invite', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipient: friendUsername })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Invitation envoyée', data);
            // Gérer la réponse - par exemple, afficher un message à l'utilisateur
        })
        .catch(error => console.error('Erreur:', error));
}
document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addFriend');
    addButton.addEventListener('click', sendFriendRequest);
});

function sendFriendRequest() {
    const recipientUsername = document.getElementById("usernamesearch").value;
    if (!recipientUsername) {
        alert("Veuillez entrer un nom d'utilisateur");
        return;
    }
    let token = document.cookie.split('=')[1];

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
}

export {sendText, showchat, showfriend};
