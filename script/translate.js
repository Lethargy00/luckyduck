
//Hämtar elementets id och försöker hitta översättning, om översättning hittas ändras texten

function translateElement(element, translatedElements) {
  const elementId = element.id;
  const translation = translatedElements[elementId];
  if (translation) {
    element.textContent = translation;
  }
}

//Hämtar alla option element i select och översätter
function translateSelectionOptions(selectId, translatedElements) {
  const selectElement = document.getElementById(selectId);
  const options = selectElement.getElementsByTagName("option");

  for (let i = 0; i < options.length; i++) { //loopar igenom varje option element inuti options variabeln
    const optionId = options[i].id;
    const translation = translatedElements[optionId];

    if (translation) {
      options[i].textContent = translation;
    }
  }
}

//Översätter till svenska
function changeLanguageToSwedish() {
  const elementsToTranslate = document.querySelectorAll('[data-se]'); //Hämtar attributen data-se för varje element

  elementsToTranslate.forEach(element => {
    element.textContent = element.getAttribute('data-se');
  });


  //Sparar det valda språket 
  localStorage.setItem("selectedLanguage", "sv");
}

//Översätter till engelska
function changeLanguageToEnglish() {
  const elementsToTranslate = document.querySelectorAll('[data-en]');
  elementsToTranslate.forEach(element => {
    element.textContent = element.getAttribute('data-en');
  });

  //Sparar det valda språket
  localStorage.setItem("selectedLanguage", "en");
}



//Händelselyssnare för ändring av språket
document.getElementById('swedish').addEventListener('change', changeLanguageToSwedish);
document.getElementById('english').addEventListener('change', changeLanguageToEnglish);

//Laddar det valda språket när sidan laddas
window.addEventListener("load", loadLanguage);

//Laddar det valda språket som sparats i localStorage
function loadLanguage() {
  const selectedLanguage = localStorage.getItem("selectedLanguage");

  if (selectedLanguage === "sv") {
    changeLanguageToSwedish();
  } else {

    changeLanguageToEnglish();
  }
}

//Används för att byta språk baserat på användarens val
function changeLanguage() {
  var selectedLanguage = document.querySelector('input[name="language"]:checked').value;
  var translatedElements = translations[selectedLanguage];

  if (translatedElements) {

    const elementsToTranslate = document.querySelectorAll('h2, label, select, p, [id]:not(#swedish):not(#english)'); //Översätter element med tag och element utan id

    elementsToTranslate.forEach(element => translateElement(element, translatedElements));


    translateSelectionOptions("priceSort", translatedElements);
  }

  // Store the selected language in localStorage
  localStorage.setItem("selectedLanguage", selectedLanguage);
}


//Hämtar radio från DOM och lägger en händelselyssnare för radioknapparna som ändrar språket.
//Kör antingen changeLanguage eller en annan funktion som påverkar filterFoods inne i index.js
const languageRadios = document.querySelectorAll('input[name="language"]');
languageRadios.forEach(radio => {
  radio.addEventListener("change", changeLanguage);

  const languageRadios = document.querySelectorAll('input[name="language"]');
  languageRadios.forEach(radio => {
    radio.addEventListener("change", function () {

      language = this.value === "en" ? false : true; //Om det användaren valt är "en" blir det true annars false
      filterFoods();
    });
  });


});

// Load the selected language when the page loads
window.addEventListener("load", loadLanguage);