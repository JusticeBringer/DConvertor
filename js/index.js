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

function transformDia(tDia){
	if(tDia === ""){
		return " ";
	}

	if(tDia === "Isus")
		return "Iisus";
	if(tDia === "sînt")
		return "sunt";
	
	var newW = "";
	newW += tDia[0];
	for(let i = 1; i < tDia.length - 1; i ++){
		if(tDia[i] === 'î')
			newW += 'â';
		else
			newW += tDia[i];
	}

	if(tDia.length > 1)
		newW += tDia[tDia.length - 1];

	var newWrd = "";
	console.log(newW);

	if(newW.search("Isus") >= 0){
		for(let i = 0; i < tDia.length; i ++){
			if(       newW[i] === 'I' 
			   && newW[i + 1] === 's'
			   && newW[i + 2] === 'u'
			   && newW[i + 3] === 's')
				{
					newWrd += "Iisus";
					i += 3;
				}
			else
				newWrd += newW[i];
		}
	}
	else return newW;

	return newWrd;
}

function convertText(textTo){
	var sngWrd = "";
	var newText = "";

	for (var x of textTo){
		// if (typeof sngWrd === 'undefined')
		// 	continue;

		if(x === " "){
			sngWrd = transformDia(sngWrd);
			newText += sngWrd + " ";

			sngWrd = "";
		}
		else if(x === '\n'){
			sngWrd = transformDia(sngWrd);
			newText += sngWrd + '\n';

			sngWrd = "";
		}
		else{
			sngWrd += x;
		}
	}
	
	if (typeof sngWrd !== 'undefined'){
		if (x !== " " && x !== "\n"){
			sngWrd = transformDia(sngWrd);
		}

		newText += sngWrd + '\n';
	}

	console.log(newText);
	return newText;
}

function moveText(){
	var pasteArea;
	var convertArea;

	if(document.documentElement.clientWidth <= 425){
		pasteArea = document.getElementById("pasteAreaMob425");
		convertArea = document.getElementById('convertedTextMob425');
	}
	else{
		pasteArea = document.getElementById("pasteArea");
		convertArea = document.getElementById('convertedText');
	}

	convertArea.value = pasteArea.value;
	convertArea.value = convertText(convertArea.value);
}

function insertCopied(){
	var toInsertArea = "";

	if(document.documentElement.clientWidth <= 425){
		toInsertArea = document.getElementById("pasteAreaMob425");
	}
	else{
		toInsertArea = document.getElementById("pasteArea");
	}

	navigator.clipboard.readText()
    .then((text)=>{
        toInsertArea.value = text;
	});
}

function clearTooltip(){
	var tooltip = document.getElementById("myTooltip");
  	tooltip.innerHTML = "Copiază";
}

window.onload = function (){
	document.getElementById('copyPasted').addEventListener('click', ()=>{
		let copyArea;

		if(document.documentElement.clientWidth <= 425){
			copyArea = document.getElementById('convertedTextMob425');
		}
		else{
			copyArea = document.getElementById('convertedText');
		}

		navigator.clipboard.writeText(copyArea.value);

		var tooltip = document.getElementById("myTooltip");
  		tooltip.innerHTML = "Copiat";
	});
}