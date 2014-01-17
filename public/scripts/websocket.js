var open = false
  , lastMessage;

window.onload = function () {
    // create socket
	host = document.getElementById('serverHost').innerHTML;
	var ws = new WebSocket('ws://'+host);
	
	ws.onopen = function () {
		
		open = true;
	  	ws.gameName = document.title;
	  	ws.send( ws.gameName );
  	
	};
	
	ws.onmessage = function ( env ) {
		
		if( env.data == ws.gameName ){
			
			ws.send( ws.gameName );
			
		} else {
			
			//document.getElementById('data').innerHTML = env.data;
			updateCanvas(env.data);
			
		}
  	
	};
};