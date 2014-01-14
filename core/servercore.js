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

var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'core' );

var express = require('express');
var RedisStore = require('connect-redis')(express);
var http = require('http');

var app = express();
var server = http.createServer(app);

var listOfGames = {};

middleWare.registerGamesList( listOfGames );

webSockets.attach( server );
webSockets.start( listOfGames );

app.configure(function(){
    
    app.use( express.logger( 'dev' ) );
    app.set( 'views', process.cwd() + '/templates' );
    app.set( 'view engine', 'jade' );
    app.use( express.urlencoded() );
    app.use( express.cookieParser() );
    app.use( express.session( { key: 'session', //TODO: real sessiondb
        secret: 'SEKR37' } ) );
    app.use( app.router );
    
    app.use( express.static('public') );
    
});

// routes

app.post('/user/login', middleWare.routes.user.login );
app.post('/user/logout', middleWare.routes.user.logout );

app.post('/games/admin/disconnect/:game', middleWare.adminDisconnectGame );
app.post('/games/admin/connect/:game', middleWare.adminConnectGame );
app.post('/games/admin/remove/:game', middleWare.adminRemoveGame );
app.post('/games/admin/add', middleWare.adminAddGame );
app.get('/games/admin', middleWare.adminPage );

app.post('/games/leave/:game', middleWare.gamesLeave );
app.post('/games/join/:game', middleWare.gamesJoin );
app.get('/games', middleWare.gamesPage );

app.post('/games/:game', middleWare.watchGame );
app.get('/games/:game', middleWare.watchGame );

app.get('/', middleWare.routes.startPage );
app.use( middleWare.routes.error404 );

server.listen(3000);
