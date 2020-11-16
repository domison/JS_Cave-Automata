'use strict';

import Display from './Display.js';
import Game from './Game.js';
import Board from './Board.js';
import Algorithm from './Algorithm.js';

let display = new Display();
let game = new Game(new Board(new Algorithm()));
game.board.grid = game.board.randomizeGrid();
display.render(game.board.grid);

// requestAnimationFrame(loop);

function loop() {
	if (game.isLooped) {
		game.progressBoard(1);
		display.render(game.board.grid);
		requestAnimationFrame(loop);
	}
}

export { game, display, loop };
