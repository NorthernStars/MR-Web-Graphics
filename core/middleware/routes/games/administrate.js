/**
 * Game administration(singleton)
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

var logging = require( process.cwd() + '/core/logging/logging.js' );
var logger = logging.getLogger( 'routes' );

var mrServerConnection = require( process.cwd() + '/core/network/mrserverconnection' );

module.exports = (function(){

    var that = {};
    
    var _listOfGames = {};
    
    that.registerGamesList = function( listOfGames ){
        
        _listOfGames = listOfGames;
        
    };
    
    /** 
     * Tries to authenticate the user
     * after successful or unsuccessful authentication the user is show his orgin_page
     * 
     * @param needs the request, response and next objects of express
     */
    that.adminPage = function( req, res, next ){
        
        if( req.session.loggedIn ){
            
            res.render('admin', { title: 'Administration', admin: true, isAuthenticated: req.session.loggedIn, listOfGames: _listOfGames, joinedGames: req.session.joinedGames } );
        
        } else {
            
            res.redirect( '/' );
            
        }
    
    };
    
    that.disconnectGame = function( req, res, next ){
        
        if( req.session.loggedIn ){
            
            if( req.params.game && _listOfGames[req.params.game] && _listOfGames[req.params.game].connected() ){
                
                _listOfGames[req.params.game].disconnect();
                
            }

            res.redirect( '/games/admin' );
            
        } else {
            
            res.redirect( 'back' );
            
        }
    
    };
    
    that.connectGame = function( req, res, next ){
        
        if( req.session.loggedIn ){

            if( req.params.game && _listOfGames[req.params.game] && !_listOfGames[req.params.game].connected() ){
                
                _listOfGames[req.params.game].connect();
                
            } 
            //TODO: build own callback, so response comes after game connected
            res.redirect( '/games/admin' );
            
        } else {
            
            res.redirect( 'back' );
            
        }
    
    };
    
    that.removeGame = function( req, res, next ){
        
        if( req.session.loggedIn ){

            if( req.params.game && _listOfGames[req.params.game]){
                
                if( _listOfGames[req.params.game].connected() ){
                    
                    _listOfGames[req.params.game].disconnect();
                    
                }
                //TODO: close all websockets
                delete _listOfGames[req.params.game];
                
            }
            
            res.redirect( '/games/admin' );
            
        } else {
            
            res.redirect( 'back' );
            
        }
    
    };
    
    that.addGame = function( req, res, next ){
        
        if( req.session.loggedIn ){

            if( req.body && req.body.name && req.body.host && req.body.port && !_listOfGames[req.body.name] ){
                
                _listOfGames[req.body.name] = mrServerConnection({ connectionname: req.body.name, mrserverip: req.body.host, mrserverport: req.body.port });
                
            }
            
            logger.debug( req.session.lastPage );
            
            res.redirect( '/games/admin' );
            
        } else {
            
            res.redirect( 'back' );
            
        }
    
    };
    
    logger.info('Created game administration routes');
    
    return that;
    
}());