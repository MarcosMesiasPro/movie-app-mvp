// src/js/components/MovieCard.js

import { getImageUrl } from '../api/tmdb.js';

/**
 * Crea el HTML de una tarjeta de película
 * @param {Object} movie - Objeto con datos de la película
 * @returns {string} HTML string de la tarjeta
 */
export function createMovieCard(movie) {
  const { id, title, poster_path, vote_average, release_date, overview } = movie;
  
  // Formatear la calificación
  const rating = vote_average.toFixed(1);
  const ratingColor = vote_average >= 7 ? 'text-green-400' : vote_average >= 5 ? 'text-yellow-400' : 'text-red-400';
  
  // Formatear la fecha
  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  
  // Truncar overview
  const truncatedOverview = overview.length > 100 
    ? overview.substring(0, 100) + '...' 
    : overview;

  return `
    <article 
      class="movie-card group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      data-movie-id="${id}"
    >
      <!-- Poster Image -->
      <div class="relative aspect-[2/3] overflow-hidden">
        <img 
          src="${getImageUrl(poster_path)}" 
          alt="${title}"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        
        <!-- Rating Badge -->
        <div class="absolute top-2 right-2 bg-dark/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <span class="text-yellow-400">⭐</span>
          <span class="${ratingColor} font-bold text-sm">${rating}</span>
        </div>
      </div>

      <!-- Info Container -->
      <div class="p-4">
        <h3 class="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          ${title}
        </h3>
        <p class="text-gray-400 text-sm mb-2">${year}</p>
        <p class="text-gray-500 text-sm line-clamp-3 hidden md:block">
          ${truncatedOverview || 'Sin descripción disponible'}
        </p>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <button class="btn-primary w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          Ver Detalles
        </button>
      </div>
    </article>
  `;
}

// ... resto del código permanece igual ...

/**
 * Renderiza un array de películas en el contenedor (reemplaza contenido)
 * @param {Array} movies - Array de objetos de películas
 * @param {HTMLElement} container - Elemento contenedor
 */
export function renderMovies(movies, container) {
  if (!movies || movies.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-20">
        <p class="text-gray-400 text-xl">😔 No se encontraron películas</p>
      </div>
    `;
    return;
  }

  const moviesHTML = movies.map(movie => createMovieCard(movie)).join('');
  container.innerHTML = moviesHTML;
}

/**
 * Agrega películas al contenedor sin borrar las existentes (para infinite scroll)
 * @param {Array} movies - Array de objetos de películas
 * @param {HTMLElement} container - Elemento contenedor
 */
export function appendMovies(movies, container) {
  if (!movies || movies.length === 0) return;

  const moviesHTML = movies.map(movie => createMovieCard(movie)).join('');
  container.insertAdjacentHTML('beforeend', moviesHTML);
}