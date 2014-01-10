//logging 
var log4js = require( 'log4js' );
var logger = log4js.getLogger();

// hashbuliding
var crypto = require('crypto');

module.exports = (function(){
	
	var that = {};

	that.createSaltedPasswordHash = function( password, salt ){
		
		var shasum = crypto.createHash('sha256');
		
		shasum.update( salt + password, 'utf-8' );
		
		return shasum.digest('hex');
		
	};
	
	// toExecute = function( exception, buffer )
	that.generateSalt = function( toExecute ){
		
		crypto.randomBytes( 64, toExecute );
		
	};
	
	return that;
	
}());