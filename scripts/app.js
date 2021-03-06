var context;
var number_of_ghosts;
var shape = new Object();
var ghost = [new Object(), new Object(), new Object(), new Object()];
var cherry = new Object();
var mushroom = new Object();
var heartMov=new Object();
var lst_ghost = [0, 0, 0, 0];  // what was where the ghost walk
var lst_cherry=0;
var lst_heart=0;
var ghost_speed = 0.3;
var cherry_speed = 0.7;
var heart_speed=0.5;
var cherryNotEaten=true;
var mushroomExist=false;
var timeExist=false;
var heartExist=false;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var timeGlass=new Object();
var maxTime;
var timeSave;
var interval;
var last_pos = 1;
var ghost_sprite;
var cherry_sprite;
var time_sprite;
var heart_sprite;
var mushroom_sprite;
var heart = 5;
var pacman_remain = 1;
var totalFood;
var goalFood;
var dotcolor5;
var dotcolor15;
var dotcolor25;
var up;
var down;
var left;
var right;
var music= new Audio('pacMan.mp3');

$(document).ready(function() {
	context = canvas.getContext("2d");

	ghost_sprite = new Image();
	ghost_sprite.src = "./imgs/ghost.png";
	cherry_sprite = new Image();
	cherry_sprite.src = "./imgs/cherry.png";
	mushroom_sprite = new Image();
	mushroom_sprite.src = "./imgs/mushroom.png";
	time_sprite = new Image();
	time_sprite.src = "./imgs/time1.png";
	heart_sprite = new Image();
	heart_sprite.src = "./imgs/heart.png";
});


function Start() {
	// starting settings
	music.loop=true;
	music.play();
	maxTime=document.getElementById("setTm").value;
	document.getElementById("registerBTN").style.pointerEvents="none";
	document.getElementById("welcomBTN").style.pointerEvents="none";
	document.getElementById("loginBTN").style.pointerEvents="none";
	heart = 5;
	for(var i=1; i<=heart; i++){
		document.getElementById('heart'+i).src = "./imgs/heart.png";
	}
	
	lst_ghost = [0, 0, 0, 0];
	lst_cherry=0;
	lst_heart=0;
	mushroom_cherry=0;
	last_pos = 1;
	pacman_remain = 1;

	cherryNotEaten=true;
	mushroomExist=false;
	timeExist=false;
	heartExist=false;


	up=document.getElementById("UpKey").value;
	down=document.getElementById("DownKey").value;
	left=document.getElementById("LeftKey").value;
	right=document.getElementById("RightKey").value;

	number_of_ghosts = $( "#ghosts" ).val();
	totalFood = $( "#dots" ).val();

	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = Math.min(50, totalFood);
	goalFood = food_remain;
	totalFood -= goalFood;
	start_time = new Date();
	let counter = 0;
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles
		for (var j = 0; j < 10; j++) {
			if((i==0&&j==0 || i==0&&j==9 || i==9&&j==0 || i==9&&j==9) && counter < number_of_ghosts){  // ghosts
				ghost[counter].i = i;
				ghost[counter].j = j;
				board[i][j]=5
				counter++;
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
				if (randomNum < (1.0 * food_remain) / cnt) {  // points
					food_remain--;
					var randomNum2 = Math.random();
                    if (randomNum2>=0.6)
                        board[i][j] = 1;
                    else if (randomNum2>=0.3&&randomNum2<0.6)
                        board[i][j] = 3;
                    else   
                        board[i][j] = 7;
				} else {  // empty
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}

	while (pacman_remain != 0){  // if pacman not located
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

	addEventListener(
		"keydown",
		function(e) {
			let key = e.keyCode;
			if(key == 37) 
				key = "Left";
			else if(key == 38) 
				key = "Up";
			else if(key == 39) 
				key = "Right";
			else if(key == 40) 
				key = "Down";
			else
				key=String.fromCharCode(key);

			keysDown[key] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			let key = e.keyCode;
			if(key == 37) 
				key = "Left";
			else if(key == 38) 
				key = "Up";
			else if(key == 39) 
				key = "Right";
			else if(key == 40) 
				key = "Down";
			else
				key=String.fromCharCode(key);
				
			keysDown[key] = false;
		},
		false
	);
	clearInterval(interval);
	interval = setInterval(UpdatePosition, 250);
}

function respawn() {
	if (pacman_remain == 0)
		return;

	var i = Math.floor(Math.random() * 5 + 3);
	var j = Math.floor(Math.random() * 5 + 3);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 5 + 3);
		j = Math.floor(Math.random() * 5 + 3);
	}
	
	shape.i = i;
	shape.j = j;
	pacman_remain--;
	board[i][j] = 2;
}

function wildMushroomAppeared(){
	if(mushroomExist)
		return;

	var emptyCell = findRandomEmptyCell(board);
	i = emptyCell[0];
	j = emptyCell[1];
	mushroom.i = i;
	mushroom.j = j;
	board[i][j] = 8;
	mushroomExist=true;
}

function randomHeartAppeared(){
	if(heartExist)
		return;

	var emptyCell = findRandomEmptyCell(board);
	i = emptyCell[0];
	j = emptyCell[1];
	heartMov.i = i;
	heartMov.j = j;
	board[i][j] = 10;
	heartExist = true;
}

function randomTimeAppeared(){
	if(!timeExist)
		return;

	var emptyCell = findRandomEmptyCell(board);
	i = emptyCell[0];
	j = emptyCell[1];
	timeGlass.i = i;
	timeGlass.j = j;
	board[i][j] = 9;
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
	if (keysDown[up]) {
		return 1;
	}
	if (keysDown[down]) {
		return 2;
	}
	if (keysDown[left]) {
		return 3;
	}
	if (keysDown[right]) {
		return 4;
	}
}

function Draw() {
	dotcolor5=document.getElementById("5color")
	dotcolor15=document.getElementById("15color")
	dotcolor25=document.getElementById("25color")
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
				context.fillStyle = dotcolor5.value//5points
				context.fill();
			} 
			else if (board[i][j] == 3) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = dotcolor15.value; //15points
				context.fill();
			}
			else if (board[i][j] == 7) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = dotcolor25.value; //25points
				context.fill();
			}
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j]==5){
				context.drawImage(ghost_sprite, center.x-15, center.y-15);
			}
			else if (board[i][j]==6){
				context.drawImage(cherry_sprite, center.x-15, center.y-15);
			}
			else if(board[i][j]==8){
				context.drawImage(mushroom_sprite, center.x-15, center.y-15);
			}
			else if(board[i][j]==9){
				context.drawImage(time_sprite, center.x-15, center.y-15);
			}
			else if(board[i][j]==10)
			{
				context.drawImage(heart_sprite, center.x-15, center.y-15);
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
		goalFood--;
	}
	else if (board[shape.i][shape.j] == 3) {
		score+=15;
		goalFood--;
	}
	else if (board[shape.i][shape.j] == 7) {
		score+=25;
		goalFood--;
	}
	else if (board[shape.i][shape.j] == 6){
		score += 50;
		cherryNotEaten = false;
		
		if(lst_cherry != 0){
			goalFood--;
		}
	}
	else if (board[shape.i][shape.j] == 8){ //  touched wild mushroom
		var randomNum2 = Math.random();

		if(number_of_ghosts == 1 || (number_of_ghosts != 4 && randomNum2<=0.5)){
			if(number_of_ghosts == 1){
				ghost[number_of_ghosts].i = 0;
				ghost[number_of_ghosts].j = 9;
				lst_ghost[number_of_ghosts] = board[0][9];
			}
			else if(number_of_ghosts == 2){
				ghost[number_of_ghosts].i = 9;
				ghost[number_of_ghosts].j = 0;
				lst_ghost[number_of_ghosts] = board[9][0];
			}
			else if(number_of_ghosts == 3){
				ghost[number_of_ghosts].i = 9;
				ghost[number_of_ghosts].j = 9;
				lst_ghost[number_of_ghosts] = board[9][9];
			}
			number_of_ghosts++;
		}
		else{
			number_of_ghosts--;
			board[Math.floor(ghost[number_of_ghosts].i)][Math.floor(ghost[number_of_ghosts].j)] = lst_ghost[number_of_ghosts];
		}
		
		
		mushroomExist=false;
	}
	else if (board[shape.i][shape.j] == 9){ //  touched time
		start_time.setSeconds(start_time.getSeconds()+10);
		timeExist=false;
	}
	else if (board[shape.i][shape.j] == 10){  // touched heart
		heart++;
		document.getElementById('heart'+heart).src = "./imgs/heart.png";
		heartExist=false;

		if(lst_heart != 0){
			goalFood--;
		}
	}

	if(heartExist){

		lst_heart = randomlyMove(heartMov, heart_speed, lst_heart);	
		if(Math.floor(heartMov.i)==shape.i && Math.floor(heartMov.j)==shape.j){  // touched heart
			heart++;
			document.getElementById('heart'+heart).src = "./imgs/heart.png";
			heartExist=false;

			if(lst_heart != 0){
				goalFood--;
			}
		}
		else{
			board[Math.floor(heartMov.i)][Math.floor(heartMov.j)] = 10; 
		}
	}

	if(cherryNotEaten){

		lst_cherry = randomlyMove(cherry, cherry_speed, lst_cherry);	
		if(Math.floor(cherry.i)==shape.i && Math.floor(cherry.j)==shape.j){
			score += 50;
			cherryNotEaten = false;

			if(lst_heart != 0){
				goalFood--;
			}
		}
		else{
			board[Math.floor(cherry.i)][Math.floor(cherry.j)] = 6;
		}
	}

	board[shape.i][shape.j] = 2;

	for(i=0; i<number_of_ghosts; i++){
		
		lst_ghost[i] = followPlayer(ghost[i], lst_ghost[i], ghost_speed);

		if(Math.floor(ghost[i].i)==shape.i && Math.floor(ghost[i].j)==shape.j){
			// player collision with ghost
			PlayerDie();
			return;
		}

		board[Math.floor(ghost[i].i)][Math.floor(ghost[i].j)] = 5;
	}

	
	
	if (Math.floor(time_elapsed%10)==0&&Math.floor(time_elapsed)!=0&&mushroomExist==false){
		timeSave=time_elapsed
		
		wildMushroomAppeared();

		if(heart<5 && !heartExist){
			randomHeartAppeared();
		}
		
	}

	if (Math.floor(time_elapsed%10)==0&&Math.floor(time_elapsed)!=0&&timeExist==false){
		timeExist=true;
		randomTimeAppeared();
	}

	if(time_elapsed-timeSave>=5){
		if (mushroomExist){
			board[mushroom.i][mushroom.j] = 0;
			mushroomExist=false;
		}

		if (heartExist){
			board[Math.floor(heartMov.i)][Math.floor(heartMov.j)] = lst_heart;
			heartExist=false;
		}
		
	}

	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (goalFood == 0) {
		if(totalFood != 0){
			goalFood += totalFood;
			while (totalFood > 0) {
				var emptyCell = findRandomEmptyCell(board);
				var randomNum2 = Math.random();
		
				if (randomNum2>=0.6)
					board[emptyCell[0]][emptyCell[1]] = 1;
				else if (randomNum2>=0.3&&randomNum2<0.6)
					board[emptyCell[0]][emptyCell[1]] = 3;
				else
					board[emptyCell[0]][emptyCell[1]] = 7;
		
				totalFood--;
			}
		}
		else{
			window.clearInterval(interval);
			music.pause();
			window.alert("Game 100% completed - you are a winner!");
			document.getElementById('playA').style.visibility = "visible";
			document.getElementById('playA').disabled = false;
			document.getElementById("registerBTN").style.pointerEvents="all";
			document.getElementById("welcomBTN").style.pointerEvents="all";
			document.getElementById("loginBTN").style.pointerEvents="all";
		}
	}
	if(Math.floor(time_elapsed)>=maxTime){
		window.clearInterval(interval);
		if(score<100){
			music.pause();
			window.alert("You are better then "+ score+" points!");
			document.getElementById('playA').style.visibility = "visible";
			document.getElementById('playA').disabled = false;
			document.getElementById("registerBTN").style.pointerEvents="all";
			document.getElementById("welcomBTN").style.pointerEvents="all";
			document.getElementById("loginBTN").style.pointerEvents="all";
		}
		else
		{
			music.pause();
			window.alert("Winner!!!");
			document.getElementById('playA').style.visibility = "visible";
			document.getElementById('playA').disabled = false;
			document.getElementById("registerBTN").style.pointerEvents="all";
			document.getElementById("welcomBTN").style.pointerEvents="all";
			document.getElementById("loginBTN").style.pointerEvents="all";
		}
	}
	 else {
		Draw();
	}
}

function PlayerDie() {
	board[shape.i][shape.j]=0;

	board[shape.i][shape.j] = 0;

	for(i=0; i<number_of_ghosts; i++){
		if (lst_ghost[i] != 2)
			board[Math.floor(ghost[i].i)][Math.floor(ghost[i].j)] = lst_ghost[i];
	}

	if(mushroomExist){
		board[mushroom.i][mushroom.j] = 0;
		mushroomExist=false;
	}

	ghost[0].i = 0;
	ghost[0].j = 0;
	board[0][0]=5;

	if(number_of_ghosts >= 2){
		ghost[1].i = 0;
		ghost[1].j = 9;
		board[0][9]=5;
	}

	if(number_of_ghosts >= 3){
		ghost[2].i = 9;
		ghost[2].j = 0;
		board[9][0]=5;
	}

	if(number_of_ghosts >= 4){
		ghost[3].i = 9;
		ghost[3].j = 9;
		board[9][9]=5;
	}

	lst_ghost = [0, 0, 0, 0];

	score-=10;
	lblScore.value = score;
	document.getElementById('heart'+heart).src = "./imgs/ghost.png";
	heart--;
	if(heart==0){
		// game over
		window.clearInterval(interval);
		music.pause();
		window.alert("Loser!");
		document.getElementById('playA').style.visibility = "visible";
		document.getElementById('playA').disabled = false;
		document.getElementById("registerBTN").style.pointerEvents="all";
		document.getElementById("welcomBTN").style.pointerEvents="all";
		document.getElementById("loginBTN").style.pointerEvents="all";
	}
	pacman_remain++;
	respawn();
}

function followPlayer(obj, lst_obj, obj_speed) {
	// return;  // uncomment when want easy mode

	let i = obj.i, j =obj.j;
	let samePlace = false;

	board[Math.floor(obj.i)][Math.floor(obj.j)] = lst_obj;
	var randomNum2 = Math.random();
	if (randomNum2<=0.5){
		if (Math.floor(obj.i) < shape.i){
			if(validPos(obj.i+1, obj.j)){
				obj.i += obj_speed;
			}
		}
		else if (Math.floor(obj.i) > shape.i){
			if(validPos(obj.i-1, obj.j)){
				obj.i -= obj_speed;
			}
		}
		else if (Math.floor(obj.j) < shape.j){
			if(validPos(obj.i, obj.j+1)){
				obj.j += obj_speed;
			}
		}
		else if (Math.floor(obj.j) > shape.j){
			if(validPos(obj.i, obj.j-1)){
				obj.j -= obj_speed;
			}
		}	
		else{
			samePlace = true;
		}	
	}
	else{
		if (Math.floor(obj.j) < shape.j){
			if(validPos(obj.i, obj.j+1)){
				obj.j += obj_speed;
			}
		}
		else if (Math.floor(obj.j) > shape.j){
			if(validPos(obj.i, obj.j-1)){
				obj.j -= obj_speed;
			}
		}
		else if (Math.floor(obj.i) < shape.i){
			if(validPos(obj.i+1, obj.j)){
				obj.i += obj_speed;
			}
		}
		else if (Math.floor(obj.i) > shape.i){
			if(validPos(obj.i-1, obj.j)){
				obj.i -= obj_speed;
			}
		}
		else{
			samePlace = true;
		}	
	}

	// if didn't move and need to move - randomly move
	if(i == obj.i && j == obj.j && !samePlace){
		randomlyMoveLoc(obj, obj_speed);
	}

	lst_obj = board[Math.floor(obj.i)][Math.floor(obj.j)];

	return lst_obj;
}

function randomlyMove(obj, obj_speed, lst_obj) {

	board[Math.floor(obj.i)][Math.floor(obj.j)] = lst_obj;
	randomlyMoveLoc(obj, obj_speed);
	lst_obj = board[Math.floor(obj.i)][Math.floor(obj.j)];

	return lst_obj;
}

function randomlyMoveLoc(obj, obj_speed) {

	var randomNum3 = Math.random();
	if(randomNum3<=0.25 && validPos(obj.i, obj.j+1)){
		obj.j+=obj_speed;
	}
	else if(randomNum3<=0.5 && randomNum3>0.25 && validPos(obj.i, obj.j-1)){
		obj.j-=obj_speed;
	}
	else if(randomNum3<=0.75 && randomNum3>0.5 && validPos(obj.i+1, obj.j)){
		obj.i+=obj_speed;
	}
	else if(randomNum3>0.75 && validPos(obj.i-1, obj.j)){
		obj.i-=obj_speed;
	}
}

function validPos(i, j) {
	i = Math.floor(i);
	j = Math.floor(j);

	if(i < 0 || j < 0 || i > 9 || j > 9)  // valid position on grid
		return false;
	if(board[i][j] == 4)  // can't touch walls
		return false;
	if(board[i][j] == 5)  // can't touch cherry
		return false;
	if(board[i][j] == 6)  // can't touch ghost
		return false;
	if(board[i][j] == 8)  // can't touch wild mushroom
		return false;
	if(board[i][j] == 10)  // can't touch heart
		return false;
	return true;
}