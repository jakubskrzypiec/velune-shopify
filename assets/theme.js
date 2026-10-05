(() => {
  function init(root = document) {
    root.querySelectorAll('[data-product-section]').forEach(section => {
      if (section.dataset.initialized) return;
      section.dataset.initialized = 'true';
      const active = section.querySelector('.gallery-active');
      section.querySelectorAll('.gallery-thumb').forEach(button => button.addEventListener('click', () => {
        active.src = button.dataset.image;
        active.removeAttribute('srcset');
        active.alt = button.dataset.alt || '';
        active.style.objectFit = button.dataset.fit || 'cover';
        const caption = section.querySelector('[data-gallery-caption]');
        if (caption) caption.textContent = button.dataset.label || active.alt;
        section.querySelectorAll('.gallery-thumb').forEach(item => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
      }));
    });
    root.querySelectorAll('.menu-toggle').forEach(button => {
      if (button.dataset.initialized) return;
      button.dataset.initialized = 'true';
      const menu = document.getElementById(button.getAttribute('aria-controls'));
      const close = () => { menu.hidden = true; button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label', 'Otwórz menu'); };
      button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') !== 'true'; menu.hidden = !open; button.setAttribute('aria-expanded', String(open)); button.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu'); });
      menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { close(); button.focus(); } });
      window.matchMedia('(min-width: 900px)').addEventListener('change', close);
    });
  }
  init();
  document.addEventListener('shopify:section:load', e => init(e.target));
})();