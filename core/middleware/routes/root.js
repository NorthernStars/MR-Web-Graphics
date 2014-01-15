/**
 * Root routes of the webserver(singleton)
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'routes' );

module.exports = (function(){

    var that = {};
    
    /** 
     * Displays the mainpage 'index'
     * 
     * @param needs the request, response, and next objects of express
     */
    that.startPage = function( req, res, next ){
        
        res.render('index', { title: 'Mixed Reality Web Graphics', main: true, isAuthenticated: req.session.loggedIn, joinedGames: req.session.joinedGames });
        
    };
    
    logger.info('Created root routes');
    
    return that;
    
}());