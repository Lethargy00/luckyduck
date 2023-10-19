//Funktion för semantisk lang="" html
function changeLang(languageCode) {
  document.documentElement.setAttribute("lang", languageCode);
};

//Översätter till svenska
function changeLanguageToSwedish() {
  const elementsToTranslate = document.querySelectorAll('[data-se]'); //Hämtar attributen data-se för varje element

  elementsToTranslate.forEach(element => {
    element.textContent = element.getAttribute('data-se');
    changeLang('se');//För att ändra HTML lang sv till en
  });

  //Sparar det valda språket 
  localStorage.setItem("selectedLanguage", "sv");
};

//Översätter till engelska
function changeLanguageToEnglish() {
  const elementsToTranslate = document.querySelectorAll('[data-en]'); //Hämtar attributen data-en för varje element
  elementsToTranslate.forEach(element => {
    element.textContent = element.getAttribute('data-en');
    changeLang('en');//För att ändra HTML lang sv till en
  });

  //Sparar det valda språket
  localStorage.setItem("selectedLanguage", "en");
};

//Händelselyssnare för ändring av språket
document.getElementById('swedish').addEventListener('change', changeLanguageToSwedish);
document.getElementById('english').addEventListener('change', changeLanguageToEnglish);
document.getElementById('english').addEventListener('click', changeLang('en'));

//Laddar det valda språket som sparats i localStorage
function loadLanguage() {
  const selectedLanguage = localStorage.getItem("selectedLanguage");
  const swedishRadio = document.getElementById("swedish");//Hämtar swedish från DOM
  const englishRadio = document.getElementById("english");//Hämtar english från DOM
  const selectedCheckBox = document.querySelector('input[name="language"]:checked');//Hämtar den markerade radioknappen 

  if (selectedLanguage === "sv" || !selectedCheckBox) { //Kontrollerar om valt språk är svenska eller om inget språk är valt och kör då koden inuti if
    swedishRadio.checked = true;
    changeLanguageToSwedish();
  } else if (selectedLanguage === "en") {//Om det valda språket är engelska körs koden nedan
    englishRadio.checked = true;
    changeLanguageToEnglish();
  }
};

//Laddar det valda språket när sidan laddas
window.addEventListener("load", loadLanguage);