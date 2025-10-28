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
        updateGame();
        
    }, GAME_TICK_INTERVAL_MS);

    return game;
}

function updateGame() {
    game.gameTick();
    drawGame(game);

    // other things that should happen each game tick to be added here
}

function setupControls() {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowLeft':
                game.moveLeft();
                break;
            case 'ArrowRight':
                game.moveRight();
                break;
            case 'ArrowUp':
                game.rotateTetrominoClockwise();
                break;
            case 'ArrowDown':
                // TODO: implement soft drop
                
            case ' ': // Space
                game.instantDropTetromino();
                break;
            case 'c':
            case 'C':
                game.holdCurrentTetromino();
                break;
            case 'z':
            case 'Z':
                game.rotateTetrominoAntiClockwise();
                break;
        }
        drawGameState();
    });
}