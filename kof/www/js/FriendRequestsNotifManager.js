
const notificationSocket = io.connect('http://localhost:8000/api/notifications', {
    query: {
        username: localStorage.getItem('currentUser')
    }
});
const user = localStorage.getItem('currentUser');


notificationSocket.on('connect', () => {
    console.log('Connected to the notification server.');
});
function changeButtonIcon(notificationReceived) {
    const button = document.getElementById('buttonNotification');
    if (button) {
        if (notificationReceived) {
            button.style.backgroundImage = "url('../picture/cloche2.png')";

        } else {
            // Chemin vers l'icône de notification normale
            button.style.backgroundImage = "url('../picture/notificon.png')";

        }
    } else {
        console.error('Button not found');
    }
}

notificationSocket.on('notification', function(data) {
    displayNotification(data.message);
    changeButtonIcon(true);
});
function displayNotification(message) {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) {
        console.error('Notification area not found');
        return;
    }

    const notification = document.createElement('div');
    notification.className = 'notification-message';
    notification.textContent = message;
    notificationArea.appendChild(notification);

    // Jouer le son de notification
    const notificationSound = document.getElementById('notificationSound');
    notificationSound.play();

    notification.addEventListener('click', () => {
        notification.remove();
        if (notificationArea.children.length === 0) {
            changeButtonIcon(false);
        }
    });
}


document.getElementById('buttonNotification').addEventListener('click', () => {
    const notificationArea = document.getElementById('notification-area');
    if (notificationArea.style.display === 'none' || !notificationArea.style.display) {
        notificationArea.style.display = 'block';

    } else {
        notificationArea.style.display = 'none';
    }
});
