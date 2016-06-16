// user doesnt need to be redirected to 'apply project' / 'faculty proposals' page
if (!checkCookie("destinationURL"))
{
	alert("No target destination");
}

// user needs to be redirected to target page in cookie
// todo: sanitize cookie to make sure we only redirect to *.fiu.edu links
else
{
	// otherwise, redirect them to the url
	//alert(getCookie("destinationURL"));
	var cook = getCookie("destinationURL");

	alert(cook);

	// clear the cookie
	document.cookie = "destinationURL" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

	window.location = getCookie("destinationURL");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function checkCookie(cookieName)
{
    var username=getCookie(cookieName);
    if (username!="") {
        return true;
    } else {
		return false;
        }
}