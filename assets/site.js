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
  const meshCanvas = document.createElement('canvas');
  const meshContext = meshCanvas.getContext('2d');
  if (!meshContext) return;
  // Original B* mesh from assets/models/bitoro4.ply; see the paper appendix.
  const vertices = [
    [-2.5, 1.5, 1.0],
    [-2.5, -1.5, 1.0],
    [2.5, -1.5, 1.0],
    [2.5, 1.5, 1.0],
    [-1.6, -0.5, 0.1],
    [-0.5, -0.5, 3.1],
    [-0.5, 0.5, 3.1],
    [-1.6, 0.5, 0.1],
    [0.5, -0.5, 3.1],
    [1.6, -0.5, 0.1],
    [1.6, 0.5, 0.1],
    [0.5, 0.5, 3.1],
    [-2.5, 1.5, -1.0],
    [-2.5, -1.5, -1.0],
    [2.5, -1.5, -1.0],
    [2.5, 1.5, -1.0],
    [-1.6, -0.5, -0.1],
    [-0.5, -0.5, -3.1],
    [-0.5, 0.5, -3.1],
    [-1.6, 0.5, -0.1],
    [0.5, -0.5, -3.1],
    [1.6, -0.5, -0.1],
    [1.6, 0.5, -0.1],
    [0.5, 0.5, -3.1]
  ];
  const triangles = [
    [0, 6, 3],
    [11, 6, 8],
    [4, 1, 5],
    [6, 0, 7],
    [8, 2, 9],
    [6, 11, 3],
    [1, 4, 0],
    [3, 11, 10],
    [8, 6, 5],
    [8, 5, 1],
    [3, 10, 9],
    [2, 8, 1],
    [16, 12, 19],
    [12, 16, 13],
    [7, 0, 4],
    [3, 9, 2],
    [19, 12, 18],
    [18, 12, 15],
    [13, 16, 17],
    [13, 17, 20],
    [13, 20, 14],
    [14, 20, 21],
    [14, 21, 15],
    [15, 21, 22],
    [15, 22, 23],
    [20, 17, 18],
    [18, 15, 23],
    [20, 18, 23],
    [12, 13, 0],
    [0, 13, 1],
    [2, 1, 14],
    [3, 2, 14],
    [13, 14, 1],
    [3, 14, 15],
    [0, 3, 12],
    [15, 12, 3],
    [4, 5, 17],
    [4, 17, 16],
    [5, 6, 17],
    [18, 17, 6],
    [19, 18, 6],
    [6, 7, 19],
    [7, 4, 19],
    [16, 19, 4],
    [8, 9, 21],
    [8, 21, 20],
    [9, 10, 21],
    [22, 21, 10],
    [23, 22, 10],
    [10, 11, 23],
    [11, 8, 23],
    [20, 23, 8]
  ];
  const edges = [...triangles.reduce((unique, face) => {
    face.forEach((a, i) => {
      const b = face[(i + 1) % 3];
      unique.set([Math.min(a, b), Math.max(a, b)].join(','), [a, b]);
    });
    return unique;
  }, new Map()).values()];
  const radius = Math.max(...vertices.map(v => Math.hypot(...v)));
  const modelScale = 210 / radius;
  let tilt = 0.92;
  let rotation = -0.35;
  let mode = 'mesh';
  let zoomPercent = 100;
  let pointer = null;
  let pendingDraw = 0;
  let frame;
  let depths;
  let hiddenEdges;

  function drawMesh(points, pixelScale, pixelRatio) {
    // Supersample in both dimensions, then filter down to the display canvas.
    // This smooths silhouettes as well as the depth-tested mesh edges.
    const samples = 2;
    const width = canvas.width * samples;
    const height = canvas.height * samples;
    pixelScale *= samples;
    if (!frame || frame.width !== width || frame.height !== height) {
      meshCanvas.width = width;
      meshCanvas.height = height;
      frame = meshContext.createImageData(width, height);
      depths = new Float64Array(width * height);
      hiddenEdges = new Float32Array(width * height);
    }
    frame.data.fill(0);
    depths.fill(-Infinity);
    hiddenEdges.fill(0);
    const viewScale = modelScale * pixelScale * zoomPercent / 100;
    const projected = points.map(([x, y, z]) => [
      width / 2 + x * viewScale,
      height / 2 + y * viewScale,
      z
    ]);
    const stroke = [41, 71, 102];
    // Keep a readable two-CSS-pixel stroke even in the smaller mobile viewer.
    const halfLineWidth = 2 * pixelRatio * samples / 2;
    const lightLength = Math.hypot(-0.35, -0.45, 1);

    for (const ids of triangles) {
      const [a, b, c] = ids.map(id => projected[id]);
      const area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
      // The mesh is outward-wound. In these screen coordinates, positive
      // signed area faces the camera, which looks toward decreasing z.
      if (area <= 1e-8) continue;

      const [p, q, r] = ids.map(id => points[id]);
      const u = q.map((v, i) => v - p[i]);
      const v = r.map((value, i) => value - p[i]);
      const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const diffuse = Math.max(0, (-0.35 * normal[0] - 0.45 * normal[1] + normal[2]) / (Math.hypot(...normal) * lightLength));
      const color = [87, 119, 155].map((dark, i) => Math.round(dark + ([218, 229, 240][i] - dark) * (0.2 + 0.8 * diffuse)));
      const altitudes = [
        area / Math.hypot(c[0] - b[0], c[1] - b[1]),
        area / Math.hypot(a[0] - c[0], a[1] - c[1]),
        area / Math.hypot(b[0] - a[0], b[1] - a[1])
      ];
      const minX = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0])));
      const maxX = Math.min(width - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
      const minY = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1])));
      const maxY = Math.min(height - 1, Math.ceil(Math.max(a[1], b[1], c[1])));

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const px = x + 0.5;
          const py = y + 0.5;
          const wa = ((b[0] - px) * (c[1] - py) - (b[1] - py) * (c[0] - px)) / area;
          const wb = ((c[0] - px) * (a[1] - py) - (c[1] - py) * (a[0] - px)) / area;
          const wc = 1 - wa - wb;
          if (wa < -1e-10 || wb < -1e-10 || wc < -1e-10) continue;
          const z = wa * a[2] + wb * b[2] + wc * c[2];
          const pixel = y * width + x;
          if (z <= depths[pixel]) continue;
          depths[pixel] = z;

          // Shade edges in the same depth-tested pass as the faces, so a
          // hidden triangle cannot draw its wireframe over a nearer face.
          const edgeDistance = Math.min(wa * altitudes[0], wb * altitudes[1], wc * altitudes[2]);
          const edge = Math.max(0, Math.min(1, halfLineWidth + 0.5 - edgeDistance));
          const offset = pixel * 4;
          for (let channel = 0; channel < 3; channel++) {
            frame.data[offset + channel] = Math.round(color[channel] + (stroke[channel] - color[channel]) * edge);
          }
          frame.data[offset + 3] = Math.round(255 * (0.36 + 0.64 * edge));
        }
      }
    }

    // Reveal occluded edges faintly beneath the translucent front surface.
    // Classify each edge sample against the actual nearest surface depth.
    const support = halfLineWidth + 0.5;
    for (const ids of edges) {
      let [a, b] = ids.map(id => projected[id]);
      const major = Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]) ? 0 : 1;
      const minor = 1 - major;
      if (a[major] > b[major]) [a, b] = [b, a];
      const span = b[major] - a[major];
      if (span < 1e-8) continue;
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const lengthSquared = dx * dx + dy * dy;
      const majorLimit = major === 0 ? width : height;
      const minorLimit = major === 0 ? height : width;
      for (let u = Math.max(0, Math.floor(a[major])); u <= Math.min(majorLimit - 1, Math.ceil(b[major])); u++) {
        const t = Math.max(0, Math.min(1, (u + 0.5 - a[major]) / span));
        const center = a[minor] + t * (b[minor] - a[minor]);
        for (let v = Math.max(0, Math.floor(center - support - 0.5)); v <= Math.min(minorLimit - 1, Math.ceil(center + support - 0.5)); v++) {
          const x = major === 0 ? u : v;
          const y = major === 0 ? v : u;
          const along = Math.max(0, Math.min(1, ((x + 0.5 - a[0]) * dx + (y + 0.5 - a[1]) * dy) / lengthSquared));
          const distance = Math.hypot(x + 0.5 - a[0] - along * dx, y + 0.5 - a[1] - along * dy);
          const coverage = Math.max(0, Math.min(1, support - distance));
          const z = a[2] + along * (b[2] - a[2]);
          const pixel = y * width + x;
          if (z < depths[pixel] - 1e-6) hiddenEdges[pixel] = Math.max(hiddenEdges[pixel], 0.24 * coverage);
        }
      }
    }
    for (let pixel = 0; pixel < hiddenEdges.length; pixel++) {
      if (!hiddenEdges[pixel]) continue;
      const offset = pixel * 4;
      const frontAlpha = frame.data[offset + 3] / 255;
      const behindAlpha = hiddenEdges[pixel] * (1 - frontAlpha);
      const alpha = frontAlpha + behindAlpha;
      for (let channel = 0; channel < 3; channel++) {
        frame.data[offset + channel] = Math.round((frame.data[offset + channel] * frontAlpha + stroke[channel] * behindAlpha) / alpha);
      }
      frame.data[offset + 3] = Math.round(255 * alpha);
    }
    meshContext.putImageData(frame, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(meshCanvas, 0, 0, canvas.width, canvas.height);
  }

  function draw() {
    // Keep supersampling while dragging; restore full Retina resolution on release.
    const ratio = Math.min(window.devicePixelRatio || 1, pointer ? 1 : 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const scale = Math.min(width / 560, height / 490);
    ctx.setTransform(ratio * scale, 0, 0, ratio * scale, width * ratio / 2, height * ratio / 2);
    const points = vertices.map(([x, y, z]) => {
      const xx = x * Math.cos(rotation) - y * Math.sin(rotation);
      const yy = x * Math.sin(rotation) + y * Math.cos(rotation);
      return [xx, yy * Math.cos(tilt) - z * Math.sin(tilt), yy * Math.sin(tilt) + z * Math.cos(tilt)];
    });
    if (mode === 'points') {
      const pointScale = modelScale * zoomPercent / 100;
      [...points].sort((a, b) => a[2] - b[2]).forEach(([x, y, z]) => {
        const depth = (z + radius) / (2 * radius);
        ctx.fillStyle = `rgba(25,47,76,${0.35 + depth * 0.65})`;
        ctx.beginPath();
        ctx.arc(x * pointScale, y * pointScale, 2.4 + depth * 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      return;
    }
    drawMesh(points, ratio * scale, ratio);
  }
  function scheduleDraw() {
    if (pendingDraw) return;
    pendingDraw = requestAnimationFrame(() => {
      pendingDraw = 0;
      draw();
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
  const zoomOut = document.querySelector('#zoom-out-surface');
  const zoomIn = document.querySelector('#zoom-in-surface');
  const zoomLevel = document.querySelector('#surface-zoom-level');
  function setZoom(percent) {
    zoomPercent = Math.max(50, Math.min(250, percent));
    zoomLevel.textContent = `${zoomPercent}%`;
    zoomOut.disabled = zoomPercent === 50;
    zoomIn.disabled = zoomPercent === 250;
    draw();
  }
  zoomOut.addEventListener('click', () => setZoom(zoomPercent - 25));
  zoomIn.addEventListener('click', () => setZoom(zoomPercent + 25));
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
    scheduleDraw();
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(event, () => {
    if (!pointer) return;
    pointer = null;
    scheduleDraw();
  });
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(canvas.parentElement);
  else window.addEventListener('resize', draw);
})();
