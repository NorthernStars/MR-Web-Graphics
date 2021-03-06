/**
 * mrServerConnection
 */

//logging
var log4js = require('log4js');
var logger = log4js.getLogger();
// xml
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();
// udp-network
var udp = require('dgram');


module.exports = function( spec ){
    
    if ( !spec.mrserverip || !spec.mrserverport ) {
        
        logger.error( 'Cannot create connection without targetserverip and targetserverport.' );
        throw {
            name: 'Missing Arguments',
            message: 'Cannot create connection without targetserverip and targetserverport.'
        };
        
    }
    
    logger.debug( 'Creating connection', spec.connectionname, 'to mrserver at',spec.mrserverip, ':', spec.mrserverport );
    
    var that = {};
    var toServer = null;
    var lastWorldData = {};
    var allListeners = [];
    var sendToListenerTimer = 0;
    
    spec.connected = false;
    spec.gamestatus = 'unknown';
    spec.yellowteamname = spec.yellowteamname || 'Team Yellow';
    spec.blueteamname = spec.blueteamname || 'Team Blue';
    
    // getter
    
    that.getName = function(){
        return spec.connectionname;
    };    
    
    that.getYellowTeamName = function(){
        return spec.yellowteamname;
    };
    
    that.getBlueTeamName = function(){
        return spec.blueteamname;
    };
    
    that.getGameStatus = function(){
        return spec.gamestatus;
    };
    
    that.getMRServerIP = function(){
        return spec.mrserverip;
    };
    
    that.getMRServerPort = function(){
        return spec.mrserverport;
    };
    
    that.getOwnServerIP = function(){
        return toServer.address().address;
    };
    
    that.getOwnServerPort = function(){
        return toServer.address().port;
    };
    
    that.connected = function(){
        return spec.connected;
    };
    
    // connection
    
    that.connect = function( callback ){
        
        if( !spec.connected ){
        
            toServer = udp.createSocket("udp4");
            
            // events
            
            toServer.on( 'error', function ( error ) {
                
                logger.debug( 'Error in connection ', spec.connectionname, '(', spec.serverip, ':', spec.serverport, '):\n', error.stack);
                
            });
            
            toServer.on( 'listening', function () {

                logger.debug( 'Listening for packet from mrserver at', toServer.address().address + ':' + toServer.address().port);
                
                toServer.serverTimeout = setTimeout( function(){
                    
                    toServer.close();
                    delete toServer.serverTimeout;
                    
                    callback();
                    
                }, 3000 );
                
            });
            
            // connection
            
            toServer.removeAllListeners('message');
            toServer.on('message', function ( messageFromServer, sender ) {
                
                //logger.trace( "server got:", messageFromServer, "from", sender.address, ":", sender.port);
                
                parser.parseString( messageFromServer, function ( error, messageObject ) {

                    if( !error &&
                        messageObject.connectionacknowlege.clientname.toString() === spec.connectionname &&
                        messageObject.connectionacknowlege.connectionallowed.toString() === 'true' ){
                        
                        spec.mrservername = messageObject.connectionacknowlege.servername.toString();
                        spec.mrserverip = sender.address;
                        spec.mrserverport = sender.port;
                        
                        logger.debug( 'Connection acknowleged by', messageObject.connectionacknowlege.servername.toString() );
                        
                        toServer.removeAllListeners( 'message' );
                        toServer.on( 'message', processWorldData );
                        
                        var connectionEstablished = {
                            
                            connectionestablished: ''
                                
                        };
                        
                        sendMessageObjectToServer( connectionEstablished );
                        
                        spec.connected = true;
                        
                        clearTimeout( toServer.serverTimeout );
                        delete toServer.serverTimeout;
                        
                    }
                    
                    callback();
                    
                });
                
            } );
            
            toServer.bind();
            
            var connectionRequest = {
                connectionrequest: {
                    clientname: spec.connectionname
                }
            };
            
            sendMessageObjectToServer( connectionRequest );
        }
        
    };
    
    that.disconnect = function(){
        
        if( spec.connected ){
            
            toServer.removeAllListeners('message');
            
            var connectionClosed = {
                connectionclosed: {
                    clientname: spec.connectionname
                }
            };
            
            sendMessageObjectToServer( connectionClosed );
            
            toServer.close();
            
            while( allListeners.length > 0 ){
                delete allListeners.pop().connectionlistener[spec.connectionname];
            }
            
            spec.connected = false;
        }
        
    };
    
    that.addListener = function( socket ){
        
        if( !socket.hasOwnProperty(['connectionlistener']) ){
        
            socket['connectionlistener'] = {};
        
        }
        
        if( !socket.connectionlistener.hasOwnProperty([spec.connectionname]) ){
        
            socket.connectionlistener[spec.connectionname] = allListeners.push( socket ) - 1;
            
        }
        
    };
    
    that.removeListener = function( socket ){
        
        if( typeof(socket.connectionlistener[spec.connectionname]) == 'number' ){
            
            allListeners.splice( socket.connectionlistener[spec.connectionname], 1);
            delete socket.connectionlistener[spec.connectionname];
            
        }
        
    };
    
    // helper
    
    var sendMessageObjectToServer = function( messageObject ){
        
        var messageToServer = new Buffer( builder.buildObject( messageObject ) );
        
        toServer.send( messageToServer, 0, messageToServer.length, spec.mrserverport, spec.mrserverip );
        
    };
    
    var processWorldData = function ( xmlWorldData, sender ) {
        
        //logger.trace( "server got:", xmlWorldData, "from", sender.address, ":", sender.port);
        
        try{
        
        parser.parseString( xmlWorldData, function ( error, worldData ) {
            
            if( !error && worldData &&  worldData.WorldData ){
            
                spec.gamestatus = worldData.WorldData.playmode.toString();
            
                var worldDataInJSON = JSON.stringify( worldData.WorldData );
                
                var currentTime = new Date().getTime();

                if( sendToListenerTimer + 100 <= currentTime ){
                    
                    sendToListenerTimer = currentTime;
                    
                    for( var i = 0; i < allListeners.length; i += 1 ){
                        
                        allListeners[i].send( worldDataInJSON );
                        
                    }
                    
                }
                
            }
            
        });
        
        } catch( error ){
            
            logger.error('Error parsing xml:\n' + error);
            
        }
        
    };
    
    return that;
    
};





