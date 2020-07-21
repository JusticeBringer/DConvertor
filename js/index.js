window.onload = function (){

	var proxyUrl = 'https://justicebringer.github.io/DConvertor/';
    var targetUrl = 'https://www.poeziitraiandorz.ro';
	


	var request = new XMLHttpRequest();
	request.open("GET", proxyUrl + "?url=" + encodeURIComponent(targetUrl), true);  // last parameter must be true
	request.responseType = "document";
	request.onload = function (e) {
	  if (request.readyState === 4) {
		if (request.status === 200) {
			console.log(request.responseXML);
		  var a = request.responseXML.querySelector("#app");
		  console.log(a);
		} else {
		  console.error(request.status, request.statusText);
		}
	  }
	};
	request.onerror = function (e) {
	  console.error(request.status, request.statusText);
	};
	// request.send(null);  // not a POST request, so don't send extra data

}