/**
 * Servercore
 * 
 * The core of the webserver, where it gets started controlled and managed
 * 
 * @author Hannes Eilers, Eike Petersen
 * @version 0.1
 */

var mrServerConnection = require( './network/mrserverconnection' );
var admindatabase = require( './database/admindatabase' );
var log4js = require('log4js');
var logger = log4js.getLogger();

var express = require('express')
, wsio = require('websocket.io')
, http = require('http');

/**
* Create express app.
*/

var app = express();
var server = http.createServer(app);

/**
* Attach websocket server.
*/

var ws = wsio.attach(server);

/**
* Serve our code
*/

app.use(express.static('templates'));

/**
* Listening on connections
*/

var theGame = mrServerConnection({ connectionname: 'The Game', mrserverip: 'localhost', mrserverport: '9060' });
theGame.connect();

ws.on('connection', function (socket) {
	
	logger.debug('Client connected');
	
	socket.on('close', function () {
		
		logger.debug('Client disconnected');
		theGame.removeListener(socket);
		
	});
	
	theGame.addListener(socket);
});

/**
* Listen
*/

server.listen(3000);