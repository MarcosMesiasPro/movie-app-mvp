// src/js/components/EmptyState.js

/**
 * Crea un empty state personalizado
 * @param {Object} options - Opciones de configuración
 * @returns {string} HTML del empty state
 */
export function createEmptyState({ 
  icon = '🎬',
  title = 'No hay resultados',
  message = 'Intenta con otra búsqueda',
  showAction = false,
  actionText = 'Volver al inicio',
  actionCallback = null
}) {
  return `
    <div class="empty-state col-span-full">
      <div class="empty-state-icon animate-float">
        ${icon}
      </div>
      <h3 class="text-2xl font-bold text-gray-300 mb-2">
        ${title}
      </h3>
      <p class="text-gray-500 text-lg mb-6">
        ${message}
      </p>
      ${showAction ? `
        <button 
          id="emptyStateAction"
          class="btn-primary"
        >
          ${actionText}
        </button>
      ` : ''}
    </div>
  `;
}

/**
 * Empty state para búsqueda sin resultados
 */
export function createNoSearchResults(query) {
  return createEmptyState({
    icon: '🔍',
    title: 'Sin resultados',
    message: `No encontramos películas para "${query}"`,
    showAction: true,
    actionText: 'Ver películas populares'
  });
}

/**
 * Empty state para error de red
 */
export function createNetworkError() {
  return createEmptyState({
    icon: '📡',
    title: 'Error de conexión',
    message: 'No pudimos conectar con el servidor',
    showAction: true,
    actionText: 'Reintentar'
  });
}