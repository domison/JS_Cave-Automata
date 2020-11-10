'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// let canvas take up two thirds of browser responsively
canvas.width = window.innerWidth * (2 / 3);
canvas.height = window.innerHeight * (2 / 3);

// ensure that canvas is a square on all viewports and orientations
canvas.height <= canvas.width
	? (canvas.width = canvas.height)
	: (canvas.height = canvas.width);

// for now resolution and with it cell size sits at 1/64
const resolution = Math.floor(canvas.width / 64);

const COLS = Math.floor(canvas.width / resolution);
const ROWS = Math.floor(canvas.height / resolution);

class Cell {
	constructor() {
		this.currentState = Math.floor(Math.random() * 2);
	}

	setState(state) {
		this.currentState = state;
	}
}

function generateGrid() {
	return new Array(COLS)
		.fill(null)
		.map(() => new Array(ROWS).fill(null).map(() => new Cell()));
}

let grid = generateGrid();
requestAnimationFrame(update);

function update() {
	grid = nextGen(grid);
	render(grid);
	requestAnimationFrame(update);
}
function nextGen(grid) {
	// create exact copy of the grid array
	const currentGen = grid.map((array) =>
		array.map((cell) => cell.currentState)
	);
	// const nextGen = grid.map((array) => [...array]);

	for (let col = 0; col < currentGen.length; col++) {
		for (let row = 0; row < currentGen[col].length; row++) {
			const cell = currentGen[col][row];
			let numberOfNeighbors = 0;

			// find the direct neighbors of each cell
			for (let i = -1; i < 2; i++) {
				for (let j = -1; j < 2; j++) {
					if (i == 0 && j == 0) {
						continue;
					}
					const x_cell = col + i;
					const y_cell = row + j;

					if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
						const currentNeighbor = currentGen[col + i][row + j];
						numberOfNeighbors += currentNeighbor;
					}
				}
			}

			// apply standard rules
			if (cell === 1 && numberOfNeighbors < 2) {
				grid[col][row].setState(0);
			} else if (cell === 1 && numberOfNeighbors > 3) {
				grid[col][row].setState(0);
			} else if (cell === 0 && numberOfNeighbors === 3) {
				grid[col][row].setState(1);
			} else {
				grid[col][row].setState(grid[col][row].currentState);
			}
		}
	}
	return grid;
}

function render(grid) {
	for (let col = 0; col < grid.length; col++) {
		for (let row = 0; row < grid[col].length; row++) {
			const cell = grid[col][row];
			context.beginPath();
			context.rect(col * resolution, row * resolution, resolution, resolution);
			context.fillStyle = cell.currentState ? 'blue' : 'white';
			context.strokeStyle = 'grey';
			context.fill();
			context.stroke();
		}
	}
}
