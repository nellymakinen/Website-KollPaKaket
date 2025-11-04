/* Laddar in recepttips och kategoriblock på recept.html via TheMealDB API.

Funktioner:
loadTips(): Visar förvalda tips.
loadVegMeals(), loadMeatMeals(), loadSeafoodMeals(): Visar 4 slumpmässiga recept inom varje kategori.
Använder utils.js för att rendera kort.
*/
import { fetchMealById, fetchMealsByCategory } from "./api.js";
import { renderMeals, getDetailedMealsByCategory } from "./utils.js";

const categories = {
  tips: [52772, 52874, 52977, 53013],
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  meat: ["Beef", "Chicken", "Pork", "Lamb", "Goat"],
  seafood: "Seafood"
};

async function loadTips() {
  const meals = await Promise.all(categories.tips.map(fetchMealById));
  renderMeals(meals, "tips-container");
}

async function loadVegMeals() {
  const [veg, vegan] = await Promise.all([
    getDetailedMealsByCategory(fetchMealsByCategory, fetchMealById, categories.vegetarian, 2),
    getDetailedMealsByCategory(fetchMealsByCategory, fetchMealById, categories.vegan, 2)
  ]);
  renderMeals([...veg, ...vegan], "veg-container");
}

async function loadMeatMeals() {
  const meals = await fetchMultipleCategories(categories.meat);
  const selected = meals.sort(() => 0.5 - Math.random()).slice(0, 4);
  const detailed = await Promise.all(selected.map(m => fetchMealById(m.idMeal)));
  renderMeals(detailed, "meat-container");
}

async function loadSeafoodMeals() {
  const seafood = await getDetailedMealsByCategory(fetchMealsByCategory, fetchMealById, categories.seafood, 4);
  renderMeals(seafood, "seafood-container");
}

async function fetchMultipleCategories(catList) {
  const all = [];
  for (const type of catList) {
    const meals = await fetchMealsByCategory(type);
    all.push(...meals);
  }
  return all;
}

loadTips();
loadVegMeals();
loadMeatMeals();
loadSeafoodMeals();

