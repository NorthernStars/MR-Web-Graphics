/**
 *  
 */

//logging 
var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'middleware' );

var mrServerConnection = require( './../network/mrserverconnection' );

var route_root = require( process.cwd() + '/core/middleware/routes/root.js' );
var route_error = require( process.cwd() + '/core/middleware/routes/error.js' );

var route_user_authenticate = require( process.cwd() + '/core/middleware/routes/user/authenticate.js' );

var route_games_administration = require( process.cwd() + '/core/middleware/routes/games/administrate.js' );

module.exports = (function(){
	
	var that = {};
	that.routes = {};
    that.routes.user = {};
    that.routes.games = {};
	
	that.registerGamesList = function( listOfGames ){
		
	    route_games_administration.registerGamesList( listOfGames );
		
	};
	
	that.routes.startPage = route_root.startPage;
    that.routes.error404 = route_error.error404;
	
	that.routes.games.adminPage = route_games_administration.adminPage;
	that.routes.games.disconnectGame = route_games_administration.disconnectGame;
	that.routes.games.connectGame = route_games_administration.connectGame;
	that.routes.games.removeGame = route_games_administration.removeGame;
	that.routes.games.addGame = route_games_administration.addGame;
	
	that.gamesPage = function( req, res, next ){
		
		res.render('games', { title: 'List of games', games: true, isAuthenticated: req.session.loggedIn, listOfGames: _listOfGames, joinedGames: req.session.joinedGames } );
		
	};
	
	that.gamesJoin = function( req, res, next ){
		
		if( req.params.game && _listOfGames[req.params.game]){
			
			if( !req.session.joinedGames ){
				
				req.session.joinedGames = {};
				
			}
			req.session.joinedGames[req.params.game] = req.params.game;
			
			res.redirect( '/games/' + req.params.game );
			
		} else {
			
			res.redirect( 'back' );
			
		}
		
	};
	
	that.gamesLeave = function( req, res, next ){
		
		if( req.params.game && _listOfGames[req.params.game]){
			
			delete req.session.joinedGames[req.params.game];
			
			res.redirect( '/games' );
			
		} else {
			
			res.redirect( 'back' );
			
		}
		
	};
	
	that.watchGame = function( req, res, next ){
		
		if( req.params.game && _listOfGames[req.params.game]){
			
			res.render('game', { title: req.params.game, game: req.params.game, isAuthenticated: req.session.loggedIn, joinedGames: req.session.joinedGames } );
			
		} else {
			
			res.redirect( 'back' );
			
		}
		
	};
	
	that.routes.user.login = route_user_authenticate.login;
	that.routes.user.logout = route_user_authenticate.logout;
	
	return that;
	
}());