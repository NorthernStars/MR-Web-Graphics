/**
 * Servercore
 * 
 * The core of the webserver, where it gets started controlled and managed
 * 
 * @author Hannes Eilers, Eike Petersen
 * @version 0.1
 */

var settings = require( process.cwd() + '/settings.js' );

var middleWare = require( process.cwd() + '/core/middleware/middleware.js' );
var webSockets = require( process.cwd() + '/core/network/websockets.js' );

var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'core' );

var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

// initalise needed 'globals'

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
    app.use( express.session( { key: settings.core.session.key, //TODO: real sessiondb
        secret: settings.core.session.secret,
        cookie: {
            maxAge  :  settings.core.session.cookie.maxAge // 20 minites lifetime
        } } ) );
    app.use( app.router );
    
    app.use( express.static('public') );
    
});

// routes

app.post('/user/login', middleWare.routes.user.login );
app.post('/user/logout', middleWare.routes.user.logout );

app.post('/games/admin/disconnect/:game', middleWare.routes.games.disconnectGame );
app.post('/games/admin/connect/:game', middleWare.routes.games.connectGame );
app.post('/games/admin/remove/:game', middleWare.routes.games.removeGame );
app.post('/games/admin/add', middleWare.routes.games.addGame );
app.get('/games/admin', middleWare.routes.games.adminPage );

app.post('/games/leave/:game', middleWare.routes.games.leaveGame );
app.post('/games/join/:game', middleWare.routes.games.loinGame );
app.post('/games', middleWare.routes.games.gamesPage );
app.get('/games', middleWare.routes.games.gamesPage );

app.post('/games/:game', middleWare.routes.games.watchGame );
app.get('/games/:game', middleWare.routes.games.watchGame );

app.get('/', middleWare.routes.startPage );
app.use( middleWare.routes.error404 );

// start server

server.listen( settings.core.server.port );
