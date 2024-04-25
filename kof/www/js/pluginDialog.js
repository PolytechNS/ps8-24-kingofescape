function alertDialog(titreMessage, message, buttonName) {
    if (cordovaLoaded) {
        navigator.notification.alert(message, null, titreMessage, buttonName);
    }
    else
        window.alert(message);
}

function confirmDialog(titreMessage, functionCallBack, message, buttonsNames) {
    if (cordovaLoaded)
        navigator.notification.confirm(message, functionCallBack, titreMessage, buttonsNames);
}