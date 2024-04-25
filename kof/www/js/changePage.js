function changePage(path_in_src) {
    window.location.href = window.location.origin + "/" + path_in_src;
}

function callBack(choice, url) {
    if (choice === 1)
        changePage(url);
}

function changePageWithVerifyBattery(path_in_src) {
    if (batteryLevel < 20 && batteryLevel !== -1)
        confirmDialog("Battery low", (choice) => callBack(choice, path_in_src), ["OK", "Cancel"]);
    else
        changePage(path_in_src);
}