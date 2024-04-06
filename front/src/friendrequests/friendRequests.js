const chatFriend = io.connect('http://localhost:8000/api/chatFriend', {
    query: {
        username: localStorage.getItem('currentUser')
    }
});
const user = localStorage.getItem('currentUser');

let room ; 
const socketFriendListUpdates = io.connect('http://localhost:8000/api/friendListUpdates');
chatFriend.on('connect', () => {
    console.log('connecté au serveur.');
    chatFriend.on('matchFound', (roomName) => {
        room = roomName;
    });
    chatFriend.on('msg1', (message) => {
        console.log('message received: ',message );
        let text = message.text;
        let usersend = message.user;
        const isCurrentUser = usersend === user;
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        paragraph.classList.add(isCurrentUser ? 'message-sent' : 'message-received');
        const element = document.getElementById('chatContent');
        element.appendChild(paragraph);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  fetchBasicFriendList();
    fetchFullFriendList();
    fetchNotifications();

});


socketFriendListUpdates.on('update-friends', (data) => {

    let currentUser = localStorage.getItem('username');

    if (data.sender === currentUser || data.friend === currentUser) { // Changement ici

        fetchFullFriendList();
    }
});



export function fetchNotifications() {
    let token = document.cookie.split('=')[1];
    const url = 'http://localhost:8000/api/friendRequest';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(handleResponse)
        .then(data => {
            const friendRequestsTableBody = document.getElementById('friend-requests-list');
            friendRequestsTableBody.innerHTML = '';
            data.forEach(notification => {
                const tr = document.createElement('tr');

                // Colonne pour le message de la demande
                const nameTd = document.createElement('td');
                nameTd.textContent = notification.message;
                tr.appendChild(nameTd);

                // Colonne pour le bouton Accepter
                const acceptTd = document.createElement('td');
                const acceptImg = document.createElement('img');
                acceptImg.src = '../picture/accept.png';
                acceptImg.alt = 'Accept';
                acceptImg.width = 30;
                acceptImg.height = 30;
                acceptImg.style.cursor = 'pointer';
                acceptImg.onclick = () => acceptFriendRequest(notification.sender, notification.recipient);
                acceptTd.appendChild(acceptImg);
                tr.appendChild(acceptTd);

                const declineTd = document.createElement('td');
                const declineImg = document.createElement('img');
                declineImg.src = '../picture/redcross.png';
                declineImg.alt = 'Decline';
                declineImg.width = 30;
                declineImg.height = 30;
                declineImg.style.cursor = 'pointer';
                declineImg.onclick = () => rejectFriendRequest(notification.sender, notification.recipient);
                declineTd.appendChild(declineImg);
                tr.appendChild(declineTd);

                friendRequestsTableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erreur:', error));
}


export function fetchFullFriendList() {
    let token = document.cookie.split('=')[1];
    const url = 'http://localhost:8000/api/friendlist/';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(handleResponse)
        .then(friends => {
            const friendListTable = document.getElementById('friendListTable');
            friendListTable.innerHTML = '';
            friends.forEach(friend => {
                const row = document.createElement('tr');

                // Username
                const usernameCell = document.createElement('td');
                usernameCell.textContent = friend.toString();
                row.appendChild(usernameCell);

                // Message
                const messageCell = document.createElement('td');
                appendIconToCell(messageCell, '../picture/enveloppe.png', 'message');
                row.appendChild(messageCell);

                // Fight
                const fightCell = document.createElement('td');
                appendIconToCell(fightCell, '../picture/multi.png', 'fight');
                row.appendChild(fightCell);

                // Delete
                const deleteCell = document.createElement('td');
                appendIconToCell(deleteCell, '../picture/redcross.png', 'delete',friend);
                row.appendChild(deleteCell);

                friendListTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function appendIconToCell(cell, src, alt, friendUsername) {
    const icon = document.createElement('img');
    icon.src = src;
    icon.alt = alt;
    icon.width = 30;
    icon.height = 30;
    icon.style.cursor = 'pointer';

    if (alt === 'delete') {
        icon.onclick = () => {
            removeFriend( friendUsername)
                .then(() => {
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression:', error);
                });
        };
    }

    cell.appendChild(icon);
}

export function fetchBasicFriendList() {
    let token = document.cookie.split('=')[1];
    const url = 'http://localhost:8000/api/friendlist/';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(handleResponse)
        .then(friends => {
            const friendListTable = document.getElementById('friendList'); // Ensure this ID is unique in HTML
            friendListTable.innerHTML = '';
            friends.forEach(friend => {
                const row = document.createElement('tr');

                // Username only
                const usernameCell = document.createElement('td');
                usernameCell.textContent = friend.toString(); // Make sure this correctly reflects the friend's username
                row.appendChild(usernameCell);
                usernameCell.addEventListener('click', () => {
                    chatFriend.emit('friend', usernameCell.textContent);
                });

                friendListTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
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
function removeFriend(friendUsername) {
    const url = 'http://localhost:8000/api/deleteFriend';
    const token = document.cookie.split('=')[1];

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendUsername, token })
    })
        .then(response => response.json())
        .then(result => {
            fetchFullFriendList()
            return result;
        })
        .catch((error) => {
            throw error;
        });
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

function sendText() {
    var messageInput = document.getElementById('message');
    var text = messageInput.value;
    chatFriend.emit('msg', { room, text, user});
    messageInput.value = "";
};

function showchat() {
    console.log('show chat');
    var element = document.getElementById('windowChat');
    element.style.display = 'grid';
    var element2 = document.getElementById('windowFriend');
    element2.style.display = 'none';
    var element3= document.getElementById('friend-requests-table');
    element3.style.display = 'none';
}

function showRequest() {
    console.log('show request');
    var element = document.getElementById('windowChat');
    element.style.display = 'none';
    var element2 = document.getElementById('windowFriend');
    element2.style.display = 'none';
    var element3= document.getElementById('friend-requests-table');
    element3.style.display = 'grid';
}
function showfriend() {
    var element = document.getElementById('windowChat');
    element.style.display = 'none';

    var element2 = document.getElementById('windowFriend');
    element2.style.display = 'grid';
    var element3= document.getElementById('friend-requests-table');
    element3.style.display = 'none';
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
function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.text().then(text => {
        return text ? JSON.parse(text) : {};
    });
}

export {sendText, showchat, showfriend,showRequest};
