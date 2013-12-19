var onsubmitNewGameForm = function(){
	var gamename = document.getElementById('').value;
	var host = document.getElementById('').value;
	var port = document.getElementById('').value;
	
	post_to_url( '/admin/game/add', {name: gamename, host: host, port: port} );
};
