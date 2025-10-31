import { createGame, Tetromino } from "./gameLogicInterface.js"
import { drawGame, drawGrid, drawUpcomingTetrominoes } from "./gameUI.js"

const GAME_TICK_INTERVAL_MS = 1000;

let game = initialiseGame();

function initialiseGame() {
    let game = createGame();

    drawGrid();
    setupControls();

    // Start the game loop
    setInterval(() => {
        drawGame(game);
        drawUpcomingTetrominoes(game);
        game.gameTick();
        
    }, GAME_TICK_INTERVAL_MS);

    return game;
}

function setupControls() {
    // we don't get events when a gamepad button is pushed, so we have to poll for it
    setInterval(pollForGamepadInput, 50)

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
            case 'z':
            case 'Z':
                game.spawnPiece(Tetromino.Z_Piece);
                drawGame(game);
                break;
     

            
            /* End debug controls */
        }
    });
}

// when you rotate by keyboard, your operating system uses a repeat delay
// so if you tap a key, it is sent once per tap, and if you hold it down it repeats after a while
// on controller it repeats immediately which is fine for joystick but unfun for buttons
// this is a workaround for that, to prevent re-rotating too quickly etc
let lastButtonPressTimes = [Date.now(), Date.now(), Date.now(), Date.now()];
const buttonRepeatDelay = 200;

function pollForGamepadInput() {
    // the gamepad list is regenerated every time a button is pressed, so we need to get them every "frame"
    var gamepads = navigator.getGamepads().filter(x=>x!=null)

    if (gamepads.length > 0) {
        var leftInputs = gamepads.filter(gp => gp.axes[0] == -1)
        var rightInputs = gamepads.filter(gp => gp.axes[0] == 1)
        var upInputs = gamepads.filter(gp => gp.axes[1] == -1)
        var downInputs = gamepads.filter(gp => gp.axes[1] == 1)

        if (leftInputs.length > 0 & rightInputs.length == 0 ) {
            game.moveLeft();
        }
        else if (rightInputs.length > 0 & leftInputs.length == 0) {
            game.moveRight();
        }
        else if (downInputs.length > 0 & upInputs.length == 0) {
            game.moveDown();
        }
        // the buttons seem to just be identified by their order in the array
        // on the specific controller we've got at Softwire, the first few buttons are A, B, X, Y
        else if (gamepads.some(x=>x.buttons[0].pressed)) { // A - turn anticlockwise
            var inputTime = Date.now();
            if (inputTime - lastButtonPressTimes[0] > buttonRepeatDelay) {
                lastButtonPressTimes[0] = inputTime;
                game.rotateTetrominoAntiClockwise();
            }
        }
        else if (gamepads.some(x=>x.buttons[1].pressed)) { // B - turn clockwise
            var inputTime = Date.now();
            if (inputTime - lastButtonPressTimes[1] > buttonRepeatDelay) {
                lastButtonPressTimes[1] = inputTime;
                game.rotateTetrominoClockwise();
            }
        }
        else if (gamepads.some(x=>x.buttons[2].pressed)|| gamepads.some(x=>x.buttons[7].pressed)) { // X or RT - drop
            var inputTime = Date.now();
            if (inputTime - lastButtonPressTimes[2] > buttonRepeatDelay) {
                lastButtonPressTimes[2] = inputTime;
                game.instantDropTetromino();
            }
        }
        else if (gamepads.some(x=>x.buttons[3].pressed)|| gamepads.some(x=>x.buttons[6].pressed)) { // Y or LT - hold
            var inputTime = Date.now();
            if (inputTime - lastButtonPressTimes[3] > buttonRepeatDelay) {
                lastButtonPressTimes[3] = inputTime;
                game.holdCurrentTetromino();
            }
        }
        else if (gamepads.some(x=>x.buttons.some(x=>x.pressed))) {
            console.log("some button(s) were pressed on gamepad with no effect")
        }

        drawGame(game);
    }
}