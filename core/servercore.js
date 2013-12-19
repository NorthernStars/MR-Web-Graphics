/**
 * Servercore
 * 
 * The core of the webserver, where it gets started controlled and managed
 * 
 * @author Hannes Eilers, Eike Petersen
 * @version 0.1
 */


var middleWare = require( './middleware/middleware' );
var webSockets = require( './network/websockets' );
var mrServerConnection = require( './network/mrserverconnection' );

var log4js = require('log4js');
var logger = log4js.getLogger();

var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var listOfGames = {};

middleWare.registerGamesList( listOfGames );

webSockets.attach( server );
webSockets.start( listOfGames );

listOfGames['TheGame'] = mrServerConnection({ connectionname: 'TheGame', mrserverip: 'localhost', mrserverport: '9060' });
listOfGames['TheGame'].connect();
listOfGames['The Game2'] = mrServerConnection({ connectionname: 'The Game2', mrserverip: 'localhost', mrserverport: '9060' });
listOfGames['The Game2'].connect();
listOfGames['The Game3'] = mrServerConnection({ connectionname: 'The Game3', mrserverip: 'localhost', mrserverport: '9060' });
listOfGames['The Game3'].connect();
listOfGames['The Game4'] = mrServerConnection({ connectionname: 'The Game4', mrserverip: 'localhost', mrserverport: '9060' });
listOfGames['The Game4'].connect();

app.use( express.logger( 'dev' ) );
app.use( express.cookieParser( 'ManManMan...!' ) );
app.use( express.cookieSession( { secret: 'DieWurstImHauseGehtZumKaeser.' } ) );
app.use( express.urlencoded() );

app.use(express.static('public'));
app.set( 'view engine', 'jade' );
app.set( 'views', './templates' );

app.post('/login', middleWare.loginAdmin );
app.post('/logout', middleWare.logoutAdmin );
app.post('/admin/games/disconnect/:game', middleWare.adminDisconnectGame );
app.post('/admin/games/connect/:game', middleWare.adminConnectGame );
app.post('/admin/games/remove/:game', middleWare.adminRemoveGame );
app.get('/admin', middleWare.adminPage );
app.post('/games/leave/:game', middleWare.gamesLeave );
app.post('/games/join/:game', middleWare.gamesJoin );
app.get('/games', middleWare.gamesPage );
app.post('/games/:game', middleWare.watchGame );
app.get('/games/:game', middleWare.watchGame );
app.get('/', middleWare.startPage );


app.use( app.router );
app.use( middleWare.error404 );

server.listen(3000);