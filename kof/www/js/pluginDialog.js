function alertDialog(titreMessage, message, buttonName) {
    if (cordovaLoaded) {
        navigator.notification.alert(message, null, titreMessage, buttonName);
    }
    else
        window.alert(message);
}