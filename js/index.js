window.onload = function (){

	var proxyUrl = 'https://justicebringer.github.io/dconvertor/';
    var targetUrl = 'https://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile';
	
	// fetch(proxyUrl + targetUrl)
	// .then(data => {
	// 	console.table(data);
	// 	//console.log(blob);
	// 	//document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
	// 	return data;
	// })
	// .catch(e => {
	// 	console.log(e);
	// 	return e;
	// });


	var request = new XMLHttpRequest();
	request.open("GET", "https://justicebringer.github.io/DConvertor/?url=" + encodeURIComponent("https://duckduckgo.com/html/?q=stack+overflow"), true);  // last parameter must be true
	request.responseType = "document";
	request.onload = function (e) {
	  if (request.readyState === 4) {
		if (request.status === 200) {
			console.log(request.responseXML);
		  var a = request.responseXML.querySelector("div.result:nth-child(1) > div:nth-child(1) > h2:nth-child(1) > a:nth-child(1)");
		  console.log(a.href);
		  document.body.appendChild(a);
		} else {
		  console.error(request.status, request.statusText);
		}
	  }
	};
	request.onerror = function (e) {
	  console.error(request.status, request.statusText);
	};
	request.send(null);  // not a POST request, so don't send extra data

	// var request = new XMLHttpRequest();

	// request.onreadystatechange = function() {
	// 	jsontext = request.responseText;
	// 	alert(jsontext);
	// }

	// var theLink = '';
	// var myKey = '72fc15d17e984b2f82db06e09121ed44320a66f9fe300007a95379505f9a7a74c650714654fcaa589b5f7462a28f2574f2c4d38eb243872f993df7298c7a8d748bc67959415f0d28c4a0e25e42134848';
	// var myUrl = 'https://justicebringer.github.io/dconvertor/';

	// request.open("GET", "https://extraction.import.io/query/extractor" + theLink + '?_apikey=' + myKey + '&url=' + myUrl, true);

	// request.send();
}