const GameManager = require("../logic/gameManager.js").gameManager;
const Arbitre = require("../logic/arbitre.js").arbitre;
const setup = require("../ai/kingofescape.js").setup;
const nextMove = require("../ai/kingofescape.js").nextMove;
const correction = require("../ai/kingofescape.js").correction;
const updateBoard = require("../ai/kingofescape.js").updateBoard;

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
        let positionIA = setup(AIPlay);

        if (AIPlay === 1)
            this.game = new GameManager(positionIA, position2)
        else
            this.game = new GameManager(position1, positionIA);

        this.arbitre = new Arbitre();
        this.AIPlay = AIPlay;
        this.currentPlayer = 1;
        this.actionRealise = undefined;
    }

    /**
     * Generate the game state for the IA
     * @returns {{ownWalls: [], opponentWalls: [], board: *[]}} - The wall of the IA, the wall of the opponent and the board containing the visibililty and players
     */
    #generateGameState() {
        let board = [];

        // Generate the board without player
        for (let i = 9; i >= 1; i--) {
            let row = [];
            for (let j = 1; j <= 9; j++) {
                if (this.game.visibilityMatrix.canSeeSquare(String(j) + String(i), this.currentPlayer === 1))
                    row.push(0);
                else
                    row.push(-1);
            }
            board.push(row);
        }

        // Add player in the board
        let positionPlayers = this.game.getPlayerSee(this.currentPlayer);

        if (this.AIPlay === 1) {
            board[9 - Number.parseInt(positionPlayers[0][1])][Number.parseInt(positionPlayers[0][0]) - 1] = 1;

            if (positionPlayers[1] !== undefined)
                board[9 - Number.parseInt(positionPlayers[1][1])][Number.parseInt(positionPlayers[1][0]) - 1] = 2;
        }
        else {
            board[9 - Number.parseInt(positionPlayers[1][1])][Number.parseInt(positionPlayers[1][0]) - 1] = 1;

            if (positionPlayers[0] !== undefined)
                board[9 - Number.parseInt(positionPlayers[0][1])][Number.parseInt(positionPlayers[0][0]) - 1] = 2;
        }

        // Get the wall of the IA and the opponent
        let opponentWalls = (this.AIPlay === 1)? this.game.gameStatePlayer2.walls : this.game.gameStatePlayer1.walls;
        let ownWalls = (this.AIPlay === 1)? this.game.gameStatePlayer1.walls : this.game.gameStatePlayer2.walls;

        return {opponentWalls: opponentWalls, ownWalls: ownWalls, board: board};
    }

    /**
     * IA do an action in the game
     * @returns {*|string} - The action that the IA has done
     */
    playIA() {
        let game = this.#generateGameState();
        let move = nextMove(game);

        try {
            this.game.playAction(move, this.currentPlayer);
        } catch (e) {
            console.log(move);
            move = {action: "idle"}
            correction(move);
            console.log(e);
        }

        game = this.#generateGameState();
        updateBoard(game);
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