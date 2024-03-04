/**
 * Arbitre class who verify Turn and end of the game
 */
class Arbitre {
    /**
     * Constructor of Arbitre
     */
    constructor() {
        this.turn = 0;
    }

    /**
     * Verify if the game is finished
     * @param positionPlayer1 - The position of the player 1
     * @param positionPlayer2 - The position of the player 2
     * @returns {number} - 1 if the player 1 win, 2 if the player 2 win, 0 if it's an equality, -1 if the game is not finished
     */
    isEndGame(positionPlayer1, positionPlayer2) {
        if (positionPlayer1[1] === "9")
            return 1;
        if (positionPlayer2[1] === "1")
            return 2;
        if (this.turn >= 100)
            return 0;

        return -1;
    }

    /**
     * Change the turn
     */
    nextTurn() {
        this.turn++;
    }
}

exports.arbitre = Arbitre;