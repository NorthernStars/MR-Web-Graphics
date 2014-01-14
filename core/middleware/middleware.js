/**
 *  
 */

//logging 
var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'middleware' );

var mrServerConnection = require( './../network/mrserverconnection' );

var route_root = require( process.cwd() + '/core/middleware/routes/root.js' );
var route_user_authenticate = require( process.cwd() + '/core/middleware/routes/user/authenticate.js' );
var route_error = require( process.cwd() + '/core/middleware/routes/error.js' );

module.exports = (function(){
	
	var that = {};
	that.routes = {};
	that.routes.user = {};
	
	var _listOfGames = {};
	
	that.registerGamesList = function( listOfGames ){
		
		_listOfGames = listOfGames;
		
	};
	
	that.routes.startPage = route_root.startPage;
	
	that.adminPage = function( req, res, next ){
		
		if( req.session.loggedIn ){
			
			res.render('admin', { title: 'Administration', admin: true, isAuthenticated: req.session.loggedIn, listOfGames: _listOfGames, joinedGames: req.session.joinedGames } );
		
		} else {
			
			res.redirect( '/' );
			
		}
	
	};
	
	that.adminDisconnectGame = function( req, res, next ){
		
		if( req.session.loggedIn ){
			
			if( req.params.game && _listOfGames[req.params.game] && _listOfGames[req.params.game].connected() ){
				
				_listOfGames[req.params.game].disconnect();
				
			}

			res.redirect( 'back' );
			
		} else {
			
			res.redirect( 'back' );
			
		}
	
	};
	
	that.adminConnectGame = function( req, res, next ){
		
		if( req.session.loggedIn ){

			if( req.params.game && _listOfGames[req.params.game] && !_listOfGames[req.params.game].connected() ){
				
				_listOfGames[req.params.game].connect();
				
			}

			res.redirect( 'back' );
			
		} else {
			
			res.redirect( 'back' );
			
		}
	
	};
	
	that.adminRemoveGame = function( req, res, next ){
		
		if( req.session.loggedIn ){

			if( req.params.game && _listOfGames[req.params.game]){
				
				if( _listOfGames[req.params.game].connected() ){
					
					_listOfGames[req.params.game].disconnect();
					
				}
				//TODO: close all websockets
				delete _listOfGames[req.params.game];
				
			}
			
			res.redirect( 'back' );
			
		} else {
			
			res.redirect( 'back' );
			
		}
	
	};
	
	that.adminAddGame = function( req, res, next ){
		
		if( req.session.loggedIn ){

			if( req.body && req.body.name && req.body.host && req.body.port && !_listOfGames[req.body.name] ){
				
				_listOfGames[req.body.name] = mrServerConnection({ connectionname: req.body.name, mrserverip: req.body.host, mrserverport: req.body.port });
				
			}
			
			res.redirect( 'back' );
			
		} else {
			
			res.redirect( 'back' );
			
		}
	
	};
	
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
	
	that.routes.error404 = route_error.error404;
	
	return that;
	
}());