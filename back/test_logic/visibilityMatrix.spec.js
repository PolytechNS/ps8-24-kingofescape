const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const VisibilityMatrix = require('../logic/visibilityMatrix.js').visibilityMatrix;

function verifyPosition(x, y, value, visibilityMatrix) {
    if (x >= 0 && x <= 8 && y >= 0 && y <= 8)
        assert.strictEqual(visibilityMatrix.matrix[x][y], value);
}

describe('visibilityMatrix', () => {
    it('return 4 lines of value -1, 1 line of value 0, 4 lines of value 1', () => {
        let visibilityMatrix = new VisibilityMatrix();

        for (let i = 0; i < 4; i++)
            assert.strictEqual(visibilityMatrix.matrix[i].every((value) => value <= -1), true);
        assert.strictEqual(visibilityMatrix.matrix[4].every((value) => value === 0), true);
        for (let i = 5; i < 9; i++)
            assert.strictEqual(visibilityMatrix.matrix[i].every((value) => value >= 1), true);
    });

    it('return value 2 in player 1 coordinate, value -2 in player 2 coordinate', () => {
        let coordinatePlayer1X = 8;
        let coordinatePlayerY = 4;
        let coordinatePlayer2X = 0;
        let coordinatePlayer1 = String(coordinatePlayerY + 1) + String(9 - coordinatePlayer1X);
        let coordinatePlayer2 = String(coordinatePlayerY + 1) + String(9 - coordinatePlayer2X);

        let xArray = [0, 1, 0, -1, 0];
        let yArray = [0, 0, 1, 0, -1];
        let visibilityMatrix = new VisibilityMatrix(coordinatePlayer1, coordinatePlayer2);

        for (let i = 0; i < 5; i++) {
            verifyPosition(coordinatePlayer1X + xArray[i], coordinatePlayerY + yArray[i], 2, visibilityMatrix);
            verifyPosition(coordinatePlayer2X + xArray[i], coordinatePlayerY + yArray[i], -2, visibilityMatrix);
        }
    });

    it('move player 1 to the right', () => {
        let coordinatePlayer1X = 8;
        let oldCoordinatePlayerY = 4;
        let newCoordinatePlayerY = 5;
        let oldCoordinatePlayer1 = "51";
        let newCoordinatePlayer1 = "61";

        let xArray = [0, 1, 0, -1, 0];
        let yArray = [0, 0, 1, 0, -1];

        let visibilityMatrix = new VisibilityMatrix(oldCoordinatePlayer1, "59");
        visibilityMatrix.movePlayer(oldCoordinatePlayer1, newCoordinatePlayer1, true);

        for (let i = 0; i < 5; i++) {
            verifyPosition(coordinatePlayer1X + xArray[i], newCoordinatePlayerY + yArray[i], 2, visibilityMatrix);

            if (i !== 0 && i !== 2)
                verifyPosition(coordinatePlayer1X + xArray[i], oldCoordinatePlayerY + yArray[i], 1, visibilityMatrix);
        }
    });

    it('move player 2 to the front', () => {
        let oldCoordinatePlayer2X = 0;
        let newCoordinatePlayer2X = 1;
        let coordinatePlayerY = 4;
        let oldCoordinatePlayer2 = "59";
        let newCoordinatePlayer2 = "58";

        let xArray = [0, 1, 0, -1, 0];
        let yArray = [0, 0, 1, 0, -1];

        let visibilityMatrix = new VisibilityMatrix("51", oldCoordinatePlayer2);
        visibilityMatrix.movePlayer(oldCoordinatePlayer2, newCoordinatePlayer2, false);

        for (let i = 0; i < 5; i++) {
            verifyPosition(newCoordinatePlayer2X + xArray[i], coordinatePlayerY + yArray[i], -2, visibilityMatrix);

            if (i !== 0 && i !== 1)
                verifyPosition(oldCoordinatePlayer2X + xArray[i], coordinatePlayerY + yArray[i], -1, visibilityMatrix);
        }
    });

    it ('place wall in position 64 in vertical', () => {
        let wall = ["64", 1];

        let visibilityMatrix = new VisibilityMatrix("63", "59");
        visibilityMatrix.placeWall(wall, false);

        let visibilityMatrixExpected = [
            [0, 0, 0, 0, 0, -1, -1, 0, 0],
            [1, 1, 1, 1, 0, 0, -1, 0, 1],
            [1, 1, 1, 1, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 1, 1]
        ]

        for (let i = 4; i < 8; i++) {
            for (let j = 0; j < 9; j++) {
                assert.strictEqual(visibilityMatrix.matrix[i][j], visibilityMatrixExpected[i - 4][j]);
            }
        }
    })

    it ('place 2 walls in position 58 in horizontal, 68 in vertical', () => {
        let wall1 = ["58", 0];
        let wall2 = ["68", 1];

        let visibilityMatrix = new VisibilityMatrix("63", "48");
        visibilityMatrix.placeWall(wall1, true);
        visibilityMatrix.placeWall(wall2, true);

        let visibilityMatrixExpected = [
            [-1, -1, -1, -2, 0, 1, 0, -1, -1],
            [-1, -1, -2, -1, 1, 3, 2, 0, -1],
            [-1, -1, -1, -1, 2, 3, 2, 0, -1],
            [-1, -1, -1, -1, 0, 1, 0, -1, -1]
        ]

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 9; j++) {
                assert.strictEqual(visibilityMatrix.matrix[i][j], visibilityMatrixExpected[i][j]);
            }
        }
    })
});