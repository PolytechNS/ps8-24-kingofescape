document.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
});

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
            const friendRequestsTableBody = document.getElementById('friend-requests-list');
            friendRequestsTableBody.innerHTML = '';

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
