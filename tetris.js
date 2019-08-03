//32:20

// Accsess to canvas
const canvas = document.getElementById('tetris');

// Get the canvas context
const context = canvas.getContext('2d');

// Scale the size of the shapes
context.scale(20, 20);

context.fillStyle = "#FF0000";
context.fillRect(20, 20, 150, 100);


function arenaSweep() {
let rowCount = 1;

	outer: for (let y = arena.length - 1 ; y > 0; --y) {
		for (let x = 0; x < arena[y].length; ++x) {
			if (arena[y][x] === 0) {
				continue outer;
			}
		}
	const row = arena.splice(y, 1)[0].fill(0);
	arena.unshift(row);
	++y;

	player.score += rowCount * 10;
		rowCount *= 2;

}
}

// Matrix shape T
const matrix = [
	[0, 0, 0, 1],
	[0, 0, 1, 0],
	[0, 1, 0, 0],
	[1, 0, 0, 0],
];

/**
 * Check if there is a collision between the player and the arena.
 * @param {*} arena 
 * @param {*} player 
 */
function colide(arena, player) {

	// Get the player position
	const [m, o] = [player.matrix, player.pos];

	// Iterate thorugh the player
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {

//Check if the arena has row and col

			if ((m[y][x]) !== 0 &&
				(arena[y + o.y] &&
					arena[y + o.y][x + o.x]) !== 0) {
					return true;
			}
		}
	}
	return false;		
}

/**
 * 
 * @param {*} w weight of the matrix
 * @param {*} h height of the matrix
 */
function createMatrix(w, h) {
	const matrix = [];
	// Decrease height -1
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

/**
 * Create a piece
 * @param {*} type Create the shape according to the recieving shape
 */
function createPiece(type){
	if (type === 'T') {
		return [
			[1, 1, 1],
			[0, 1, 0],
			[0, 0, 0],
		];
	}

	else if (type === 'O') {
		return [
			[2, 2],
			[2, 2],
		];
	}

	else if (type === 'L') {
		return [
			[0, 3, 0],
			[0, 3, 0],
			[0, 3, 3],
		];
	}

	else if (type === 'J') {
		return [
			[0, 4, 0],
			[0, 4, 0],
			[4, 4, 0],
		];
	}

	else if (type === 'I') {
		return [
			[0, 5, 0, 0],
			[0, 5, 0, 0],
			[0, 5, 0, 0],
			[0, 5, 0, 0],
		];
	}

	else if (type === 'S') {
		return [
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0],
		];
	}

	else if (type === 'Z') {
		return [
			[7, 7, 0],
			[0, 7, 7],
			[0, 0, 0],
		];
	}
}

/**
 * Create a new random piece
 */
function playerReset() {

	// Create new random piece
	const pieces = 'ILJOTSZ';
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

	//If piece touching the ceilling, reset the arena
	if (colide(arena, player)) {
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}

/**
 * Draw the screen of the tetris
 */ 
function draw() {	

	// Paint the context
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

/**
 * Iterate through the matrix of the shape, and decide for each cell
 * weather to color it or not. (0 = transperant, 1 = colorful).
 * @param {*} matrix	the matrix of the shape
 * @param {*} offset 	Increse the pixle size by the offset parameter
 */
function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x,
								 y + offset.y,
								 1, 1);
			}
		});
	});
}

/**
 * Copy the values frmm the player to the arena at current position
 * Ignore the transparant (value = 0)
 * @param {*} arena 
 * @param {*} player 
 */
function merge(arena, player){
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

/**
 * Move shape down
 */
function playerDrop() {

	//  Move piece down
	player.pos.y++;

	// If there is collision, merge the arena and the player position
	if (colide(arena, player)) {
		player.pos.y--;

		// merge the player & arena
		merge(arena, player);

		// When the piece touch the button, start all over again
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}

// Can't exit from the arena
function playerMove(dir) {
	player.pos.x += dir;
	if (colide(arena, player)){
		player.pos.x -= dir;
	}
}

function playerRotate(dir) {
	 const pos = player.pos.x;
	let offset = 1;
	
	rotate(player.matrix, dir);
	
	// Prevent shape from rotate inside the wall
	 while(colide(arena, player)) {
	 	player.pos.x += offset;
	 	offset = -(offset + (offset > 0 ? 1 : -1));
	
	 	if (offset > player.matrix[0].length) {
	 		player.pos.x = pos;
	 		return;
	 	}	
	 }
}

function rotate (matrix, dir){

	// Rotate matrix - put the opposite element
	for(let y =0; y<matrix.length; ++y){
		for (let x =0; x<y; ++x) {
			[
				matrix[x][y],
				matrix[y][x],
			] = [
				matrix[y][x],
				matrix[x][y],
			];
		}
	}

	if (dir > 0) {
		matrix.forEach (row => row.reverse());
	}
	else {
		matrix.reverse
	}
}
	
let dropCounter = 0;

// Every 1 second (1000 milisecond) drop a piece/shape
let dropInterval = 1000;
let lastTime = 0;

/**
 * Drop the piece down every second
 * @param {*} time	Get the time from the animation frame 
 */
function update(time = 0) {
	const deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
		playerDrop();
	}

	draw();
	requestAnimationFrame(update);
}

/**
 * Update the user score
 */
function updateScore(){
	document.getElementById('score').innerText = player.score;
}

// Matrix that represents all the shapes that already fell from above and placed in the board.
const arena = createMatrix(12, 20)

// Draw table in the console that represents the arena 
console.log(arena);
console.table(arena);

const colors = [
	null, 
	"#FBECC4",
	"#7FE5E7",
	"#62BEC3",
	"#F1CAC2",
	"#F1CAC2",
	"#A3C9CF", 
	"#C69EC0",
]

/**
 * Type of shape and where it falls from
 */
const player = {
	// The start point of the board where the piece is falling from
	pos: {x: 0, y: 0},
	// The type of the shape
	matrix: null,
	score: 0,
}

/**
 * Listen to user keyboard
 */
document.addEventListener('keydown', event => { //Listen to keyboard clicks
	//Print to console the details about the keyboard button pressed
	//console.log.length(event);

	// If left arrow on keyboard is pressed, move shape left
	if (event.keyCode === 37) { 
		playerMove(-1);
	}

	// If right arrow on keyboard is pressed, move shape right
	else if (event.keyCode === 39) {
		playerMove(1);
	}

		// If down arrow on keyboard is pressed, move shape down
	else if (event.keyCode === 40) {

		playerDrop();
	}

	else if(event.keyCode === 38) {
		playerRotate(1);
	}
});

playerReset();
updateScore();
update();