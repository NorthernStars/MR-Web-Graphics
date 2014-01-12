/**
 * Logging for the webserver as a singleton, 
 * because the logging framework does 'interesting' things 
 * if it uses the same appender from to different logger-configs
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

var log4js = require( 'log4js' );
log4js.configure( 'log_configuration.json' );
var logger = log4js.getLogger( 'logging' );

module.exports = (function(){
    
    var that = {};
    
    /** 
     * forwarded getLogger-function with internal logging :)
     * 
     * @param {String} name of requested logger
     * @returns the requested logger-object
     */
    that.getLogger = function( name ){
        
        logger.debug( 'Created logger "' + name + '"');
        return log4js.getLogger( name );
        
    };

    return that;
    
}());
