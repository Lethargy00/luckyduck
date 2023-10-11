var translations = {
  sv: {
    menuTitle: "Meny",
    mainFilters: "Filter",
    mainName: "Namn + Pris",
    titleKötträtter: "Kottratter",
    labelVegetarian: "Vegetarisk",
    labelChicken: "Kyckling",
    labelPork: "Fläsk",
    labelGroundBeef: "Nöt",
    labelFish: "Fisk",
    titleAllergies: "Allergier",
    labelGlutenFree: "Glutenfri",
    labelLactoseFree: "Laktosfri",
    titlePriceSort: "Pris sortering",
    optionAscending: "Stigande",
    optionDescending: "Fallande",
  },
  en: {
    menuTitle: "Menu",
    mainFilters: "Filters",
    mainName: "Name + Price",
    titleKötträtter: "Meat dish",
    labelVegetarian: "Vegetarian",
    labelChicken: "Chicken",
    labelPork: "Pork",
    labelGroundBeef: "Beef",
    labelFish: "Fish",
    titleAllergies: "Allergies",
    labelGlutenFree: "Gluten free",
    labelLactoseFree: "Lactose free",
    titlePriceSort: "Price sorting",
    optionAscending: "Ascending",
    optionDescending: "Descending",
  },
};

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

function changeLanguage() {
  var selectedLanguage = document.getElementById("language").value;
  var translatedElements = translations[selectedLanguage];
  
  if (translatedElements) {
    const headerElements = document.querySelectorAll("header, h1, h2, label");
    headerElements.forEach(element => translateElement(element, translatedElements));
  
    const mainElements = document.querySelectorAll("h3, input, select, p");
    mainElements.forEach(element => translateElement(element, translatedElements));
    
    const footerElements = document.querySelectorAll("footer, p");
    footerElements.forEach(element => translateElement(element, translatedElements));
    
    // Translate the options in the select element
    translateSelectionOptions("priceSort", translatedElements);
  }
  // Store the selected language in localStorage
  localStorage.setItem("selectedLanguage", selectedLanguage);
}

function loadLanguage() {
  var storedLanguage = localStorage.getItem("selectedLanguage");
  if (storedLanguage) {
    document.getElementById("language").value = storedLanguage;
  }
  changeLanguage();
}

document.getElementById("language").addEventListener("change", changeLanguage);
window.addEventListener("load", loadLanguage);
