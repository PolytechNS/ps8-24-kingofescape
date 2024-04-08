import {Arbitre} from "./arbitre.js";
import {GameManager} from "./gameManager.js";

/**
 * Class GameLocal for the local game
 */
class GameLocal {

    /**
     * Constructor of the class GameLocal
     * @param positionPlayer1 - The position of the player 1
     * @param positionPlayer2 - The position of the player 2
     */
    constructor(positionPlayer1, positionPlayer2) {
        this.gameManager = new GameManager(positionPlayer1, positionPlayer2);
        this.arbitre = new Arbitre();
        this.currentPlayer = 1;
        this.actionRealise = undefined;
    }

    /**
     * Do an action in the game Local
     * @param move - The action to do
     */
    doAction(move) {
        if (this.actionRealise === undefined) {
            if (this.arbitre.isEndGame(this.gameManager.gameStatePlayer1.positionPlayer, this.gameManager.gameStatePlayer2.positionPlayer) !== -1)
                throw new Error("The game is already finished.");

            this.gameManager.playAction(move, this.currentPlayer);
            this.actionRealise = move;
        }
        else
            throw new Error("Action already done");
    }

    /**
     * Get the positions of the players depending on the matrix of visibility
     * @returns {string[]} - The positions of the players
     */
    getPlayerSee() {
        return this.gameManager.getPlayerSee(this.currentPlayer);
    }


    generateGameState() {
        return this.gameManager.generateGameState(this.currentPlayer);
    }

    getPossibleMoves() {
        return this.gameManager.getPossibleMove(this.currentPlayer === 1);
    }

    /**
     * Get the current number of the player
     * @returns {number} - The number of the player
     */
    numberPlayer() {
        return this.currentPlayer;
    }

    /**
     * Change turn player
     */
    update() {
        if (this.currentPlayer === 2)
            this.arbitre.nextTurn();

        this.currentPlayer = 3 - this.currentPlayer;
        this.actionRealise = undefined;
    }

    /**
     * Get if the game is finished
     * @returns {number} - The number of the player who won or equlity
     */
    isEndGame() {
        return this.arbitre.isEndGame(this.gameManager.gameStatePlayer1.positionPlayer, this.gameManager.gameStatePlayer2.positionPlayer);
    }
}

export { GameLocal };