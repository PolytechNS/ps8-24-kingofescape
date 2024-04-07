const {setScoreTable} = require('./score.js');
const {getStat, setStat, getStatTable, setStatTable} = require('../sucess/sucess.js');
function calculeElo(stockPoints, resultatPartie, gestionSocketPlayer) {
        let player1 = stockPoints.username1;
        let player2 = stockPoints.username2;

        let eloJoueur1 = Number.parseInt(player1[1]);
        let eloJoueur2 = Number.parseInt(player2[1]);

        const k = 32;
        const esperance1 = Math.round(1 / (1 + Math.pow(10, (eloJoueur2 - eloJoueur1) / 400)));
        const esperance2 = Math.round(1 / (1 + Math.pow(10, (eloJoueur1 - eloJoueur2) / 400)));

        const nouveauEloJoueur1 = eloJoueur1 + k * (resultatPartie - esperance1);
        const nouveauEloJoueur2 = eloJoueur2 + k * ((1 - resultatPartie) - esperance2);

        gestionSocketPlayer.emitSocket('endGame', ["win", {elo: nouveauEloJoueur1, earn: eloJoueur1 - nouveauEloJoueur1}], (resultatPartie === 1)? 1 : 2);
        gestionSocketPlayer.emitSocket('endGame', ["lose", {elo: nouveauEloJoueur2, earn: eloJoueur2 - nouveauEloJoueur2}], (resultatPartie === 1)? 2 : 1);

        setScoreTable(player1[0], nouveauEloJoueur1);
        setScoreTable(player2[0], nouveauEloJoueur2);

        getStatTable(player1[0]).then(([status, stats]) => {
                let win = parseInt(stats.win);
                let lose = parseInt(stats.lose);
                let total = parseInt(stats.total);
                if (status === 200) {
                        if (resultatPartie === 1) {
                                setStatTable(player1[0], win+1, lose, total+1);
                        }
                        else {
                                setStatTable(player1[0], win, lose+1, total+1);
                        }
                }
        });

        getStatTable(player2[0]).then(([status, stats]) => {
                let win = parseInt(stats.win);
                let lose = parseInt(stats.lose);
                let total = parseInt(stats.total);
                if (status === 200) {
                        if (resultatPartie === 0) {
                                setStatTable(player2[0], win+1, lose, total+1);
                        }
                        else {
                                setStatTable(player2[0], win, lose+1, total+1);
                        }
                }
        });
}

exports.calculeElo = calculeElo;