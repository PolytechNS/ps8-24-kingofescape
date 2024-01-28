class VisibilityMatrix {
    constructor(coordonnee1, coordonnee2) {
        this.visibilityMatrix = [];
        this.buildVisibilityMatrice();

        if (coordonnee1 && coordonnee2) {
            let valueCoordinateX = [1, 0, -1, 0];
            let valueCoordinateY = [0, 1, 0, -1];

            for (let i = 0; i < 4; i++) {
                this.updateMatrixValue(coordonnee1.x + valueCoordinateX[i], coordonnee1.y + valueCoordinateY[i], 1);
            }
        }
    }

    buildVisibilityMatrice() {
        this.fillMatrix(0, 4, -1);
        this.fillMatrix(4, 5, 0);
        this.fillMatrix(5, 9, 1);
    }

    fillMatrix(indexYStart, indexYEnd, value) {
        for (let i = indexYStart; i < indexYEnd; i++) {
            let line = [];

            for (let j = 0; j < 9; j++) {
                line.push(value);
            }

            this.visibilityMatrix.push(line);
        }
    }

    updateMatrixWall(wall, isPlayerOne) {
        const coordinate1 = wall.coordinate1;
        const coordinate4 = wall.coordinate4;
        let multiply = isPlayerOne ? 1 : -1;

        this.visibilityMatrix[coordinate1.x][coordinate1.y] += multiply * 2;
        this.visibilityMatrix[coordinate4.x][coordinate4.y] += multiply * 2;
        this.visibilityMatrix[coordinate1.x][coordinate4.y] += multiply * 2;
        this.visibilityMatrix[coordinate4.x][coordinate1.y] += multiply * 2;

        this.updateMatrixValue(coordinate1.x - 1, coordinate1.y, multiply);
        this.updateMatrixValue(coordinate1.x - 1, coordinate1.y + 1, multiply);
        this.updateMatrixValue(coordinate1.x, coordinate1.y + 2, multiply);
        this.updateMatrixValue(coordinate1.x + 1, coordinate1.y + 2, multiply);
        this.updateMatrixValue(coordinate1.x + 2, coordinate1.y + 1, multiply);
        this.updateMatrixValue(coordinate1.x + 2, coordinate1.y, multiply);
        this.updateMatrixValue(coordinate1.x + 1, coordinate1.y - 1, multiply);
        this.updateMatrixValue(coordinate1.x, coordinate1.y - 1, multiply);
    }

    updateMoveCharacter(oldCoordinate, newCoordinate, isPlayerOne) {
        let multiply = isPlayerOne ? 1 : -1;
        let valueCoordinateX = [1, 0, -1, 0, 0];
        let valueCoordinateY = [0, 1, 0, -1, 0];

        for (let i = 0; i < 4; i++) {
            this.updateMatrixValue(oldCoordinate.x + valueCoordinateX[i], oldCoordinate.y + valueCoordinateY[i], multiply);
        }

        for (let i = 0; i < 4; i++) {
            this.updateMatrixValue(newCoordinate.x + valueCoordinateX[i], newCoordinate.y + valueCoordinateY[i], -multiply);
        }
    }

    canSeeSquare(coordinate, isPlayerOne) {
        return isPlayerOne? this.visibilityMatrix[coordinate.x][coordinate.y] >= 0 :
            this.visibilityMatrix[coordinate.x][coordinate.y] <= 0;
    }

    updateMatrixValue(x, y, multiply) {
        if (x >= 0 && x < 9 && y >= 0 && y < 9)
            this.visibilityMatrix[x][y] += multiply * 1;
    }
}

exports.VisibilityMatrix = VisibilityMatrix;