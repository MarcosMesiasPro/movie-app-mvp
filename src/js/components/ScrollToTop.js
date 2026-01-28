// src/js/components/ScrollToTop.js

/**
 * Crea el botón de scroll to top
 * @returns {string} HTML del botón
 */
export function createScrollToTopButton() {
  return `
    <button 
      id="scrollToTop"
      class="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-2xl opacity-0 pointer-events-none transition-all duration-300 z-40 group hover:scale-110"
      aria-label="Volver arriba"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6 transform group-hover:-translate-y-1 transition-transform" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  `;
}

/**
 * Configura la funcionalidad del botón scroll to top
 */
export function setupScrollToTop() {
  const button = document.getElementById('scrollToTop');
  if (!button) return;

  // Mostrar/ocultar botón según scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      button.classList.remove('opacity-0', 'pointer-events-none');
      button.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      button.classList.add('opacity-0', 'pointer-events-none');
      button.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });

  // Click para scroll suave
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}