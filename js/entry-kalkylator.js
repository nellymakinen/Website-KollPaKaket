/* Startpunkt (entry point) för kalkylator.js, kopplad till berakna.html.

Funktion:
Kallar på init() när DOM laddats.
*/
import { init } from "./kalkylator.js";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

