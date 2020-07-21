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

	$.getJSON(proxyUrl + encodeURIComponent(targetUrl) + '&callback=?', function (data) {
        alert(data.contents);
    });

	// var request = new XMLHttpRequest();

	// request.onreadystatechange = function() {
	// 	jsontext = request.responseText;
	// 	alert(jsontext);
	// }

	// request.open("GET", "https://extraction.import.io/query/extractor/THE_PUBLIC_LINK_THEY_GIVE_YOU?_apikey=YOUR_KEY&url=YOUR_URL", true);

	// request.send();
}