/**
 * User authentication(singleton)
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'routes' );

var userDatabase = require( process.cwd() + '/core/persistence/database.js' );

var helpers_password = require( process.cwd() + '/core/middleware/helper/security_password.js' );

module.exports = (function(){

    userDatabase.initializeDatabase( './admin.db' ); //TODO: config-file
    
    var that = {};
    
    /** 
     * Tries to authenticate the user
     * after successful or unsuccessful authentication the user is show his orgin_page
     * 
     * @param needs the request, response and next objects of express
     */
    that.login = function( req, res, next ){
        
        logger.debug( 'User tries to log in' );
        if( !req.session.loggedIn && req.body && req.body.user && req.body.password ){
            logger.debug( req.body.user + ' ' + req.body.password );
            userDatabase.getUser( req.body.user, function( error, password, salt, flags ){
                logger.debug( password + ' ' + helpers_password.createSaltedPasswordHash( req.body.password, salt ) );
                if( !error && password && salt &&
                    password === helpers_password.createSaltedPasswordHash( req.body.password, salt ) ){
                    
                    logger.debug( 'User', req.body.user, 'logged in' );
                    req.session.loggedIn = true;
                    res.redirect( 'back' );
            
                } else {
                    
                    logger.debug( 'User', req.body.user, 'could not be authenticated' );
                    res.redirect( 'back' );
                    
                }
                
            } );
            
        } else {
            
            res.redirect( 'back' );
            
        }
    };
    
    /** 
     * Logs the user out
     * 
     * @param needs the request, response, and next objects of express
     */
    that.logout = function( req, res, next ){
        
        if( req.session.loggedIn ){
        
            req.session.loggedIn = false;
            req.session.destroy();
        
        }
        
        res.redirect( '/' );
            
    };
    
    logger.info('Created user authentication routes');
    
    return that;
    
}());