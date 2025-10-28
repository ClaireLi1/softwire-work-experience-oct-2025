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
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0]
	],
	J_Piece: [
        [0,0,1,0],
        [0,0,1,0],
        [0,1,1,0],
        [0,0,0,0]
	],
	L_Piece: [
       [0,1,0,0],
       [0,1,0,0],
       [0,1,1,0],
       [0,0,0,0]
	],
	O_Piece: [
		[0,0,0,0],
		[0,1,1,0],
		[0,1,1,0],
		[0,0,0,0]
	],
	S_Piece: [
        [0,0,0,0],
        [0,0,1,1],
        [0,1,1,0],
        [0,0,0,0]
	],
	Z_Piece: [
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
	],
	T_Piece: [
        [0,0,0,0],
        [0,1,1,1],
        [0,0,1,0],
        [0,0,0,0]
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
				newArray[i][j] = tiles[j][3-i]
			}
		}
	}
	else {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				newArray[j][3-i] = tiles[i][j]
			}
		}
	}

	return newArray;
}

export const emptyGameState = {
	// A 10x20 array full of null values
	playfield: new Array(BOARD_UNITS_HEIGHT).fill(null).map(() => new Array(BOARD_UNITS_WIDTH).fill(null)),
	score: 0,
	upcomingTetrominoes: Array.from({length: 3}, getRandomTetromino),
	heldTetromino: null,
	activeTetromino: {
		...(function() {
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
		gameTick: function() {
			// 1: Move currently active piece down
			this.gameState.activeTetromino.position.y -= 1;
			
			// 2: Lock piece in place if it can't move down anymore


			// 3: Clear any full lines
			
			
			// 4: Increase score
			
			
			// 5: Get new piece from upcoming tetrominoes


		},

		/**
		 * Return if the game is over
		 * @return {boolean}
		 */
		isGameOver: function() {

		},

		/**
		 * Return the tile at the given position
		 * If there is a tile, return its colour
		 * @return {null | string}
		 *
		 * Possible colours: "cyan, blue, orange, yellow, green, purple, red"
		 */
		getTileAtPosition: function(x, y) {
			
		},

		/**
		 * Return the score of the game
		 * @return {int}
		 */
		getScore: function() {

		},

		/**
		 * Return any stats that have been kept track of (tetrominos dropped, tetrises made, etc.)
		 * @return {object}
		 *
		 * Which stats to keep track of can be determined later
		 */
		getStats: function() {

		},

		/**
		 * Get any upcoming tetrominoes
		 * @return {Array<Tetromino>}
		 */
		getUpcomingTetrominoes: function() {

		},

		/**
		 * Return the tetromino currently being held, if any
		 * @return {null | Tetromino}
		 */
		getHeldTetromino: function() {

		},

		/**
		 * Return the entire game state in a single object
		 * This combines every one of the above functions (for debug purposes)
		 * @return {object}
		 */
		getGameState: function() {
			return this.gameState;
		},

		/**
		 * Move the current tetromino left 1 tile
		 */
		moveLeft: function() {
			this.gameState.activeTetromino.position.x -= 1;
		},


		/**
		 * Move the current tetromino right 1 tile
		 */
		moveRight: function() {
			this.gameState.activeTetromino.position.x += 1;

		},



		/**
		 * Rotate the current tetromino clockwise 90 degrees
		 */
		rotateTetrominoClockwise: function() { /* tranpose */
			this.gameState.activeTetromino.tiles = rotateArray(this.gameState.activeTetromino.tiles, "cw")
		},

		/**
		 * Rotate the current tetromino anti-clockwise 90 degrees
		 */
		rotateTetrominoAntiClockwise: function() {
			this.gameState.activeTetromino.tiles = rotateArray(this.gameState.activeTetromino.tiles, "acw")
		},

		/**
		 * Instantly drop the current tetromino as far as it goes and lock it in place
		 */
		instantDropTetromino: function() {

		},

		/**
		 * Hold the current tetromino, swapping it for any currently held one
		 */
		holdCurrentTetromino: function() {

		},
	};

	return tetrisGame;
};
