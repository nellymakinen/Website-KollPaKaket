/* Visar sidadatum för senaste uppdatering i sidfoten.

Funktion:
Hämtar document.lastModified och konverterar till svensk datumformat (ex: 4 juni 2025).
*/
document.addEventListener("DOMContentLoaded", () => {
  const footerUpdateElem = document.querySelector(".footer-update p");
  if (!footerUpdateElem) return;

  const lastModified = new Date(document.lastModified);
  footerUpdateElem.textContent = `Sidan uppdaterades: ${formatDate(lastModified)}`;
});

function formatDate(date) {
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

