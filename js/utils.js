/* Syfte:
Samlar återanvändbara hjälpmetoder för att generera och rendera receptkort.
Funktioner:

renderMealCard(meal): Skapar ett receptkort (HTML).

renderMeals(meals, containerId): Visar en lista av receptkort i angivet DOM-element.

filterMeals(meals, filter): Filtrerar recept utifrån kategori.

getDetailedMealsByCategory(...): Hämtar detaljerade receptdata från en kategori (via API).
*/
/**
 * Skapar ett receptkort från ett meal-objekt
 * @param {Object} meal
 * @returns {HTMLElement}
 */
export function renderMealCard(meal) {
  const card = document.createElement("a");
  card.href = `instruktioner.html?mealId=${meal.idMeal}`;
  card.className = "meal-card";
  card.innerHTML = generateMealCardHTML(meal);
  return card;
}
function generateMealCardHTML(meal) {
  return `
    <figure class="meal-image">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
    </figure>
    <section class="meal-content">
      <h5 class="meal-title">${meal.strMeal}</h5>
      <p class="meal-category">${meal.strArea} • ${meal.strCategory}</p>
    </section>
  `;
}
/**
 * Renderar flera meal-objekt till angivet container-element
 * @param {Array} meals
 * @param {string} containerId
 */
export function renderMeals(meals, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  meals.forEach(meal => container.appendChild(renderMealCard(meal)));
}
/**
 * Filtrerar måltider baserat på kategori
 * @param {Array} meals
 * @param {string} filter
 * @returns {Array}
 */
export function filterMeals(meals, filter) {
  return meals.filter(meal => {
    const cat = meal.strCategory?.toLowerCase();
    switch (filter) {
      case "vegetarian": return cat === "vegetarian";
      case "vegan": return cat === "vegan";
      case "meat": return ["beef", "chicken", "pork", "lamb", "miscellaneous"].includes(cat);
      case "seafood": return cat === "seafood";
      default: return true;
    }
  });
}
/**
 * Returnerar detaljerade måltider från kategori
 * @param {Function} fetchMealsByCategory
 * @param {Function} fetchMealById
 * @param {string} category
 * @param {number} count
 */
export async function getDetailedMealsByCategory(fetchMealsByCategory, fetchMealById, category, count = 4) {
  const baseMeals = await fetchMealsByCategory(category);
  const selected = baseMeals.sort(() => 0.5 - Math.random()).slice(0, count);
  return await Promise.all(selected.map(m => fetchMealById(m.idMeal)));
}
