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

// Shapes of the tetrominoes, with Y axis flipped so the in-memory representation matches playfield numbering where 0,0 is bottom-left
const TetrominoShapes = flipYAxis({
	I_Piece: [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0]
	],
	J_Piece: [
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	L_Piece: [
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	O_Piece: [
		[1, 1],
		[1, 1]
	],
	S_Piece: [
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	],
	Z_Piece: [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	],
	T_Piece: [
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	]
});

function flipYAxis(tetrominoShapes) {
	const flippedTetrominoes = {};
	for (const [key, shape] of Object.entries(tetrominoShapes)) {
		const flippedShape = shape.slice().reverse();
		flippedTetrominoes[key] = flippedShape;
	}
	return flippedTetrominoes;
}

/* separate library of tetros in preview (2x4 max) */
export const previewTetros = {
	I_Piece: [
		[1, 1, 1, 1],
		[1, 4]
	],
	L_Piece: [
		[0, 0, 1],
		[1, 1, 1],
		[2, 3]
	],
	J_Piece: [
		[1, 0, 0],
		[1, 1, 1],
		[2, 3]
	],
	O_Piece: [
		[1, 1],
		[1, 1],
		[2, 2]
	],
	S_Piece: [
		[0, 1, 1],
		[1, 1, 0],
		[2, 3]
	],
	Z_Piece: [
		[1, 1, 0],
		[0, 1, 1],
		[2, 3]
	],
	T_Piece: [
		[0, 1, 0],
		[1, 1, 1],
		[2, 3]
	],
}

export function getTetrominoColor(piece) {
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

function newActiveTetromino(tetroName) {
	const tiles = TetrominoShapes[tetroName];
	return {
		name: tetroName,
		tiles: tiles,
		colour: getTetrominoColor(tetroName),
		position: getSpawnPosition(tiles.length),
	}
}

function getSpawnPosition(len) {
	let position = {
		x: Math.floor((BOARD_UNITS_WIDTH - len) / 2),
		y: (len === 2) ? BOARD_UNITS_HEIGHT - 1 : BOARD_UNITS_HEIGHT - 2, // Top row is reserved for game over
	};

	return position;
}

/* transpose function */
function rotateArray(tiles, direction) {
	const len = tiles.length;
	let newArray = new Array(len).fill(0).map(() => new Array(len).fill(0));

	if (direction === "cw") {
		for (let i = 0; i < len; i++) {
			for (let j = 0; j < len; j++) {
				newArray[i][j] = tiles[j][len - 1 - i];
			}
		}
	}
	else {
		for (let i = 0; i < len; i++) {
			for (let j = 0; j < len; j++) {
				newArray[j][len - 1 - i] = tiles[i][j];
			}
		}
	}

	return newArray;
}

function checkCollision(playfield, activeTetromino) {
	const tiles = activeTetromino.tiles;
	const position = activeTetromino.position;
	const len = tiles.length;

	for (let r = 0; r < len; r++) {
		for (let c = 0; c < len; c++) {
			if (tiles[r][c] === 0) {
				continue;
			}
			const xValue = c + position.x
			const yValue = (r + position.y) - 1

			if (playfield[yValue]) {
				if (playfield[yValue][xValue]) {
					return true
				}
			}

			if (yValue < 0) {
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
	const len = tiles.length;

	for (let r = 0; r < len; r++) {
		for (let c = 0; c < len; c++) {
			if (tiles[r][c] === 1) {
				const xValue = c + position.x;
				// const yValue = len - 1 - r + position.y;
				const yValue = r + position.y;

                if (yValue >= 0 && yValue < BOARD_UNITS_HEIGHT && xValue >= 0 && xValue < BOARD_UNITS_WIDTH) {
                    playfield[yValue][xValue] = colour;
                }
            }
        }
    }
}

/* add workaround for clearing non adjacent lines */
/* add workaround for clearing non adjacent lines */
function moveGridDown(playfield, yValue) {
	for (let y = yValue; y<BOARD_UNITS_HEIGHT-1;y++) {
		for (let x = 0; x < BOARD_UNITS_WIDTH; x++) {
			playfield[y][x] = playfield[y+1][x]
		}
	}
}


function addToScore(score, numLines) {
	if (numLines == 1) {
		score += 40
	}
	else if (numLines == 2) {
		score += 100
	} else if (numLines == 3) {
		score += 300
	} else if (numLines == 4) {
		score += 1200
	}
	console.log(score)
	document.getElementById("score-container").innerText = "Score: " + score;
	return score;
}

function clearFullLine(playfield, yValue) {
	/* setTimeout (() => { */
	for (let i = 0; i < BOARD_UNITS_WIDTH; i++) {
		playfield[yValue][i] = "white";
	}
		// }, "10");
	moveGridDown(playfield, yValue)
}

/* only check after piece has been locked in */
function checkFullLine(playfield, yValue) {
	let full = true
	for (let col=0; col < BOARD_UNITS_WIDTH; col++) {
		if (playfield[yValue][col] == null) {
			full = false;
			return false;
		}
	};
	if (full) {
		return true
	};
}

function checkAllFullLines(playfield, score) {
	let numFullLines = 0;
	let yVals = [];
	for (let row = 0; row < BOARD_UNITS_HEIGHT; row++) {
		if (checkFullLine(playfield, row)) {
			yVals.push(row);
			numFullLines++;
		}
	};
	for (let i = 0; i < numFullLines; i++) {
		clearFullLine(playfield, (yVals[i]-i));
	};
	return addToScore(score, numFullLines);
}

function OutOfBounds(playfield, activeTetromino, direction) {
	const tiles = activeTetromino.tiles;
    const position = activeTetromino.position;
	const len = tiles.length;

	for (let r = 0; r < len; r++) {
		for (let c = 0; c < len; c++) {
			if(tiles[r][c] === 0) {
				continue;				
			}

			const xValue = c + position.x
			const yValue = r + position.y

			if (direction == "left") {
				if (xValue - 1 < 0) {
					return true
				}
				if (playfield[xValue]) {
					if (playfield[yValue][xValue - 1]) {
						return true
					}
				}
			} else if (direction == "right") {
				if (xValue + 1 >= BOARD_UNITS_WIDTH) {
					return true
				}
				if (playfield[xValue]) {
					if (playfield[yValue][xValue + 1]) {
						return true
					}
				}
			}
		}
	}
	return false;
}

function rotationCollision (playfield, activeTetromino, rotatedTiles) {
	
	const testTetromino = {
		...activeTetromino,
		tiles: rotatedTiles
  	};

	const OutOfBounds = testBoundaryChange(playfield,testTetromino);
	const collision = checkCollision(playfield,testTetromino);

	if (!OutOfBounds && !collision) {
		return false;
	} else {
		return true;
	}
}

function testBoundaryChange (playfield,tetromino) {
	const tiles = tetromino.tiles;
	const position = tetromino.position;
	const len = tiles.length;
	
	for (let r = 0; r < len; r++) {
		for (let c = 0; c < len; c++) {
			if (tiles[r][c] === 0) {
				continue;
			}

			const x = position.x + c;
			const y = position.y + r;

			if (x < 0 || x >= BOARD_UNITS_WIDTH || y < 0 || y >= BOARD_UNITS_HEIGHT) {
				return true; 
			}
		}
	}
	return false;
}

export const emptyGameState = {
	// A 10x20 array full of null values
	playfield: new Array(BOARD_UNITS_HEIGHT).fill(null).map(() => new Array(BOARD_UNITS_WIDTH).fill(null)),
	score: 0,
	level: 1, // to act as a multiplier for score and speed
	upcomingTetrominoes: Array.from({ length: 3 }, getRandomTetromino),
	heldTetromino: null,
	// Whether hold has been used for the currently active piece
	holdUsed: false,
	activeTetromino: newActiveTetromino(getRandomTetromino()),
};

export function createGame(initialGameState = emptyGameState) {
	const tetrisGame = {
		gameState: initialGameState,
		counter: 0,
		/**
		 * Progress the game forward one timestep
		 */
		gameTick: function () {
			console.log("Game tick: " + this.counter++);
			// 1: Move currently active piece down

			// 2: Lock piece in place if it can't move down anymore
			const playfield = this.gameState.playfield
			const activeTetromino = this.gameState.activeTetromino
			// let score = this.gameState.score;

			const collideValue = checkCollision(playfield, activeTetromino)

			if (!collideValue) {
				this.gameState.activeTetromino.position.y -= 1;
				console.log("doesn't collide");
			} else {
				lockCollision(playfield,activeTetromino)
				this.gameState.score = checkAllFullLines(playfield, this.gameState.score)
				this.gameState.score = checkAllFullLines(playfield, this.gameState.score)
				const GameOver = this.isGameOver();
				console.log("collision happens");
				console.log(GameOver);
				if (GameOver) {
					display()
				} else {
					this.getUpcomingTetrominoes();
				}
			}

			// 3: Clear any full lines
			/* check all lines are full */
			
			// 4: Increase score

			// 5: Get new piece from upcoming tetrominoes


		},

		/**
		 * Return if the game is over
		 * @return {boolean}
		 */
		isGameOver: function () {
			console.log("called isGameOver");
			const playfield = this.gameState.playfield;
			const activeTetromino = this.gameState.activeTetromino;
			const tiles = activeTetromino.tiles;
			const position = activeTetromino.position;
			const len = tiles.length;

			// Check if the tetromino at spawn position would collide
			for (let r = 0; r < len; r++) {
				for (let c = 0; c < len; c++) {
					// console.log("inside nested loop");
					if (tiles[r][c] === 0) continue; // Skip empty tiles
					const xValue = c + position.x;
					const yValue = r + position.y; // Checking the topmost row
					// console.log("xValue: " + xValue);
					// console.log("yValue: " + yValue);

					// Check if the position is outside the bounds or collides with an existing block
					if (yValue >= BOARD_UNITS_HEIGHT || xValue < 0 || xValue >= BOARD_UNITS_WIDTH) {
						// console.log("condition is met")
						return true; // Game over if there's a collision
					}
				}
			}
			console.log("finished loop")
			return false; // No collision, game is not over yet
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
			// const relativeY = position.y - posY + tiles.length - 1;
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
			const state = this.gameState;
			const nextTetromino = state.upcomingTetrominoes.shift();

			state.upcomingTetrominoes.push(getRandomTetromino());

			state.activeTetromino = newActiveTetromino(nextTetromino);
			// Reset hold availability when a new piece becomes active
			state.holdUsed = false;
		},



		/**
		 * 
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
			const playfield = this.gameState.playfield
			const activeTetromino = this.gameState.activeTetromino

			const boundary = OutOfBounds(playfield, activeTetromino, "left")

			if (!boundary) {
				this.gameState.activeTetromino.position.x -= 1;
			}
		},

		/**
		 * Move the current tetromino right 1 tile
		 */
		moveRight: function () {
			const playfield = this.gameState.playfield
			const activeTetromino = this.gameState.activeTetromino

			const boundary = OutOfBounds(playfield, activeTetromino, "right")

			if (!boundary) {
				this.gameState.activeTetromino.position.x += 1;
			}
		},

		/**
		 * Move the current tetromino down and increase fall speed
		 */
		moveDown: function () {

			const playfield = this.gameState.playfield
			const activeTetromino = this.gameState.activeTetromino
			const upcomingTetromino = this.gameState.upcomingTetrominoes

			const collideValue = checkCollision(playfield, activeTetromino)

			if (!collideValue) {
				this.gameState.activeTetromino.position.y -= 1;
			} else {
				lockCollision(playfield, activeTetromino)
				this.getUpcomingTetrominoes();
			}
		},

		/**
		 * Rotate the current tetromino clockwise 90 degrees
		 */
		rotateTetrominoClockwise: function () { /* tranpose */
			// this.gameState.activeTetromino.tiles = rotateArray(this.gameState.activeTetromino.tiles, "cw")
			const playfield = this.gameState.playfield
			const activeTetromino = this.gameState.activeTetromino
			const rotatedTiles = rotateArray(activeTetromino.tiles, "cw");

			if (!rotationCollision (playfield, activeTetromino, rotatedTiles)) {
				activeTetromino.tiles = rotatedTiles;
			}
		},

		/**
		 * Rotate the current tetromino anti-clockwise 90 degrees
		 */
		rotateTetrominoAntiClockwise: function () {
			// this.gameState.activeTetromino.tiles = rotateArray(this.gameState.activeTetromino.tiles, "acw")
			const playfield = this.gameState.playfield
			const activeTetromino = this.gameState.activeTetromino
			const rotatedTiles = rotateArray(activeTetromino.tiles, "acw");

			if (!rotationCollision (playfield, activeTetromino, rotatedTiles)) {
				activeTetromino.tiles = rotatedTiles;
			}
		},

		/**
		 * Instantly drop the current tetromino as far as it goes and lock it in place
		 */
		instantDropTetromino: function () {
			const playfield = this.gameState.playfield;
			const activeTetromino = this.gameState.activeTetromino;

			// Keep moving the tetromino down until it collides
			while (!checkCollision(playfield, activeTetromino)) {
				activeTetromino.position.y -= 1; // or += 1 depending on your coordinate system
			}

			// Move it back up one step since it collided
			// activeTetromino.position.y += 1;

			// Lock the tetromino in place
			lockCollision(playfield, activeTetromino);
			// this.getUpcomingTetrominoes();


		},

		/**
		 * Hold the current tetromino, swapping it for any currently held one
		 */
		holdCurrentTetromino: function() {
			const state = this.gameState;
			// Only allow hold once per active piece
			if (state.holdUsed) return;
	
			// Name of the currently active tetromino
			const activeName = state.activeTetromino && state.activeTetromino.name;
			if (!activeName) return;
	
			if (state.heldTetromino) {
				const previouslyHeld = state.heldTetromino;
				// Put active into held
				state.heldTetromino = activeName;
	
				// Make previously held the new active tetromino at spawn
				state.activeTetromino = newActiveTetromino(previouslyHeld);
			} else {
				// No held piece: move active to held and spawn next from upcoming list
				state.heldTetromino = activeName;
	
				// Pull next tetromino from upcoming; if present remove it and replenish the queue
				let nextName;
				if (state.upcomingTetrominoes && state.upcomingTetrominoes.length > 0) {
					nextName = state.upcomingTetrominoes.shift();
					// Ensure the preview always shows three upcoming pieces by replenishing
					state.upcomingTetrominoes.push(getRandomTetromino());
				} else {
					// Fallback: generate a random tetromino if the queue is unexpectedly empty
					nextName = getRandomTetromino();
				}
	
				state.activeTetromino = newActiveTetromino(nextName);
			}
	
			// mark hold used for this active piece
			state.holdUsed = true;
	
		},
		
	
		/**
		 * Debug controls, will be removed for release
		 * Spawn a specific piece at the top of the board (for testing purposes)
		 */
		spawnPiece: function (tetrominoName) {
			this.gameState.activeTetromino = newActiveTetromino(tetrominoName);
		}
	};




	
	return tetrisGame;
};
