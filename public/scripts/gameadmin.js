var onsubmitNewGameForm = function(){

	var gamename = document.getElementById('newConnectionGameName').value;
	var host = document.getElementById('newConnectionIP').value;
	var port = document.getElementById('newConnectionPort').value;

	post_to_url( '/admin/games/add', {name: gamename, host: host, port: port} );
};
