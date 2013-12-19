var open = false
  , lastMessage;

window.onload = function () {
    // create socket
	var ws = new WebSocket('ws://localhost:3000');
	
	ws.onopen = function () {
		
		open = true;
	  	ws.gameName = document.title;
	  	ws.send( ws.gameName );
  	
	};
	
	ws.onmessage = function ( env ) {
		
		if( env.data == ws.gameName ){
			
			ws.send( ws.gameName );
			
		} else {
			
			document.getElementById('data').innerHTML = env.data;
			
		}
  	
	};
};