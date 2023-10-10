const foodDiv = document.querySelector("#mainFood");

// Filter methods
function filterVegetarian(dishes) {
  return dishes.filter((dish) => dish.isVegetarian);
}

function filterGlutenFree(dishes) {
  return dishes.filter((dish) => dish.isGlutenFree);
}

function filterLactoseFree(dishes) {
  return dishes.filter((dish) => dish.isLactoseFree);
}

function filterBeef(dishes) {
  return dishes.filter((dish) => dish.typeOfMeat == "Beef");
}

function filterChicken(dishes) {
  return dishes.filter((dish) => dish.typeOfMeat == "Chicken");
}

function filterFish(dishes) {
  return dishes.filter((dish) => dish.typeOfMeat == "Fish");
}

function filterPork(dishes) {
  return dishes.filter((dish) => dish.typeOfMeat == "Pork");
}

// This displays the foods by inserting HTML to the index.html
const displayFoods = function (foods) {
  foods.forEach((food, i) => {
    const html = `<div>Test ${food.name}</div>`;

    foodDiv.insertAdjacentHTML("afterbegin", html);
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
  const menuData = await fetchMenuData();

  // Example filtering
  const vegetarianDishes = filterVegetarian(menuData);
  const glutenFreeDishes = filterGlutenFree(menuData);
  const lactoseFreeDishes = filterLactoseFree(menuData);
  const beefDishes = filterBeef(menuData);
  const chickenDishes = filterChicken(menuData);
  const fishDishes = filterFish(menuData);
  const porkDishes = filterPork(menuData);

  // console.log("Vegetarian Dishes:", vegetarianDishes);
  // console.log("Gluten-Free Dishes:", glutenFreeDishes);
  // console.log("Lactose-Free Dishes:", lactoseFreeDishes);
  // console.log("Beef Dishes:", beefDishes);
  // console.log("Chicken Dishes:", chickenDishes);
  // console.log("Fish Dishes:", fishDishes);
  // console.log("Pork Dishes:", porkDishes);
  displayFoods(menuData);
}

// Call the getMenu function to fetch and work with menu data
getMenu();
