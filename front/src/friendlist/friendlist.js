document.addEventListener('DOMContentLoaded', function() {
    fetchfriendlist();
});
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
            const friendList = document.getElementById('friendsList');
            friendList.innerHTML = ''; // Nettoyer la liste existante

            data.forEach(friend => {

                const tr = document.createElement('tr');

                const nameTd = document.createElement('td');
                nameTd.textContent = friend;
                // Créer un bouton pour inviter pour une partie
                const inviteButton = document.createElement('button');
                inviteButton.textContent = 'Inviter pour une partie';
                inviteButton.onclick = () =>inviteForGame(friend);

                const inviteId = document.createElement('td');
                inviteId.appendChild(inviteButton);
                tr.appendChild(nameTd);
                tr.appendChild(inviteId);
                friendList.appendChild(tr);
            });
        })
        .catch(error => console.error('Erreur:', error));
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
