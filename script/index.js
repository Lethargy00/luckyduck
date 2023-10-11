const foodDiv = document.querySelector("#mainFood");
const checkGlutenFree = document.querySelector("input[name=glutenFree]");
const checkLactoseFree = document.querySelector("input[name=lactoseFree]");
const checkVegetarian = document.querySelector("input[name=vegetarian]");
const checkBeef = document.querySelector("input[name=groundBeef]");
const checkPork = document.querySelector("input[name=pork]");
const checkChicken = document.querySelector("input[name=chicken]");
const checkFish = document.querySelector("input[name=fish]");
const languageSelect = document.querySelector("#language");
const swedishOption = document.querySelector("#language option[value='sv']");
const englishOption = document.querySelector("#language option[value='en']");

let language = true;
let menu = [];

// This displays the foods by inserting HTML to the index.html

const displayFoods = function (foods) {
  foodDiv.innerHTML = "";
  const nameProperty = language ? "seName" : "enName";
  const descriptionProperty = language ? "seDescription" : "enDescription";

  foods.forEach((food) => {
    const html = `<div><p class="food-title">${food[nameProperty]}</p><p class="food-price">${food.price} kr</p><p class="food-description">${food[descriptionProperty]}</p></div>`;

    foodDiv.insertAdjacentHTML("beforeend", html);
  });
};

// Fetch the menu data from menu.json
async function fetchMenuData() {
  try {
    const response = await fetch("./script/menu.json");
    if (!response.ok) {
      throw new Error("Failed to fetch menu data");
    }
    const menuData = await response.json(); // Parse the JSON data
    return menuData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Example usage to fetch and filter menu data
async function getMenu() {
  menu = await fetchMenuData();
  filteredMenu = [...menu];
  displayFoods(menu);
}

// Call the getMenu function to fetch and work with menu data
getMenu();

const filterFoods = function () {
  // Reset the filteredMenu to the original menu data
  filteredMenu = [...menu];

  if (checkGlutenFree.checked) {
    filteredMenu = filteredMenu.filter((food) => food.isGlutenFree);
  }
  if (checkLactoseFree.checked) {
    filteredMenu = filteredMenu.filter((food) => food.isLactoseFree);
  }
  if (checkVegetarian.checked) {
    filteredMenu = filteredMenu.filter((food) => food.isVegetarian);
  }
  if (checkBeef.checked) {
    filteredMenu = filteredMenu.filter((food) => {
      return food.typeOfMeat.includes("Beef");
    });
  }
  if (checkPork.checked) {
    filteredMenu = filteredMenu.filter((food) => {
      return food.typeOfMeat.includes("Pork");
    });
  }
  if (checkChicken.checked) {
    filteredMenu = filteredMenu.filter((food) => {
      return food.typeOfMeat.includes("Chicken");
    });
  }
  if (checkFish.checked) {
    filteredMenu = filteredMenu.filter((food) => {
      return food.typeOfMeat.includes("Fish");
    });
  }

  // Display the filtered menu items
  displayFoods(filteredMenu);
};

// Event listeners
checkGlutenFree.addEventListener("change", filterFoods);
checkLactoseFree.addEventListener("change", filterFoods);
checkVegetarian.addEventListener("change", filterFoods);
checkBeef.addEventListener("change", filterFoods);
checkPork.addEventListener("change", filterFoods);
checkChicken.addEventListener("change", filterFoods);
checkFish.addEventListener("change", filterFoods);

languageSelect.addEventListener("change", function () {
  const selectedLanguage = languageSelect.value;

  // Use selectedLanguage to determine the user's language choice
  if (selectedLanguage === "sv") {
    language = true;
  } else if (selectedLanguage === "en") {
    language = false;
  }

  displayFoods(filteredMenu);
});
