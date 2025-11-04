/* Tillhandahåller API-anrop till TheMealDB och fungerar som en tjänstemodul.

Funktioner:
searchMeals(query): Söker recept baserat på en textsträng.
fetchMealById(id): Hämtar ett enskilt recept baserat på dess ID.
fetchMealsByCategory(category): Hämtar recept inom en viss kategori.*/

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query) {
  try {
    const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error("Fel vid sökning:", error);
    return [];
  }
}

export async function fetchMealById(id) {
  try {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals?.[0];
  } catch (error) {
    console.error("Fel vid hämtning av måltid med ID:", id, error);
    return null;
  }
}

export async function fetchMealsByCategory(category) {
  try {
    const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error("Fel vid hämtning av kategori:", category, error);
    return [];
  }
}
