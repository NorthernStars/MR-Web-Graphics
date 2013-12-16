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
var crypto = require('crypto');


module.exports = (function(){
	
	var that = {};
	
	var databasefile = './' + 'admin.db';
	var databaseexists = filesystem.existsSync( databasefile )
	
	if( !databaseexists ) {
		
		logger.debug( 'Creating admindatabase file.' );
		filesystem.openSync( databasefile, 'w' );

	}
	
	var database = new sqlite3.Database( databasefile );
	

	// Helper
	
	var createSaltedPasswordHash = function( password, salt ){
		
		var shasum = crypto.createHash('sha256');
		
		shasum.update( salt + password, 'utf-8' );
		
		return shasum.digest('hex');
		
	};
	
	// toExecute = function( exception, buffer )
	var generateSalt = function( toExecute ){
		
		crypto.randomBytes( 64, toExecute );
		
	};
	
	var addAdminToDatabase = function( email, passwordhash, salt ){
		
		var stmt = database.prepare( 'INSERT INTO admins ( email, passwd, salt ) VALUES ( $email, $passwd, $salt )' );
		
		stmt.run({
	        $email: email,
	        $passwd: passwordhash,
	        $salt: salt
	    });

	};
	
	if( !databaseexists ){
		
		logger.debug( 'Creating tables in admindatabase file and filling them with dummydata.' );
		database.serialize( function() {
			
			database.run( 'CREATE TABLE admins ( email TEXT PRIMARY KEY, passwd VARCHAR(64) NOT NULL, salt VARCHAR(64) NOT NULL)' );

			generateSalt( function( exception, salt ){
				
				var passwordhash = createSaltedPasswordHash( 'sechs54e2i', salt.toString() );
				
				addAdminToDatabase( 'eike.petersen@student.fh-kiel.de', passwordhash, salt.toString() );

			});
			
			generateSalt( function( exception, salt ){
				
				var passwordhash = createSaltedPasswordHash( 'sechs54e2i', salt.toString() );
				
				addAdminToDatabase( 'hannes.eilers@student.fh-kiel.de', passwordhash, salt.toString() );

			});
			
		});
		
	}

	// functions
	
	var getAdmin = database.prepare( 'SELECT passwd, salt FROM admins WHERE email = $email' );
	// callback = function( boolean )
	that.authenticateAdmin = function( email, password, callback ){
		
		getAdmin.get({
			$email: email
		}, function( error, row ){
			if( error || !row ){

				callback( false );
				return;
			}

			if( row.passwd === createSaltedPasswordHash( password, row.salt ) ){

				callback( true );
				return;
			}

			callback(false);
		});
		
	};
	
	that.closeDatabase = function(){
		
		database.close();
		
	};

	return that;
	
}());