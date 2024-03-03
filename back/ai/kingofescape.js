// Default variable

let graph;
let position;
let positionOtherIA;
let AIPlay;
let turn = 0;
let lastMove;
let numberOwnWalls = 0;


/**
 * Graph for the IA
 */
class GraphIA {
    /**
     * Default Constructor of the class GraphIA
     */
    constructor() {
        this.graph = new Map();
        this.wall = new Map();
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

                if (i !== 8 && j !== 8)
                    this.wall.set(String(position), -1);
            }
        }
    }

    /**
     * Verify if it's possible to place a wall.
     * @param wall - The wall to place ['yx', 0 || 1].
     * @returns {boolean} - True if it's possible to place the wall, else false.
     */

    verifyPossibilityToPlaceWall(wall) {
        // Get the 4 coordinate of wall
        let coordinate1 = wall[0];
        let coordinate2 = String(Number.parseInt(coordinate1) + 10);
        let coordinate3 = String(Number.parseInt(coordinate1) - 1);
        let coordinate4 = String(Number.parseInt(coordinate1) + 9);

        // Verify if edge available to place wall
        let edgeAvailable12 = this.verifyEdge(coordinate1, coordinate2);
        let edgeAvailable13 = this.verifyEdge(coordinate1, coordinate3);
        let edgeAvailable24 = this.verifyEdge(coordinate2, coordinate4);
        let edgeAvailable34 = this.verifyEdge(coordinate3, coordinate4);

        if (wall[1] === 1 && edgeAvailable12 && edgeAvailable34 && !(!edgeAvailable13 && !edgeAvailable24))
            return true;
        else if (wall[1] === 0 && edgeAvailable13 && edgeAvailable24 && !(!edgeAvailable12 && !edgeAvailable34))
            return true;
        return false;
    }

    /**
     * Add a wall to the graph.
     * @param wall - The wall to place ['yx', 0 || 1].
     */
    addWall(wall) {
        // Get the 4 coordinate of wall
        let numberPosition1 = Number.parseInt(wall[0]);
        let position1 = wall[0];
        let position2 = String(numberPosition1 + 10);
        let position3 = String(numberPosition1 - 1);
        let position4 = String(numberPosition1 + 9);

        // Depending on orientation, delete the 2 edge in horizontal or vertical
        if (wall[1] === 1) {
            this.deleteEdgeMap(this.graph, position1, position2);
            this.deleteEdgeMap(this.graph, position3, position4);
        }
        else {
            this.deleteEdgeMap(this.graph, position1, position3);
            this.deleteEdgeMap(this.graph, position2, position4);
        }

        this.wall.set(position1, wall[1]);
    }

    /**
     * Get all the wall.
     * @returns {string[][]} get all Wall with value ['yx', 0 || 1].
     */
    getAllWall() {
        return [...this.wall].filter(wall => wall[1] === -1);
    }

    /**
     * Remove wall in the graph for simulate move in graph
     * @param wall - The wall to remove ['yx', 0 || 1].
     */
    removeWall(wall) {
        // Get the 4 coordinate of wall
        let numberPosition1 = Number.parseInt(wall[0]);
        let position1 = wall[0];
        let position2 = String(numberPosition1 + 10);
        let position3 = String(numberPosition1 - 1);
        let position4 = String(numberPosition1 + 9);

        // In order of orientation, add the 2 edge in horizontal or vertical
        if (wall[1] === 1) {
            this.addEdgeMap(this.graph, position1, position2);
            this.addEdgeMap(this.graph, position3, position4);
        }
        else {
            this.addEdgeMap(this.graph, position1, position3);
            this.addEdgeMap(this.graph, position2, position4);
        }

        this.wall.set(position1, -1);
    }

    /**
     * Verify if exist an edge for move a player
     * @param coordinate1 - the coordinate one of edge
     * @param coordinate2 - the coordinate two of edge
     * @returns {boolean} - True if it exists an edge
     */
    verifyEdge(coordinate1, coordinate2) {
        if (this.graph.has(coordinate1))
            return this.graph.get(coordinate1).has(coordinate2);

        return false;
    }

    /**
     * Add an edge in the graph
     * @param map - the graph
     * @param vertex - the vertex to add in node
     * @param node - the node to add in vertex
     */
    addEdgeMap(map, vertex, node) {
        map.get(vertex).add(node);
        map.get(node).add(vertex);
    }

    /**
     * Delete an edge in the graph
     * @param map - the graph
     * @param vertex - the vertex to remove in node
     * @param node - the node to remove in vertex
     */
    deleteEdgeMap(map, vertex, node) {
        map.get(vertex).delete(node);
        map.get(node).delete(vertex);
    }
}

/**
 * Get the shortest Path between two position
 * @param position - The position of the player
 * @param positionXToGoal - The position X of the goal
 * @returns {string[]} - The shortest path between the two position
 */
function shortestPath(position, positionXToGoal) {
    let distances = new Map();
    let previous = new Map();
    let visited = new Set();

    graph.graph.forEach((_, vertex) => {
        distances.set(vertex, Infinity);
    });
    distances.set(position, 0);

    // Algorithme de Dijkstra
    while (visited.size < graph.graph.size) {
        let minVertex = null;
        let minDistance = Infinity;

        // Trouver le prochain sommet non visité avec la plus petite distance
        graph.graph.forEach((_, vertex) => {
            if (!visited.has(vertex) && distances.get(vertex) < minDistance) {
                minVertex = vertex;
                minDistance = distances.get(vertex);
            }
        });

        if (minVertex === null) {
            break;
        }

        // Marquer le sommet comme visité
        visited.add(minVertex);

        // Mettre à jour les distances des voisins non visités
        graph.graph.get(minVertex).forEach(neighbor => {
            if (!visited.has(neighbor)) {
                let distance = distances.get(minVertex) + 1; // Poids de l'arête = 1 dans ce cas
                if (distance < distances.get(neighbor)) {
                    distances.set(neighbor, distance);
                    previous.set(neighbor, minVertex);
                }
            }
        });
    }

    // Reconstitution du chemin le plus court jusqu'à la case 9X
    let path = [];

    for (let i = 1; i < 10; i++) {
        let p = [];
        let vertex = i + positionXToGoal[1];

        while (vertex !== position) {
            p.unshift(vertex);
            vertex = previous.get(vertex);

            if (vertex === undefined) {
                p = [];
                break;
            }
        }

        if (path.length === 0 || path.length > p.length) {
            path = p;
        }
    }

    path.unshift(position);
    return path;
}

/**
 * Evaluate the game state for score minimax
 * @param gameState - The game state
 * @returns {number} - The score of the game state depending on the position of the player
 */
function evaluate(gameState) {
    let distance = shortestPath(gameState.position, (AIPlay === 1) ? "99" : "11");
    let distanceOtherIA = shortestPath(gameState.positionOtherIA, (AIPlay === 2) ? "99" : "11");

    if (distanceOtherIA.length === 0)
        return -Infinity;
    return distanceOtherIA.length - distance.length;
}

/**
 * Get all the moves for the IA
 * @param position - The position of the player
 * @returns {*[]} - All the moves possible for the IA
 */
function getAllMoves(position) {
    let walls = graph.getAllWall();
    let moves = [];
    let numberPosition = Number.parseInt(position);

    let coordinateLeft = String(numberPosition - 10);
    if (numberPosition > 20 && graph.verifyEdge(position, coordinateLeft))
        moves.push({move: coordinateLeft});

    let coordinateRight = String(numberPosition + 10);
    if (numberPosition < 90 && graph.verifyEdge(position, coordinateRight))
        moves.push({move: coordinateRight});

    let coordinateDown = String(numberPosition - 1);
    if (numberPosition % 10 !== 1 && graph.verifyEdge(position, coordinateDown))
        moves.push({move: coordinateDown});

    let coordinateUp = String(numberPosition + 1);
    if (numberPosition % 10 !== 9  && graph.verifyEdge(position, coordinateUp))
        moves.push({move: coordinateUp});

    for (let value of walls) {
        if (value[1] === -1) {
            if (graph.verifyPossibilityToPlaceWall([value[0], 0]))
                moves.push({wall: [value[0], 0]})

            if (graph.verifyPossibilityToPlaceWall([value[0], 1]))
                moves.push({wall: [value[0], 1]})
        }
    }

    return moves;
}

/**
 * Initialisation of Minimax algorithm for the IA
 * @param gameState - The game state containing the positions of players
 * @param alpha - The alpha value for the alpha-beta pruning
 * @param beta - The beta value for the alpha-beta pruning
 * @param depth - The depth of the minimax algorithm
 * @returns {*} - The best move for the IA depending on the depth
 */
function minimaxBegin(gameState, alpha, beta, depth) {
    let maxEval = -Infinity;
    let bestMove;
    let moves = getAllMoves(gameState.position);

    for (let value of moves) {
        if (value.wall !== undefined) {
            graph.addWall(value.wall);
            let eval = minimax(gameState, alpha, beta, depth - 1, false);

            if (eval > maxEval) {
                maxEval = eval;
                bestMove = value;
            }

            alpha = Math.max(alpha, eval);
            graph.removeWall(value.wall);
            if (beta <= alpha)
                break;
        }
        else {
            let latestPosition = gameState.position;
            gameState.position = value.move;
            let eval = minimax(gameState, alpha, beta, depth - 1, false);

            if (eval > maxEval) {
                maxEval = eval;
                bestMove = value;
            }

            alpha = Math.max(alpha, eval);
            gameState.position = latestPosition
            if (beta <= alpha)
                break;
        }
    }

    return bestMove;
}


/**
 * Minimax algorithm for the IA
 * @param gameState - The game state containing the positions of players
 * @param alpha - The alpha value for the alpha-beta pruning
 * @param beta - The beta value for the alpha-beta pruning
 * @param depth - The depth of the minimax algorithm
 * @param isMaximing - if is the maximing player
 * @returns {number} - The score of the game state depending on the position of the player
 */
function minimax(gameState, alpha, beta, depth, isMaximing) {
    if (depth === 0)
        return evaluate(gameState);

    if (isMaximing) {
        let maxEval = -Infinity;
        let moves = getAllMoves(gameState.position);

        for (let value of moves) {
            if (value.wall !== undefined) {
                graph.addWall(value.wall);
                let eval = minimax(gameState, alpha, beta, depth - 1, false);

                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                graph.removeWall(value.wall);

                if (beta <= alpha)
                    break;
            }
        }

        return maxEval;
    }
    else {
        let minEval = Infinity;
        let moves = getAllMoves(gameState.positionOtherIA);

        for (let value of moves) {
            if (value.wall !== undefined) {
                graph.addWall(value.wall);
                let eval = minimax(gameState, alpha, beta, depth - 1, true);

                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                graph.removeWall(value.wall);

                if (beta <= alpha)
                    break;
            }
        }

        return minEval;
    }
}

/**
 * Function to send the 3 first move in the IA depending on AIPlay
 * @returns {{action: string, value: (string|number)[]}} - An action and a value
 */
function firstsMoves() {
    if (AIPlay === 1) {
        if (turn === 1) {
            return {action: "wall",value:['49', 0]};
        }
        else if (turn === 2) {
            return {action: "wall", value: ['28', 0]};
        }
        else if (turn === 3) {
            return {action: "wall", value: ['78', 0]};
        }
    }
    else {
        if (turn === 1) {
            return {action: "wall",value: ['53', 0]};
        }
        else if (turn === 2) {
            return {action: "wall", value: ['73', 0]};
        }
        else if (turn === 3) {
            return {action: "wall", value: ['24', 0]};
        }
    }
}

/**
 * Heuristique for the IA
 * @param gameState - The game state containing the positions of players
 * @returns {{action: string, value: ([string,number]|string)}}
 */
function heuristique(gameState) {
    if (turn < 3 && positionOtherIA === undefined) {
        turn++;
        return firstsMoves();
    }
    else if (positionOtherIA === undefined || numberOwnWalls === 10) {
        let move = shortestPath(position, (AIPlay === 1) ? "99" : "11");
        return {action: "move", value: move[1]};
    }
    else {
        let game = {position: position, positionOtherIA: positionOtherIA};
        let move = minimaxBegin(game, -Infinity, Infinity, 1);

        if (move.move === undefined)
            return {action: "wall", value: move.wall};
        else
            return {action: "move", value: move.move};
    }
}

/**
 * Get the position of the players in the board
 * @param board - the board containing the position of the players
 */
function getPlayers(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {

            if (board[i][j] === 1)
                position = String((j + 1) * 10 + (9 - i));
            else if (board[i][j] === 2)
                positionOtherIA = String((j + 1) * 10 + (9 - i));
        }
    }
}

/**
 * Fonction to setup the game of IA
 * @param AiPlay - the number of when the AI should play
 * @returns {string} - The position to start AI depending on the AIPlay
 */
function setup(AiPlay) {
    graph = new GraphIA();
    positionOtherIA = undefined;
    AIPlay = AiPlay;
    turn = 0;

    if (AIPlay === 1)
        position = "41";
    else
        position = "69";

    return position;
}

/**
 * Function to send the move of IA
 * @param gameState - The game state containing the positions of players
 * @returns {{action: string, value: ([string,number]|string)}} - The move of the IA
 */
function nextMove(gameState) {
    position = undefined;

    // Get the time
    let time = performance.now();
    getPlayers(gameState.board);

    // Add wall in the graph
    for (let wall of gameState.opponentWalls)
        graph.addWall(wall);

    // Get the move in heuristique
    let move = heuristique(gameState);

    // Print the time of the move
    console.log(performance.now() - time);

    lastMove = move;
    return move;
}

/**
 * Function if the move is not legal
 */
function correction(rightMove) {
    if (lastMove.action === "wall") {
        graph.addWall(lastMove.value);
    }

    return true;
}

/**
 * After the move of the IA, update the board
 * @param gameState - The game state containing the new positions of players
 * @returns {boolean} - True
 */
function updateBoard(gameState) {
    positionOtherIA = undefined;
    numberOwnWalls = gameState.ownWalls.length;
    getPlayers(gameState.board);

    for (let wall of gameState.ownWalls)
        graph.addWall(wall);
    return true;
}

exports.setup = setup;
exports.nextMove = nextMove;
exports.correction = correction;
exports.updateBoard = updateBoard;