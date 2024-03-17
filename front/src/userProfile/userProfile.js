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
                notificationsList.appendChild(li);
            });
        })
        .catch(error => console.error('Erreur:', error));
}
