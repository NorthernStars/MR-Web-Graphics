/**
 * Script to create a new and empty sqlite-database and
 * update the configfile for the webserver
 * 
 * @author Hannes Eilers
 * @author Eike Petersen
 * 
 * @version Beta 1.0
 */
"use strict";

//sqlite
var sqlite3 = require( 'sqlite3' ).verbose();

// filesystem
var filesystem = require("fs");
// hash and so
var helpers_password = require( process.cwd() + '/core/middleware/helper/security_password.js' );

var readInput = function( requesttext, callback ){

    process.stdout.write( requesttext );

    process.stdin.removeAllListeners('data');
    process.stdin.resume();
    process.stdin.setEncoding( 'utf8' );
    process.stdin.on( 'data', callback );
    
};

var createDatabase = function( filename, email, password ){

    console.log( 'Creating databasefile ' + filename );
    filesystem.openSync( filename, 'w' );
    
    var database = new sqlite3.Database( filename );

    database.serialize( function() {
        
        console.log( 'Creating users table' );
        database.run( 'CREATE TABLE users ( email TEXT PRIMARY KEY, password VARCHAR(64) NOT NULL, salt VARCHAR(64) NOT NULL)' );

        console.log( 'Generating passwordsalt' );
        helpers_password.generateSalt( function( exception, salt ){
            
            console.log( 'Generating passwordhash' );
            var passwordhash = helpers_password.createSaltedPasswordHash( password, salt.toString() );
            
            var stmt = database.prepare( 'INSERT INTO users ( email, password, salt ) VALUES ( $email, $password, $salt )' );
            
            console.log( 'Add user ' + email + ' as superuser in database.' );
            stmt.run({
                $email: email,
                $password: passwordhash,
                $salt: salt.toString()
            }, function(){ process.exit(0); });
            
        });

    });
    
};

(function(){
    
    var neededData = {};
    
    var getDatabaseFileName = function(){
        
        readInput('Set the filename and path of the databasefile: ', setDatabaseFileName);
        
    };
    
    var setDatabaseFileName = function( databaseFileName ){
        
        databaseFileName = databaseFileName.replace(/(\n|\r|\r\n)$/, '');
        neededData.file = databaseFileName;
        
        if( filesystem.existsSync( databaseFileName ) ){
            
            readInput('The file ' + databaseFileName + ' exists. Do you want to overwrite it? (y/N) ', overwriteDatabaseFile);
            
        } else {
            
            getUsername();
            
        }
        
    };
    
    var overwriteDatabaseFile = function( data ){
        
        data = data.replace(/(\n|\r|\r\n)$/, '');
        
        if( data === 'y' || data === 'Y' ){
            
            getUsername();
            
        } else {
            
            getDatabaseFileName();
            
        }
        
    };
    
    var getUsername = function(){
        
        readInput('Set the superusername(email): ', setUsername );
        
    };
    
    var setUsername = function( username ){
        
        username = username.replace(/(\n|\r|\r\n)$/, '');
        neededData.user = username;
        getUserpassword();
        
    };
    
    var getUserpassword = function(){
        
        readInput('Set the superuserpassword: ', setUserpassword );
        
    };
    
    var setUserpassword = function( password ){
        
        password = password.replace(/(\n|\r|\r\n)$/, '');
        neededData.password = password;
        createDatabase( neededData.file, neededData.user, neededData.password);
        
    };
    
    console.log('This script creates a databasefile and builds  the databasestructure\n' +
            'for the webserver in it. It also creates a superuser to enable the configuration\n' +
            'and use of the webserver.\n');

    
    getDatabaseFileName();
            
    
}());