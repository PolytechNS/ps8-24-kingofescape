document.getElementById("refreshNotifications").addEventListener("click", function() {
    fetchNotifications();
});


function fetchNotifications() {
    let token = document.cookie.split('=')[1];

    const url = 'http://localhost:8000/api/notifications/';
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const notificationsList = document.getElementById('notificationsList');
            notificationsList.innerHTML = '';

            data.forEach(notification => {
                const li = document.createElement('li');
                li.textContent = notification.message;
                // Bouton pour accepter la demande d'ami
                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'Accepter';
                acceptButton.addEventListener('click', function() {
                    acceptFriendRequest(notification.sender, notification.recipient);
                });
                li.appendChild(acceptButton);

                // Bouton pour refuser la demande d'ami
                const rejectButton = document.createElement('button');
                rejectButton.textContent = 'Refuser';
                rejectButton.addEventListener('click', function() {
                    rejectFriendRequest(notification.sender);
                });
                li.appendChild(rejectButton);

                notificationsList.appendChild(li);

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
         //
            //   fetchNotifications();
        })
        .catch(error => console.error('Erreur:', error));
}
function rejectFriendRequest(sender) {
    let token = document.cookie.split('=')[1];

    // Envoi d'une requête POST pour refuser la demande d'ami
    fetch('http://localhost:8000/api/rejectFriendRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sender: sender, token: token }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchNotifications();
        })
        .catch(error => console.error('Erreur:', error));
}

