/**
 * Database connection(singleton)
 * Creates and manages the connection to the database ( at the moment sqlite )
 * and all accessors
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

// logging
var logging = require( process.cwd() + '/core/logging/logging.js' ),
    logger = logging.getLogger( 'database' );

// sqlite
logger.debug( 'Loading sqlite3 module' );
var sqlite3 = require( 'sqlite3' ).verbose();

// filesystem
logger.debug( 'Loading fs module' );
var filesystem = require("fs");

module.exports = (function(){
    
    var that = {},
        databasefile_ = '',
        database_ = null;
    
    // prepared statements, to mitigate security-risks
    
    var prepStatements_ = {};
    
    // functions
    
    /** 
     * set the database-file, initializes and opens the database and
     * prepares all needed Statements
     * 
     * @param {String} file path and identifier
     */
    that.setDatabase = function( database ){
        
        databasefile_ = database;

        if( filesystem.existsSync( databasefile_ ) ) {
            
            logger.debug( 'Opening database file ' + databasefile_ );

            database_ = new sqlite3.Database( databasefile_ );
            
            {
                logger.debug( 'Prepareing statements' );
                prepStatements_.getUser = database_.prepare( 'SELECT password, salt FROM users WHERE email = $email' );
            }
        }
        
    };

    /** 
     * Tries to get the userdata from the database
     * If an error happens the callback gets only the error object
     * else if the user cannot be found all callback-parameters are empty
     * else if the user is found the callback is called with error=null, 
     * the passwordhash, the salt and the user-roleflags
     * 
     * @param {String} username(email)
     * @param {function}    callback to process the found data
     *                        the callback has the format:
     *                        function( error, password, salt, flags )
     */
    that.getUser = function( email, callback ){
        
        if( !database_ ){
            
            logger.error( 'No existing database' );
            callback( new Error( 'No existing database' ) );
            return;
            
        }
        
        prepStatements_.getUser.get(
                {
                    $email: email 
                }, 
                function( error, row ){
                    if( error ){
                        
                        logger.error( 'Error getting user', email, error );
                        callback( error );
                        return;
                        
                    }
                    
                    if( row ){
        
                        logger.debug( 'Found user', email );
                        callback( null, row.password, row.salt );
                        return;
                        
                    }
        
                    logger.debug( 'Could not find user', email );
                    callback();
                    
                });
        
    };
    
    /** 
     * Closes the Database
     */
    that.closeDatabase = function(){
        
        database_.close();
        database_ = null;
        
    };

    return that;
    
}());