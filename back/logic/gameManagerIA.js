import {GameManager} from "../../front/src/logic/gameManager.js";
import {computeMove} from "./ai.js";
class GameManagerIA {
    constructor(aiPlay) {
        this.gameManager = new GameManager();
        this.aiPlay = aiPlay;

        if (aiPlay === 1)
            this.playTurnAI();
    }

    playTurnAI() {
        let move = computeMove(this.gameManager);
        console.log(move);
        this.gameManager.moveCharacters(move);
        this.update(this.isPlayerOne());
        return move;
    }

    placeWall(wall) {
        return this.gameManager.placeWall(wall);
    }

    moveCharacters(newCoordinate) {
        return this.gameManager.moveCharacters(newCoordinate);
    }

    update(isPlayerOne) {
        this.gameManager.update(isPlayerOne);
    }

    getOtherPlayer(isPlayerOne) {
        return this.gameManager.getOtherPlayer(isPlayerOne);
    }

    isPlayerOne() {
        return this.gameManager.isPlayerOne();
    }

    isEndGame() {
        return this.gameManager.isEndGame();
    }
}

export {GameManagerIA};