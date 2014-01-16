/**
 * Game watching(singleton)
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
    
    /** 
     * Registers the 'global' list of games(mrserverconnection) with this module
     * 
     * @param {list of mrserverconnection} the 'global' gameslist
     */
    that.registerGamesList = function( listOfGames ){
        
        _listOfGames = listOfGames;
        
    };
    
    /** 
     * Shows the list-page for games.
     * 
     * @param needs the request, response and next objects of express
     */
    that.gamesPage = function( req, res, next ){
        
        res.render('games', { title: 'List of games', games: true, isAuthenticated: req.session.loggedIn, listOfGames: _listOfGames, joinedGames: req.session.joinedGames } );
        
    };
    
    /** 
     * Joins a game to watch.
     * 
     * @param needs the request, response and next objects of express
     */
    that.joinGame = function( req, res, next ){
        
        if( req.params.game && _listOfGames[req.params.game]){
            
            if( !req.session.joinedGames ){
                
                req.session.joinedGames = {};
                
            }
            req.session.joinedGames[req.params.game] = req.params.game;
            
            res.redirect( '/games/' + req.params.game );
            
        } else {
            
            res.redirect( 'back' );
            
        }
        
    };

    /** 
     * Leaves the watched game.
     * 
     * @param needs the request, response and next objects of express
     */
    that.leaveGame = function( req, res, next ){
        
        if( req.params.game && _listOfGames[req.params.game]){
            
            delete req.session.joinedGames[req.params.game];
            
            res.redirect( '/games' );
            
        } else {
            
            res.redirect( 'back' );
            
        }
        
    };

    /** 
     * Watches the game.
     * 
     * @param needs the request, response and next objects of express
     */
    that.watchGame = function( req, res, next ){
        
        if( req.params.game && _listOfGames[req.params.game]){
            
            res.render('game', { title: req.params.game, isAuthenticated: req.session.loggedIn, joinedGames: req.session.joinedGames, game: _listOfGames[req.params.game] } );
            
        } else {
            
            res.redirect( 'back' );
            
        }
        
    };
    
    logger.info('Created game watch routes');
    
    return that;
    
}());