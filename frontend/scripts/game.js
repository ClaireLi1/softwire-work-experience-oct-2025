import createGame  from "./gameLogicInterface.js"
import { drawGame, drawGrid } from "./gameUI.js"

const GAME_TICK_INTERVAL_MS = 1000;

let game = initialiseGame();
gameLoop();

function initialiseGame() {
    let game = createGame();

    drawGrid();
    drawGame(game);

    console.log(game);

    return game;
}

function gameLoop() {
    setInterval(() => {
        game.gameTick();
        drawGame(game);
        
    }, GAME_TICK_INTERVAL_MS);    
}