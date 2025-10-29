export const BOARD_UNITS_WIDTH = 10;
export const BOARD_UNITS_HEIGHT = 20;
const BOARD_UNIT_PIXEL_SIZE = 40;

const BOARD_WIDTH = BOARD_UNITS_WIDTH * BOARD_UNIT_PIXEL_SIZE;
const BOARD_HEIGHT = BOARD_UNITS_HEIGHT * BOARD_UNIT_PIXEL_SIZE;

export function drawGrid(){
    var gameCanvas=document.getElementById("game-grid");
    gameCanvas.setAttribute("width", BOARD_WIDTH)
    gameCanvas.setAttribute("height", BOARD_HEIGHT)

    var gameContext = gameCanvas.getContext("2d");
    addHorizontalGameLines(gameContext);
    addVerticalGameLines(gameContext);
    gameContext.stroke();
}

export function drawGame(game) {
    var gameCanvas=document.getElementById("game-grid");
    gameCanvas.setAttribute("width", BOARD_WIDTH)
    gameCanvas.setAttribute("height", BOARD_HEIGHT)

    var gameContext = gameCanvas.getContext("2d");
    gameContext.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    addHorizontalGameLines(gameContext);
    addVerticalGameLines(gameContext);
    gameContext.stroke();

    for (var y=0; y<BOARD_UNITS_HEIGHT; y++) {
        for (var x=0; x<BOARD_UNITS_WIDTH; x++) {
            const tileColour = game.getTileAtPosition(x, y);
            if (tileColour !== null && tileColour !== undefined) {
                gameContext.fillStyle = tileColour;
                gameContext.fillRect(
                    x * BOARD_UNIT_PIXEL_SIZE,
                    (BOARD_UNITS_HEIGHT - y - 1) * BOARD_UNIT_PIXEL_SIZE,
                    BOARD_UNIT_PIXEL_SIZE,
                    BOARD_UNIT_PIXEL_SIZE
                );
            }
        }
    }
}

function addVerticalGameLines(gameContext) {
    for (var xPosition=0; xPosition<=BOARD_WIDTH; xPosition = xPosition + BOARD_UNIT_PIXEL_SIZE) {
        gameContext.moveTo(xPosition, 0);
        gameContext.lineTo(xPosition, BOARD_HEIGHT);
    }
}

function addHorizontalGameLines(gameContext) {
    for (var yPosition = 0; yPosition <= BOARD_HEIGHT; yPosition = yPosition + BOARD_UNIT_PIXEL_SIZE) {
        gameContext.moveTo(0, yPosition);
        gameContext.lineTo(BOARD_WIDTH, yPosition);
    }
}

function drawHeldPiece(game) {
    const gameCanvas = document.getElementById("held-piece-container");
    const gameContext = gameCanvas.getContext("2d");

    // Set the canvas size (should match the size of the tetromino grid)
    const canvasSize = BOARD_UNIT_PIXEL_SIZE * 4; // Assuming maximum 4x4 tetromino
    gameCanvas.setAttribute("width", canvasSize);
    gameCanvas.setAttribute("height", canvasSize);

    // Clear the canvas before redrawing
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    const heldName = game.gameState.heldTetromino;
    if (!heldName) return; // If there's no held piece, return early

    // Get the shape and color of the held tetromino
    const tiles = TetrominoShapes[heldName];
    const colour = getTetrominoColor(heldName);
    
    // Draw each tile in the held tetromino
    gameContext.fillStyle = colour;

    // Ensure the tetromino is centered
    const offsetX = (canvasSize - tiles[0].length * BOARD_UNIT_PIXEL_SIZE) / 2;
    const offsetY = (canvasSize - tiles.length * BOARD_UNIT_PIXEL_SIZE) / 2;

    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            if (tiles[y][x] === 1) { // If this position has part of the tetromino
                gameContext.fillRect(
                    offsetX + x * BOARD_UNIT_PIXEL_SIZE,
                    offsetY + y * BOARD_UNIT_PIXEL_SIZE,
                    BOARD_UNIT_PIXEL_SIZE,
                    BOARD_UNIT_PIXEL_SIZE
                );
            }
        }
    }
}
