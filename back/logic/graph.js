import {Coordinate} from "./coordinate";

class Graph {
    /**
     * Class constructor
     */
    constructor() {
        this.graph = new Map();
    }

    /**
     * Add vertex to the graph
     * @param vertex
     */
    addVertex(vertex) {
        this.graph.set(vertex, new Set());
    }

    /**
     * Add link between two vertex
     * @param vertex first vertex
     * @param node second vertex
     */
    addEdge(vertex, node) {
        if (this.graph.has(vertex) && this.graph.has(node)) {
            this.graph.get(vertex).add(node);
            this.graph.get(node).add(vertex);
        }
    }

    verifyEdge(vertex, node) {
        if (this.graph.has(vertex) && this.graph.has(node)) {
            return this.graph.get(vertex).has(node);
        }
        return false;
    }

    addWall(wall) {
        let tuple1 = wall.coordinate1.toNumber();
        let tuple4 = wall.coordinate4.toNumber();
        let tuple2 = Coordinate.toNumberXY(wall.coordinate4.x, wall.coordinate1.y);
        let tuple3 = Coordinate.toNumberXY(wall.coordinate1.x, wall.coordinate4.y);
        let boolVerify1 = this.verifyEdge(tuple1, tuple2);
        let boolVerify2 = this.verifyEdge(tuple3, tuple4);
        let boolVerify3 = this.verifyEdge(tuple1, tuple3);
        let boolVerify4 = this.verifyEdge(tuple2, tuple4);

        if (wall.isVertical && boolVerify1 && boolVerify2 && !(boolVerify3 && boolVerify4)) {
            this.deleteEdge(tuple1, tuple2);
            this.deleteEdge(tuple3, tuple4);
            return true;
        }
        else if (!wall.isVertical && boolVerify3 && boolVerify4 && !(boolVerify1 && boolVerify2)) {
            this.deleteEdge(tuple1, tuple3);
            this.deleteEdge(tuple2, tuple4);
            return true;
        }

        return false;
    }

    /**
     * Delete link between two vertex
     * @param vertex first vertex
     * @param node second vertex
     */
    deleteEdge(vertex, node) {
        if (this.graph.has(vertex) && this.graph.has(node)) {
            this.graph.get(vertex).delete(node);
            this.graph.get(node).delete(vertex);
        }
    }

    /**
     * Print the graph
     */
    print() {
        for (let [key, value] of this.graph) {
            console.log(key, value);
        }
    }
}

/**
 * Initialize the graph
 * @returns {Graph} graph class initialized
 */
export function initGraph() {
    let graph = new Graph();
    let matrice = []

    // create the matrice with coordinates x, y in string
    for (let i = 0; i < 9; i++) {
        matrice[i] = [];
        for (let j = 0; j < 9; j++) {
            matrice[i][j] = Coordinate.toNumberXY(i, j);
        }
    }

    // add all squares in the graph
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            graph.addVertex(matrice[i][j]);
        }
    }

    // Allow to give link between squares with orientation (right, left, up, down)
    addOrientationEdgeGraph(graph, matrice, 0, 1, 9, 9, 0, -1);
    addOrientationEdgeGraph(graph, matrice, 1, 0, 9, 9, -1, 0);
    addOrientationEdgeGraph(graph, matrice, 0, 0, 8, 9, 1, 0);
    addOrientationEdgeGraph(graph, matrice, 0, 0, 9, 8, 0, 1);

    return graph;
}

/**
 * Add all edges in the graph with the orientation
 * @param graph graph class
 * @param matrice matrice with coordinates x, y in string
 * @param startI start index i
 * @param startJ start index j
 * @param endI end index i
 * @param endJ end index j
 * @param gapI gap index i
 * @param gapJ gap index j
 */
function addOrientationEdgeGraph(graph, matrice, startI, startJ, endI, endJ, gapI, gapJ) {
    for (let i = startI; i < endI; i++) {
        for (let j = startJ; j < endJ; j++) {
            graph.addEdge(matrice[i][j], matrice[i + gapI][j + gapJ]);
        }
    }
}