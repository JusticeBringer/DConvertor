function forImportIo(){
	var proxyUrl = 'https://justicebringer.github.io/dconvertor/';
    var targetUrl = 'https://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile';

	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		let jsontext = request.responseText;
		alert(jsontext);
	}

	var theLink = '';
	var myKey = '72fc15d17e984b2f82db06e09121ed44320a66f9fe300007a95379505f9a7a74c650714654fcaa589b5f7462a28f2574f2c4d38eb243872f993df7298c7a8d748bc67959415f0d28c4a0e25e42134848';
	var myUrl = 'https://justicebringer.github.io/DConvertor/';

	request.open("GET", "https://extraction.import.io/query/extractor" + theLink + '?_apikey=' + myKey + '&url=' + myUrl, true);

	request.send();
}

window.onload = function (){

}