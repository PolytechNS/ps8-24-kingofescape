/**
 * A visibility matrix.
 */
class VisibilityMatrix {
    /**
     * Create a visibility matrix.
     */
    constructor(coordinatePlayer1, coordinatePlayer2) {
        this.matrix = [];

        // Add 4 lines of -1, 1 line of 0, 4 lines of 1
        for (let i = 0; i < 4; i++) this.addLine(-1);
        this.addLine(0);
        for (let i = 0; i < 4; i++) this.addLine(1);

        // Assuming the coordinates are correct, we place the characters in the matrix.
        if (coordinatePlayer1 !== undefined && coordinatePlayer2 !== undefined) {
            this.#placePlayer(coordinatePlayer1, 1);
            this.#placePlayer(coordinatePlayer2, -1);
        }
    }

    /**
     * Add a line to the matrix for init visibility Matrix.
     * @param value - The value to add to each square in the line.
     */
    addLine(value) {
        let line = [];

        for (let i = 0; i < 9; i++)
            line.push(value);

        this.matrix.push(line);
    }

    /**
     * Place a character in the matrix and update the visibility.
     * @param coordinate - The coordinate where the character is placed.
     * @param value - The value to add in the matrix.
     */
    #placePlayer(coordinate, value) {
        let x = 9 - Number.parseInt(coordinate[1]);
        let y = Number.parseInt(coordinate[0]) - 1;

        this.matrix[x][y] += value;
        this.#writeValueInMatrix(x - 1, y, value);
        this.#writeValueInMatrix(x + 1, y, value);
        this.#writeValueInMatrix(x, y - 1, value);
        this.#writeValueInMatrix(x, y + 1, value);
    }

    /**
     * Check if possible to write coordinate in Matrix.
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param value - The value to add in the matrix.
     */
    #writeValueInMatrix(x, y, value) {
        if (x >= 0 && x <= 8 && y >= 0 && y <= 8)
            this.matrix[x][y] += value;
    }

    /**
     * Move a player in the matrix.
     * @param oldCoordinate - The old coordinate of the player.
     * @param newCoordinate - The new coordinate of the player.
     * @param isPlayerOne - true if the player is player one, false if it's player two.
     */
    movePlayer(oldCoordinate, newCoordinate, isPlayerOne) {
        let value = isPlayerOne ? 1: -1;
        this.#placePlayer(oldCoordinate, -value);
        this.#placePlayer(newCoordinate, value);
    }

    /**
     * Place a wall in the matrix.
     * @param wall - The wall to place ['yx', 1 or 0].
     * @param isPlayerOne - true if the wall is placed by player one, false if it's placed by player two.
     */
    placeWall(wall, isPlayerOne) {
        let coordinate = wall[0];
        let multiply = isPlayerOne? 1 : -1;

        let x = 9 - Number.parseInt(coordinate[1]);
        let y = Number.parseInt(coordinate[0]) - 1;
        let xArray = [0, 0, 1, 1, -1, -1, 0, 1, 2, 2, 1, 0];
        let yArray = [0, 1, 0, 1, 0, 1, 2, 2, 1, 0, -1, -1];

        // Add the multiply value * 2 to the 4 squares around the wall, and add the multiply value to the 8 squares around these 4 squares.
        for (let i = 0; i < 4; i++)
            this.#writeValueInMatrix(x + xArray[i], y + yArray[i], 2 * multiply);

        for (let i = 4; i < 12; i++)
            this.#writeValueInMatrix(x + xArray[i], y + yArray[i], multiply);
    }

    /**
     * Check if a player can see a square.
     * @param coordinate - The coordinate to check.
     * @param isPlayerOne - true if it's player one, false if it's player two.
     * @returns {boolean} - True if the player can see the square, else false.
     */
    canSeeSquare(coordinate, isPlayerOne) {
        let x = 9 - Number.parseInt(coordinate[1]);
        let y = Number.parseInt(coordinate[0]) - 1;
        return (isPlayerOne && this.matrix[x][y] >= 0) || (!isPlayerOne && this.matrix[x][y] <= 0);
    }

    /**
     * Check if a player can see the other player.
     * @param coordinatePlayer1 - The coordinate of the first player.
     * @param coordinatePlayer2 - The coordinate of the second player.
     * @param isPlayerOne - true if it's player one, false if it's player two.
     * @returns {boolean} - True if the player can see the other player, else false.
     */
    canSeeOtherPlayer(coordinatePlayer1, coordinatePlayer2, isPlayerOne) {
        let coordinateToSee = isPlayerOne ? coordinatePlayer2 : coordinatePlayer1;
        let coordinate = Number.parseInt(isPlayerOne ? coordinatePlayer1 : coordinatePlayer2);

        if (String(coordinate + 1) === coordinateToSee || String(coordinate - 1) === coordinateToSee ||
            String(coordinate + 10) === coordinateToSee || String(coordinate - 10) === coordinateToSee)
            return true;

        return this.canSeeSquare(coordinateToSee, isPlayerOne);
    }
}

export { VisibilityMatrix };