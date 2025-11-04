/* Näringsberäknarens logik – analyserar makro- och mikronutrienter via Nutritionix API.

Funktioner:
Samlar ingredienser + mängder från formulär.
Anropar Nutritionix med naturligt språk (ex: "40 grams oats").
Skapar två tabeller: makronutrienter (kcal, protein, fett...) och mikronutrienter (vitaminer & mineraler).
Ger feedback vid API-fel.
*/
export function init() {
  const appId = '00364535'; 
  const appKey = '1598b5fa1c762e01db1c0a2ad1e83c5e';

  const micronutrientMap = {
    301: 'Kalcium (mg)',
    303: 'Järn (mg)',
    304: 'Magnesium (mg)',
    306: 'Kalium (mg)',
    307: 'Natrium (mg)',
    401: 'Vitamin C (mg)',
    320: 'Vitamin A (µg)',
    323: 'Vitamin E (mg)',
    430: 'Vitamin K (µg)',
    415: 'Vitamin B6 (mg)',
    418: 'Vitamin B12 (µg)',
    417: 'Folat (µg)'
  };

  const form = document.getElementById("calc-form");
  const addRowButton = document.getElementById("add-row");
  const resultContainer = document.getElementById("result");
  let ingredientCount = 1;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const ingredients = Array.from(document.querySelectorAll('input[name="ingredient[]"]')).map(i => i.value.trim());
    const amounts = Array.from(document.querySelectorAll('input[name="amount[]"]')).map(i => parseFloat(i.value));
    resultContainer.innerHTML = "<p>Söker via Nutritionix...</p>";

    const micronutrientTotals = initMicronutrientTotals();
    const queryText = buildQueryText(ingredients, amounts);

    try {
      const foods = await fetchNutritionixData(queryText);
      const macroResult = calculateMacroTotals(foods);
      const microTable = generateMicronutrientTable(foods, micronutrientTotals);

      resultContainer.innerHTML = generateMacroTableHTML(macroResult.rows, macroResult.totals);
      resultContainer.innerHTML += microTable;
    } catch (err) {
      resultContainer.innerHTML = `<p style="color:red">Ett fel uppstod: ${err.message}</p>`;
      console.error(err);
    }
  });

  addRowButton.addEventListener("click", function () {
    ingredientCount++;
    const ul = document.getElementById("ingredient-list");

    const li = document.createElement("li");
    
    const labeli = document.createElement("label");
    labeli.setAttribute("for", `ingredient${ingredientCount}`);
    labeli.textContent = `Ingrediens:`;

    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.name = "ingredient[]";
    inputText.id = `ingredient${ingredientCount}`;
    inputText.placeholder = "Ingrediens";

    const labela = document.createElement("label");
    labela.setAttribute("for", `amount`);
    labela.textContent = `Mängd:`;

    const inputNumber = document.createElement("input");
    inputNumber.type = "number";
    inputNumber.name = "amount[]";
    inputNumber.placeholder = "Mängd (g/ml)";

    li.appendChild(labeli);
    li.appendChild(inputText);
    li.appendChild(labela)
    li.appendChild(inputNumber);
    ul.appendChild(li);
  });

  function initMicronutrientTotals() {
    const totals = {};
    for (const id in micronutrientMap) {
      totals[id] = 0;
    }
    return totals;
  }

  function buildQueryText(ingredients, amounts) {
    return ingredients.map((ingredient, i) => 
      ingredient && !isNaN(amounts[i]) ? `${amounts[i]} grams ${ingredient}` : ""
    ).join(", ");
  }

  async function fetchNutritionixData(queryText) {
    const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": appId,
        "x-app-key": appKey
      },
      body: JSON.stringify({ query: queryText, timezone: "Europe/Stockholm" })
    });

    if (!response.ok) throw new Error("Nutritionix API-fel");
    const data = await response.json();
    return data.foods;
  }

  function calculateMacroTotals(foods) {
    let rows = [];
    let totals = { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0 };

    foods.forEach(food => {
      totals.calories += food.nf_calories ?? 0;
      totals.protein += food.nf_protein ?? 0;
      totals.fat += food.nf_total_fat ?? 0;
      totals.carbs += food.nf_total_carbohydrate ?? 0;
      totals.fiber += food.nf_dietary_fiber ?? 0;
      totals.sugar += food.nf_sugars ?? 0;

      rows.push(`
        <tr>
          <td>${food.food_name}</td>
          <td>${food.serving_weight_grams} g</td>
          <td>${(food.nf_calories ?? 0).toFixed(1)}</td>
          <td>${(food.nf_protein ?? 0).toFixed(1)}</td>
          <td>${(food.nf_total_fat ?? 0).toFixed(1)}</td>
          <td>${(food.nf_total_carbohydrate ?? 0).toFixed(1)}</td>
          <td>${(food.nf_dietary_fiber ?? 0).toFixed(1)}</td>
          <td>${(food.nf_sugars ?? 0).toFixed(1)}</td>
        </tr>
      `);
    });

    return { rows, totals };
  }

  function generateMacroTableHTML(rows, totals) {
    const totalRow = `
      <tr style="font-weight:bold">
        <td>Totalt</td>
        <td>-</td>
        <td>${totals.calories.toFixed(1)}</td>
        <td>${totals.protein.toFixed(1)}</td>
        <td>${totals.fat.toFixed(1)}</td>
        <td>${totals.carbs.toFixed(1)}</td>
        <td>${totals.fiber.toFixed(1)}</td>
        <td>${totals.sugar.toFixed(1)}</td>
      </tr>
    `;
    return `
      <h3>Makronutrienter</h3>
      <table class="styled-table makro">
        <thead>
          <tr>
            <th>Ingrediens</th>
            <th>Mängd</th>
            <th>kcal</th>
            <th>Protein (g)</th>
            <th>Fett (g)</th>
            <th>Kolhydrater (g)</th>
            <th>Fiber (g)</th>
            <th>Socker (g)</th>
          </tr>
        </thead>
        <tbody id="resultat">
          ${rows.join("")}
          ${totalRow}
        </tbody>
      </table>
    `;
  }

  function generateMicronutrientTable(foods, totals) {
    foods.forEach(food => {
      if (food.full_nutrients) {
        food.full_nutrients.forEach(nutrient => {
          if (micronutrientMap[nutrient.attr_id]) {
            totals[nutrient.attr_id] += nutrient.value || 0;
          }
        });
      }
    });

    let table = `
      <h3>Mikronutrienter (totalt)</h3>
      <table class="styled-table mikro">
        <thead>
          <tr>
            <th>Ämne</th>
            <th>Mängd</th>
          </tr>
        </thead>
        <tbody id="resultat">
    `;

    for (const id in micronutrientMap) {
      const label = micronutrientMap[id];
      const value = totals[id];
      if (value > 0) {
        table += `
          <tr>
            <td>${label}</td>
            <td>${value.toFixed(1)}</td>
          </tr>
        `;
      }
    }

    table += `</tbody></table>`;
    return table;
  }
}


