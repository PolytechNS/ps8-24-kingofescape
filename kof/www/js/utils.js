// URL du site en développement (localhost)
const developmentURL = 'http://localhost:8000/'

// URL du vrai site (production)
const productionURL = 'http://kingofescape.ps8.academy/';

let cordovaLoaded = false;

document.addEventListener("deviceready", () => { cordovaLoaded = true; }, false);

// Fonction pour obtenir l'URL appropriée en fonction de l'environnement
function getAPIURL() {
    //return productionURL;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return developmentURL;
    } else {
        return productionURL;
    }
}

const apiURL = getAPIURL();


function getCookie(name) {
    // Sépare la chaîne de cookies en segments individuels
    const cookieArray = document.cookie.split(';');

    // Parcourt chaque segment pour trouver le cookie demandé
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        // Supprime les espaces en début et fin de chaîne
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }

        let splitCookie = cookie.split('=');

        // Si le nom du cookie correspond, retourne sa valeur
        if (splitCookie[0] === name) {
            return splitCookie[1];
        }
    }

    // Retourne null si le cookie n'est pas trouvé
    return null;
}

function verifyLogin() {
    let token = getCookie("token");

    if (token == null) {
        return null;
    }
    else {
        return fetch(`${apiURL}api/verifyLogin/${token}`, {
            method: "get"
        })
    }
}