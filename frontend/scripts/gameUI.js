import { getTetrominoColor, previewTetros } from "./gameLogicInterface.js";

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

/* 
* add absolute widths and heights to previewtetros dict to help w centering 
* add conditions to function for centering with odd width/height blocks */
function drawPreviewTetromino(tetro, offset) {
    var canvas = document.getElementById("upcoming-pieces-container");
    var ctx = canvas.getContext("2d");
    let mat = []
    let pieceHeight = 0
    let pieceWidth = 0
    if (tetro === "I_Piece") {
        mat = previewTetros[tetro].slice(0,1)
        pieceHeight = previewTetros[tetro][1][0]
        pieceWidth = previewTetros[tetro][1][1]
        offset = offset + 20
    } else {
        mat = previewTetros[tetro].slice(0,2)
        pieceHeight = previewTetros[tetro][2][0]
        pieceWidth = previewTetros[tetro][2][1]
    }

    console.log("this is piece " + tetro)

    ctx.fillStyle = getTetrominoColor(tetro)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3

    let contWidth = 303.33
    for (let i = 0; i < pieceHeight; i++) {
        for (let j = 0; j < pieceWidth; j++) {
            if (mat[i][j] == 1) {
                ctx.fillRect(((contWidth-40*pieceWidth)/2)+40*j,(40 + 40*i + offset), 40, 40)
                ctx.strokeRect(((contWidth-40*pieceWidth)/2)+40*j,(40 + 40*i + offset), 40, 40)
            } else {
            }
        }
    }
}

export function drawUpcomingTetrominoes(game) {
    drawPreviewTetromino(game.gameState.upcomingTetrominoes[0], 0)
    drawPreviewTetromino(game.gameState.upcomingTetrominoes[1], 120)
    drawPreviewTetromino(game.gameState.upcomingTetrominoes[2], 240)
    console.log(game.gameState.upcomingTetrominoes)
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

    // Also update held-piece display whenever the main board is drawn
    try { drawHeldPiece(game); } catch (e) { /* ignore if UI not present */ }
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

export function drawHeldPiece(game) {
    const gameCanvas = document.getElementById("held-piece-container");
    if (!gameCanvas) return;
    const gameContext = gameCanvas.getContext("2d");

    // Set the held-piece canvas to a fixed displayed width (user requested 300px)
    // Keep tiles drawn at the same size as the main grid (BOARD_UNIT_PIXEL_SIZE)
    const canvasSize = 300; // displayed and buffer size in pixels
    gameCanvas.setAttribute("width", canvasSize);
    gameCanvas.setAttribute("height", canvasSize);
    // Also set the displayed size so CSS doesn't scale the canvas; keep it fixed
    gameCanvas.style.width = canvasSize + 'px';
    gameCanvas.style.height = canvasSize + 'px';

    // Clear the canvas before redrawing
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    const held = typeof game.getHeldTetrominoDetails === 'function'
        ? game.getHeldTetrominoDetails()
        : null;

    if (!held) return; // If there's no held piece, return early

    const tiles = held.tiles;
    const colour = held.colour;

    if (!tiles || !Array.isArray(tiles) || !colour) return;

    // Draw each tile in the held tetromino
    gameContext.fillStyle = colour;

    // Ensure the tetromino is centered in the canvas
    const offsetX = (canvasSize - tiles[0].length * BOARD_UNIT_PIXEL_SIZE) / 2;
    const offsetY = (canvasSize - tiles.length * BOARD_UNIT_PIXEL_SIZE) / 2;

    // Iterate over the tiles and draw the pieces
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

