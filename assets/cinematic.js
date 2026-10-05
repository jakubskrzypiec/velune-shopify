(() => {
  function init(root = document) {
    root.querySelectorAll('[data-living-scene]').forEach(scene => {
      if (scene.dataset.ready) return;
      scene.dataset.ready = 'true';
      const photo = scene.querySelector('.scene-photo');
      const positionPoints = () => {
        if (!photo.naturalWidth) return;
        const w = scene.clientWidth, h = scene.clientHeight;
        const scale = Math.max(w / photo.naturalWidth, h / photo.naturalHeight);
        const positions = getComputedStyle(photo).objectPosition.split(' ');
        const px = parseFloat(positions[0]) / 100, py = parseFloat(positions[1] || '50%') / 100;
        scene.querySelectorAll('[data-scene-point]').forEach(point => {
          const x = Number(point.dataset.x) / 100 * photo.naturalWidth * scale + (w - photo.naturalWidth * scale) * px;
          const y = Number(point.dataset.y) / 100 * photo.naturalHeight * scale + (h - photo.naturalHeight * scale) * py;
          point.style.left = x + 'px'; point.style.top = y + 'px';
          point.style.setProperty('--point-scale', Math.max(.45, Math.min(1.25, scale)));
        });
      };
      photo.addEventListener('load', positionPoints);
      positionPoints();
      new ResizeObserver(positionPoints).observe(scene);
    });
    root.querySelectorAll('[data-bundle-picker]').forEach(picker => {
      if (picker.dataset.ready) return;
      picker.dataset.ready = 'true';
      picker.addEventListener('change', event => {
        if (event.target.matches('input[type=radio]')) picker.querySelector('[data-bundle-total]').textContent = event.target.dataset.total;
      });
    });
    root.querySelectorAll('[data-motion-toggle]').forEach(button => {
      if (button.dataset.ready) return;
      button.dataset.ready = 'true';
      button.addEventListener('click', () => {
        const paused = document.documentElement.classList.toggle('motion-paused');
        document.querySelectorAll('[data-motion-toggle]').forEach(item => {
          item.setAttribute('aria-pressed', String(paused));
          item.textContent = paused ? 'Wznów animacje' : 'Zatrzymaj animacje';
        });
      });
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('scene-outside', !entry.isIntersecting)));
      root.querySelectorAll('.living-scene,.autumn-interlude').forEach(scene => observer.observe(scene));
    }
  }
  init();
  document.addEventListener('shopify:section:load', event => init(event.target));
})();
