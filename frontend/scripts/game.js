import createGame  from "./gameLogicInterface.js"
import { drawGame, drawGrid } from "./gameUI.js"

const GAME_TICK_INTERVAL_MS = 1000;

let game = initialiseGame();

function initialiseGame() {
    let game = createGame();

    drawGrid();
    setupControls();

    console.log(game);

    // Start the game loop
    setInterval(() => {
        game.gameTick();
        drawGame(game);
    }, GAME_TICK_INTERVAL_MS);

    return game;
}

function setupControls() {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            
            case 'ArrowLeft':
                game.moveLeft();
                drawGame(game);
                break;
            case 'ArrowRight':
                game.moveRight();
                drawGame(game);
                break;
            case 'ArrowUp':
                game.rotateTetrominoClockwise();
                drawGame(game);
                break;
            case 'ArrowDown':
                // TODO: implement soft drop
                
            case ' ': // Space
                game.instantDropTetromino();
                drawGame(game);
                break;
            case 'c':
            case 'C':
                game.holdCurrentTetromino();
                drawGame(game);
                break;
            case 'z':
            case 'Z':
                game.rotateTetrominoAntiClockwise();
                drawGame(game);
                break;
        }
    });
}