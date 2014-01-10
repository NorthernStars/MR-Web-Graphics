	

	var databasefile = './' + 'admin.db';
	var databaseexists = filesystem.existsSync( databasefile );

	if( !databaseexists ) {
		
		logger.debug( 'Creating admindatabase file.' );
		filesystem.openSync( databasefile, 'w' );

	}
	
	var database = new sqlite3.Database( databasefile );
	
	var addAdminToDatabase = function( email, passwordhash, salt ){
		
		var stmt = database.prepare( 'INSERT INTO admins ( email, passwd, salt ) VALUES ( $email, $passwd, $salt )' );
		
		stmt.run({
	        $email: email,
	        $passwd: passwordhash,
	        $salt: salt
	    });

	};
	
	if( !databaseexists ){
		
		logger.debug( 'Creating tables in admindatabase file and filling them with dummydata.' );
		database.serialize( function() {
			
			database.run( 'CREATE TABLE admins ( email TEXT PRIMARY KEY, passwd VARCHAR(64) NOT NULL, salt VARCHAR(64) NOT NULL)' );

			generateSalt( function( exception, salt ){
				
				var passwordhash = createSaltedPasswordHash( 'sechs54e2i', salt.toString() );
				
				addAdminToDatabase( 'eike.petersen@student.fh-kiel.de', passwordhash, salt.toString() );

			});
			
			generateSalt( function( exception, salt ){
				
				var passwordhash = createSaltedPasswordHash( 'sechs54e2i', salt.toString() );
				
				addAdminToDatabase( 'hannes.eilers@student.fh-kiel.de', passwordhash, salt.toString() );

			});
			
		});
		
	}
	
	that.closeDatabase = function(){
		
		database.close();
		
	};