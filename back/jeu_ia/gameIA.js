const GameManager = require("../logic/gameManager.js").gameManager;
const Arbitre = require("../logic/arbitre.js").arbitre;
const computeMove = require("../ai/ai.js").ia;

/**
 * Class GameIA for the game IA
 */
class GameIA {
    /**
     * Constructor of the class GameIA
     * @param position1 - The position of the player 1
     * @param position2 - The position of the player 2
     * @param AIPlay - The number of the player who is the IA
     */
    constructor(position1, position2, AIPlay) {
        this.game = new GameManager(position1, position2)
        this.arbitre = new Arbitre();
        this.AIPlay = AIPlay;
        this.currentPlayer = 1;
        this.actionRealise = undefined;
    }

    /**
     * IA do an action in the game
     * @returns {*|string} - The action that the IA has done
     */
    playIA() {
        let position = this.currentPlayer === 1 ? this.game.gameStatePlayer1.positionPlayer : this.game.gameStatePlayer2.positionPlayer;
        let move = computeMove(Number.parseInt(position));

        try {
            move = {action: "move", value: move};
            this.game.playAction(move, this.currentPlayer);
        } catch (e) {
            console.log(move);
            move = {action: "idle"}
            console.log(e);
        }

        this.update();
        return move;
    }

    /**
     * Player do an action in the game
     * @param move - The action to do
     */
    playAction(move) {
        if (this.currentPlayer === this.AIPlay)
            throw new Error("It's not your turn.");
        if (this.arbitre.isEndGame(this.game.gameStatePlayer1.positionPlayer, this.game.gameStatePlayer2.positionPlayer) !== -1)
            throw new Error("The game is already finished.");
        if (this.actionRealise !== undefined)
            throw new Error("Action already done");

        this.game.playAction(move, this.currentPlayer);
        this.actionRealise = move;
    }

    /**
     * Get the positions of the players depending on the matrix of visibility
     * @returns {string[]} - The positions of the players
     */
    getPlayerSee() {
        return this.game.getPlayerSee(this.currentPlayer);
    }

    /**
     * Change turn player
     */
    update() {
        if (this.currentPlayer === 2)
            this.arbitre.nextTurn();

        this.actionRealise = undefined;
        this.currentPlayer = 3 - this.currentPlayer;
    }

    /**
     * Get if the game is finished
     * @returns {number} - The number of the player who won or equlity
     */
    isEndGame() {
        return this.arbitre.isEndGame(this.game.gameStatePlayer1.positionPlayer, this.game.gameStatePlayer2.positionPlayer);
    }

}

exports.gameIA = GameIA;