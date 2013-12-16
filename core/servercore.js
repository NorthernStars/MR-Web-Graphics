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
, wsio = require('websocket.io');

/**
* Create express app.
*/

var app = express();

/**
* Attach websocket server.
*/

var ws = wsio.attach(app);

/**
* Serve our code
*/

app.use(express.static('public'));

/**
* Listening on connections
*/

var theGame = mrServerConnection({ connectionname: 'The Game', mrserverip: 'localhost', mrserverport: '9060' });
theGame.connect();

ws.on('connection', function (socket) {
	logger.debug('Client connected');
	theGame.addListener(socket);
});

/**
* Listen
*/

app.listen(3000);

