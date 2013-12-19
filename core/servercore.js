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
app.post('/admin/games/add', middleWare.adminAddGame );
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