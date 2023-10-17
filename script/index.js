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
      priceHtml = `<p class="food-price">${smallPortionSvg} ${food.price[0]} kr <button class="addToBasket addToBasketSmall" id="id${food.id[0]}">${orderLanguage}</button></p><p>${largePortionSvg} ${food.price[1]} kr <button class="addToBasket addToBasketLarge" id="id${food.id[1]}">${orderLanguage}</button></p>`;
    } else {
      priceHtml = `<p class="food-price">${largePortionSvg} ${food.price[0]} kr <button class="addToBasket" id="id${food.id[0]}">${orderLanguage}</button></p>`;
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

const filterFoods = function () {
  // Filters the food items based on checkboxes ticked

  filteredMenu = [...menu]; // Reset the filteredMenu to the original menu data

  const filteredMeats = [];

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
    filteredMeats.push("Beef");
  }

  if (checkPork.checked) {
    filteredMeats.push("Pork");
  }

  if (checkChicken.checked) {
    filteredMeats.push("Chicken");
  }

  if (checkFish.checked) {
    filteredMeats.push("Fish");
  }

  if (filteredMeats.length > 0) {
    filteredMenu = filteredMenu.filter((food) => {
      return filteredMeats.some((meat) => food.typeOfMeat.includes(meat));
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

const addToBasket = function (event) {
  const target = event.target; // Gets the target you clicked

  // Checks if you clicked an actual button
  if (target.classList.contains("addToBasket")) {
    const foodContainer = target.closest("div"); // Selects the div containing the food

    if (foodContainer) {
      // Extract the unique ID from the clicked button's class
      const buttonIds = target.id.split(" ");
      let id = null;
      for (const idNum of buttonIds) {
        if (idNum.startsWith("id")) {
          id = parseInt(idNum.replace("id", ""));
          break;
        }
      }
      // If id is valid find the item inside the menu
      if (!isNaN(id)) {
        const menuItem = menu.find((item) => item.id.includes(id));
        // If the menuItem is found, get the price depending on portion size
        if (menuItem) {
          let price = menuItem.price[0];
          let portion = "";
          if (target.classList.contains("addToBasketSmall")) {
            portion = smallPortionSvg; // Default for small portion
          } else if (target.classList.contains("addToBasketLarge")) {
            price = menuItem.price[1];
          }
          // Checks if item is already in the basket, if not adds the food item to the basket
          const existingItem = basket.find((item) => item.id === id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            basket.push({ id, price, portion, quantity: 1, menuItem });
          }
        }
      }
    }
  }
  updateOrderList();
};

const increaseDecreaseBasket = function (event) {
  const target = event.target; // Gets the target you clicked
  // Checks if you clicked a buton
  if (target.classList.contains("basketQuantity")) {
    const id = parseInt(target.getAttribute("id")); // Converts the id to number
    if (!isNaN(id)) {
      // checks if id is a valid number
      const item = basket.find((item) => item.id === id); // Gets the menuitem with matching id
      if (item) {
        if (target.classList.contains("increaseQuantity")) {
          item.quantity += 1; // If increase button clicked, up quantity
          updateOrderList();
        } else if (target.classList.contains("decreaseQuantity")) {
          if (item.quantity > 1) {
            item.quantity -= 1; // If decrease button clicked and quantity is greater than 1, lower quantity
          } else {
            // If quantity is 1 or less, remove the item from the basket
            const index = basket.findIndex((item) => item.id === id);
            basket.splice(index, 1);
          }
        }
        updateOrderList();
      }
    }
  }
};

function updateOrderList() {
  localStorage.setItem("basket", JSON.stringify(basket)); // Save basket so page can be reloaded
  orderList.innerHTML = "";
  const lang = language ? "seName" : "enName"; // access translated names
  // Create HTML for each item added to the basket
  basket
    .filter((item) => item.quantity > 0) // Quantity must be greater than 0
    .forEach((item, i) => {
      const name = item.menuItem[lang];
      const html = `<li class="basketItem item${i}"><button class="basketQuantity increaseQuantity" id="${item.id
        }"><svg
      class="basketQuantitySvg increaseQuantitySvg"
      
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </svg></button> ${item.quantity
        } <button class="basketQuantity decreaseQuantity" id="${item.id}"><svg
      class="basketQuantitySvg decreaseQuantitySvg"
      
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg></button> <span class="foodName">${name}</span> <span class="foodPrice">${item.price * item.quantity
        }</span> kr <span class="foodPortion">${item.portion}</span></li>`;
      orderList.insertAdjacentHTML("beforeend", html);
    });
  updateOrderSummary();
}

function updateOrderSummary() {
  orderSummary.innerHTML = "";
  let sum = language ? "Summa" : "Sum";
  // Calculae total by refucing basket to single value (price * quantity)
  const total = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ); //Starts at 0 and accumulates the price
  const html = `${sum}: ${total} kr`;
  orderSummary.insertAdjacentHTML("beforeend", html);
}

if (localStorage.getItem("selectedLanguage") === "en") {
  language = false;
} else language = true;

if (localStorage.getItem("basket")) {
  basket = JSON.parse(localStorage.getItem("basket"));
  updateOrderList();
}

// If filter and language isn't open, show orderContainer
function toggleContainers() {
  const languageVisible = $("#mainLanguage").hasClass("show");
  const filterVisible = $("#filterContainer").hasClass("show");

  if (!languageVisible && !filterVisible) {
    $("#orderContainer").removeClass("hide");
  } else {
    $("#orderContainer").addClass("hide");
  }
}

// jQuery code
$(document).ready(function () {
  // Automatic year updating in the variable currentYear
  var currentYear = new Date().getFullYear();
  $("#currentYear").text(currentYear);

  // Toggle Language
  $("#languageButton").click(function () {
    $("#mainLanguage").toggleClass("show");

    $("#filterContainer").removeClass("show");

    toggleContainers();
  });

  // Toggle Filters
  $("#mainFilters").click(function () {
    $("#mainLanguage").removeClass("show");

    $("#filterContainer").toggleClass("show");

    toggleContainers();
  });

  // Makes order visible
  $("#orderTitle").click(function () {
    $("#mainLanguage").removeClass("show");

    $("#filterContainer").removeClass("show");

    $("#orderContainer").removeClass("hide");

    toggleContainers();
  });

  // Ability to press the div on languages
  $(".languageBox").click(function () {
    $(this).find('input[type="radio"]').prop('checked', true);
  });

  // Ability to press the div on filterSelectors
  $('.filterSelect').on('click', function () {
    var target = $(this).data('target');
    var checkbox = $('#' + target);
    checkbox.prop('checked', !checkbox.prop('checked'));
  });
});
// jQuery code

// Event listeners - calls filterFoods to update the list of foods -------------------------------------------
checkGlutenFree.addEventListener("change", filterFoods);
checkLactoseFree.addEventListener("change", filterFoods);
checkVegetarian.addEventListener("change", filterFoods);
checkBeef.addEventListener("change", filterFoods);
checkPork.addEventListener("change", filterFoods);
checkChicken.addEventListener("change", filterFoods);
checkFish.addEventListener("change", filterFoods);

// Adding items to the basket
foodDiv.addEventListener("click", addToBasket);
// Increasing or decreasing basket quantity
orderList.addEventListener("click", increaseDecreaseBasket);

languageSelect.forEach((change) =>
  change.addEventListener("change", function () {
    language = !language; // Switch from default Swedish to English
    filterFoods();
    updateOrderList();
  })
);

// Changes the value of sorting and calls the filter to update the list of foods
priceSort.addEventListener("change", function () {
  selectedSort = priceSort.value;
  console.log(selectedSort);
  filterFoods();
});
