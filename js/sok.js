/* Hanterar sökfunktionen och filtrering på sidan recept.html.

Funktioner:
Läser in användarens sökord.
Filtrerar resultatet utifrån kategori (vegan, kött etc.).
Visar max 8 receptkort i ett rutnät.
Inkluderar stöd för tillgänglighet och responsivitet (kategori-knappar).
*/
import { searchMeals } from "./api.js";
import { filterMeals, renderMeals } from "./utils.js";

const searchForm = document.getElementById("recipe-search");
const searchInput = document.getElementById("search-input");
const tipsContainer = document.getElementById("search-container");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const searchTitle = document.getElementById("search-title");

let currentFilter = "all";

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    updateActiveFilter(button);
    searchForm.dispatchEvent(new Event("submit"));
  });
});

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) handleSearch(query);
});

function updateActiveFilter(button) {
  filterButtons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  currentFilter = button.dataset.filter;
}

async function handleSearch(query) {
  showLoadingMessage();
  const meals = await searchMeals(query);
  const filtered = filterMeals(meals, currentFilter);

  if (filtered.length === 0) {
    showNoResults(query);
  } else {
    renderMeals(filtered.slice(0, 8), "search-container");
    searchTitle.style.display = "block";
  }
}

function showLoadingMessage() {
  tipsContainer.innerHTML = "<p>Söker via The Meal DB...</p>";
}

function showNoResults(query) {
  tipsContainer.innerHTML = `<p>Inga resultat i kategorin "${currentFilter}" för "${query}".</p>`;
}
