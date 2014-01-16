var TEAM_NONE = 0;
var TEAM_YELLOW = 1;
var TEAM_BLUE = 2;
var PLAYER_WIDTH = 0.05;				// [1/100%]
var BALL_WIDTH = PLAYER_WIDTH*0.5;		// [1/100%]

var TO_RADIANS = Math.PI/180;
var FONT_CFG = "normal 8pt Arial";
var DOT_WIDTH = 0.0035;
var LINE_WIDTH = DOT_WIDTH/2;

/**
* Draws a player marker
* @param x		Center-x-position
* @param y		Center-y-position
* @param angle	Angle in degree of player
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
    
    // draw image
    if( team == TEAM_YELLOW ){
    	img.src = "/img/playeryellow.gif";
    }
    else if( team == TEAM_BLUE ){
    	img.src = "/img/playerblue.gif";
    }
    else{
    	img.src = "/img/playernone.gif";
    }
    
    // wait for image to load on chrome browsers
    if( window.navigator.userAgent.indexOf("Chrome") != -1 ){
    	img.onload = function() {
	    	// save context
		    ctx.save();
		    
		    // translate and rotate context
		    ctx.translate( x, y );
		    ctx.rotate( angle * TO_RADIANS );
		    
		    // draw image
		    ctx.drawImage( img, -pSize*0.5, -pSize*0.5, pSize, pSize );
		    
		    // draw bot name
		    ctx.font = FONT_CFG;
		    ctx.fillStyle = "#555555";
		    ctx.textBaseline = "top"; 
		    ctx.fillText( name, -pSize*0.5, pSize*0.5+3 );
		    
		    // restore context
		    ctx.restore();  
    	};
    }
    // draw directly on firefox and ie
    else{
    	// save context
	    ctx.save();
	    
	    // translate and rotate context
	    ctx.translate( x, y );
	    ctx.rotate( angle * TO_RADIANS );
	    
	    // draw image
	    ctx.drawImage( img, -pSize*0.5, -pSize*0.5, pSize, pSize );
	    
	    // draw bot name
	    ctx.font = FONT_CFG;
	    ctx.fillStyle = "#555555";
	    ctx.textBaseline = "top"; 
	    ctx.fillText( name, -pSize*0.5, pSize*0.5+3 );
	    
	    // restore context
	    ctx.restore();
    }
};

/**
* Draws the ball image
* @param x	Center-x-position
* @param y	Center-y-position
*/
function drawBall(x, y){
	// get canvas elements
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	var h = canvas.height;
	    
    // get player size
    var bSize = Math.round(h * BALL_WIDTH);
	
    // create image object
    var img = document.createElement('img');
    img.src = "/img/ball.png";
    
    // wait for image to load on chrome browsers
    if( window.navigator.userAgent.indexOf("Chrome") != -1 ){
	    img.onload = function() {
			// save context
		    ctx.save();
		    
		    // translate and rotate context
		    ctx.translate( x, y );
		    
		    // draw image	    
		    ctx.drawImage( img, -bSize*0.5, -bSize*0.5, bSize, bSize );
		    
		    // restore context
		    ctx.restore();
	    };
    }
    // draw directly on firefox and ie
    else{
    	// save context
	    ctx.save();
	    
	    // translate and rotate context
	    ctx.translate( x, y );
	    
	    // draw image	    
	    ctx.drawImage( img, -bSize*0.5, -bSize*0.5, bSize, bSize );
	    
	    // restore context
	    ctx.restore();
    }

};

/**
 * Draws a ball image
 * @param ctx
 * @param img
 * @param bSize
 */
function drawBallImg( ctx, img, bSize){
	
}

/**
* Draws a line
* @param start	Array (x,y) of start position
* @param end	Array (x,y) of end position
*/
function drawLine(start, end){
	// get canvas elements
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    var h = canvas.height;
    
 	// drawing line
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.lineWidth = LINE_WIDTH*h;
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
    var h = canvas.height;
    
    ctx.beginPath();
    if( !radius ){
    	ctx.arc( x, y, DOT_WIDTH*h, 0, 2*Math.PI, false );
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
* @param x		Bottom-Left-x-position
* @param y		Bottom-Left-y-position
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
    var maxW = document.getElementById('gameInfoHeader').scrollWidth;
    var maxH = Math.floor( document.documentElement.clientHeight*0.9-202 );
    
    // set new canvas size using maximum width
    var w = maxW;
    var h = maxW*0.75;
    
    // if height is too high, resize canvas using maximum height
    if(maxW*0.75 > maxH){
    	h = maxH;
    	w = Math.floor( maxH*(1/0.75) );
    }
    
    canvas.width = w;
    canvas.height = h;
    
    return new Array(w, h);
}

function pad(a,b){
	return(1e15+a+"").slice(-b);
};

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
    
    // Parse worlddata
//    document.getElementById('data').innerHTML = wdata ;
    wdata = JSON.parse(wdata);
    
    // Set game info    
    var timestamp = Math.round(wdata.time);    
    var min = Math.floor(timestamp / 60);
    var sec = Math.round(timestamp - min*60);
    var time = pad(min, 2) + ":" + pad(sec, 2);
    
    var scoreYellow = pad(wdata.score[0].yellow, 2);
    var scoreBlue = pad(wdata.score[0].blue, 2);
    var teamYellow = document.getElementById('teamNameYellow').innerHTML;
    var teamBlue = document.getElementById('teamNameBlue').innerHTML;
    var gameinfo = teamYellow + " " + scoreYellow + " : " + scoreBlue + " " + teamBlue;
    
    setGameHeader( gameinfo, time );
    setGameInfo(wdata.playmode);

    // clear canvas
    clearCanvas();
    
    // update canvas size
    updateCanvasSize();
    var w = canvas.width;
    var h = canvas.height;    
    var yScale = 0.75;

    // get and draw flags
    var flags = {};
    var i;
    for( i=0; i<wdata.flag.length; i++ ){
    	var flag = wdata.flag[i];
    	var x = Math.floor( flag.position[0].x * w );
    	var y = Math.floor( (1-(flag.position[0].y / yScale)) * h );
    	flags[flag.pointtype] = [x, y];
    	drawArc(x, y);
    }
    
    // draw lines
    // field outline
    drawLine( flags['bottom_center'], flags['top_center'] );
    drawLine( flags['top_left_corner'], flags['top_right_corner'] );
    drawLine( flags['bottom_left_corner'], flags['bottom_right_corner'] );
    drawLine( flags['top_left_corner'], flags['top_left_pole'] );
    drawLine( flags['bottom_left_corner'], flags['bottom_left_pole'] );
    drawLine( flags['top_right_corner'], flags['top_right_pole'] );
    drawLine( flags['bottom_right_corner'], flags['bottom_right_pole'] );
    
    // small area
    drawLine( flags['top_left_pole'], flags['top_left_small_area'] );
    drawLine( flags['top_left_small_area'], flags['bottom_left_small_area'] );    
    drawLine( flags['bottom_left_small_area'], flags['bottom_left_pole'] );
    drawLine( flags['top_right_pole'], flags['top_right_small_area'] );
    drawLine( flags['top_right_small_area'], flags['bottom_right_small_area'] );    
    drawLine( flags['bottom_right_small_area'], flags['bottom_right_pole'] );
    
    // big area
    drawLine( [flags['top_left_pole'][0], flags['top_left_goal'][1]], flags['top_left_goal'] );
    drawLine( flags['top_left_goal'], flags['bottom_left_goal'] );    
    drawLine( flags['bottom_left_goal'], [flags['bottom_left_pole'][0], flags['bottom_left_goal'][1]] );
    drawLine( [flags['top_right_pole'][0], flags['top_right_goal'][1]], flags['top_right_goal'] );
    drawLine( flags['top_right_goal'], flags['bottom_right_goal'] );    
    drawLine( flags['bottom_right_goal'], [flags['bottom_right_pole'][0], flags['bottom_right_goal'][1]] );
    
    // draw center circle
    drawArc( flags['middle_center'][0], flags['middle_center'][1], 0.1*h );
    
    // draw goals
    var goalW = flags['top_left_pole'][0]*0.8;
    var goalH = flags['top_left_pole'][1]-flags['bottom_left_pole'][1];
    drawRectangle( flags['bottom_left_pole'][0]-goalW, flags['bottom_left_pole'][1], goalW, goalH, "yellow");
    drawRectangle( flags['top_right_pole'][0], flags['bottom_right_pole'][1], goalW, goalH, "blue");
    
    // draw player
    for( i=0; i<wdata.players.length; i++ ){
    	var player = wdata.players[i];
    	if( player.pointtype == "player" ){
    		
	    	var x = Math.floor( player.position[0].x * w );
	    	var y = Math.floor( (1-(player.position[0].y / yScale)) * h );
	    	var angle = -player.orientationangle[0];
	    	var name = player.nickname[0] + " " + player.id[0];
	    	var team = player.team[0];
	    	
	    	// set team
	    	if(team == "yellow"){
	    		team = TEAM_YELLOW;
	    	}
	    	else if(team == "blue"){
	    		team = TEAM_BLUE;
	    	}
	    	else{
	    		team = TEAM_NONE;
	    	}
	    	
	    	drawPlayer(x, y, angle, name, team);
	    	
    	}
    }
    
    // draw ball
    if( wdata.ball[0].pointtype == "ball" ){
    	var ballPos = wdata.ball[0].position[0];
    	drawBall(ballPos.x*w, (1-(ballPos.y/yScale))*h);
    }
    
};