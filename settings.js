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
                // values to secure the sessions on the clients
                session: {
                    // the name of the sessioncookie
                    key:  'mrwg-session',
                    // the secret to secure the sessiondata
                    secret: 'dasi5teinwursttanz',
                    // the lifetime of the sessioncookie, eg the lifetime of the session
                    cookie: {
                        maxAge: 1000 * 60 * 20 // 20 minutes lifetime
                    }
                },
    			server: {
    			    // the serverport, should be higer than 1024 and http should be forwarded to it
    				port: 3000,
    				// the websocketconfiguration
    				websocket: {
    				    // the url(ip) of the webserver to allow the websocket to connect to it
    					ip: 'myserver',
    					// the websocketport, can be the same as http port
    					port: '3000'
    				}
    			},
                cache:{
                    // the lifetme of the clientside cacheobjects
                    lifetime: 1000 * 60 * 20 // 20 minuites lifetime
                }
            },
            logging: {
                // the configurationfile for the logger
                config: 'log_configuration.json'
            },
            user:{
                // the name of the database
                database: './admin.db'
            }
    };
    
    logger.info('Loaded settings');
    
    return that;
    
}());