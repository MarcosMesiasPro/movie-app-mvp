// src/main.js
import './style.css';
import { getPopularMovies, searchMovies, getMovieDetails } from './js/api/tmdb.js';
import { renderMovies, appendMovies } from './js/components/MovieCard.js';
import { 
  createSearchBar, 
  showSearchLoading, 
  hideSearchLoading,
  showResultsCount,
  hideResultsCount 
} from './js/components/SearchBar.js';
import { 
  createInfiniteLoader,
  createNoMoreResults 
} from './js/components/LoadMoreButton.js';
import { 
  createMovieModal, 
  showModal, 
  closeModal, 
  setupModalListeners 
} from './js/components/MovieModal.js';
import { showSkeletonLoaders } from './js/components/SkeletonLoader.js';
import { createScrollToTopButton, setupScrollToTop } from './js/components/ScrollToTop.js';
import { createNoSearchResults } from './js/components/EmptyState.js';
import { showLoading, hideLoading, showError, debounce } from './js/utils/helpers.js';

// Estado global de la aplicación
let currentQuery = '';
let currentPage = 1;
let totalPages = 1;
let isLoading = false;
let isSearching = false;
let observer = null;

/**
 * Carga las películas populares
 * @param {number} page - Número de página
 * @param {boolean} append - Si es true, agrega al final en vez de reemplazar
 */
async function loadPopularMovies(page = 1, append = false) {
  if (isLoading) return;
  
  try {
    isLoading = true;
    const moviesGrid = document.getElementById('moviesGrid');
    
    // Mostrar skeleton loaders solo en primera carga
    if (!append && page === 1) {
      showSkeletonLoaders(20, moviesGrid);
    }
    
    const data = await getPopularMovies(page);
    
    // Actualizar estado
    currentPage = page;
    totalPages = data.total_pages;
    
    // Renderizar películas con animación
    if (append) {
      appendMovies(data.results, moviesGrid);
    } else {
      renderMovies(data.results, moviesGrid);
      // Agregar animación a las nuevas cards
      setTimeout(() => {
        const cards = moviesGrid.querySelectorAll('.movie-card');
        cards.forEach((card, index) => {
          card.style.animation = `slideUp 0.4s ease-out ${index * 0.03}s backwards`;
        });
      }, 100);
    }
    
    hideLoading();
    hideResultsCount();
    
    // Setup infinite scroll observer
    setupInfiniteScroll();
    
    console.log(`✅ Loaded popular movies - Page ${page}/${totalPages}`);
    
  } catch (error) {
    console.error('❌ Error loading popular movies:', error);
    showError('No se pudieron cargar las películas populares.');
  } finally {
    isLoading = false;
  }
}

/**
 * Realiza la búsqueda de películas
 * @param {string} query - Término de búsqueda
 * @param {number} page - Número de página
 * @param {boolean} append - Si es true, agrega al final en vez de reemplazar
 */
async function performSearch(query, page = 1, append = false) {
  // Si el query está vacío, volver a películas populares
  if (!query.trim()) {
    currentQuery = '';
    isSearching = false;
    currentPage = 1;
    await loadPopularMovies(1, false);
    return;
  }

  if (isLoading) return;

  try {
    isLoading = true;
    isSearching = true;
    currentQuery = query;
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (!append) {
      showSearchLoading();
      showSkeletonLoaders(20, moviesGrid);
    }
    
    const data = await searchMovies(query, page);
    
    // Actualizar estado
    currentPage = page;
    totalPages = data.total_pages;
    
    // Si no hay resultados, mostrar empty state
    if (data.results.length === 0 && page === 1) {
      moviesGrid.innerHTML = createNoSearchResults(query);
      
      // Setup action button
      const actionBtn = document.getElementById('emptyStateAction');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          const searchInput = document.getElementById('searchInput');
          if (searchInput) searchInput.value = '';
          currentQuery = '';
          isSearching = false;
          loadPopularMovies(1, false);
        });
      }
    } else {
      // Renderizar películas
      if (append) {
        appendMovies(data.results, moviesGrid);
      } else {
        renderMovies(data.results, moviesGrid);
        // Agregar animación
        setTimeout(() => {
          const cards = moviesGrid.querySelectorAll('.movie-card');
          cards.forEach((card, index) => {
            card.style.animation = `slideUp 0.4s ease-out ${index * 0.03}s backwards`;
          });
        }, 100);
      }
      
      // Setup infinite scroll observer
      setupInfiniteScroll();
    }
    
    hideLoading();
    hideSearchLoading();
    
    if (!append && data.results.length > 0) {
      showResultsCount(data.total_results, query);
    }
    
    console.log(`🔍 Search results for "${query}" - Page ${page}/${totalPages}: ${data.results.length} movies`);
    
  } catch (error) {
    console.error('❌ Error searching movies:', error);
    hideSearchLoading();
    showError('Error al buscar películas. Intenta de nuevo.');
  } finally {
    isLoading = false;
  }
}

/**
 * Carga la siguiente página
 */
async function loadNextPage() {
  if (isLoading || currentPage >= totalPages) return;
  
  const nextPage = currentPage + 1;
  
  console.log(`📄 Loading page ${nextPage}...`);
  
  if (isSearching && currentQuery) {
    await performSearch(currentQuery, nextPage, true);
  } else {
    await loadPopularMovies(nextPage, true);
  }
}

/**
 * Configura el Intersection Observer para infinite scroll
 */
function setupInfiniteScroll() {
  const moviesGrid = document.getElementById('moviesGrid');
  if (!moviesGrid) return;
  
  // Remover loader/mensaje anterior si existe
  const existingLoader = document.getElementById('infiniteLoader');
  const existingMessage = document.getElementById('noMoreResults');
  if (existingLoader) existingLoader.remove();
  if (existingMessage) existingMessage.remove();
  
  // Si ya llegamos al final, mostrar mensaje
  if (currentPage >= totalPages) {
    moviesGrid.insertAdjacentHTML('beforeend', createNoMoreResults());
    if (observer) observer.disconnect();
    return;
  }
  
  // Agregar el loader sentinel
  moviesGrid.insertAdjacentHTML('beforeend', createInfiniteLoader());
  const sentinel = document.getElementById('infiniteLoader');
  
  // Desconectar observer anterior si existe
  if (observer) observer.disconnect();
  
  // Crear nuevo observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading) {
          console.log('🔭 Sentinel visible, loading next page...');
          loadNextPage();
        }
      });
    },
    {
      rootMargin: '200px',
      threshold: 0.1
    }
  );
  
  // Observar el sentinel
  if (sentinel) {
    observer.observe(sentinel);
  }
}

/**
 * Configura los event listeners del search bar
 */
function setupSearchListeners() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');

  if (!searchInput) return;

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    currentPage = 1;
    performSearch(query, 1, false);
  }, 500);

  // Event listener para el input
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const clearBtn = document.getElementById('clearSearch');
    
    if (query) {
      clearBtn?.classList.remove('hidden');
    } else {
      clearBtn?.classList.add('hidden');
    }
    
    debouncedSearch(query);
  });

  // Event listener para el botón de limpiar
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      currentQuery = '';
      isSearching = false;
      currentPage = 1;
      loadPopularMovies(1, false);
    });
  }

  // Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      currentPage = 1;
      performSearch(searchInput.value, 1, false);
    }
  });
}

/**
 * Abre el modal con los detalles de la película
 */
async function openMovieModal(movieId) {
  try {
    console.log(`🎬 Opening modal for movie ID: ${movieId}`);
    
    // Mostrar loading temporal
    const tempModal = document.createElement('div');
    tempModal.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div class="flex flex-col items-center gap-4">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
          <p class="text-white text-lg">Cargando detalles...</p>
        </div>
      </div>
    `;
    document.body.appendChild(tempModal);
    
    // Obtener detalles
    const movieDetails = await getMovieDetails(movieId);
    
    // Remover loading temporal
    tempModal.remove();
    
    // Crear y mostrar modal
    const modalHTML = createMovieModal(movieDetails);
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    showModal();
    setupModalListeners();
    
  } catch (error) {
    console.error('❌ Error opening modal:', error);
    alert('Error al cargar los detalles de la película');
  }
}

/**
 * Configura event delegation para las movie cards
 */
function setupMovieCardListeners() {
  const moviesGrid = document.getElementById('moviesGrid');
  
  if (moviesGrid) {
    moviesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.movie-card');
      
      if (card) {
        const movieId = card.dataset.movieId;
        if (movieId) {
          openMovieModal(movieId);
        }
      }
    });
  }
}

/**
 * Inicializa la aplicación
 */
async function init() {
  try {
    // Renderizar search bar
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
      searchContainer.innerHTML = createSearchBar();
      setupSearchListeners();
    }

    // Agregar scroll to top button
    document.body.insertAdjacentHTML('beforeend', createScrollToTopButton());
    setupScrollToTop();

    // Setup movie card listeners
    setupMovieCardListeners();

    // Cargar películas populares inicialmente
    await loadPopularMovies(1, false);
    
    console.log('✅ App initialized successfully');
    console.log('📊 Infinite scroll enabled');
    console.log('🎭 Modal system ready');
    console.log('🎨 Visual enhancements loaded');
    
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    showError('No se pudo inicializar la aplicación. Verifica tu API Key.');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
document.body.classList.add('loaded');