const valueVibrate = localStorage.getItem("vibration");
const vibrateVar = (valueVibrate === "true" || valueVibrate === null);

function vibrate() {
    if (cordovaLoaded && vibrateVar)
        navigator.vibrate(300);
}