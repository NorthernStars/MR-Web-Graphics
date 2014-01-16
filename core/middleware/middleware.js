/**
 * Middleware administration(singleton)
 * helperfunctions and routes
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

//logging 
var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'middleware' );

var cacheManifest = require('connect-cache-manifest');
var mrServerConnection = require( './../network/mrserverconnection' );

var route_root = require( process.cwd() + '/core/middleware/routes/root.js' );
var route_error = require( process.cwd() + '/core/middleware/routes/error.js' );

var route_user_authenticate = require( process.cwd() + '/core/middleware/routes/user/authenticate.js' );

var route_games_administration = require( process.cwd() + '/core/middleware/routes/games/administrate.js' );
var route_games_watching = require( process.cwd() + '/core/middleware/routes/games/watch.js' );

module.exports = (function(){
    
    var that = {};
    that.routes = {};
    that.routes.user = {};
    that.routes.games = {};

    /** 
     * Registers the 'global' list of games(mrserverconnection) with the needed routes
     * 
     * @param {list of mrserverconnection} the 'global' gameslist
     */
    that.registerGamesList = function( listOfGames ){
        
        route_games_administration.registerGamesList( listOfGames );
        route_games_watching.registerGamesList( listOfGames );
        
    };
    
    that.manifest = cacheManifest({
  	  manifestPath: '/application.manifest',
  	  files: [{
  		    dir: process.cwd() + '/public/img',
  		    prefix: '/img/'
  	  }, {
  	    dir: process.cwd() + '/public/css',
  	    prefix: '/css/'
  	  }],
  	  networks: ['*'],
  	  fallbacks: []
  	});
    
    that.routes.startPage = route_root.startPage;
    that.routes.error404 = route_error.error404;
    
    that.routes.games.adminPage = route_games_administration.adminPage;
    that.routes.games.disconnectGame = route_games_administration.disconnectGame;
    that.routes.games.connectGame = route_games_administration.connectGame;
    that.routes.games.removeGame = route_games_administration.removeGame;
    that.routes.games.addGame = route_games_administration.addGame;
    
    that.routes.games.gamesPage = route_games_watching.gamesPage;
    that.routes.games.loinGame = route_games_watching.joinGame;
    that.routes.games.leaveGame = route_games_watching.leaveGame;
    that.routes.games.watchGame = route_games_watching.watchGame;
    
    that.routes.user.login = route_user_authenticate.login;
    that.routes.user.logout = route_user_authenticate.logout;
    
    return that;
    
}());