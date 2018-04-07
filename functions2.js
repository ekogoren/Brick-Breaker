

	// JavaScript Document
	var gameOver;
	//canvas
	var context;
	var WIDTH = 990; 
	var HEIGHT = 600;
	
	//balls 
	var balls ;
	var threeBallsAtWork;
	var fastDuration;
	var fast;
	var ballsCount;
	var score;
	
	//ball + direction and speed
	
	var radius = 12;
	
	//paddle
	
	paddlex=650;
	paddleh=20;
	paddlew=200;
	
	var paddleColor;
	var paddleTouch;
	var paddleTouchDuration;
	var paddleWidenDuration;
	var paddleShrinkDuration;
	var paddleLastToken;
	var paddlePreviousToken;
	
	//bricks
	var bricks;
	var n_brick_cols = 13;
	var n_brick_rows = 6;
	var brick_padding = 5;
	var brick_width = (WIDTH - (brick_padding * (n_brick_cols + 1))) / n_brick_cols;
	var brick_height = 30; 
	
	pickBrickColor = ["#b29b59", "#ccab52","#e6bb45","#ffc933","#ffd666","#ffdd7f","#ffe499" ];
	
	bricks = new Array(n_brick_rows);
	for (i=0; i<n_brick_rows; i++){
		bricks[i] = new Array(n_brick_cols);
			for (j=0; j<n_brick_cols; j++){
				bricks[i][j] = 1;
		}
	}


//keyboard
var paddleRight = false;
var paddleLeft = false;

var rightDown = false;
var leftDown = false;

//pause/gameover
var pause;
var prepause;
var lostCount;

//mouse
var canvasMinX;
var canvasMaxX;
var canvasStart;


//Tokens
var tokenLetters = new Object();



function start_over(){
	
	$('#sound').attr('src', 'audio/start.mp3');
	$('#sound')[0].play();
	
	clearInterval(frames);
	for(ball in balls){
	delete balls[ball]; 
	}
	for(token in tokenLetters){
	delete tokenLetters[token]; 
	}
	for (i=0; i<n_brick_rows; i++){
		bricks[i] = new Array(n_brick_cols);
			for (j=0; j<n_brick_cols; j++){
			bricks[i][j] = 1;
			}
		}
	
	balls = { 0 : {x : 100, y : 300, dx : 12, dy: 6 }};
	ballsCount = 0;
	
	$("#canvas").css("background-image","none");
	fastDuration = 0;
	paddleTouch = false;
	paddleTouchDuration = 0;
	paddleShrinkDuration = 0;
	paddleWidenDuration = 0;
	paddleColor = "#e6bb45";
	
	fast = false;
	threeBallsAtWork = false;
	
	gameOver = false;
	score = 0;
	pause = false;
	prepause = true;
	lostCount = 0;
	startAnimate();
	$('#score').html(score);
	$("#announce").hide();
	context.clearRect(0,0,WIDTH, HEIGHT);
	window.setTimeout(function(){frames =  setInterval(draw, 20);prepause = false;$("#canvas").css("background-image","url(images/foxes.png)");},1200);
}



function initial(){
	
	
	$('#sound').attr('src', 'audio/start.mp3');
	$('#sound')[0].play();
	
	balls = { 0 : {x : 100, y : 300, dx : 12, dy: 6 }};
	ballsCount = 0;
	
	fastDuration = 0;
	paddleTouch = false;
	paddleTouchDuration = 0;
	paddleShrinkDuration = 0;
	paddleWidenDuration = 0;
	paddleColor = "#e6bb45";
	
	fast = false;
	threeBallsAtWork = false;
	
	gameOver = false;
	score = 0;
	pause = false;
	lostCount = 0;
	prepause = true;
	
	
	$(document).keydown(keyDown);
	$(document).keyup(keyUp);
	$(document).mousemove(onMouseMove);
	$("#canvas").click(initPause);
	$("#announce").click(initPause);
	$("#togglesound").click(toggleSound);
	$(".start_over").click(start_over);
	var context = canvas.getContext("2d");
	startAnimate();
	var canvasStart = $("#canvas").offset().left;
	window.setTimeout(function(){frames =  setInterval(draw, 20);prepause = false;$("#canvas").css("background-image","url(images/foxes.png)");},1200);
	
}

function draw(){
	
	clear();
	drawBalls();
	paddle();
	drawBricks();
	bounce();
	Tokens();
	
	for(ball in balls){
			
			
	}
}

function rect(c,x,y,w,h) {
  context.fillStyle = c;
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
}


function drawBalls(){
	
	if(fastDuration){
		fastDuration--;
	}else if(fast){
		balls[ball].dx *= (2/3);
		balls[ball].dy *= (2/3);
		fast = false;
	}
	
	for(ball in balls){
		
	var dx = balls[ball].dx;	
	var dy = balls[ball].dy;
		
	balls[ball].x += dx;
	balls[ball].y += dy;
		
		var y = balls[ball].y;
		var x = balls[ball].x;
		
	context.fillStyle = "#555";
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI*2, true); 
	context.closePath();
	context.fill();
	}
	
	if(Object.keys(balls).length == 1)threeBallsAtWork = false;
	
}

function clear(){
	context.clearRect(0,0,WIDTH, HEIGHT);
}

 function paddle(){
	 
	if((rightDown) && ((paddlex + paddlew) < WIDTH)) 
	{
		paddlex += 15;
	}
	if((leftDown) && (paddlex > 0)) 
	{
		paddlex -= 15;
	} 
	
	
	if(paddleWidenDuration || paddleShrinkDuration){
		if(paddlew == 200){
			if(paddleLastToken === "W") paddlew = 300;
			else paddlew = 100;
		}
		if(paddlew == 100){
			if(!paddleShrinkDuration || paddleLastToken === "W") paddlew = 200;
		}
		if(paddlew == 300){
			if(paddleLastToken === "S") paddlew = 200;
			
		}
	}else paddlew = 200;
	
	paddleWidenDuration && paddleWidenDuration--;
	paddleShrinkDuration && paddleShrinkDuration--;
	
	 
	rect(paddleColor, paddlex, HEIGHT-paddleh, paddlew, paddleh);
	
	if((paddleTouch) && (paddleTouchDuration == 20)){
		paddleColor = "#e6bb45";
		paddleTouch = false;	
		paddleTouchDuration = 0;
		
	}
	if((paddleTouch) && (paddleTouchDuration < 20)){
		paddleTouchDuration++ ;
	}
 }
 
 
 function drawBricks(){
	 
	var isWon = true;
	for(i=0; i<n_brick_rows; i++){
		for(j=0; j<n_brick_cols; j++){
			
			if(bricks[i][j] == 1){
			var color = pickBrickColor[i];
			 isWon = false;
			 rect(color,
			 (brick_padding + (j*(brick_width+brick_padding))),
			 (brick_padding + (i*(brick_height+brick_padding))),
			 brick_width, brick_height);
			}
	}
}


	 if(isWon == true){
		clearInterval(frames);
		  $("#announce").html("You won!");
		  $("#announce").show(); 
		  for(ball in balls){
			delete balls[ball];  
			gameOver=true;
		  }
	 }
	
	 
}


function Tokens(){
	
	for(token in tokenLetters){
		
		var changedTokenColor;
		tokenSpeed = 10;
		//hit bottom
		if(tokenLetters[token].y > HEIGHT) {delete tokenLetters[token]; break;}
		//collect
		if((tokenLetters[token].y + tokenSpeed > (HEIGHT - paddleh)) && (tokenLetters[token].x - 5 > paddlex) && (tokenLetters[token].x + 5 < paddlex + paddlew)){
			switch(tokenLetters[token].type){
				case "B":
					$('#tokenSound').attr('src', 'audio/bonus.wav');
					$('#tokenSound')[0].play();
					score +=100;
					$('#score').html(score);
					delete tokenLetters[token];
					break;
				case "W":
					$('#tokenSound').attr('src', 'audio/bonus.wav');
					$('#tokenSound')[0].play();
					score +=20;
					$('#score').html(score);
					if(!paddleWidenDuration) paddlex -= 50;
					paddleWidenDuration += 150;
					paddlePrevousToken = paddleLastToken;
					paddleLastToken = "W";
					delete tokenLetters[token];
					break;
				case "3":
					$('#tokenSound').attr('src', 'audio/bonus.wav');
					$('#tokenSound')[0].play();
					score +=30;
					$('#score').html(score);
					threeBalls();
					delete tokenLetters[token];
					break;
				case "F":
					$('#tokenSound').attr('src', 'audio/bad_token.wav');
					$('#tokenSound')[0].play();
					score -=100;
					$('#score').html(score);
					if(!fastDuration){
						for(ball in balls){
						balls[ball].dx *= 1.5;	
						balls[ball].dy *= 1.5;
						}
						fast = true;
					}
					fastDuration += 20;
					delete tokenLetters[token];
					break;
				case "S":
					$('#tokenSound').attr('src', 'audio/bad_token.wav');
					$('#tokenSound')[0].play();
					score -=100;
					$('#score').html(score);
					if(!paddleShrinkDuration) paddlex += 50;
					paddleShrinkDuration += 150;
					paddlePrevousToken = paddleLastToken;
					paddleLastToken = "S";
					delete tokenLetters[token];
					break;
			}
		}
		
		
		if(tokenLetters[token]){
			
		var tokenColor;
		var changedTokenColor;
		
		var tokenX = tokenLetters[token].x;
		var tokenY = tokenLetters[token].y += tokenSpeed;
		var type = tokenLetters[token].type;
		++tokenLetters[token].color;
		switch(tokenLetters[token].type){
		case("B"):tokenColor = "#000";changedTokenColor = "#e6bb45";break;
		case("W"):tokenColor = "#000";changedTokenColor = "#050";;break;
		case("3"):tokenColor = "#000";changedTokenColor = "#0CC";break;
		case("F"):tokenColor = "#bd0a01";changedTokenColor = "#000";break;
		case("S"):tokenColor = "#bd0a01";changedTokenColor = "#ffffff";break;
		}
		
		
	
		((tokenLetters[token].color % 7) !== 0) ? tokenColor : tokenColor = changedTokenColor;
		
		context.fillStyle = tokenColor;
		context.font="45px Arial Black, Gadget, sans-serif";
		context.fillText(type,tokenX,tokenY);
	
		
	}
	}
	
	
	function threeBalls(){
		if(!threeBallsAtWork){
			for(ball in balls){
		
			var y = balls[ball].y;
			var x = balls[ball].x;	
			var dx = balls[ball].dx;	
			var dy = balls[ball].dy;	
			
			balls[++ballsCount] =  {x : x, y : y, dx : -dx, dy: dy };
			balls[++ballsCount] =  {x : x, y : y, dx : dx, dy: -dy };
			threeBallsAtWork = true;
			
						 
			
			}
			
		}
		
	}
	
}
 
 
 function bounce(){
	 
	 
	 
	 //bricks
	
	function brickHit(i,j,y,x){
		bricks[i][j] = 0;
		$('#sound').attr('src', 'audio/brick.wav');
		$('#sound')[0].play();
		score += 12;
		$('#score').html(score);
		var random = Math.random();
		if(random < 0.7){
			tokenLetters["pos-i"+i+"j"+j] = new Object;
			var newToken = tokenLetters["pos-i"+i+"j"+j];
			newToken["y"] = y;
			newToken["x"] = x;
			newToken["color"] = 0;
			
			 random = Math.random();
			if(threeBallsAtWork){
				if(random <= 0.25)newToken["type"] = "B";
				else if(random <= 0.5)newToken["type"] = "W";
				else if(random <= 0.75)newToken["type"] = "F";
				else if(random <= 1)newToken["type"] = "S";
				}else{
				if(random <= 0.2)newToken["type"] = "B";
				else if(random <= 0.4)newToken["type"] = "W";	
				else if(random <= 0.6)newToken["type"] = "3";
				else if(random <= 0.8)newToken["type"] = "F";
				else if(random <= 1)newToken["type"] = "S";
				}
			
		}
	}
	
	
	
	
	
	 for(i=0; i<n_brick_rows; i++){
		for(j=0; j<n_brick_cols; j++){
			
			var brick_x_l = brick_padding + (j*(brick_width+brick_padding));
			var brick_x_r = brick_width + brick_padding + (j*(brick_width+brick_padding));
			var brick_y_b =  (brick_padding + brick_height + (i*(brick_height+brick_padding)));
			var brick_y_t =  (brick_padding + (i*(brick_height+brick_padding)));
			var brick_edge = brick_height *0.4;
			var tokenY = brick_y_b;
			var tokenX = (0.5*brick_width) + brick_padding + (j*(brick_width+brick_padding));
			
			if(bricks[i][j] == 1){
			
			for(ball in balls){
		
			var y = balls[ball].y;
			var x = balls[ball].x;	
			var dx = balls[ball].dx;	
			var dy = balls[ball].dy;	
			
				//directions
				var  ballDirection;
				
				if((dx<0) && (dy<0)) ballDirection = "up left";
				if((dx>0) && (dy<0)) ballDirection = "up right";
				if((dx<0) && (dy>0)) ballDirection = "down left";
				if((dx>0) && (dy>0)) ballDirection = "down right";
				
				
				
				if( ballDirection == "up left" && ((y + dy - radius) <= brick_y_b) && ((y + dy + radius) >= brick_y_t) && ( ((x + dx - radius) >= brick_x_l) && ( (x + dx - radius) <= brick_x_r) )  ){
					 if((y-radius < brick_y_b) ){
					 //dy = -(dy);
					balls[ball].dx = -(dx); 
					 	}else{
					 balls[ball].dy = -(dy);
					 }
				  brickHit(i,j, tokenY,tokenX);
				
				}else
				
				if( ballDirection == "down left" && ((y + dy + radius) >= (brick_y_t)) && ((y + dy - radius) <= brick_y_b) && ( ((x + dx - radius) >= brick_x_l) && ( (x + dx - radius) <= brick_x_r ) )  ){
					 if( (y+radius > (brick_y_t))  ){
					 //dy = -(dy);
					 balls[ball].dx = -(dx); 
					 	}else{
					 balls[ball].dy = -(dy);
					 }
				   brickHit(i,j, tokenY,tokenX);
				  	
				}else
				
				if( ballDirection == "up right" && ((y + dy - radius) <= brick_y_b) && ((y + dy + radius) >= brick_y_t) && ( ((x + dx + radius) >= brick_x_l) && ( (x + dx + radius) <= brick_x_r ) )  ){
					if((y-radius < brick_y_b) ){
					 //dy = -(dy);
					 balls[ball].dx = -(dx); 
					 	}else{
					 balls[ball].dy = -(dy);
					 }
				   brickHit(i,j, tokenY,tokenX);
				  
				}else
				
				if( ballDirection == "down right" && ((y + dy + radius) >= brick_y_t) && ((y + dy - radius) <= brick_y_b) && ( ((x + dx + radius) >= brick_x_l) && ( (x + dx + radius) < brick_x_r ) )  ){
					 if( (y+radius > (brick_y_t))  ){
					 //dy = -(dy);
					 balls[ball].dx = -(dx); 
					 	}else{
					 balls[ball].dy = -(dy);
					 }
				  brickHit(i,j, tokenY,tokenX);
				}
				
								
				
			  
 	
			}
		
			}
	 }
	 
	 //walls
	 
	 for(ball in balls){
		
			var y = balls[ball].y;
			var x = balls[ball].x;	
			var dx = balls[ball].dx;	
			var dy = balls[ball].dy;
			
	 
	 if ((x + dx + radius) > WIDTH || (x + dx - radius) < 0){
     balls[ball].dx = -(dx);
	 $('#sound').attr('src', 'audio/wall.wav');
		$('#sound')[0].play();
	 }
	 
	 if((y + dy - radius) < 0){
		  balls[ball].dy = -(dy);
		   $('#sound').attr('src', 'audio/wall.wav');
		$('#sound')[0].play();
	 }


	//paddle
	if ((y + dy > (HEIGHT-radius-paddleh)) && (lostCount == 0)){
    	if( ((x+dx) > (paddlex-(radius*2))) && ((x+dx) < (paddlex + paddlew+(radius*2)) )){
   			 //below surface or on edge
			 if( ((HEIGHT-y-dy) < paddleh) || ( (x+dx) < ((paddlex + (paddlew*0.1))+(radius*2)) ) || (  (x+dx) > (paddlex + (paddlew*0.9)-(radius*2))   ) ) {
				 //considering current movement
			 	if( ((rightDown) && (dx > 0)) || ((leftDown) && (dx < 0))){
				   	balls[ball].dy = -(dy);
					 paddleColor = "#ffc933";
					 paddleTouch = true;
					 $('#sound')[0].play();
					}else{
					balls[ball].dy = -(dy);
					 balls[ball].dx = -(dx);
					paddleColor = "#ffc933";
					paddleTouch = true;
					$('#sound').attr('src', 'audio/paddle.wav');
					$('#sound')[0].play();
				}
			 }else{
			 
			 balls[ball].dy = -(dy);
			 paddleColor = "#ffc933";
			 paddleTouch = true;
			 $('#sound').attr('src', 'audio/paddle.wav');
			 $('#sound')[0].play();
			 }
  	}
		
		
	}
	//lost
	if(y > (HEIGHT+radius)){
		delete balls[ball];
		//var emptyCheck = isEmpty();	
			if(isEmpty()){
			clearInterval(frames);
		  $("#announce").html("game over");
		  $("#announce").show();
			gameOver=true;
			 $('#sound').attr('src', 'audio/game_over.wav');
			 $('#sound')[0].play();
			
			}
			
			
			
		} 	
}

	 }

 }


//mouse and keyboard

function keyDown(key){
	if (key.keyCode == 39) rightDown = true; 
  else if (key.keyCode == 37) leftDown = true;
  else if (key.keyCode == 32) {
	  initPause();
  }
}	

function initPause(){
	if(!gameOver && !prepause){
	if(!pause) {
		  clearInterval(frames);
		  pause = true;
		   $("#announce").html("pause");
		  $("#announce").show();
		  pauseAnimate();
	  }else if(pause){
		  frames = setInterval(draw, 20);
		  pause = false;
		   $("#announce").hide();
	  }
	}
}

function keyUp(key){
	if (key.keyCode == 39) rightDown = false;
  else if (key.keyCode == 37) leftDown = false;
}

function init_mouse() {
  canvasStart = $("#canvas").offset().left;
  canvasMinX = canvasStart - (paddlew*0.2);
  canvasMaxX = canvasStart + WIDTH - (paddlew*0.2);
}

function onMouseMove(evt) {
	init_mouse();
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
    paddlex = evt.pageX - canvasStart;
	

  }
}


function toggleSound(){
	if(document.getElementById('sound').muted){
		document.getElementById('sound').muted = false;
		document.getElementById('tokenSound').muted = false;
		$("#togglesound").css("background-image", "url(images/sound_on.png)");	
	}else{
		document.getElementById('sound').muted = true;
		document.getElementById('tokenSound').muted = true;
		$("#togglesound").css("background-image","url(images/sound_off.png)");	
	}
	
}


//animations

function startAnimate(){
	
	$('#canvas').css({height: 550, width: 850, opacity: 0});
	$('.sidebar').css({right:150, opacity:0})
	$('#canvas').animate({width: "990px", height: "600px", opacity: 1}, 250);
	$('.sidebar').delay(250).animate({right: "0px", opacity: 1}, 550);
	
	
		
}

function pauseAnimate(){
	
	if(pause){
		$('#announce').animate( {top : 150}, 350, function(){
			$('#announce').animate( {top : 155}, 350, function(){
			
			pauseAnimate();
			
		});
			
			
		});
	}
}

function isEmpty(){
				 for(ball in balls){
					 return false;
				 }
				 return true;
			
				
			}




