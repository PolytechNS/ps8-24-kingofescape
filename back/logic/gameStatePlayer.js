/**
 * Class representing the position of a player and the number of Wall in the game.
 */
class GameStatePlayer {
    /**
     * Create a game state player.
     * @param positionPlayer - The position of the player.
     */
    constructor(positionPlayer) {
        this.positionPlayer = positionPlayer;
        this.walls = [];
    }

    /**
     * Add a wall to the player.
     * @param wall - The wall to add.
     */
    addWall(wall) {
        this.walls.push(wall);
    }

    /**
     * Move a player to a new position.
     * @param position - The new position of the player.
     */
    movePlayer(position) {
        this.positionPlayer = position;
    }
}

exports.GameState = GameStatePlayer;