document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".main-nav");

  toggle.addEventListener("click", () => {
    nav.classList.toggle("show-links");
    const expanded = nav.classList.contains("show-links");
    toggle.setAttribute("aria-expanded", expanded);
  });
});
