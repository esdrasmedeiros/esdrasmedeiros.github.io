/* Progressive enhancement: publications, navigation and a small surface viewer. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (menu && nav) {
    const closeMenu = () => {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        menu.focus();
      }
    });
  }

  const publications = [...document.querySelectorAll('.publication')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const more = document.querySelector('.publication-more');
  const count = document.querySelector('.result-count');
  if (publications.length && more && count) {
    let topic = 'all';
    let expanded = false;
    function updatePublications() {
      const matches = publications.filter(p => topic === 'all' || p.dataset.topic.split(' ').includes(topic));
      const visible = topic === 'all' && !expanded ? matches.filter(p => p.classList.contains('featured')) : matches;
      publications.forEach(p => { p.hidden = !visible.includes(p); });
      count.textContent = `${visible.length} of ${matches.length} publications`;
      more.hidden = topic !== 'all' || matches.length <= 4;
      more.setAttribute('aria-expanded', String(expanded));
      more.textContent = expanded ? 'Show selected publications −' : `Show all ${matches.length} publications +`;
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === topic)));
    }
    filters.forEach(button => button.addEventListener('click', () => {
      topic = button.dataset.filter;
      updatePublications();
    }));
    more.addEventListener('click', () => {
      expanded = !expanded;
      updatePublications();
      if (!expanded) document.querySelector('.publication-toolbar').scrollIntoView({ block: 'start' });
    });
    document.querySelector('.publication-toolbar').hidden = false;
    updatePublications();
  }

  const canvas = document.querySelector('#surface');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const uSteps = 48;
  const vSteps = 18;
  const vertices = [];
  const triangles = [];
  for (let i = 0; i < uSteps; i++) {
    const u = i / uSteps * Math.PI * 2;
    for (let j = 0; j < vSteps; j++) {
      const v = j / vSteps * Math.PI * 2;
      const r = 0.70 * (1 + 0.14 * Math.cos(3 * u));
      vertices.push([(1.63 + r * Math.cos(v)) * Math.cos(u), (1.63 + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v) + 0.22 * Math.sin(3 * u)]);
      const a = i * vSteps + j;
      const b = ((i + 1) % uSteps) * vSteps + j;
      const c = ((i + 1) % uSteps) * vSteps + (j + 1) % vSteps;
      const d = i * vSteps + (j + 1) % vSteps;
      triangles.push([a, b, c], [a, c, d]);
    }
  }
  let tilt = 0.92;
  let rotation = -0.35;
  let mode = 'mesh';
  function draw() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const scale = Math.min(width / 560, height / 490);
    ctx.setTransform(ratio * scale, 0, 0, ratio * scale, width * ratio / 2, height * ratio / 2);
    const points = vertices.map(([x, y, z]) => {
      const yy = y * Math.cos(tilt) - z * Math.sin(tilt);
      const zz = y * Math.sin(tilt) + z * Math.cos(tilt);
      return [(x * Math.cos(rotation) + yy * Math.sin(rotation)) * 102, (-x * Math.sin(rotation) + yy * Math.cos(rotation)) * 102, zz];
    });
    if (mode === 'points') {
      [...points].sort((a, b) => a[2] - b[2]).forEach(([x, y, z]) => {
        ctx.fillStyle = `rgba(39,73,46,${0.25 + (z + 2.5) / 7})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.15 + (z + 2.5) / 8, 0, Math.PI * 2);
        ctx.fill();
      });
      return;
    }
    const faces = triangles.map(ids => ({ ids, z: ids.reduce((sum, id) => sum + points[id][2], 0) / 3 }));
    faces.sort((a, b) => a.z - b.z);
    ctx.lineWidth = 0.55;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#385a43';
    faces.forEach(({ ids, z }) => {
      const light = Math.max(0, Math.min(1, (z + 2.4) / 4.8));
      const rgb = [218, 226, 204].map((c, i) => Math.round(c + ([101, 138, 100][i] - c) * light));
      ctx.fillStyle = `rgb(${rgb.join(',')})`;
      ctx.beginPath();
      ids.forEach((id, index) => {
        const [x, y] = points[id];
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }
  canvas.hidden = false;
  draw();
  // Keep the static illustration's text alternative when showing the canvas.
  document.querySelector('#surface-fallback').style.opacity = '0';
  document.querySelector('.geometry-controls').hidden = false;
  document.querySelectorAll('[data-surface-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.surfaceMode;
    document.querySelectorAll('[data-surface-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    draw();
  }));
  document.querySelector('#rotate-surface').addEventListener('click', () => {
    rotation += Math.PI / 6;
    draw();
  });
  let pointer = null;
  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    rotation += (event.clientX - pointer.x) * 0.008;
    tilt += (event.clientY - pointer.y) * 0.008;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    draw();
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(event, () => { pointer = null; });
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(canvas.parentElement);
  else window.addEventListener('resize', draw);
})();
