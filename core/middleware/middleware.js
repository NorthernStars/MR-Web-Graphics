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
		
		res.render('index', { title: 'Mixed Reality Web Graphics', main: true, isAuthenticated: req.session.loggedIn });
		
	};
	
	that.adminPage = function( req, res, next ){
		
		if( req.session.loggedIn ){
			
			res.render('admin', { title: 'Administration', admin: true, isAuthenticated: req.session.loggedIn });
		
		} else {
			
			that.startPage( req, res, next );
			
		}
	
	};
	
	that.gamesPage = function( req, res, next ){
		
		logger.debug(_listOfGames);
		
		res.render('games', { title: 'List of games', games: true, isAuthenticated: req.session.loggedIn, listOfGames: _listOfGames } );
		
	};
	
	that.loginAdmin = function( req, res, next ){
		
		
		if( !req.session.loggedIn && req.body && req.body.user && req.body.password ){
		
			adminDatabase.authenticateAdmin( req.body.user, req.body.password, function( authenticated ){
				
				if( authenticated ){

					req.session.loggedIn = true;
					that.adminPage( req, res, next );
			
				} else {
					
					that.startPage( req, res, next );
					
				}
				
			} );
			
		} else {
			
			that.startPage( req, res, next );
			
		}
	};
	
	that.logoutAdmin = function( req, res, next ){
		
		
		if( req.session.loggedIn ){
		
			req.session.loggedIn = false;
		
		}
			
		that.startPage( req, res, next );
			
	};
	
	that.error404 = function( req, res, next ){
		
		res.render('error', { status: 404, url: req.url } );
  
	};

	return that;
	
}());