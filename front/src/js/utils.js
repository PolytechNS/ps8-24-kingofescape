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
        return fetch("http://localhost:8000/api/verifyLogin/" + token, {
            method: "get"
        })
    }
}