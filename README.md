MR-Web-Graphics
===============
This projects contains a browser interface for the Mixed-Reality Graphics module.  
It bases on a Node.js server, that connects to the Mixed-Reality game-server and offers a web-page to display games.  
  
Installation
------------
First install Node.js (http://nodejs.org/).  
Than download complete project and execute on projects root directory:  
  
sudo apt-get install npm  
npm install
  
Create database from projects root directory.  
node setup_db.js 

To configure the server edit  
settings.js 

Usage
-----
To start the server execute on projects root directory:  
  
node core/servercore  
  
After that you can access the server through your browser on  
  
localhost:3000
the test-user is user:wert pass:wert
