let batteryLevel = -1;

window.addEventListener("batterystatus", onBatteryStatus, false);

function onBatteryStatus(status) {
    batteryLevel = status.level;
}

function showBattery(isCritical, status) {
    if (!status.isPlugged) {
        if (isCritical) {
            alertDialog("Battery critical", "Your battery is critically low, please charge your device", "OK");
        } else {
            alertDialog("Battery low", "Your battery is low, please charge your device", "OK");
        }
    }
}

function notifyBattery() {
    window.addEventListener("batterylow",(status) => showBattery(false, status), false);
    window.addEventListener("batterycritical",(status) => showBattery(true, status), false);

    if (batteryLevel < 20 && batteryLevel !== -1) {
        alertDialog("Battery low", "Your battery is low, please charge your device", "OK");
    }
}