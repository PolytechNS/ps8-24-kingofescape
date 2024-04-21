
const notificationSocket = io.connect('http://localhost:8000/api/notifications', {
    query: {
        username: localStorage.getItem('currentUser')
    }
});
const user = localStorage.getItem('currentUser');


notificationSocket.on('connect', () => {
    console.log('Connected to the notification server.');
});
notificationSocket.on('notification', function(data) {
    displayNotification(data.message);
    showNotificationIndicator();
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

    notification.addEventListener('click', () => {
        notification.remove();
    });

    // Hide the notification indicator when notifications are displayed
    hideNotificationIndicator();
}
function showNotificationIndicator() {
    const indicator = document.getElementById('notificationIndicator');
    if (indicator) {
        indicator.style.display = 'block';
    }
}

function hideNotificationIndicator() {
    const indicator = document.getElementById('notificationIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

document.getElementById('notificationButton').addEventListener('click', () => {
    const notificationArea = document.getElementById('notification-area');
    if (notificationArea.style.display === 'none' || !notificationArea.style.display) {
        notificationArea.style.display = 'block';
        hideNotificationIndicator();
    } else {
        notificationArea.style.display = 'none';
    }
});
