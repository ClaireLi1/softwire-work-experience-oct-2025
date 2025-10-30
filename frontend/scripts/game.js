import { createGame, Tetromino, } from "./gameLogicInterface.js"
import { drawGame, drawGrid, drawUpcomingTetrominoes } from "./gameUI.js"

export var GAME_TICK_INTERVAL_MS = 500;

let game = initialiseGame();

function initialiseGame() {
    let game = createGame();

    drawGrid();
    setupControls();

    console.log(game);

    game.start(() => {
        drawGame(game); // frontend redraws every tick
        drawUpcomingTetrominoes(game);
    });

    return game;
}


function setupControls() {
    document.addEventListener('keydown', (event) => {
        if (!game.isGameOver()) { 
            switch(event.key) {
                
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
                game.spawnPiece(Tetromino.I_Piece);
                drawGame(game);
                break;
            
            case 'j':
            case 'J':
                game.spawnPiece(Tetromino.J_Piece);
                drawGame(game);
                break;
            case 'l':
            case 'L':
                game.spawnPiece(Tetromino.L_Piece);
                drawGame(game);
                break;
            case 'o':
            case 'O':
                game.spawnPiece(Tetromino.O_Piece);
                drawGame(game);
                break;
            case 's':
            case 'S':
                game.spawnPiece(Tetromino.S_Piece);
                drawGame(game);
                break;
            case 't':
            case 'T':
                game.spawnPiece(Tetromino.T_Piece);
                drawGame(game);
                break;
            // case 'z':
            // case 'Z':
            //     game.spawnPiece(Tetromino.Z_Piece);
            //     drawGame(game);
            //     break;
     
            case 'q':
            case 'Q':
                game.increaseSpeedProgress(() => {drawGame(game);
                drawUpcomingTetrominoes(game);
                });
                
                break;
     

    
            /* End debug controls */
        }
    }
    });
}