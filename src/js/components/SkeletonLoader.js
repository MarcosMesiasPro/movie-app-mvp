// src/js/components/SkeletonLoader.js

/**
 * Crea un skeleton loader para una movie card
 * @returns {string} HTML del skeleton
 */
export function createMovieCardSkeleton() {
  return `
    <div class="skeleton-card bg-gray-900 rounded-lg overflow-hidden shadow-lg animate-pulse">
      <!-- Poster Skeleton -->
      <div class="relative aspect-[2/3] bg-gray-800"></div>
      
      <!-- Info Skeleton -->
      <div class="p-4 space-y-3">
        <!-- Title -->
        <div class="h-6 bg-gray-800 rounded w-3/4"></div>
        <!-- Year -->
        <div class="h-4 bg-gray-800 rounded w-1/4"></div>
        <!-- Description -->
        <div class="space-y-2 hidden md:block">
          <div class="h-3 bg-gray-800 rounded"></div>
          <div class="h-3 bg-gray-800 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza múltiples skeleton loaders
 * @param {number} count - Número de skeletons
 * @param {HTMLElement} container - Contenedor
 */
export function showSkeletonLoaders(count = 20, container) {
  if (!container) return;
  
  const skeletons = Array(count)
    .fill(null)
    .map(() => createMovieCardSkeleton())
    .join('');
  
  container.innerHTML = skeletons;
}