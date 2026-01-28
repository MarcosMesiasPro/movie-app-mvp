// src/js/api/tmdb.js

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMG_BASE_URL = import.meta.env.VITE_TMDB_IMG_BASE;

/**
 * Configuración base para fetch requests
 */
const fetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json'
  }
};

/**
 * Obtiene películas populares
 * @param {number} page - Número de página (default: 1)
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function getPopularMovies(page = 1) {
  try {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

/**
 * Busca películas por término
 * @param {string} query - Término de búsqueda
 * @param {number} page - Número de página
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function searchMovies(query, page = 1) {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

/**
 * Construye la URL completa de una imagen
 * @param {string} path - Path de la imagen
 * @param {string} size - Tamaño (w500, w780, original)
 * @returns {string} URL completa
 */
export function getImageUrl(path, size = 'w500') {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMG_BASE_URL.replace('w500', size)}${path}`;
}

// src/js/api/tmdb.js
// ... código existente ...

/**
 * Obtiene los detalles completos de una película
 * @param {number} movieId - ID de la película
 * @returns {Promise<Object>} Detalles de la película
 */
export async function getMovieDetails(movieId) {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos`;
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Obtiene el trailer de YouTube de una película
 * @param {Array} videos - Array de videos de la API
 * @returns {string|null} ID del video de YouTube o null
 */
export function getYouTubeTrailer(videos) {
  if (!videos || !videos.results) return null;
  
  // Buscar trailer oficial en YouTube
  const trailer = videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? trailer.key : null;
}