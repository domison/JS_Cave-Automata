'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function generateGrid() {
	return new Array(COLS)
		.fill(null)
		.map(() =>
			new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
		);
}

let grid = generateGrid();
requestAnimationFrame(update);

// console.log(grid);
function update() {
	grid = nextGen(grid);
	render(grid);
	requestAnimationFrame(update);
}
function nextGen(grid) {
	// create exact copy of the grid array
	const nextGen = grid.map((array) => [...array]);

	for (let col = 0; col < grid.length; col++) {
		for (let row = 0; row < grid.length; row++) {
			const cell = grid[col][row];
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
						let currentNeighbor = grid[col + i][row + j];
						numberOfNeighbors += currentNeighbor;
					}
				}
			}

			// apply standard rules
			if (cell === 1 && numberOfNeighbors < 2) {
				nextGen[col][row] = 0;
			} else if (cell === 1 && numberOfNeighbors > 3) {
				nextGen[col][row] = 0;
			} else if (cell === 0 && numberOfNeighbors === 3) {
				nextGen[col][row] = 1;
			}
		}
	}
	return nextGen;
}

function render(grid) {
	for (let col = 0; col < grid.length; col++) {
		for (let row = 0; row < grid.length; row++) {
			const cell = grid[col][row];

			context.beginPath();
			context.rect(col * resolution, row * resolution, resolution, resolution);
			context.fillStyle = cell ? 'blue' : 'white';
			context.strokeStyle = 'grey';
			context.fill();
			context.stroke();
		}
	}
}
