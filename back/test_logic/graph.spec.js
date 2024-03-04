const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const Graph = require('../logic/graph.js').graph;

describe('graph', () => {
    it('constructor graph', () => {
        let graph = new Graph();
        assert.strictEqual(graph.graph.size, 81);
        graph.graph.forEach((value, key) => {
            assert.strictEqual(value.size <= 4 && value.size >= 2, true);
        })
    });

    it('place wall in coordinate 58 in horizontal', () => {
        let graph = new Graph();
        let wall = graph.placeWall(["58", 1], "48", "63");

        assert.strictEqual(wall[0], "58");
        assert.strictEqual(wall[1], 1);
        assert.strictEqual(graph.graph.get("58").size, 3);
        assert.strictEqual(graph.graph.get("57").size, 3);
        assert.strictEqual(graph.graph.get("68").size, 3);
        assert.strictEqual(graph.graph.get("67").size, 3);

        assert.strictEqual(graph.graph.get("58").has("68"), false);
        assert.strictEqual(graph.graph.get("57").has("67"), false);
        assert.strictEqual(graph.graph.get("68").has("58"), false);
        assert.strictEqual(graph.graph.get("67").has("57"), false);
    });

    it('place wall in coordinate 68 in horizontal', () => {
        let graph = new Graph();
        let wall = graph.placeWall(["68", 0], "48", "63");

        assert.strictEqual(wall[0], "68");
        assert.strictEqual(wall[1], 0);
        assert.strictEqual(graph.graph.get("68").size, 3);
        assert.strictEqual(graph.graph.get("78").size, 3);
        assert.strictEqual(graph.graph.get("67").size, 3);
        assert.strictEqual(graph.graph.get("77").size, 3);

        assert.strictEqual(graph.graph.get("68").has("67"), false);
        assert.strictEqual(graph.graph.get("78").has("77"), false);
        assert.strictEqual(graph.graph.get("67").has("68"), false);
        assert.strictEqual(graph.graph.get("77").has("78"), false);
    });

    it('place wall in coordinate 99', () => {
        let graph = new Graph();
        assert.throws(() => {graph.placeWall(["99", 1], "48", "63")}, Error, 'Impossible to place wall.');
        //assert.AssertionError(, 'This wall block player.');
    });

    it('place 2 wall in coordinate 19 on horizontal and vertical', () => {
        let graph = new Graph();
        graph.placeWall(["19", 0], "48", "63");
        assert.throws(() => {graph.placeWall(["19", 1], "48", "63")}, Error, 'Impossible to place wall.');
    });

    it('block player one', () => {
        let graph = new Graph();
        graph.placeWall(["18", 0], "19", "63");
        assert.throws(() => {graph.placeWall(["29", 1], "48", "19")}, Error, 'This wall block player.');
    })
});