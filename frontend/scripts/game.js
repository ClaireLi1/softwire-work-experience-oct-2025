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
                game.moveDown();
                drawGame(game);
                break;
                
            case ' ': // Space
                game.instantDropTetromino();
                drawGame(game);
                break;
            case 'c':
            case 'C':
                game.holdCurrentTetromino();
                drawGame(game);
                break;
            // case 'z':
            // case 'Z':
            //     game.rotateTetrominoAntiClockwise();
            //     drawGame(game);
            //     break;
            
            /* Debug controls, will be removed for release */
            case 'i':
            case 'I':
                game.spawnI_Piece();
                drawGame(game);
                break;
            
            case 'j':
            case 'J':
                game.spawnJ_Piece();
                drawGame(game);
                break;
            case 'l':
            case 'L':
                game.spawnL_Piece();
                drawGame(game);
                break;
            case 'o':
            case 'O':
                game.spawnO_Piece();
                drawGame(game);
                break;
            case 's':
            case 'S':
                game.spawnS_Piece();
                drawGame(game);
                break;
            case 't':
            case 'T':
                game.spawnT_Piece();
                drawGame(game);
                break;
            case 'z':
            case 'Z':
                game.spawnZ_Piece();
                drawGame(game);
                break;
            /* End debug controls */
        }
    });
}