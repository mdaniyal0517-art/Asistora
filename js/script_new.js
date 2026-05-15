// Asistora Website - Interactive JavaScript
// Includes:
// - navigateToSection(id) helper for reliable scrolling
// - loading overlay removal (prevents infinite loading)
// - smooth scrolling for same-page hash links

function navigateToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.error('Section not found:', id);
  }
}

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Loading screen (avoid infinite loading):
    const loading = document.querySelector('.loading');
    if (loading) {
      window.addEventListener('load', () => {
        loading.classList.add('hidden');
        setTimeout(() => (loading.style.display = 'none'), 500);
      });
    }

    // Smooth scrolling for same-page hash links.
    const anchors = document.querySelectorAll('a[href*="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href') || '';
        if (!href.includes('#')) return;

        const hash = href.split('#').pop();
        if (!hash) return;

        // Only handle same-page paths here.
        const linkUrl = new URL(href, window.location.href);
        if (linkUrl.pathname !== window.location.pathname) return;

        const target = document.getElementById(hash);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (window.location.hash !== `#${hash}`) window.location.hash = `#${hash}`;
      });
    });
  });
})();

