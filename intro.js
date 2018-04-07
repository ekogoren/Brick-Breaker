// JavaScript Document
var blinkCount=0;
var blinking


var scenes = ["s2","s3","s4","s5","s6","s7"];

function intro(){
	
	$('#introSound')[0].play();
	$('#skip').click(function(){
		startGame();
	});
	
	
	
	
	$('#togglesoundintro').show(500).click(toggleintroSound).delay(4200).animate({top:40, left:40}, 700);
	$('#sup_head').delay(1000).animate({marginTop : 100, opacity:1}, 400);
	$('#main_head').delay(1900).animate({width:643, height:117, marginTop:0, opacity:1}, 800);
	
	window.setTimeout(function(){
		$('#sup_head').animate({width:192.5, height:41, marginTop : 10}, 500, "linear");
		$('#main_head').animate({width:321.5, height:58.5}, 500, "linear");
		$('#skip').delay(300).animate({opacity:1}, 500);
	} ,5000);
		
	
	var s2 = window.setTimeout(function(){
		scenes.shift();
		$('#instructions').css("display", "block");
		$('#instructions').animate({opacity:1}, 100);
		$('#keys').css("display", "block");
		$('#keys').delay(300).animate({opacity:1}, 1000)
		},7000);
		
	
	var s3 =	window.setTimeout(function(){
		scenes.shift();
		$('#keys').animate({opacity:0}, 500);
		
	},14000);
		
	var s4 = window.setTimeout(function(){
		scenes.shift();
		$('#keys').css("display", "none");
		$('#tokens').css("display", "block");
			$('#tokens').animate({opacity:1}, 1000);
			blinkLetters = setInterval(blink, 40); 
			blinking = true;
		},15000);
		
		
	var s5 = window.setTimeout(function(){
		scenes.shift();
		clearInterval(blinkLetters);
			$('#tokens').animate({opacity:0}, 1000);
			$('#instructions').animate({opacity:0}, 500);
		},20000);

	var s6 = window.setTimeout(function(){
		scenes.shift();
		
		$('#togglesoundintro').delay(1000).animate({top:400, left:564}, 700);
		$('#skip').delay(900).animate({opacity:0}, 1000);
		$('#tokens').css("display", "none");
		$('#instructions').css("display", "none");
		$('#ctg , #ct').animate({opacity:1}, 3000);
		$('#ctg , #ct').click(function(){
			startGame();
		});
	},21000);
	
	var s7 = window.setTimeout(function(){
		scenes.shift();
		clickToStart();
		
	}, 22000);
}

function toggleintroSound(){
	if(document.getElementById('introSound').muted){
		document.getElementById('introSound').muted = false;
		$("#togglesoundintro").css("background-image", "url(images/sound_on.png)");	
	}else{
		document.getElementById('introSound').muted = true;
		$("#togglesoundintro").css("background-image","url(images/sound_off.png)");	
	}
	
}

function blink(){
	
	if(!(blinkCount % 6)){
	$('#B').css("color", "#e6bb45");
	$('#S').css("color", "#FFF");
	}else{
	$('#B').css("color", "#000");
	$('#S').css("color", "red");	
	}
	
	if(!(blinkCount % 5)){
	$('#W').css("color", "#e6bb45");
	$('#F').css("color", "#FFF");
	}else{
	$('#W').css("color", "#000");
	$('#F').css("color", "red");	
	}
	
	if(!(blinkCount % 7)){
	$('#three').css("color","#0CC");
	}else{
	$('#three').css("color","#000");	
	}
	blinkCount++;
}

function clickToStart(){
	$('#ctg').animate({left:352}, 300, 
	function(){
	$('#ctg').animate({left:355}, 500,	
	clickToStart())
	}
	);
	
}

function startGame(){
	document.getElementById('introSound').muted = true;
	for(scene in scenes){
		window.clearTimeout(scenes[scene]);
		}
		$('.intro').hide(200);
		$('#canvas, .sidebar').show();
		blinking ? clearInterval(blinkLetters): blinking;
		initial();
	
}