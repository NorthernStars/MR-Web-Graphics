var TEAM_NONE = 0;
var TEAM_YELLOW = 1;
var TEAM_BLUE = 2;
var PLAYER_WIDTH = 0.05;
var BALL_WIDTH = PLAYER_WIDTH*0.5;

var TO_RADIANS = Math.PI/180;
var FONT_CFG = "normal 14pt Arial";
var DOT_WIDTH = 5;
var LINE_WIDTH = 2;

/**
* Draws a player marker
* @param x		Center-x-position
* @param y		Center-y-position
* @param angle	Angle ind degree of player
* @param name	Name of the player
* @param team	Team of the player. Could be TEAM_NONE, TEAM_YELLOW or TEAM_BLUE
*/
function drawPlayer(x, y, angle, name, team){	        			
    // create image object
    var img = new Image();

 	// get canvas elements
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	var h = canvas.height;
	    
    // get player size
    var pSize = Math.round(h * PLAYER_WIDTH);
    
	// save context
    ctx.save();
    
    // translate and rotate context
    ctx.translate( x, y );
    ctx.rotate( angle * TO_RADIANS );	
    
    // draw image
    if( team == TEAM_YELLOW ){
    	img.src = "img/playeryellow.gif";
    }
    else if( team == TEAM_BLUE ){
    	img.src = "img/playerblue.gif";
    }
    else{
    	img.src = "img/playernone.gif";
    }
    ctx.drawImage( img, -pSize*0.5, -pSize*0.5, pSize, pSize );
    
    // draw bot name
    ctx.font = FONT_CFG;
    ctx.fillStyle = "#555555";
    ctx.textBaseline = "top"; 
    ctx.fillText( name, -pSize*0.5, pSize*0.5+3 );
    
    // restore context
    ctx.restore();  
};

/**
* Draws the ball image
* @param x	Center-x-position
* @param y	Center-y-position
*/
function drawBall(x, y){	
    // create image object
    var img = new Image();

 	// get canvas elements
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	var h = canvas.height;
	    
    // get player size
    var bSize = Math.round(h * BALL_WIDTH);
    
	// save context
    ctx.save();
    
    // translate and rotate context
    ctx.translate( x, y );
    
    // draw image
    img.src = "img/ball.png";
    ctx.drawImage( img, -bSize*0.5, -bSize*0.5, bSize, bSize );
    
    // restore context
    ctx.restore();  
};

/**
* Draws a line
* @param start	Array (x,y) of start position
* @param end	Array (x,y) of end position
*/
function drawLine(start, end){
	// get canvas elements
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    
 	// drawing line
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';				    
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
};

/**
* Draws a dot or arc
* @param x		Center-x-position
* @param y		Center-y-position
* @param radius	Radius of arc in pixel.
*				If set a arc instead of a dot is drawn
*/
function drawArc(x, y, radius){
	// get canvas elements
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    if( !radius ){
    	ctx.arc( x, y, DOT_WIDTH, 0, 2*Math.PI, false );
    	ctx.fillStyle = '#FFFFFF';
    	ctx.fill();
    }
    else{
    	ctx.arc( x, y, radius, 0, 2*Math.PI, false );
	    ctx.lineWidth = LINE_WIDTH;
	    ctx.strokeStyle = "#FFFFFF";
	    ctx.stroke();
    }
};

/**
* Draws a rectangle
* @param x		Top-Left-x-position
* @param y		Top-Left-y-position
* @param w		Width
* @param h		Height
* @param color	Fill color
*/
function drawRectangle(x, y, w, h, color){
	// get canvas elements
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    
    if(!color){
    	color = "gray";
    }
    
    ctx.beginPath();
    ctx.rect( x, y, w, h );
    ctx.fillStyle = color;
    ctx.fill(); 
}

/**
 * Shows game header info text and gametime
 * @param info
 * @param gametime
 */
function setGameHeader(info, gametime){
	var txt = info + "<span>Time: " + gametime + "</span>";
	document.getElementById('gameInfoHeader').innerHTML = txt;	
}

/**
 * Shows info text in game info footer
 * @param info
 */
function setGameInfo(info){
	document.getElementById('gameInfo').innerHTML = info;
}

/**
* Clears canvas
*/
function clearCanvas(){
	// get canvas elements
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);	        			
}

/**
* Updates size of canvas
* @return Array (w,h) of new canvas size
*/
function updateCanvasSize(){
	// get canvas elements
    var canvas = document.getElementById('game');
    
    // update canvas size
    var h = document.getElementById('game').scrollWidth;
    //var w = document.getElementById('game').scrollHeight;
    var w = h * 1.33;
    //var h = Math.round(w * 0.75);
    canvas.width = w;
    canvas.height = h;
    
    return new Array(w, h);
}

/**
* Updates canvas
* @param wdata	Worlddata
* @return True if successfull updated
*/
function updateCanvas(wdata){
	
	var canvas = document.getElementById('game');
    if(!canvas){
    	return false;
    }
    
    // Set game info
    setGameHeader( "Maus 03 : 01 Elefant", "05:47" );
    setGameInfo("Game paused!");

    // clear canvas
    clearCanvas();
    
    // update canvas size
    var cSize = updateCanvasSize();
    var w = cSize[0];
    var h = cSize[1];

 	// drawing line
 	drawLine( new Array(0.5*w, 0.05*h), new Array(0.5*w, (1-0.05)*h) );
    
    // drawing dot
    drawArc(0.5*w, 0.5*h);
    
    // draw arc
    drawArc(0.5*w, 0.5*h, 0.1*h);
    
    // draw rectanles
    drawRectangle(0.01*w, 0.4*h, 0.05*w, 0.2*h, "yellow"); 
    drawRectangle(0.94*w, 0.4*h, 0.05*w, 0.2*h, "blue");
    
    // draw player
    drawPlayer(0.1*w, 0.3*h, 20, "BOT 0", TEAM_YELLOW);
    drawPlayer(0.5*w, 0.6*h, 80, "BOT 1", TEAM_BLUE);
    drawPlayer(0.8*w, 0.6*h, 250, "BOT 2", TEAM_NONE);
    
    // draw ball
    drawBall(0.6*w, 0.4*h);
    
};