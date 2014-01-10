/**
 * sqlite database
 */

//logging 
var log4js = require( 'log4js' );
var logger = log4js.getLogger();
//sqlite
var sqlite3 = require( 'sqlite3' ).verbose();
// filesystem
var filesystem = require("fs");
// hashbuliding
var helpers_password = require('./security_password');


module.exports = (function(){
	
	var that = {};
	
	var databasefile = '';
	
	var database = null;
	
	// prepared statements
	
	var prepStatements = {};
	
	// functions
	
	that.setDatabase = function( database ){
		
		databasefile = database;
		var databaseexists = filesystem.existsSync( databasefile );

		if( databaseexists ) {
			
			logger.debug( 'Opening database file ' + databasefile );

			database = new sqlite3.Database( databasefile );
			
			{
				prepStatements.getUser = database.prepare( 'SELECT passwd, salt FROM admins WHERE email = $email' );
			}
		}
		
	};
	
	// callback = function( boolean )
	that.authenticateUser = function( email, password, callback ){
		
		if( !database ){
			
			logger.error( 'No existing database.' );
			callback( false );
			return;
			
		}
		
		prepStatements.getUser.get({
			$email: email
		}, function( error, row ){
			if( error || !row ){
				
				logger.debug( 'No existing user ' + email );
				callback( false );
				return;
				
			}

			if( row.passwd === helpers_password.createSaltedPasswordHash( password, row.salt ) ){

				logger.debug( 'Existing user ' + email + ' logged in.' );
				callback( true );
				return;
			}

			callback(false);
		});
		
	};
	
	that.closeDatabase = function(){
		
		database.close();
		database = null;
		
	};

	return that;
	
}());