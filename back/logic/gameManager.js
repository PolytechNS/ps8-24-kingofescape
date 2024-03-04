const Graph = require('./graph.js').graph;
const VisibilityMatrix = require('./visibilityMatrix.js').visibilityMatrix;
const GameStatePlayer = require('./gameStatePlayer.js').GameState;

/**
 * Class representing the game includes the two players, the graph of the game and the visibilityMatrix.
 */
class GameManager {

    /**
     * Create a game manager.
     * @param positionPlayer1 - The position of the first player.
     * @param positionPlayer2 - The position of the second player.
     * @throws {Error} - If the position of the players is incorrect.
     * @throws {Error} - If the position of the players is not provided.
     */
    constructor(positionPlayer1, positionPlayer2) {
        if (positionPlayer1 === undefined || positionPlayer2 === undefined)
            throw new Error("You must provide the position of the two players.");
        if (positionPlayer1[1] !== "1" || positionPlayer2[1] !== "9")
            throw new Error("The position of the players is incorrect.");

        this.gameStatePlayer1 = new GameStatePlayer(positionPlayer1);
        this.gameStatePlayer2 = new GameStatePlayer(positionPlayer2);
        this.graph = new Graph();
        this.visibilityMatrix = new VisibilityMatrix(positionPlayer1, positionPlayer2);
    }

    /**
     * Play an action for a player.
     * @param action - The action to play.
     * @param playerNumber - The number of the player.
     */
    playAction(action, playerNumber) {
        let isPlayer1 = playerNumber === 1;

        if (action.action === "wall")
            this.#playWall(action.value, isPlayer1);
        else if (action.action === "move")
            this.#playMove(action.value, isPlayer1);
    }

    /**
     * Add a wall to the game.
     * @param wall - The wall to add.
     * @param isPlayerOne - true if the wall is placed by player one, false if it's placed by player two.
     * @throws {Error} - If the player has already placed 10 walls.
     */
    #playWall(wall, isPlayerOne) {
        let player = isPlayerOne ? this.gameStatePlayer1 : this.gameStatePlayer2;

        if (player.walls.length >= 10)
            throw new Error("The player has already placed 10 walls.");

        this.graph.placeWall(wall, this.gameStatePlayer1.positionPlayer, this.gameStatePlayer2.positionPlayer);
        this.visibilityMatrix.placeWall(wall, isPlayerOne);
        player.addWall(wall);
    }

    /**
     * Play a move for a player.
     * @param position - The position to move to.
     * @param isPlayerOne - true if it's player one, false if it's player two.
     */
    #playMove(position, isPlayerOne) {
        let possibleMoves = this.getPossibleMove(isPlayerOne);

        if (!possibleMoves.includes(position))
            throw new Error("The move is not possible.");

        let player = isPlayerOne ? this.gameStatePlayer1 : this.gameStatePlayer2;
        this.visibilityMatrix.movePlayer(player.positionPlayer, position, isPlayerOne);
        player.movePlayer(position);
    }

    /**
     * Get the possible move for a player.
     * @param isPlayerOne - true if it's player one, false if it's player two.
     * @returns {string[]} - The possible moves for the player.
     */
    getPossibleMove(isPlayerOne) {
        let player = isPlayerOne ? this.gameStatePlayer1 : this.gameStatePlayer2;
        let otherPlayer = isPlayerOne ? this.gameStatePlayer2 : this.gameStatePlayer1;
        let coordinatePlayer = Number.parseInt(player.positionPlayer);

        let possibleMoves = [];
        let totalPossibilityMove = [String(coordinatePlayer + 1), String(coordinatePlayer + 2),
            String(coordinatePlayer - 1), String(coordinatePlayer - 2),
            String(coordinatePlayer + 10), String(coordinatePlayer + 20),
            String(coordinatePlayer - 10), String(coordinatePlayer - 20)];

        for (let i = 0; i < 8; i += 2) {
            let coordinate1 = player.positionPlayer;
            let possibleMove = totalPossibilityMove[i];

            if (totalPossibilityMove[i] === otherPlayer.positionPlayer) {
                coordinate1 = otherPlayer.positionPlayer;
                possibleMove = totalPossibilityMove[i + 1];
            }

            if (this.graph.verifyEdge(coordinate1, possibleMove))
                possibleMoves.push(possibleMove);
        }

        return possibleMoves;
    }

    /**
     * Get the position of the players that the player can see.
     * @param playerNumber - The number of the player.
     * @returns {string[]} - The position of the players that the player can see.
     */
    getPlayerSee(playerNumber) {
        let isPlayer1 = playerNumber === 1;
        let coordinatePlayer1 = isPlayer1 ? this.gameStatePlayer1.positionPlayer : undefined;
        let coordinatePlayer2 = isPlayer1 ?  undefined : this.gameStatePlayer2.positionPlayer;

        if (coordinatePlayer1 === undefined && this.visibilityMatrix.canSeeOtherPlayer(this.gameStatePlayer1.positionPlayer, this.gameStatePlayer2.positionPlayer, isPlayer1))
            coordinatePlayer1 = this.gameStatePlayer1.positionPlayer;

        if (coordinatePlayer2 === undefined && this.visibilityMatrix.canSeeOtherPlayer(this.gameStatePlayer1.positionPlayer, this.gameStatePlayer2.positionPlayer, isPlayer1))
            coordinatePlayer2 = this.gameStatePlayer2.positionPlayer;

        return [coordinatePlayer1, coordinatePlayer2];
    }
}

exports.gameManager = GameManager;