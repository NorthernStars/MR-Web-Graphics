/**
 * Errorroutes of the webserver(singleton)
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
     * Displays the error 'Page not found'(404)
     * 
     * @param needs the request, response, and next objects of express
     */
    that.error404 = function( req, res, next ){
        
        res.render('error', { status: 404, url: req.url } );
  
    };
    
    logger.info('Created error routes');
    
    return that;
    
}());