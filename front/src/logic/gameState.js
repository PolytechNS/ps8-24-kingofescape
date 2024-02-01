class gameState {
    constructor(character) {
        this.wallsPlayer1 = [];
        this.wallsPlayer2 = [];
        this.character = character;
        this.otherCharacter = null;
        this.turn = 0;
    }

    addVisibileCharacter(character) {
        this.otherCharacter = character;
    }

    removeVisibleCharacter() {
        this.otherCharacter = null;
    }

    addWall(wall, isPlayerOne) {
        if (isPlayerOne)
            this.wallsPlayer1.push(wall);
        else
            this.wallsPlayer2.push(wall);
    }
}

exports.GameState = gameState;