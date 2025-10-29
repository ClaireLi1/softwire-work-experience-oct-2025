import { BOARD_UNITS_HEIGHT, BOARD_UNITS_WIDTH } from "./gameUI.js"

export const Tetromino = {
	I_Piece: "I_Piece",
	J_Piece: "J_Piece",
	L_Piece: "L_Piece",
	O_Piece: "O_Piece",
	S_Piece: "S_Piece",
	Z_Piece: "Z_Piece",
	T_Piece: "T_Piece",
};

const TetrominoShapes = {
	I_Piece: [
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0]
	],
	J_Piece: [
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	L_Piece: [
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	O_Piece: [
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	S_Piece: [
		[0, 0, 0, 0],
		[0, 0, 1, 1],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	Z_Piece: [
		[0, 0, 0, 0],
		[1, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	],
	T_Piece: [
		[0, 0, 0, 0],
		[0, 1, 1, 1],
		[0, 0, 1, 0],
		[0, 0, 0, 0]
	]
};

function getTetrominoColor(piece) {
	const colorMap = {
		"I_Piece": "cyan",
		"J_Piece": "blue",
		"L_Piece": "orange",
		"O_Piece": "yellow",
		"S_Piece": "green",
		"T_Piece": "purple",
		"Z_Piece": "red"
	};
	return colorMap[piece];
}

function getRandomTetromino() {
	const options = Object.values(Tetromino);
	return options[Math.floor(Math.random() * options.length)];
}

/* transpose function */
function rotateArray(tiles, direction) {
	var newArray = [[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]];

	if (direction === "cw") {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				newArray[i][j] = tiles[j][3 - i]
			}
		}
	}
	else {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				newArray[j][3 - i] = tiles[i][j]
			}
		}
	}

	return newArray;
}

function checkCollision(playfield,activeTetromino) {
	const tiles=activeTetromino.tiles
	const position=activeTetromino.position
	for (let r = 0; r<4; r++) {
		for (let c = 0; c < 4;c++) {
			if(tiles[r][c] === 0) {
				continue;				
			}
			const xValue = c + position.x
			const yValue = (r + position.y) - 1
			
			if (playfield[yValue][xValue]) {
				return true
			}

			if (yValue < 0){
				return true
			}

		}
	}
	return false
}

function lockCollision(playfield, activeTetromino) {
    const colour = activeTetromino.colour;
    const tiles = activeTetromino.tiles;
    const position = activeTetromino.position;

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (tiles[r][c] === 1) {
                const xValue = c + position.x;
                const yValue = r + position.y;

                if (yValue >= 0 && yValue < BOARD_UNITS_HEIGHT && xValue >= 0 && xValue < BOARD_UNITS_WIDTH) {
                    playfield[yValue][xValue] = colour;
                }
            }
        }
    }
}


export const emptyGameState = {
	// A 10x20 array full of null values
	playfield: new Array(BOARD_UNITS_HEIGHT).fill(null).map(() => new Array(BOARD_UNITS_WIDTH).fill(null)),
	score: 0,
	upcomingTetrominoes: Array.from({ length: 3 }, getRandomTetromino),
	heldTetromino: null,
	activeTetromino: {
		...(function () {
			const tetromino = getRandomTetromino();
			return {
				name: tetromino,
				tiles: TetrominoShapes[tetromino],
				colour: getTetrominoColor(tetromino)
			};
		}()),
		position: {
			x: (BOARD_UNITS_WIDTH - 4) / 2,
			y: BOARD_UNITS_HEIGHT - 1, // Top row is reserved for game over
		}
	}
};



export default function createGame(initialGameState = emptyGameState) {
	const tetrisGame = {
		gameState: initialGameState,

		/**
		 * Progress the game forward one timestep
		 */
		gameTick: function () {
			// 1: Move currently active piece down
			
			// 2: Lock piece in place if it can't move down anymore
			const playfield = this.gameState.playfield
			const activeTetromino = this.gameState.activeTetromino


			const collideValue=checkCollision(playfield,activeTetromino)

			if (!collideValue) {
				this.gameState.activeTetromino.position.y -= 1;
			} else {
				lockCollision(playfield,activeTetromino)
			}




			// 3: Clear any full lines


			// 4: Increase score


			// 5: Get new piece from upcoming tetrominoes


		},

		/**
		 * Return if the game is over
		 * @return {boolean}
		 */
		isGameOver: function () {

		},

		/**
		 * Return the tile at the given position
		 * If there is a tile, return its colour
		 * @return {null | string}
		 *
		 * Possible colours: "cyan, blue, orange, yellow, green, purple, red"
		 */
		getTileAtPosition: function (posX, posY) {
			const { position, tiles, colour } = this.gameState.activeTetromino;

			// Check active tetromino first
			const relativeX = posX - position.x;
			const relativeY = posY - position.y;
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

			// else, return the value from playfield coordinates
			return this.gameState.playfield[posY][posX];
		},

		/**
		 * Return the score of the game
		 * @return {int}
		 */
		getScore: function () {
			return this.gameState.score;
		},

		/**
		 * Return any stats that have been kept track of (tetrominos dropped, tetrises made, etc.)
		 * @return {object}
		 *
		 * Which stats to keep track of can be determined later
		 */
		getStats: function () {

		},

		/**
		 * Get any upcoming tetrominoes
		 * @return {Array<Tetromino>}
		 */
		getUpcomingTetrominoes: function () {
			return this.gameState.upcomingTetrominoes;
		},

		/**
		 * Return the tetromino currently being held, if any
		 * @return {null | Tetromino}
		 */
		getHeldTetromino: function () {
			return this.gameState.heldTetromino;
		},

		/**
		 * Return a render-friendly object for the held tetromino, or null if none.
		 * @return {null | {name: string, tiles: number[][], colour: string}}
		 */
		getHeldTetrominoDetails: function () {
			const name = this.gameState.heldTetromino;
			if (!name) return null;
			return {
				name,
				tiles: TetrominoShapes[name],
				colour: getTetrominoColor(name),
			};
		},

		/**
		 * Return the entire game state in a single object
		 * This combines every one of the above functions (for debug purposes)
		 * @return {object}
		 */
		getGameState: function () {
			return this.gameState;
		},

		/**
		 * Move the current tetromino left 1 tile
		 */
		moveLeft: function () {
			this.gameState.activeTetromino.position.x -= 1;
		},

		/**
		 * Move the current tetromino right 1 tile
		 */
		moveRight: function () {
			this.gameState.activeTetromino.position.x += 1;
		},

		/**
		 * Move the current tetromino down and increase fall speed
		 */
		moveDown: function() {
			this.gameState.activeTetromino.position.y -= 1;
		},

		/**
		 * Rotate the current tetromino clockwise 90 degrees
		 */
		rotateTetrominoClockwise: function () { /* tranpose */
			this.gameState.activeTetromino.tiles = rotateArray(this.gameState.activeTetromino.tiles, "cw")
		},

		/**
		 * Rotate the current tetromino anti-clockwise 90 degrees
		 */
		rotateTetrominoAntiClockwise: function () {
			this.gameState.activeTetromino.tiles = rotateArray(this.gameState.activeTetromino.tiles, "acw")
		},

		/**
		 * Instantly drop the current tetromino as far as it goes and lock it in place
		 */
		instantDropTetromino: function () {

		},

		/**
		 * Hold the current tetromino, swapping it for any currently held one
		 */
		holdCurrentTetromino: function () {
			const state = this.gameState;

			// Name of the currently active tetromino
			const activeName = state.activeTetromino.name;

			// If there is a held tetromino already, swap them
			if (state.heldTetromino) {
				const previouslyHeld = state.heldTetromino;
				// Put active into held
				state.heldTetromino = activeName;

				const activePosition = {
					x: state.activeTetromino.position.x,
					y: state.activeTetromino.position.y
				};

				// Make previously held the new active tetromino
				state.activeTetromino = {
					name: previouslyHeld,
					tiles: TetrominoShapes[previouslyHeld].map(row => row.slice()),
					colour: getTetrominoColor(previouslyHeld),
					position: activePosition
				};
			} else {
				// No held piece: move active to held and spawn next from upcoming list
				state.heldTetromino = activeName;

				// Pull next tetromino from upcoming; if none, use the first one
				const nextName = state.upcomingTetrominoes && state.upcomingTetrominoes.length > 0
					? state.upcomingTetrominoes.shift()
					: state.upcomingTetrominoes[0];

				state.activeTetromino = {
					name: nextName,
					tiles: TetrominoShapes[nextName].map(row => row.slice()),
					colour: getTetrominoColor(nextName),
					position: {
						x: (BOARD_UNITS_WIDTH - 4) / 2,
						y: BOARD_UNITS_HEIGHT - 1,
					}
				};
			}

			// Call this to redraw the held piece
			// UI is responsible for redrawing; do not call into UI from game logic (avoids circular imports)
		},


		/**
		 * Load the next tetromino from the upcoming queue and add a new random one to the queue
		 */
		loadNextTetromino: function () {

		},

		/**
		 * Debug controls, will be removed for release
		 * Spawn a specific piece at the top of the board (for testing purposes)
		 */
		spawnI_Piece: function () {
			this.gameState.activeTetromino = {
				name: Tetromino.I_Piece,
				tiles: TetrominoShapes.I_Piece,
				colour: getTetrominoColor(Tetromino.I_Piece),
				position: {
					x: (BOARD_UNITS_WIDTH - 4) / 2,
					y: BOARD_UNITS_HEIGHT - 1,
				}
			};
		},

		spawnJ_Piece: function () {
			this.gameState.activeTetromino = {
				name: Tetromino.J_Piece,
				tiles: TetrominoShapes.J_Piece,
				colour: getTetrominoColor(Tetromino.J_Piece),
				position: {
					x: (BOARD_UNITS_WIDTH - 4) / 2,
					y: BOARD_UNITS_HEIGHT - 1,
				}
			};
		},

		spawnL_Piece: function () {
			this.gameState.activeTetromino = {
				name: Tetromino.L_Piece,
				tiles: TetrominoShapes.L_Piece,
				colour: getTetrominoColor(Tetromino.L_Piece),
				position: {
					x: (BOARD_UNITS_WIDTH - 4) / 2,
					y: BOARD_UNITS_HEIGHT - 1,
				}
			};
		},

		spawnO_Piece: function () {
			this.gameState.activeTetromino = {
				name: Tetromino.O_Piece,
				tiles: TetrominoShapes.O_Piece,
				colour: getTetrominoColor(Tetromino.O_Piece),
				position: {
					x: (BOARD_UNITS_WIDTH - 4) / 2,
					y: BOARD_UNITS_HEIGHT - 1,
				}
			};
		},

		spawnS_Piece: function () {
			this.gameState.activeTetromino = {
				name: Tetromino.S_Piece,
				tiles: TetrominoShapes.S_Piece,
				colour: getTetrominoColor(Tetromino.S_Piece),
				position: {
					x: (BOARD_UNITS_WIDTH - 4) / 2,
					y: BOARD_UNITS_HEIGHT - 1,
				}
			};
		},

		spawnZ_Piece: function () {
			this.gameState.activeTetromino = {
				name: Tetromino.Z_Piece,
				tiles: TetrominoShapes.Z_Piece,
				colour: getTetrominoColor(Tetromino.Z_Piece),
				position: {
					x: (BOARD_UNITS_WIDTH - 4) / 2,
					y: BOARD_UNITS_HEIGHT - 1,
				}
			};
		},

		spawnT_Piece: function () {
			this.gameState.activeTetromino = {
				name: Tetromino.T_Piece,
				tiles: TetrominoShapes.T_Piece,
				colour: getTetrominoColor(Tetromino.T_Piece),
				position: {
					x: (BOARD_UNITS_WIDTH - 4) / 2,
					y: BOARD_UNITS_HEIGHT - 1,
				}
			};
		}
	};
	return tetrisGame;
};
