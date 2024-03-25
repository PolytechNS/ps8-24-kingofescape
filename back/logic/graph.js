/**
 * Class representing a graph.
 */
class Graph {
    /**
     * Constructor of graph.
     */
    constructor() {
        this.graph = new Map();
        this.#initGraph();
    }

    /**
     * Initialize the graph.
     */
    #initGraph() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let set = new Set();
                let position = (j + 1) * 10 + (9 - i);

                if (i !== 0)
                    set.add(String(position + 1));
                if (i !== 8)
                    set.add(String(position - 1));
                if (j !== 0)
                    set.add(String(position - 10));
                if (j !== 8)
                    set.add(String(position + 10));

                this.graph.set(String(position), set);
            }
        }
    }

    /**
     * Verify if there don't have wall in this position.
     * @param coordinate1 - The first coordinate. (ex: "19")
     * @param coordinate2 - The second coordinate. (ex: "29")
     * @param coordinate3 - The third coordinate. (ex: "18")
     * @param coordinate4 - The fourth coordinate. (ex: "28")
     * @param isVertical - The orientation of the wall. (0 for horizontal, 1 for vertical)
     * @returns {boolean} - True if it's possible to place the wall, else false.
     */
    #verifyPossibilityToPlaceWall(coordinate1, coordinate2, coordinate3, coordinate4, isVertical) {
        let edgeAvailable12 = this.verifyEdge(coordinate1, coordinate2);
        let edgeAvailable13 = this.verifyEdge(coordinate1, coordinate3);
        let edgeAvailable24 = this.verifyEdge(coordinate2, coordinate4);
        let edgeAvailable34 = this.verifyEdge(coordinate3, coordinate4);

        if (isVertical === 1 && edgeAvailable12 && edgeAvailable34 && !(!edgeAvailable13 && !edgeAvailable24))
            return true;
        else if (isVertical === 0 && edgeAvailable13 && edgeAvailable24 && !(!edgeAvailable12 && !edgeAvailable34))
            return true;
        return false;
    }

    /**
     * Place a wall in the graph.
     * @param wall - The wall to place ['yx', 1 or 0].
     * @param positionPlayerOne - The position of the player one. (ex: "19")
     * @param positionPlayerTwo - The position of the player two. (ex: "91")
     * @returns wall - The wall placed.
     * @throws Error - If it's impossible to place the wall.
     * @throws Error - If the wall block a player.
     */
    placeWall(wall, positionPlayerOne, positionPlayerTwo) {
        let numberCoordinate = Number.parseInt(wall[0]);
        let coordinate1 = wall[0];
        let coordinate2 = String(numberCoordinate + 10);
        let coordinate3 = String(numberCoordinate - 1);
        let coordinate4 = String(numberCoordinate + 9);

        if (this.#verifyPossibilityToPlaceWall(coordinate1, coordinate2, coordinate3, coordinate4, wall[1])) {
            let mapTest = new Map([...this.graph].map(([key, value]) => [key, new Set(value)]));

            if (wall[1] === 1) {
                this.#deleteEdge(mapTest, coordinate1, coordinate2);
                this.#deleteEdge(mapTest, coordinate3, coordinate4);
            }
            else {
                this.#deleteEdge(mapTest, coordinate1, coordinate3);
                this.#deleteEdge(mapTest, coordinate2, coordinate4);
            }

            if (this.#bfs(mapTest, positionPlayerOne, "19") && this.#bfs(mapTest, positionPlayerTwo, "91")) {
                this.graph = mapTest;
                return wall;
            }
            else
                throw new Error('This wall block player.');
        }
        else
            throw new Error('Impossible to place wall.');
    }


    /**
     * Apply the bfs algorithm for verify move Character.
     * @param map - The map to verify.
     * @param position - The position of the character.
     * @param positionToGoal - The position to go.
     * @returns {boolean} - True if it's possible to move, else false.
     */
    #bfs(map, position, positionToGoal) {
        let visited = new Map();

        for (let key of map.keys())
            visited.set(key, false);

        let queue = [];
        queue.push(position);

        while (queue.length !== 0) {
            let current = queue.pop();

            if (!visited.get(current)) {
                visited.set(current, true);

                // If the current position X is the goal position X, return true.
                if (current[1] === positionToGoal[1])
                    return true;

                for (let neighbor of map.get(current)) {
                    if (!visited.get(neighbor))
                        queue.push(neighbor);
                }
            }
        }

        return false;
    }

    /**
     * Verify if there is an edge between two coordinates.
     * @param coordinate1 - The first coordinate.
     * @param coordinate2 - The second coordinate.
     * @returns {boolean} - True if there is an edge, else false.
     */
    verifyEdge(coordinate1, coordinate2) {
        if (this.graph.has(coordinate1))
            return this.graph.get(coordinate1).has(coordinate2);

        return false;
    }

    /**
     * Delete an edge between two coordinates in graph.
     * @param map - The graph.
     * @param coordinate1 - The first coordinate.
     * @param coordinate2 - The second coordinate.
     */
    #deleteEdge(map, coordinate1, coordinate2) {
        map.get(coordinate1).delete(coordinate2);
        map.get(coordinate2).delete(coordinate1);
    }
}

exports.graph = Graph;