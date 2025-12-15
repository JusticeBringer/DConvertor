// --- DYNAMIC CONTENT MAPPING FUNCTIONS (UNCHANGED) ---

/**
 * Extracts the numerical ID from the poem's URL.
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
 */
function getBookTitle(poemId) {
  // Defined ranges based on your request:
  if (poemId >= 1 && poemId <= 140) {
    return "Cântările Dintâi";
  }
  if (poemId >= 141 && poemId <= 310) {
    return "Cântări Îndepărtate";
  }
  if (poemId >= 1384 && poemId <= 1562) {
    return "Cântarea Anilor";
  }
  if (poemId >= 1563 && poemId <= 1734) {
    return "Cântările Roadelor";
  }

  // Add more ranges here as you determine them...

  // Default return for IDs outside the known ranges
  return "Volum Necunoscut";
}

// --- CORE CONVERSION FUNCTION (UNCHANGED) ---

function transformDia(tDia) {
  if (tDia === "") {
    return " ";
  }

  // Direct word replacements for specific words (sînt/sunt, Isus/Iisus)
  if (tDia === "Isus") return "Iisus";
  if (tDia === "sînt") return "sunt";
  if (tDia === "Sînt") return "Sunt";
  if (tDia === "sîntem") return "suntem";
  if (tDia === "Sîntem") return "Suntem";
  if (tDia === "sînteți") return "sunteți";
  if (tDia === "Sînteți") return "Sunteți";

  var newW = "";
  // Process based on position: 'î' -> 'â' except at the beginning or end
  newW += tDia[0];
  for (let i = 1; i < tDia.length - 1; i++) {
    if (tDia[i] === "î") newW += "â";
    else newW += tDia[i];
  }

  if (tDia.length > 1) newW += tDia[tDia.length - 1];

  var newWrd = "";
  console.log("Function transformDia: " + newW);

  // Special case replacement for "Isus" (if it was missed by the initial check)
  if (newW.search("Isus") >= 0) {
    for (let i = 0; i < tDia.length; i++) {
      if (
        newW[i] === "I" &&
        newW[i + 1] === "s" &&
        newW[i + 2] === "u" &&
        newW[i + 3] === "s"
      ) {
        newWrd += "Iisus";
        i += 3;
      } else newWrd += newW[i];
    }
  } else return newW;

  return newWrd;
}

function convertText(textTo, shouldExcludeLink) {
  var sngWrd = "";
  var newText = "";

  // 1. Prepare Text: Clean up all trailing signatures and links
  let lines = textTo.trim().split("\n");
  let poemId = 0;
  let originalLink = ""; // Variable to store the captured link

  // Iteratively remove blank lines, known signatures, and the URL from the end
  while (lines.length > 0) {
    const lastLine = lines[lines.length - 1].trim();

    if (lastLine === "") {
      // Remove blank lines
      lines.pop();
      continue;
    }

    if (lastLine.startsWith("http")) {
      // Found and extract ID from the URL
      poemId = extractPoemId(lastLine);
      originalLink = lastLine; // Capture the original link here
      lines.pop(); // Remove the URL line
      continue;
    }

    // Check for known signature formats (case-insensitive for robustness)
    if (
      lastLine.toLowerCase().includes("traian dorz") ||
      lastLine.toLowerCase().includes("fr. traian dorz") ||
      lastLine.startsWith("—Traian")
    ) {
      lines.pop(); // Remove the signature line
      continue;
    }

    // If the last line is not a link, blank, or a known signature, stop cleaning
    break;
  }

  // Reconstruct the clean poem text
  let textWithoutSignature = lines.join("\n");

  // 2. Determine the dynamic ending
  const dynamicName = getBookTitle(poemId);

  // New, standardized signature format
  const newSignature = `— Traian Dorz, din vol. ${dynamicName}`;

  // Reset textTo to the cleaned text for the main loop
  textTo = textWithoutSignature;

  // 3. Process Text (Word by Word) for dialect conversion
  for (var x of textTo) {
    if (x === " ") {
      console.log("Function convertText: " + sngWrd);

      sngWrd = transformDia(sngWrd);
      newText += sngWrd + " ";

      sngWrd = "";
    } else if (x === "\n") {
      sngWrd = transformDia(sngWrd);
      newText += sngWrd + "\n";

      sngWrd = "";
    } else {
      sngWrd += x;
    }
  }

  // 4. Handle the last word
  if (typeof sngWrd !== "undefined" && sngWrd !== "") {
    sngWrd = transformDia(sngWrd);
    newText += sngWrd;
  }

  // 5. Add the new standardized signature (and conditionally the link)

  // Ensure text ends neatly before adding the signature
  newText = newText.trim();

  // Add two newlines for separation before the signature
  newText += "\n\n" + newSignature;

  // If the checkbox `shouldExcludeLink` is false AND we successfully captured a link, append it with a leading newline.
  if (shouldExcludeLink === false && originalLink) {
    newText += "\n" + originalLink;
  }

  console.log("Function convertText: " + newText);
  return newText;
}

// --- DARK THEME LOGIC (NEW FUNCTIONS) ---

const THEME_KEY = "theme-preference";
const DARK_CLASS = "dark-theme";

/**
 * Applies the specified theme preference to the <body> element.
 * @param {boolean} isDark - true for dark mode, false for light mode.
 */
function setTheme(isDark) {
  document.body.classList.toggle(DARK_CLASS, isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

  // Update the checkbox state to match the applied theme
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.checked = isDark;
  }
}

/**
 * Initializes the theme based on localStorage or system preference.
 */
function initializeTheme() {
  const savedPreference = localStorage.getItem(THEME_KEY);
  let prefersDark;

  if (savedPreference) {
    // Use saved preference
    prefersDark = savedPreference === "dark";
  } else {
    // Check system preference
    prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  setTheme(prefersDark);
}

// --- UI/HELPER FUNCTIONS (UNCHANGED) ---

function moveLocation() {
  var convertArea = document.getElementById("convertedText");
  convertArea.scrollIntoView();
}

function makeBigger() {
  var convertArea = document.getElementById("convertedText");
  convertArea.style.height = "30vh";
}

function moveText() {
  var pasteArea = document.getElementById("pasteArea");
  var convertArea = document.getElementById("convertedText");
  var withLink = document.getElementById("cuSite").checked;
  console.log("Function moveText, Check link: " + withLink);

  // The convertText function now handles ID extraction internally
  convertArea.value = convertText(pasteArea.value, withLink);

  makeBigger();
  moveLocation();
}

function insertCopied() {
  var toInsertArea = document.getElementById("pasteArea");

  navigator.clipboard.readText().then((text) => {
    toInsertArea.value = text;
  });
}

function toMoveText() {
  var toInsertArea = document.getElementById("pasteArea");
  var convertedArea = document.getElementById("convertedText");

  toInsertArea.value = convertedArea.value;
}

function clearTooltip() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copiază";
}

function clearTooltipMagic() {
  var tooltip = document.getElementById("myTooltipMagic");
  tooltip.innerHTML = "Copiază";
}

myBlurFunction = function (state) {
  /* state can be 1 or 0 */
  var containerElement = document.getElementById("allContent");
  var overlayEle = document.getElementById("overlay");

  if (state) {
    overlayEle.style.display = "block";
    containerElement.setAttribute("class", "blur");
  } else {
    overlayEle.style.display = "none";
    containerElement.setAttribute("class", null);
  }
};

function openMail() {
  window.location.href = "mailto:gabriel.univ208@gmail.com";
}

function countCharacters() {
  var pasteArea = document.getElementById("pasteArea");

  console.log("L: " + pasteArea.length);
  console.log("V: " + pasteArea.value.length);

  return pasteArea.value.length;
}

var times = 0;

function executaActiune() {
  document.getElementById("pasteArea").value = "";
  var once = 0;

  setInterval(function () {
    if (once === 0) {
      once = 1;
      insertCopied();
    }

    if (countCharacters() > 1) {
      if (once === 1) {
        moveText();

        once = 2;

        console.log("In executa...");

        let copyArea = document.getElementById("convertedText");
        navigator.clipboard.writeText(copyArea.value);
      }
    }
  }, 300);
}

// --- WINDOW.ONLOAD MODIFIED FOR THEME INITIALIZATION AND TOGGLE ---

window.onload = function () {
  // Initialize the theme immediately
  initializeTheme();

  // Event listener for the theme toggle switch
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("change", (event) => {
      setTheme(event.target.checked);
    });
  }

  // Original event listener for copy button
  document.getElementById("copyPasted").addEventListener("click", () => {
    let copyArea = document.getElementById("convertedText");

    navigator.clipboard.writeText(copyArea.value);

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copiat";
  });
};
