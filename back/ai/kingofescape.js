let graph;
let position;
let positionOtherIA;
let AIPlay;
let turn = 0;
let lastMove;
let numberOwnWalls = 0;

class GraphIA {
    constructor() {
        this.graph = new Map();
        this.wall = new Map();
        this.#initGraph();
    }

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

    verifyPossibilityToPlaceWall(wall) {
        let coordinate1 = wall[0];
        let coordinate2 = String(Number.parseInt(coordinate1) + 10);
        let coordinate3 = String(Number.parseInt(coordinate1) - 1);
        let coordinate4 = String(Number.parseInt(coordinate1) + 9);

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

    addWall(wall) {
        let numberPosition1 = Number.parseInt(wall[0]);
        let position1 = wall[0];
        let position2 = String(numberPosition1 + 10);
        let position3 = String(numberPosition1 - 1);
        let position4 = String(numberPosition1 + 9);

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

    getAllWall() {
        return [...this.wall].filter(wall => wall[1] === -1);
    }

    removeWall(wall) {
        let numberPosition1 = Number.parseInt(wall[0]);
        let position1 = wall[0];
        let position2 = String(numberPosition1 + 10);
        let position3 = String(numberPosition1 - 1);
        let position4 = String(numberPosition1 + 9);

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

    verifyEdge(coordinate1, coordinate2) {
        if (this.graph.has(coordinate1))
            return this.graph.get(coordinate1).has(coordinate2);

        return false;
    }

    addEdgeMap(map, vertex, node) {
        map.get(vertex).add(node);
        map.get(node).add(vertex);
    }

    deleteEdgeMap(map, vertex, node) {
        map.get(vertex).delete(node);
        map.get(node).delete(vertex);
    }
}

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

function evaluate(gameState) {
    let distance = shortestPath(gameState.position, (AIPlay === 1) ? "99" : "11");
    let distanceOtherIA = shortestPath(gameState.positionOtherIA, (AIPlay === 2) ? "99" : "11");

    if (distanceOtherIA.length === 0)
        return -Infinity;
    return distanceOtherIA.length - distance.length;
}

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

function minimax(gameState, alpha, beta, depth, isMaximing) {
    if (depth === 0)
        return evaluate(gameState, positionOtherIA);

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

function nextMove(gameState) {
    position = undefined;
    let time = performance.now();
    getPlayers(gameState.board);
    for (let wall of gameState.opponentWalls)
        graph.addWall(wall);

    let move = heuristique(gameState);
    console.log(performance.now() - time);
    lastMove = move;
    return move;
}

function correction(rightMove) {
    if (lastMove.action === "wall") {
        graph.addWall(lastMove.value);
    }

    return true;
}

function updateBoard(gameState) {
    positionOtherIA = undefined;
    numberOwnWalls = gameState.ownWalls.length;
    getPlayers(gameState.board);

    for (let wall of gameState.ownWalls)
        graph.addWall(wall);
    return true;
}

//setup(1);

exports.setup = setup;
exports.nextMove = nextMove;
exports.correction = correction;
exports.updateBoard = updateBoard;