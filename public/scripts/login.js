var onclickmenueLogin = function () {
	document.getElementById('login').style.visibility='visible';
};

var onclickmenueLogout = function () {
	
	post_to_url( '/logout' );
	
};

var onclickloginCancel = function () {
	document.getElementById('loginUsername').value='';
	document.getElementById('loginPassword').value='';
	document.getElementById('login').style.visibility='hidden';
};

var onclickloginSubmit = function () {
	var usr = document.getElementById('loginUsername').value;
	var pw = document.getElementById('loginPassword').value;
	document.getElementById('login').style.visibility='hidden';
	
	post_to_url( '/login', { user: usr, password: pw });
};

var post_to_url = function( path, params, method ) {
	method = method || "post";

	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", path);

	for( var key in params ) {
		if( params.hasOwnProperty(key) ) {
			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", key);
			hiddenField.setAttribute("value", params[key]);

			form.appendChild( hiddenField );
		}
	}

	document.body.appendChild( form );
	form.submit();
};