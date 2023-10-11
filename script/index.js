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
const priceSort = document.querySelector("#priceSort");
const optionStandard = document.querySelector(
  "#priceSort option[value='standard']"
);
const optionAscending = document.querySelector(
  "#priceSort option[value='ascending']"
);
const optionDescending = document.querySelector(
  "#priceSort option[value='descending']"
);

let language = true;
let selectedSort = "standard";
let menu = [];

// This displays the foods by inserting HTML to the index.html

const displayFoods = function (foods) {
  foodDiv.innerHTML = "";
  const nameLanguage = language ? "seName" : "enName";
  const descriptionLanguage = language ? "seDescription" : "enDescription";

  const sortedFoods = sortFoodByPrice(foods);

  sortedFoods.forEach((food) => {
    const html = `<div><p class="food-title">${food[nameLanguage]}</p>
    <p class="food-price">${food.price} kr</p>
    <p class="food-description">${food[descriptionLanguage]}</p></div>`;

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

async function getMenu() {
  menu = await fetchMenuData();
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
    checkBeef.checked = false;
    checkPork.checked = false;
    checkChicken.checked = false;
    checkFish.checked = false;
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

const sortFoodByPrice = function (filteredMenu) {
  if (selectedSort === "standard") {
    return filteredMenu;
  } else if (selectedSort === "ascending") {
    return filteredMenu.slice().sort((a, b) => a.price - b.price);
  } else if (selectedSort === "descending") {
    return filteredMenu.slice().sort((a, b) => b.price - a.price);
  }
};

// Event listeners - calls filterFoods to update the list of foods
checkGlutenFree.addEventListener("change", filterFoods);
checkLactoseFree.addEventListener("change", filterFoods);
checkVegetarian.addEventListener("change", filterFoods);
checkBeef.addEventListener("change", filterFoods);
checkPork.addEventListener("change", filterFoods);
checkChicken.addEventListener("change", filterFoods);
checkFish.addEventListener("change", filterFoods);

languageSelect.addEventListener("change", function () {
  const selectedLanguage = languageSelect.value;

  // Use selectedLanguage to determine the user's language choice, Swedish is default
  if (selectedLanguage === "sv") {
    language = true;
  } else if (selectedLanguage === "en") {
    language = false;
  }

  displayFoods(filteredMenu);
});

// Changes the value of sorting and calls the filter to update the list of foods

priceSort.addEventListener("change", function () {
  selectedSort = priceSort.value;
  filterFoods();
});
