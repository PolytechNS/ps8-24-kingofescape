const chatFriend = io.connect('http://localhost:8000/api/chatFriend', {
    query: {
        username: localStorage.getItem('currentUser')
    }
});
const user = localStorage.getItem('currentUser');

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addFriend');
    addButton.addEventListener('click', sendFriendRequest);
});
document.addEventListener('DOMContentLoaded', () => {
    fetchBasicFriendList();
    fetchFullFriendList();
    fetchFriendsRequests();

});


let room ;
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



export async function fetchFriendsRequests() {
    const token = document.cookie.split('=')[1];
    const url = 'http://localhost:8000/api/friendRequest';

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        populateFriendRequestsTable(data);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function populateFriendRequestsTable(friendRequests) {
    const friendRequestsTableBody = document.getElementById('friend-requests-list');
    friendRequestsTableBody.innerHTML = '';

    friendRequests.forEach(notification => {
        const tr = createFriendRequestRow(notification);
        friendRequestsTableBody.appendChild(tr);
    });
}

function createFriendRequestRow(notification) {
    const tr = document.createElement('tr');
    tr.appendChild(createTableCell(notification.message));
    tr.appendChild(createButtonCell('../picture/accept.png', 'Accept', () => acceptFriendRequest(notification.sender, notification.recipient)));
    tr.appendChild(createButtonCell('../picture/redcross.png', 'Decline', () => rejectFriendRequest(notification.sender, notification.recipient)));
    return tr;
}

function createTableCell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createButtonCell(imageSrc, altText, onClick) {
    const td = document.createElement('td');
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = altText;
    img.width = 30;
    img.height = 30;
    img.style.cursor = 'pointer';
    img.onclick = onClick;
    td.appendChild(img);
    return td;
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
            fetchFriendsRequests();
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
            fetchFriendsRequests();
        })
        .catch(error => console.error('Erreur:', error));
}

function sendText() {
    var messageInput = document.getElementById('message');
    var text = messageInput.value;
    chatFriend.emit('msg', { room, text, user});
    messageInput.value = "";
};



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

export {sendText};
