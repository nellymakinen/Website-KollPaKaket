/* Visar detaljerad information om ett valt recept på instruktioner.html.

Funktioner:
Hämtar receptdata baserat på mealId i URL.
Visar ingredienser, ursprung, kategori, instruktioner och ev. YouTube-video.
Har separata funktioner för att parsning av ingredienser och instruktioner.
*/
import { fetchMealById } from "./api.js";

const container = document.getElementById("meal-details");
const title = document.getElementById("meal-title");
const mealId = new URLSearchParams(window.location.search).get("mealId");

async function loadMeal() {
  if (!mealId) {
    title.textContent = "Inget recept hittades.";
    return;
  }

  try {
    const meal = await fetchMealById(mealId);
    if (!meal) {
      title.textContent = "Receptet kunde inte laddas.";
      return;
    }

    title.textContent = meal.strMeal;
    document.getElementById("current-meal-name").textContent = meal.strMeal;
    container.innerHTML = generateMealHTML(meal);
  } catch (err) {
    title.textContent = "Fel vid hämtning av recept.";
    console.error(err);
  }
}

function generateMealHTML(meal) {
  const ingredients = getIngredients(meal);
  const instructions = getInstructions(meal);

  return `
    <div class="meal-layout">
      <figure class="meal-left">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-hero-image" />
        <figcaption>
          <p><strong>Ursprung:</strong> ${meal.strArea} • <strong>Kategori:</strong> 
          ${meal.strCategory}</p>
        </figcaption>
      </figure>
      <section class="meal-right">
        <h4>Du behöver:</h4>
        <ul>
          ${ingredients.map(i => `<li><span class="icon-bullet">✔ </span>${i}</li>`)
          .join("")}
        </ul>
      </section>
    </div>
    <section class="meal-instructions">
      <h4>Gör så här:</h4>
      <ul>${instructions.map(line => `<li><span class="icon-bullet">✔ </span>${line}</li>`).join("")}</ul>
      ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank">Visa tillagningsvideo ▶</a>` : ""}
    </section>
  `;
}

function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
    }
  }
  return ingredients;
}

function getInstructions(meal) {
  return meal.strInstructions
    .split(/\r?\n/)
    /*.filter(line => line.trim() !== "")*/
    .map(line => line.trim())
    .filter(line => line !== "" && !/^\d+\.\s*$/.test(line));
}

document.addEventListener("DOMContentLoaded", loadMeal);
