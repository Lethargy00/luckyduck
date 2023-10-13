function translateElement(element, translatedElements) {
  const elementId = element.id;
  const translation = translatedElements[elementId];
  if (translation) {
    element.textContent = translation;
  }
}

function translateSelectionOptions(selectId, translatedElements) {
  const selectElement = document.getElementById(selectId);
  const options = selectElement.getElementsByTagName("option");

  for (let i = 0; i < options.length; i++) {
    const optionId = options[i].id;
    const translation = translatedElements[optionId];

    if (translation) {
      options[i].textContent = translation;
    }
  }
}
function changeLanguageToSwedish() {
  const elementsToTranslate = document.querySelectorAll('[data-se]');
  elementsToTranslate.forEach(element => {
    element.textContent = element.getAttribute('data-se');
  });

  // Store the selected language in localStorage
  localStorage.setItem("selectedLanguage", "sv");
}

function changeLanguageToEnglish() {
  const elementsToTranslate = document.querySelectorAll('[data-en]');
  elementsToTranslate.forEach(element => {
    element.textContent = element.getAttribute('data-en');
  });

  // Store the selected language in localStorage
  localStorage.setItem("selectedLanguage", "en");
}

// Add event listeners for language switches
document.getElementById('swedish').addEventListener('change', changeLanguageToSwedish);
document.getElementById('english').addEventListener('change', changeLanguageToEnglish);

// Load the selected language when the page loads
window.addEventListener("load", loadLanguage);

// Load the last selected language from local storage
function loadLanguage() {
  const selectedLanguage = localStorage.getItem("selectedLanguage");
  if (selectedLanguage === "sv") {
    changeLanguageToSwedish();
  } else {
    changeLanguageToEnglish();
  }
}


function changeLanguage() {
  var selectedLanguage = document.querySelector('input[name="language"]:checked').value;
  var translatedElements = translations[selectedLanguage];

  if (translatedElements) {
    const elementsToTranslate = document.querySelectorAll('h2, label, select, p, [id]:not(#swedish):not(#english)');

    elementsToTranslate.forEach(element => translateElement(element, translatedElements));

    translateSelectionOptions("priceSort", translatedElements);
  }

  // Store the selected language in localStorage
  localStorage.setItem("selectedLanguage", selectedLanguage);
}


const languageRadios = document.querySelectorAll('input[name="language"]');
languageRadios.forEach(radio => {
  radio.addEventListener("change", changeLanguage);

  const languageRadios = document.querySelectorAll('input[name="language"]');
  languageRadios.forEach(radio => {
    radio.addEventListener("change", function () {

      language = this.value === "en" ? false : true;
      filterFoods();
    });
  });

});

// Load the selected language when the page loads
window.addEventListener("load", loadLanguage);