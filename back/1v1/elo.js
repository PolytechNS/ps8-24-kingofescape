const {MongoClient} = require('mongodb');
const {urlAdressDb} = require('../env/env.js');
const jwt = require('jsonwebtoken');
const {getScores, setScore} = require('./score.js');

function calculeElo(player1, player2, resultatPartie) {
    const eloJoueur1 = getScores(player1);
    const eloJoueur2 = getScores(player2);
    const k = 32;
    const esperance1 = 1 / (1 + Math.pow(10, (eloJoueur2 - eloJoueur1) / 400));
    const esperance2 = 1 / (1 + Math.pow(10, (eloJoueur1 - eloJoueur2) / 400));
    const nouveauEloJoueur1 = eloJoueur1 + k * (resultatPartie - esperance1);
    const nouveauEloJoueur2 = eloJoueur2 + k * ((1 - resultatPartie) - esperance2);
    setScore(player1, nouveauEloJoueur1);
    setScore(player2, nouveauEloJoueur2);
}

exports.calculeElo = calculeElo;