// src/js/components/MovieModal.js

import { getImageUrl, getYouTubeTrailer } from '../api/tmdb.js';

/**
 * Crea el HTML del modal con los detalles de la película
 * @param {Object} movie - Objeto con detalles completos de la película
 * @returns {string} HTML string del modal
 */
export function createMovieModal(movie) {
  const {
    title,
    backdrop_path,
    poster_path,
    overview,
    vote_average,
    vote_count,
    release_date,
    runtime,
    genres,
    credits,
    videos,
    tagline,
    status,
    budget,
    revenue
  } = movie;

  // Formatear datos
  const rating = vote_average.toFixed(1);
  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const ratingColor = vote_average >= 7 ? 'text-green-400' : vote_average >= 5 ? 'text-yellow-400' : 'text-red-400';
  const genresList = genres?.map(g => g.name).join(', ') || 'N/A';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const durationText = runtime ? `${hours}h ${minutes}m` : 'N/A';
  
  // Top 5 actores
  const cast = credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A';
  
  // Director
  const director = credits?.crew?.find(person => person.job === 'Director')?.name || 'N/A';
  
  // Trailer
  const trailerKey = getYouTubeTrailer(videos);
  const trailerSection = trailerKey ? `
    <div class="mt-6">
      <h3 class="text-xl font-bold mb-3">🎬 Trailer</h3>
      <div class="aspect-video rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/${trailerKey}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      </div>
    </div>
  ` : '';

  // Formatear presupuesto y recaudación
  const formatMoney = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return `
    <div id="movieModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <!-- Backdrop -->
      <div 
        id="modalBackdrop" 
        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      ></div>

      <!-- Modal Content -->
      <div class="relative bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <!-- Close Button -->
        <button 
          id="closeModal"
          class="absolute top-4 right-4 z-10 bg-gray-800/90 hover:bg-gray-700 text-white rounded-full p-2 transition-colors"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Backdrop Image -->
        <div class="relative h-64 md:h-96 overflow-hidden rounded-t-2xl">
          <img 
            src="${getImageUrl(backdrop_path || poster_path, 'w780')}" 
            alt="${title}"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          
          <!-- Title Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-2">${title}</h2>
            ${tagline ? `<p class="text-gray-300 italic text-lg">"${tagline}"</p>` : ''}
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <!-- Stats Row -->
          <div class="flex flex-wrap gap-4 mb-6">
            <!-- Rating -->
            <div class="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
              <span class="text-yellow-400 text-xl">⭐</span>
              <span class="${ratingColor} font-bold text-lg">${rating}</span>
              <span class="text-gray-400 text-sm">/ 10</span>
              <span class="text-gray-500 text-xs ml-1">(${vote_count.toLocaleString()} votos)</span>
            </div>

            <!-- Year -->
            <div class="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
              <span class="text-primary">📅</span>
              <span class="text-white font-semibold">${year}</span>
            </div>

            <!-- Duration -->
            <div class="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
              <span class="text-primary">⏱️</span>
              <span class="text-white font-semibold">${durationText}</span>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
              <span class="text-white font-semibold">${status}</span>
            </div>
          </div>

          <!-- Genres -->
          <div class="mb-6">
            <h3 class="text-lg font-bold mb-2 text-gray-400">Géneros</h3>
            <div class="flex flex-wrap gap-2">
              ${genres?.map(genre => `
                <span class="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  ${genre.name}
                </span>
              `).join('') || '<span class="text-gray-500">N/A</span>'}
            </div>
          </div>

          <!-- Overview -->
          <div class="mb-6">
            <h3 class="text-xl font-bold mb-3">📖 Sinopsis</h3>
            <p class="text-gray-300 leading-relaxed">
              ${overview || 'No hay sinopsis disponible.'}
            </p>
          </div>

          <!-- Credits -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-lg font-bold mb-2 text-gray-400">🎬 Director</h3>
              <p class="text-white">${director}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold mb-2 text-gray-400">🎭 Reparto Principal</h3>
              <p class="text-white">${cast}</p>
            </div>
          </div>

          <!-- Budget & Revenue -->
          ${budget || revenue ? `
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              ${budget ? `
                <div>
                  <h3 class="text-lg font-bold mb-2 text-gray-400">💰 Presupuesto</h3>
                  <p class="text-white text-xl font-semibold">${formatMoney(budget)}</p>
                </div>
              ` : ''}
              ${revenue ? `
                <div>
                  <h3 class="text-lg font-bold mb-2 text-gray-400">💵 Recaudación</h3>
                  <p class="text-green-400 text-xl font-semibold">${formatMoney(revenue)}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Trailer -->
          ${trailerSection}
        </div>
      </div>
    </div>
  `;
}

/**
 * Muestra el modal y bloquea el scroll del body
 */
export function showModal() {
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal y restaura el scroll del body
 */
export function closeModal() {
  const modal = document.getElementById('movieModal');
  if (modal) {
    // Animación de salida
    modal.classList.add('animate-fadeOut');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = 'auto';
    }, 200);
  }
}

/**
 * Configura los event listeners del modal
 */
export function setupModalListeners() {
  const closeBtn = document.getElementById('closeModal');
  const backdrop = document.getElementById('modalBackdrop');
  
  // Cerrar con botón X
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Cerrar al hacer click en el backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }
  
  // Cerrar con tecla ESC
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}