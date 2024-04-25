let isLoadedCordova = false;
document.addEventListener('deviceready', () => { isLoadedCordova = true; }, false);

function toggleList() {
    document.getElementById('menuBurger').classList.toggle('active');
}

function showHelp() {
    const url = "http://kingofescape.ps8.academy/rules.html";

    if (isLoadedCordova) {
        let target = "_blank";
        let options = "location=yes,hidden=no";
        cordova.InAppBrowser.open(url, target, options);
    }
    else
        window.open(url, "_blank");
}