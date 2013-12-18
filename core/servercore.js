/**
 * Servercore
 * 
 * The core of the webserver, where it gets started controlled and managed
 * 
 * @author Hannes Eilers, Eike Petersen
 * @version 0.1
 */

//var adminDatabase = require( './database/admindatabase' );
var middleWare = require( './middleware/middleware' );
var webSockets = require( './network/websockets' );
var mrServerConnection = require( './network/mrserverconnection' );

var log4js = require('log4js');
var logger = log4js.getLogger();

var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var listOfGames = {};

webSockets.attach( server );
webSockets.start( listOfGames );

listOfGames['The Game'] = mrServerConnection({ connectionname: 'The Game', mrserverip: 'localhost', mrserverport: '9060' });
listOfGames['The Game'].connect();

app.use(express.static('templates'));

server.listen(3000);