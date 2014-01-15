/**
 * Server settings(singleton)
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

var logging = require( 'log4js' );
var logger = logging.getLogger( 'settings' );

module.exports = (function(){

    var that = {
            core: {
                session: {
                    key:  'mrwg-session',
                    secret: 'dasi5teinwursttanz',
                    cookie: {
                        maxAge: 1000 * 60 * 20 // 20 minuites lifetime
                    }
                }
            },
            logging: {
                config: 'log_configuration.json'
            },
            user:{
                database: './admin.db'
            }
    };
    
    logger.info('Loaded settings');
    
    return that;
    
}());