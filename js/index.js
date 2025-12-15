// --- DYNAMIC CONTENT MAPPING FUNCTIONS ---

/**
 * Extracts the numerical ID from the poem's URL.
 * Example: https://www.poeziitraiandorz.ro/1392-Ce-sfint-si-nalt-curaj -> 1392
 * @param {string} url - The URL string.
 * @returns {number} The extracted ID or 0 if not found.
 */
function extractPoemId(url) {
    // Looks for a number after the last '/' and before the first non-numeric character (like '-')
    const match = url.match(/\/(\d+)[-\/]?/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }
    return 0; // Default to 0 if ID extraction fails
}

/**
 * Maps a poem ID to its corresponding book title based on specified ranges.
 * NOTE: You can add more ranges here as needed.
 * @param {number} poemId - The ID number extracted from the poem's URL.
 * @returns {string} The name of the volume (e.g., "Cântarea Anilor").
 */
function getBookTitle(poemId) {
    // Defined ranges based on your request:
    if (poemId >= 1384 && poemId <= 1562) {
        return "Cântarea Anilor";
    } else if (poemId >= 1563 && poemId <= 1734) {
        return "Cântările Roadelor";
    }
    
    // Add more ranges here as you determine them...
    
    // Default return for IDs outside the known ranges
    return "Volum Necunoscut"; 
}

// --- CORE CONVERSION FUNCTION ---

function transformDia(tDia){
	if(tDia === ""){
		return " ";
	}

	// Direct word replacements for specific words (sînt/sunt, Isus/Iisus)
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
	// Process based on position: 'î' -> 'â' except at the beginning or end
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

	// Special case replacement for "Isus" (if it was missed by the initial check)
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
    
    // 1. Prepare Text: Remove link and extract ID
    const lines = textTo.trim().split('\n');
    let poemId = 0;
    let textWithoutSignature = textTo;
    
    // Check if the last line looks like a URL
    const lastLine = lines[lines.length - 1].trim();

    if (lastLine.startsWith('http')) {
        poemId = extractPoemId(lastLine);
        // Remove the link line and the traditional signature line ("—Traian Dorz") if it exists
        textWithoutSignature = lines.slice(0, -1).join('\n');
    } 
    
    // Determine the dynamic ending based on the extracted ID
    const dynamicName = getBookTitle(poemId);
    
    // The signature should only be "Fr. Traian Dorz" if withLink is true, otherwise the full volume name.
    // NOTE: Based on your request, the new format is always "Traian Dorz, din vol. DynamicName"
    const newSignature = `Traian Dorz, din vol. „${dynamicName}”`;

    // Reset textTo to the cleaned text for the main loop
    textTo = textWithoutSignature;

    // 2. Process Text (Word by Word)
	for (var x of textTo){
		
		if(x === " "){
			console.log("Function convertText: " + sngWrd);
			
            // --- The original logic for checking "—Traian" is REMOVED/DEPRECATED here ---
            // The signature is now handled at the end of the function.
			
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
	
    // 3. Handle the last word if there was no trailing space/newline
	if (typeof sngWrd !== 'undefined' && sngWrd !== ''){
		sngWrd = transformDia(sngWrd);
		newText += sngWrd; 
	}
    
    // 4. Add the new dynamic signature
    
    // Ensure the signature is on a new line
    if (newText.length > 0 && !newText.trim().endsWith(newSignature.substring(0, 10)) && !newText.endsWith('\n')) {
        newText += '\n';
    }
    
    newText = newText.trim() + '\n\n' + newSignature;
    
    // If the original text ended with a link, we need to decide what to do with the link.
    // The previous implementation ignored the link if `withLink` was true and only returned the signature.
    // We will keep the link in the output if `withLink` is selected, using the original last line.
    if(withLink && lastLine.startsWith('http')) {
        newText += '\n' + lastLine;
    }


	console.log("Function convertText: " + newText);
	return newText;
}

// --- UI/HELPER FUNCTIONS (UNCHANGED) ---

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

	// The convertText function now handles ID extraction internally
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

var times = 0;

function executaActiune(){
	document.getElementById("pasteArea").value = "";
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
	}, 300);
}

window.onload = function (){
	document.getElementById('copyPasted').addEventListener('click', ()=>{
		let copyArea = document.getElementById('convertedText');

		navigator.clipboard.writeText(copyArea.value);

		var tooltip = document.getElementById("myTooltip");
  		tooltip.innerHTML = "Copiat";
	});
}
