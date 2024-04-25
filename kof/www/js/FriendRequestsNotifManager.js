
const notificationSocket = io.connect('http://localhost:8000/api/notifications', {
    query: {
        username: localStorage.getItem('currentUser')
    }
});
const user = localStorage.getItem('currentUser');


notificationSocket.on('connect', () => {
    console.log('Connected to the notification server.');
});


    function toggleNotifications() {
        const notificationArea = document.getElementById('notification-area');
        if (notificationArea.style.display === 'none' || !notificationArea.style.display) {
            notificationArea.style.display = 'block';
        } else {
            notificationArea.style.display = 'none';
        }
    }
function changeButtonIcon(notificationReceived) {
    const button = document.getElementById('buttonNotification');
    const notificationCounter = document.getElementById('notificationCounter');
    const menuNotificationCount = document.getElementById('menuNotificationCount');
    const burgerLines = document.querySelectorAll('.burger-line'); 
    if (notificationReceived) {
        button.style.backgroundImage = "url('../picture/cloche2.png')";
        burgerLines.forEach(line => line.style.backgroundColor = 'red');
    } else {
        button.style.backgroundImage = "url('../picture/notificon.png')";
        burgerLines.forEach(line => line.style.backgroundColor = ''); // Reset burger line color
        notificationCounter.textContent = '0';
        menuNotificationCount.style.display = 'none'; // Hide the counter when no notifications
    }
}

notificationSocket.on('notification', function(data) {
    displayNotification(data.message);
    changeButtonIcon(true);
});
function displayNotification(message) {
    const notificationArea = document.getElementById('notification-area');
    const notificationCounter = document.getElementById('notificationCounter');
    const menuNotificationCount = document.getElementById('menuNotificationCount');
    let count = parseInt(notificationCounter.textContent);

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
    if (notificationSound) {
        notificationSound.play();
    } else {
        console.error('Notification sound element not found');
    }

    notification.addEventListener('click', () => {
        notification.remove();
        if (notificationArea.children.length === 0) {
            changeButtonIcon(false);
        }
    });

    count++;
    notificationCounter.textContent = count;
    menuNotificationCount.style.display = 'block';
}
document.getElementById('buttonNotification').addEventListener('click', () => {
    const notificationArea = document.getElementById('notification-area');
    if (notificationArea.style.display === 'none' || !notificationArea.style.display) {
        notificationArea.style.display = 'block';

    } else {
        notificationArea.style.display = 'none';
    }
});