/**
 *  
 */

//logging 
var log4js = require( 'log4js' );
var logger = log4js.getLogger();
var adminDatabase = require( './../database/admindatabase' );

module.exports = (function(){
	
	var that = {};
	var  _listOfGames = {};
	
	that.registerGamesList = function( listOfGames ){
		
		_listOfGames = listOfGames;
		
	};
	
	that.startPage = function( req, res, next ){
		
		res.render('index', { title: 'Mixed Reality Web Graphics', main: true, isAuthenticated: req.session.loggedIn, joinedGames: req.session.joinedGames });
		
	};
	
	that.adminPage = function( req, res, next ){
		
		if( req.session.loggedIn ){
			
			res.render('admin', { title: 'Administration', admin: true, isAuthenticated: req.session.loggedIn, listOfGames: _listOfGames, joinedGames: req.session.joinedGames } );
		
		} else {
			
			res.redirect( 'back' );
			
		}
	
	};
	
	that.adminDisconnectGame = function( req, res, next ){
		
		if( req.session.loggedIn ){
			
			if( req.params.game && _listOfGames[req.params.game] && _listOfGames[req.params.game].connected() ){
				
				_listOfGames[req.params.game].disconnect();
				
			}

			res.redirect( '/admin' );
			
		} else {
			
			res.redirect( 'back' );
			
		}
	
	};
	
	that.adminConnectGame = function( req, res, next ){
		
		if( req.session.loggedIn ){

			if( req.params.game && _listOfGames[req.params.game] && !_listOfGames[req.params.game].connected() ){
				
				_listOfGames[req.params.game].connect();
				
			}

			res.redirect( '/admin' );
			
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
			
			res.redirect( '/admin' );
			
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
	
	that.loginAdmin = function( req, res, next ){
		
		
		if( !req.session.loggedIn && req.body && req.body.user && req.body.password ){
		
			adminDatabase.authenticateAdmin( req.body.user, req.body.password, function( authenticated ){
				
				if( authenticated ){

					req.session.loggedIn = true;
					that.adminPage( req, res, next );
			
				} else {
					
					res.redirect( 'back' );
					
				}
				
			} );
			
		} else {
			
			res.redirect( 'back' );
			
		}
	};
	
	that.logoutAdmin = function( req, res, next ){
		
		
		if( req.session.loggedIn ){
		
			req.session.loggedIn = false;
		
		}
		
		res.redirect( '/' );
			
	};
	
	that.error404 = function( req, res, next ){
		
		res.render('error', { status: 404, url: req.url } );
  
	};

	return that;
	
}());