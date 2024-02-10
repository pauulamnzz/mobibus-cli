document.addEventListener('DOMContentLoaded', function () {
    // Obtén el botón de hamburguesa y el menú de navegación
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('.navbar-menu');

  
    // Agrega un eveneto de clic al botón de hamburguesa
    burger.addEventListener('click', function () {
      // Alternar la clase 'is-active' en ambos elementos
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    });
  });