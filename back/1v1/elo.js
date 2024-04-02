const {setScoreTable} = require('./score.js');

function calculeElo(stockPoints, resultatPartie, gestionSocketPlayer) {
        let player1 = stockPoints.username1;
        let player2 = stockPoints.username2;

        let eloJoueur1 = Number.parseInt(player1[1]);
        let eloJoueur2 = Number.parseInt(player2[1]);

        const k = 32;
        const esperance1 = 1 / (1 + Math.pow(10, (eloJoueur2 - eloJoueur1) / 400));
        const esperance2 = 1 / (1 + Math.pow(10, (eloJoueur1 - eloJoueur2) / 400));

        const nouveauEloJoueur1 = eloJoueur1 + k * (resultatPartie - esperance1);
        const nouveauEloJoueur2 = eloJoueur2 + k * ((1 - resultatPartie) - esperance2);

        gestionSocketPlayer.emitSocket('endGame', ["win", {elo: nouveauEloJoueur1, earn: eloJoueur1 - nouveauEloJoueur1}], (resultatPartie === 1)? 1 : 2);
        gestionSocketPlayer.emitSocket('endGame', ["lose", {elo: nouveauEloJoueur2, earn: eloJoueur2 - nouveauEloJoueur2}], (resultatPartie === 1)? 2 : 1);

        setScoreTable(player1[0], nouveauEloJoueur1);
        setScoreTable(player2[0], nouveauEloJoueur2);
}

exports.calculeElo = calculeElo;