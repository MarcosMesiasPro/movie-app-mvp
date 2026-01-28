// src/main.js
import './style.css';
import { getPopularMovies, searchMovies } from './js/api/tmdb.js';
import { renderMovies } from './js/components/MovieCard.js';
import { showLoading, hideLoading, showError, debounce } from './js/utils/helpers.js';

/**
 * Inicializa la aplicación
 */
async function init() {
  try {
    showLoading();
    
    // Cargar películas populares
    const data = await getPopularMovies();
    const moviesGrid = document.getElementById('moviesGrid');
    
    renderMovies(data.results, moviesGrid);
    hideLoading();
    
    console.log('✅ App initialized successfully');
    console.log(`📊 Loaded ${data.results.length} movies`);
    
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    showError('No se pudieron cargar las películas. Verifica tu API Key.');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);