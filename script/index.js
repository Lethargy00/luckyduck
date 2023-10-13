const foodDiv = document.querySelector("#mainFood");
const checkGlutenFree = document.querySelector("input[name=glutenFree]");
const checkLactoseFree = document.querySelector("input[name=lactoseFree]");
const checkVegetarian = document.querySelector("input[name=vegetarian]");
const checkBeef = document.querySelector("input[name=groundBeef]");
const checkPork = document.querySelector("input[name=pork]");
const checkChicken = document.querySelector("input[name=chicken]");
const checkFish = document.querySelector("input[name=fish]");
const languageSelect = document.querySelectorAll("input[name=language]");
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
const orderList = document.querySelector(".orderList");
const orderSummary = document.querySelector(".orderSummary");

// SVG for portion sizes
const smallPortionSvg =
  '<svg class="portionIcon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>';
const largePortionSvg =
  '<svg class="portionIcon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/></svg>';

//Setting default values
let language = true;
let selectedSort = "standard";
let menu = [];
let basket = [];

// This displays the foods by inserting HTML to the index.html
const displayFoods = function (foods) {
  foodDiv.innerHTML = "";
  const nameLanguage = language ? "seName" : "enName";
  const descriptionLanguage = language ? "seDescription" : "enDescription";
  const orderLanguage = language ? "Beställ" : "Order";

  const sortedFoods = sortFoodByPrice(foods);
  sortedFoods.forEach((food) => {
    let priceHtml = "";

    if (food.price.length > 1) {
      priceHtml = `<p class="food-price">${smallPortionSvg} ${food.price[0]} kr <button class="addToBasketSmall">${orderLanguage}</button></p><p>${largePortionSvg} ${food.price[1]} kr <button class="addToBasketLarge">${orderLanguage}</button></p>`;
    } else {
      priceHtml = `<p class="food-price">${largePortionSvg} ${food.price[0]} kr <button class="addToBasket">${orderLanguage}</button></p>`;
    }
    const html = `<div><p class="food-title">${food[nameLanguage]}</p>
    ${priceHtml}
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
    const menuData = await response.json();
    return menuData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getMenu() {
  menu = await fetchMenuData();
  displayFoods(menu); // Displays the menu when first loading page
}
getMenu();

// Filters the food items basen on checkboxes ticked
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
    // Uncheck all meat options when ticking vegetarian
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
    return filteredMenu.sort((a, b) => a.price[0] - b.price[0]);
  } else if (selectedSort === "descending") {
    return filteredMenu.sort((a, b) => b.price[0] - a.price[0]);
  }
};

// Adding items to the basket
foodDiv.addEventListener("click", function (event) {
  const target = event.target; // Gets the target you clicked

  // Checks if you clicked an actual button
  if (
    target.classList.contains("addToBasket") ||
    target.classList.contains("addToBasketLarge") ||
    target.classList.contains("addToBasketSmall")
  ) {
    // Finds the div containing food details
    const foodContainer = target.closest("div");
    // Checks if foodContainer is a truthy value (if the div was found it is truthy)
    if (foodContainer) {
      let icon = largePortionSvg; // Icon to represent large or small portion in basket
      const name = foodContainer.querySelector(".food-title").textContent; // Gets the food name
      let priceElement = foodContainer.querySelector(".food-price"); // Gets the food price
      if (target.classList.contains("addToBasketSmall")) {
        icon = smallPortionSvg; // Change default (lage portion) to small portion icon
      }
      if (target.classList.contains("addToBasketLarge")) {
        // Alters price based on the button clicked
        // If price has multiple options, use the second price in the array
        priceElement = priceElement.nextElementSibling;
      }
      const priceText = priceElement.textContent;
      const price = parseInt(priceText.match(/\d+/)); // Extract the price using regular expression that ckecks for one or more consecutive digits and then parses them to integers.

      // Ads the food item to the basket
      basket.push({ name, price, icon });
      updateOrderList();
      updateOrderSummary();
    }
  }
});

function updateOrderList() {
  orderList.innerHTML = "";
  basket.forEach((item) => {
    const html = `<li class="basketItem">${item.name} ${item.icon}</li>`;
    orderList.insertAdjacentHTML("beforeend", html);
    console.log(item);
  });
}

function updateOrderSummary() {
  orderSummary.innerHTML = "";
  const total = basket.reduce((sum, item) => sum + item.price, 0); //Starts at 0 and accumulates the price
  const html = `Summa: ${total} kr`;
  orderSummary.insertAdjacentHTML("beforeend", html);
}

if (localStorage.getItem("selectedLanguage") === "en") {
  language = false;
} else language = true;

// Event listeners - calls filterFoods to update the list of foods -------------------------------------------
checkGlutenFree.addEventListener("change", filterFoods);
checkLactoseFree.addEventListener("change", filterFoods);
checkVegetarian.addEventListener("change", filterFoods);
checkBeef.addEventListener("change", filterFoods);
checkPork.addEventListener("change", filterFoods);
checkChicken.addEventListener("change", filterFoods);
checkFish.addEventListener("change", filterFoods);

languageSelect.forEach((change) =>
  change.addEventListener("change", function () {
    language = !language; // Switch from default Swedish to English
    filterFoods();
  })
);

// Changes the value of sorting and calls the filter to update the list of foods
priceSort.addEventListener("change", function () {
  selectedSort = priceSort.value;
  console.log(selectedSort);
  filterFoods();
});
