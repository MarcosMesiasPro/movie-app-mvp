// src/js/utils/helpers.js

/**
 * Muestra el estado de loading
 */
export function showLoading() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const grid = document.getElementById('moviesGrid');
  
  if (loading) loading.classList.remove('hidden');
  if (error) error.classList.add('hidden');
  if (grid) grid.innerHTML = '';
}

/**
 * Oculta el estado de loading
 */
export function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.add('hidden');
}

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje de error personalizado
 */
export function showError(message = 'Error al cargar las películas') {
  const error = document.getElementById('error');
  const loading = document.getElementById('loading');
  
  if (error) {
    error.classList.remove('hidden');
    error.innerHTML = `
      <p class="text-red-500 text-xl mb-4">❌ ${message}</p>
      <button onclick="location.reload()" class="btn-primary">
        🔄 Reintentar
      </button>
    `;
  }
  if (loading) loading.classList.add('hidden');
}

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export function debounce(func, wait = 500) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}