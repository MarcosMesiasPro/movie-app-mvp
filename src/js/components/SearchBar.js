// src/js/components/SearchBar.js

/**
 * Crea el HTML de la barra de búsqueda
 * @returns {string} HTML string del search bar
 */
export function createSearchBar() {
  return `
    <div class="relative w-full md:w-96">
      <!-- Search Input -->
      <div class="relative">
        <input 
          type="text" 
          id="searchInput"
          placeholder="Buscar películas..."
          class="w-full bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
        />
        
        <!-- Search Icon -->
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Clear Button (hidden by default) -->
        <button 
          id="clearSearch"
          class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Loading Spinner (hidden by default) -->
        <div id="searchLoading" class="hidden absolute right-3 top-1/2 -translate-y-1/2">
          <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-primary"></div>
        </div>
      </div>

      <!-- Search Results Count -->
      <p id="searchResultsCount" class="hidden text-sm text-gray-400 mt-2"></p>
    </div>
  `;
}

/**
 * Muestra el loading spinner del search
 */
export function showSearchLoading() {
  const loading = document.getElementById('searchLoading');
  const clearBtn = document.getElementById('clearSearch');
  
  if (loading) loading.classList.remove('hidden');
  if (clearBtn) clearBtn.classList.add('hidden');
}

/**
 * Oculta el loading spinner del search
 */
export function hideSearchLoading() {
  const loading = document.getElementById('searchLoading');
  const clearBtn = document.getElementById('clearSearch');
  const input = document.getElementById('searchInput');
  
  if (loading) loading.classList.add('hidden');
  if (clearBtn && input?.value) clearBtn.classList.remove('hidden');
}

/**
 * Muestra el contador de resultados
 * @param {number} count - Número de resultados
 * @param {string} query - Término buscado
 */
export function showResultsCount(count, query) {
  const counter = document.getElementById('searchResultsCount');
  if (counter) {
    counter.classList.remove('hidden');
    counter.textContent = `${count} resultado${count !== 1 ? 's' : ''} para "${query}"`;
  }
}

/**
 * Oculta el contador de resultados
 */
export function hideResultsCount() {
  const counter = document.getElementById('searchResultsCount');
  if (counter) counter.classList.add('hidden');
}