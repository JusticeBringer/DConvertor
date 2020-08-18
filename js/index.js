function transformDia(tDia){
	if(tDia === ""){
		return " ";
	}

	if(tDia === "Isus")
		return "Iisus";
	if(tDia === "sînt")
		return "sunt";
	if(tDia === "Sînt")
		return "Sunt";
	if(tDia === "sîntem")
		return "suntem";
	if(tDia === "Sîntem")
		return "Suntem";
	if(tDia === "sînteți")
		return "sunteți";
	if(tDia === "Sînteți")
		return "Sunteți";
	
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
	console.log("Function transformDia: " + newW);

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

function convertText(textTo, withLink){
	var sngWrd = "";
	var newText = "";
	var count = 0;

	for (var x of textTo){
		count ++;
		// if (typeof sngWrd === 'undefined')
		// 	continue;

		if(x === " "){
			console.log("Function convertText: " + sngWrd);
			if((sngWrd[0] + sngWrd[1] + sngWrd[2] + sngWrd[3] + sngWrd[4] + sngWrd[5] + sngWrd[6] ) === "—Traian"){
				if(withLink){
					newText += "— Fr. Traian Dorz";
					return newText;
				}
				else{
					newText += "— Fr. Traian Dorz";

					for(let ind = count + 4; ind < textTo.length; ind ++){
						newText += textTo[ind];
					}

					return newText;
				}
			}
			else{
				sngWrd = transformDia(sngWrd);
				newText += sngWrd + " ";
	
				sngWrd = "";
			}

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

	console.log("Function convertText: " + newText);
	return newText;
}

function moveLocation(){
	var convertArea = document.getElementById('convertedText');
	convertArea.scrollIntoView();
}

function makeBigger(){
	var convertArea = document.getElementById('convertedText');
	convertArea.style.height = "30vh";
}

function moveText(){
	var pasteArea = document.getElementById("pasteArea");
	var convertArea = document.getElementById('convertedText');
	var withLink = document.getElementById('cuSite').checked;
	console.log("Function moveText, Check link: " + withLink);

	convertArea.value = convertText(pasteArea.value, withLink);

	makeBigger();
	moveLocation();
}

function insertCopied(){
	var toInsertArea = document.getElementById("pasteArea");

	navigator.clipboard.readText()
    .then((text)=>{
        toInsertArea.value = text;
	});
}

function toMoveText(){
	var toInsertArea = document.getElementById("pasteArea");
	var convertedArea = document.getElementById("convertedText");

	toInsertArea.value = convertedArea.value;
}

function clearTooltip(){
	var tooltip = document.getElementById("myTooltip");
  	tooltip.innerHTML = "Copiază";
}

function clearTooltipMagic(){
	var tooltip = document.getElementById("myTooltipMagic");
  	tooltip.innerHTML = "Copiază";
}

myBlurFunction = function(state) {
    /* state can be 1 or 0 */
    var containerElement = document.getElementById('allContent');
    var overlayEle = document.getElementById('overlay');

    if (state) {
        overlayEle.style.display = 'block';
        containerElement.setAttribute('class', 'blur');
    } else {
        overlayEle.style.display = 'none';
        containerElement.setAttribute('class', null);
    }
};

function openMail(){
	window.location.href = "mailto:gabriel.univ208@gmail.com";
}


function countCharacters(){
	var pasteArea = document.getElementById("pasteArea");

	console.log("L: " + pasteArea.length);
	console.log("V: " + pasteArea.value.length);

	return pasteArea.value.length;
}

function executaActiune(){
	var once = 0;

	setInterval(function(){ 
		if (once === 0){
			once = 1;
			insertCopied();
		}

		if(countCharacters() > 1){
			if(once === 1){
				moveText();
				once = 2;
				
				console.log("In executa...");
				
				let copyArea = document.getElementById('convertedText');
				navigator.clipboard.writeText(copyArea.value);
			}
		}
	}, 1000);
	

}

window.onload = function (){
	document.getElementById('copyPasted').addEventListener('click', ()=>{
		let copyArea = document.getElementById('convertedText');

		navigator.clipboard.writeText(copyArea.value);

		var tooltip = document.getElementById("myTooltip");
  		tooltip.innerHTML = "Copiat";
	});
}