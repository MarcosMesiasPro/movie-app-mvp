// src/js/components/LoadMoreButton.js

/**
 * Crea el HTML del loading indicator para infinite scroll
 * @returns {string} HTML string del loader
 */
export function createInfiniteLoader() {
  return `
    <div id="infiniteLoader" class="col-span-full flex justify-center items-center py-8">
      <div class="flex flex-col items-center gap-4">
        <!-- Spinner -->
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
        <p class="text-gray-400">Cargando más películas...</p>
      </div>
    </div>
  `;
}

/**
 * Crea el botón de "Cargar Más" (fallback)
 * @returns {string} HTML string del botón
 */
export function createLoadMoreButton() {
  return `
    <div class="col-span-full flex justify-center py-8">
      <button 
        id="loadMoreBtn"
        class="btn-primary flex items-center gap-2"
      >
        <span>Cargar Más Películas</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  `;
}

/**
 * Crea el mensaje de "No hay más películas"
 * @returns {string} HTML string del mensaje
 */
export function createNoMoreResults() {
  return `
    <div class="col-span-full flex justify-center py-8">
      <p class="text-gray-500 text-lg">📽️ No hay más películas para mostrar</p>
    </div>
  `;
}