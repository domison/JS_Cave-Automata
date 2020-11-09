'use strict';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const resolution = 40;
canvas.width = 400;
canvas.height = 400;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function generateGrid() {
	return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0));
}

const grid = generateGrid();
render(grid);

function render(grid) {
	for (let col = 0; col < grid.length; col++) {
		for (let row = 0; row < grid.length; row++) {
			const cell = grid[col][row];

			context.beginPath();
			context.rect(col * resolution, row * resolution, resolution, resolution);
			context.stroke();
		}
	}
}
