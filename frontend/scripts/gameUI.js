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
            const tileColour = getTileAt(game, {x: x, y: y});
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

function getTileAt(game, position) {
    const { playfield, activeTetromino } = game.gameState;
    const { tiles, colour } = activeTetromino;
    const { x: posX, y: posY } = position;

    // Check active tetromino first
    const relativeX = posX - activeTetromino.position.x;
    const relativeY = posY - activeTetromino.position.y;
    if (
        relativeX >= 0 &&
        relativeX < tiles[0].length &&
        relativeY >= 0 &&
        relativeY < tiles.length
    ) {
        if (tiles[relativeY][relativeX] === 1) {
            return colour;
        }
    }

    // Then check playfield
    return game.getTileAtPosition(posX, posY);
}