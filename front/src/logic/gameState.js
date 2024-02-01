class GameState {
    constructor(character) {
        this.character = character;
        this.wallsPlayer = [];
        this.turn = 0;
    }

    addWall(wall) {
        this.wallsPlayer.push(wall);
    }

    getRestantWall() {
        return 10 - this.wallsPlayer.length;
    }
}

export {GameState};