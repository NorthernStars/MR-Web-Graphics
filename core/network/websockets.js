/**
 * New node file
 */

var log4js = require('log4js');
var logger = log4js.getLogger();

var wsio = require('websocket.io');

module.exports = (function(){
	
	var that = {};
	
	var ws = null;
	var _listOfGames = null;
	
	that.attach = function( webserver ){
		
		ws = wsio.attach( webserver );
		
	};
	
	var newClient = function( socket ) {
		
		if( socket ){
			
			socket.isAliveCounter = 10;
			var doomCounterTimeout = setInterval( function(){
				
				if( socket.isAliveCounter <= 0 ){
					
					logger.debug('Client timed out');
					socket.close();
					
				} else {
					
					socket.isAliveCounter -= 1;
					socket.send( socket.theWatchedGame );
					
				}
				
			}, 2000 );

			socket.on('message', function ( message ) {
				
				if( !socket.theWatchedGame ){
					
					socket.theWatchedGame = message;
					if( _listOfGames[socket.theWatchedGame] ){
						
						_listOfGames[socket.theWatchedGame].addListener( socket );
						
					} else {
						
						socket.close();
						
					}
					
				}
				if( socket.theWatchedGame === message ){
					
					socket.isAliveCounter = 10;
					
				}
				
			});
			
			socket.on('close', function () {
				
				logger.debug('Client disconnected');
				if( _listOfGames[socket.theWatchedGame] ){
					
					_listOfGames[socket.theWatchedGame].removeListener( socket );
					
				}
				clearInterval( doomCounterTimeout );
				
			});
			
			logger.debug('Client connected');
			
		}
		
	};

	that.start = function( listOfGames ){
		
		_listOfGames = listOfGames;
		
		ws.on('connection', newClient );
		
	};

	return that;
	
}());
