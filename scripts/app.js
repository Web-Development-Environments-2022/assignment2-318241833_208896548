var context;
var shape = new Object();
var ghost = new Object();
var cherry = new Object();
var lst_ghost = 0;  // what was where the ghost walk
var lst_cherry=0;
var ghost_speed = 0.5;  // 0.3
var cherry_speed=0.3;
var cherryNotEaten=true;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var last_pos = 1;
var ghost_sprite;
var cherry_sprite;
var heart = 5;
var pacman_remain = 1;

$(document).ready(function() {
	context = canvas.getContext("2d");
	// Start();
});


function Start() {

	document.getElementById('heart1').src = "./imgs/heart.png";
	document.getElementById('heart2').src = "./imgs/heart.png";
	document.getElementById('heart3').src = "./imgs/heart.png";
	document.getElementById('heart4').src = "./imgs/heart.png";
	document.getElementById('heart5').src = "./imgs/heart.png";
	heart = 5;
	lst_ghost = 0;
	lst_cherry=0;
	cherryNotEaten=true;
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles
		for (var j = 0; j < 10; j++) {
			if(i==0&&j==0){  // ghost
				ghost.i = i;
				ghost.j = j;
				board[i][j]=5
			}
			else if(i==5&&j==5){  // cherry
				cherry.i = i;
				cherry.j = j;
				board[i][j]=6
			}
			else if (  // wall
				(i==1&&j==0)||
				(i==5&&j==0)||
				(i==9&&j==1)||
				(i==3&&j==1)||
				(i==7&&j==1)||
				(i==0&&j==2)||
				(i==2&&j==2)||
				(i==3&&j==2)||
				(i==4&&j==2)||
				(i==6&&j==2)||
				(i==7&&j==2)||
				(i==8&&j==2)||
				(i==0&&j==4)||
				(i==1&&j==4)||
				(i==3&&j==4)||
				(i==4&&j==4)||
				(i==6&&j==4)||
				(i==8&&j==4)||
				(i==9&&j==4)||
				(i==4&&j==5)||
				(i==6&&j==5)||
				(i==1&&j==6)||
				(i==2&&j==6)||
				(i==8&&j==6)||
				(i==3&&j==7)||
				(i==5&&j==7)||
				(i==6&&j==7)||
				(i==1&&j==8)||
				(i==2&&j==8)||
				(i==3&&j==8)||
				(i==5&&j==8)||
				(i==7&&j==8)||
				(i == 9 && j == 8)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {  // points
					food_remain--;
					var randomNum2 = Math.random();
                    if (randomNum2>=0.6)
                        board[i][j] = 1;
                    else if (randomNum2>=0.3&&randomNum2<0.6)
                        board[i][j] = 3;
                    else   
                        board[i][j] = 7;
				} else if (pacman_remain != 0 && (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt)) {  // pacman
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {  // empty
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}

	if (pacman_remain != 0){  // if pacman not located
		respawn();
	}

	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		var randomNum2 = Math.random();

		if (randomNum2>=0.6)
			board[emptyCell[0]][emptyCell[1]] = 1;
		else if (randomNum2>=0.3&&randomNum2<0.6)
			board[emptyCell[0]][emptyCell[1]] = 3;
		else
			board[emptyCell[0]][emptyCell[1]] = 7;

		food_remain--;
	}

	keysDown = {};

	ghost_sprite = new Image();
	ghost_sprite.src = "./imgs/ghost.png";
	cherry_sprite = new Image();
	cherry_sprite.src = "./imgs/cherry.png";

	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function respawn() {
	while(pacman_remain != 0){
		for (var i = 0; i < 10; i++){
			for (var j = 0; j < 10; j++) {
				var randomNum2 = Math.random();
				if (board[i][j] == 0 && randomNum2<=0.3){
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;

					if (pacman_remain == 0)
						return;
				}
			}
		}
	}
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				if (last_pos == 1)
					context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // mouth right
				else if (last_pos == 2)	
					context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // mouth down
				else if (last_pos == 3)
					context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // mouth left
				else if (last_pos == 4)
					context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // mouth up
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				if (last_pos == 1)
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // eye right
				else if (last_pos == 2)
					context.arc(center.x + 15, center.y - 5, 5, 0, 2 * Math.PI); // eye down
				else if (last_pos == 3)
					context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // eye left
				else if (last_pos == 4)
					context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // eye up
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} 
			else if (board[i][j] == 3) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "red"; //color
				context.fill();
			}
			else if (board[i][j] == 7) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "green"; //color
				context.fill();
			}
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			if (board[i][j]==5){
				context.drawImage(ghost_sprite, center.x-15, center.y-15);
			}
			if (board[i][j]==6){
				context.drawImage(cherry_sprite, center.x-15, center.y-15);
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			last_pos = 4;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			last_pos = 2;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			last_pos = 3;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			last_pos = 1;
		}
	}

	// score
	if (board[shape.i][shape.j] == 1) {
		score+=5;
	}
	// else if (board[shape.i][shape.j] == 6) {
	// 	score+=50;
	// }
	else if (board[shape.i][shape.j] == 3) {
		score+=15;
	}
	else if (board[shape.i][shape.j] == 7) {
		score+=25;
	}


	board[Math.floor(ghost.i)][Math.floor(ghost.j)] = lst_ghost;
	var randomNum2 = Math.random();
	if (randomNum2<=0.5){
		if (Math.floor(ghost.i) < shape.i){
			if(board[Math.floor(ghost.i+1)][Math.floor(ghost.j)] != 4)
				ghost.i += ghost_speed;
		}
		else if (Math.floor(ghost.i) > shape.i){
			if(board[Math.floor(ghost.i-1)][Math.floor(ghost.j)] != 4)
				ghost.i -= ghost_speed;
		}			
	}
	else{
		if (Math.floor(ghost.j) < shape.j){
			if(board[Math.floor(ghost.i)][Math.floor(ghost.j+1)] != 4)
				ghost.j += ghost_speed;
		}
		else if (Math.floor(ghost.j) > shape.j){
			if(board[Math.floor(ghost.i)][Math.floor(ghost.j-1)] != 4)
				ghost.j -= ghost_speed;
		}
	}
	if(cherryNotEaten){
		board[Math.floor(cherry.i)][Math.floor(cherry.j)] = lst_cherry;
		var randomNum3 = Math.random();
		if(randomNum3<=0.25){
			if(board[Math.floor(cherry.i)][Math.floor(cherry.j+1)] != 4)
				cherry.j+=cherry_speed;
		}
		if(randomNum3<=0.5 && randomNum3>0.25){
			if(board[Math.floor(cherry.i)][Math.floor(cherry.j-1)] != 4)
				cherry.j-=cherry_speed;
		}
		if(randomNum3<=0.75 && randomNum3>0.5){
			if(board[Math.floor(cherry.i+1)][Math.floor(cherry.j)] != 4)
				cherry.i+=cherry_speed;
		}
		if(randomNum3>0.75){
			if(board[Math.floor(cherry.i-1)][Math.floor(cherry.j)] != 4)
				cherry.i-=cherry_speed;
		}

		lst_cherry = board[Math.floor(cherry.i)][Math.floor(cherry.j)];

		board[Math.floor(cherry.i)][Math.floor(cherry.j)] = 6;
		if(Math.floor(cherry.i)==shape.i && Math.floor(cherry.j)==shape.j){
			score+=50;
			cherryNotEaten=false;
		}
	}	
			// check ghost stayed in the same location randomy move somewhere else

	lst_ghost = board[Math.floor(ghost.i)][Math.floor(ghost.j)];

	
		


	if(Math.floor(ghost.i)==shape.i && Math.floor(ghost.j)==shape.j){
		// player collision with ghost
		PlayerDie();
		return;
	}

	board[shape.i][shape.j] = 2;
	board[Math.floor(ghost.i)][Math.floor(ghost.j)] = 5;
	

	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 1500) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

function PlayerDie() {
	ghost.i = 0;
	ghost.j = 0;
	board[0][0]=5

	score-=10;
	document.getElementById('heart'+heart).src = "./imgs/ghost.png";
	heart--;
	if(heart==0){
		// game over
		window.clearInterval(interval);
		window.alert("Game Over");
	}
	pacman_remain++;
	respawn();
}