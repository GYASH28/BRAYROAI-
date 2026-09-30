import './scrollcraft.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function connectDetails(){
  const contact = document.querySelector('.contact-section');
  if (contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        contact.classList.add('is-visible');
        observer.disconnect();
      }
    }, {threshold: .25});
    observer.observe(contact);
  }

  const links = [...document.querySelectorAll('.hero-chapters a[href^="#"]')];
  const targets = links.map(link => ({link, section: document.querySelector(link.getAttribute('href') === '#top' ? '.hero' : link.getAttribute('href'))})).filter(item => item.section);
  if (targets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(() => {
      let current = targets[0];
      for (const item of targets) if (item.section.getBoundingClientRect().top < innerHeight * .45) current = item;
      links.forEach(link => link.removeAttribute('aria-current'));
      current.link.setAttribute('aria-current', 'location');
    }, {rootMargin: '-40% 0px -40% 0px'});
    targets.forEach(item => observer.observe(item.section));
  }
}

const clamp = value => Math.min(1, Math.max(0, value));
const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };

function initResponsiveProof(root) {
  const section = root.querySelector('.viewport-section');
  const proof = section?.querySelector('[data-device-proof]');
  const frame = section?.querySelector('[data-device-frame]');
  const canvas = section?.querySelector('.device-canvas');
  const slider = section?.querySelector('[data-viewport-slider]');
  const arrow = section?.querySelector('[data-viewport-arrow]');
  const label = section?.querySelector('[data-device-copy]');
  if (!section || !proof || !frame || !slider) return;

  let progress = 0;
  let manualUntil = 0;
  let renderer, scene, camera, rig, desktopMesh, mobileMesh, frameMesh, stand, standFoot, resizeObserver;
  let drawQueued = false;
  let lastLabel = '';
  let inView = false;

  function disposeRenderer() {
    if (!renderer) return;
    resizeObserver?.disconnect();
    scene?.traverse(object => {
      object.geometry?.dispose?.();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => { material?.map?.dispose?.(); material?.dispose?.(); });
    });
    renderer.dispose();
    renderer = undefined;
    proof.classList.remove('has-3d-proof');
  }

  function setProgress(value) {
    progress = clamp(Number(value) || 0);
    slider.value = String(Math.round(progress * 100));
    slider.setAttribute('aria-valuetext', progress < .18 ? 'Desktop view' : progress > .82 ? 'Phone view' : 'Changing from desktop to phone');
    proof.style.setProperty('--device-p', progress.toFixed(4));
    proof.style.setProperty('--device-mix', smooth((progress - .48) / .08).toFixed(4));
    if (arrow) arrow.style.setProperty('--arrow-p', progress.toFixed(4));
    const nextLabel = progress < .5 ? '01 / WIDE SCREEN' : '02 / PHONE SCREEN';
    if (label && nextLabel !== lastLabel) { label.textContent = nextLabel; lastLabel = nextLabel; }
    if (renderer && inView) requestDraw();
  }

  slider.addEventListener('input', () => {
    manualUntil = performance.now() + 1600;
    setProgress(Number(slider.value) / 100);
  });
  slider.addEventListener('keydown', () => { manualUntil = performance.now() + 2600; });

  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      scrollTick = false;
      if (performance.now() < manualUntil) return;
      const raw = getComputedStyle(section).getPropertyValue('--sc-p');
      if (raw.trim()) setProgress(raw);
    });
  }, {passive: true});

  setProgress(reduced.matches ? 1 : 0);
  if (reduced.matches || innerWidth < 720 || !('IntersectionObserver' in window) || !canvas) return;

  const visibility = new IntersectionObserver(entries => {
    inView = entries[0]?.isIntersecting ?? false;
    if (inView && !document.hidden) requestDraw();
  }, {threshold: .02});
  visibility.observe(section);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && inView) requestDraw(); });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); disposeRenderer(); }, {once: true});
  window.addEventListener('pagehide', () => { visibility.disconnect(); disposeRenderer(); }, {once: true});

  let requested = false;
  const near = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting) && !requested) {
      requested = true;
      near.disconnect();
      loadRenderer();
    }
  }, {rootMargin: '20%'});
  near.observe(section);

  async function loadRenderer() {
    try {
      const THREE = await import('three');
      if (!canvas.isConnected || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.setSize(frame.clientWidth, frame.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(32, Math.max(.1, frame.clientWidth / frame.clientHeight), .1, 100);
      camera.position.set(0, 0, 8.8);
      rig = new THREE.Group();
      scene.add(rig);

      const textureLoader = new THREE.TextureLoader();
      const [desktop, mobile] = await Promise.all([
        textureLoader.loadAsync('/assets/fakhrimart-case-desktop.webp'),
        textureLoader.loadAsync('/assets/fakhrimart-case-mobile.webp'),
      ]);
      [desktop, mobile].forEach(texture => { texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4); });

      const screenGeometry = new THREE.PlaneGeometry(1, 1);
      const dark = new THREE.MeshStandardMaterial({color: 0x171819, metalness: .56, roughness: .38});
      frameMesh = new THREE.Mesh(new THREE.BoxGeometry(1.04, 1.06, .15), dark);
      rig.add(frameMesh);
      desktopMesh = new THREE.Mesh(screenGeometry, new THREE.MeshBasicMaterial({map: desktop, transparent: true}));
      mobileMesh = new THREE.Mesh(screenGeometry, new THREE.MeshBasicMaterial({map: mobile, transparent: true, opacity: 0}));
      desktopMesh.position.z = .09;
      mobileMesh.position.z = .1;
      rig.add(desktopMesh, mobileMesh);

      const metal = new THREE.MeshStandardMaterial({color: 0x393b3d, metalness: .58, roughness: .46});
      stand = new THREE.Mesh(new THREE.BoxGeometry(.62, 1, .12), metal);
      stand.position.set(0, -.6, -.11);
      rig.add(stand);
      standFoot = new THREE.Mesh(new THREE.BoxGeometry(2.25, .1, .5), metal);
      standFoot.position.set(0, -1.1, -.08);
      rig.add(standFoot);

      const keyLight = new THREE.DirectionalLight(0xffe7d2, 2.2);
      keyLight.position.set(-4, 6, 9);
      scene.add(keyLight, new THREE.AmbientLight(0xffffff, 1.1));
      const beadMaterial = new THREE.MeshBasicMaterial({color: 0xff6228});
      for (const [x, y] of [[-4.7, 2.3], [4.7, 2.3], [-4.7, -2.3], [4.7, -2.3]]) {
        const bead = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), beadMaterial);
        bead.position.set(x, y, -.2);
        rig.add(bead);
      }
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(frame);
      } else window.addEventListener('resize', resize, {passive: true});
      proof.classList.add('has-3d-proof');
      resize();
      setProgress(progress);
    } catch (error) {
      console.info('3D proof display using its still-image version.', error);
      if (renderer) renderer.dispose();
      renderer = undefined;
      proof.classList.remove('has-3d-proof');
    }
  }

  function resize() {
    if (!renderer || !frame) return;
    if (innerWidth < 720 || reduced.matches) { disposeRenderer(); return; }
    const width = Math.max(1, frame.clientWidth), height = Math.max(1, frame.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestDraw();
  }

  function requestDraw() {
    if (drawQueued || !renderer) return;
    drawQueued = true;
    requestAnimationFrame(() => {
      drawQueued = false;
      const p = smooth(progress);
      const width = 6.9 + (2.45 - 6.9) * p;
      const height = 4.25 + (5.1 - 4.25) * p;
      const mobileMix = smooth((progress - .48) / .08);
      rig.rotation.y = Math.sin(progress * Math.PI) * .46;
      rig.rotation.x = -.035 + Math.sin(progress * Math.PI) * .045;
      rig.rotation.z = -.014 + progress * .018;
      frameMesh.scale.set(width + .18, height + .18, .9);
      desktopMesh.scale.set(width, height, 1);
      mobileMesh.scale.set(width, height, 1);
      desktopMesh.material.opacity = 1 - mobileMix;
      mobileMesh.material.opacity = mobileMix;
      stand.visible = standFoot.visible = progress < .82;
      stand.material.transparent = standFoot.material.transparent = true;
      stand.material.opacity = standFoot.material.opacity = 1 - smooth(progress / .82);
      stand.scale.set(1, Math.max(.08, height * .12), 1);
      stand.position.y = -height * .58;
      standFoot.position.y = -height * .73;
      camera.position.z = 8.8 + (10.2 - 8.8) * p;
      camera.lookAt(0, -.1, 0);
      renderer.render(scene, camera);
    });
  }
}

function initMaterialParallax(root) {
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const figures = [...root.querySelectorAll('.method-row figure')];
  if (!figures.length) return;
  const active = new Set();
  let frame = 0;
  const render = () => {
    frame = 0;
    if (document.hidden) return;
    for (const figure of active) {
      const rect = figure.getBoundingClientRect();
      const travel = (rect.top + rect.height * .5 - innerHeight * .5) / Math.max(1, innerHeight);
      figure.style.setProperty('--media-drift', `${Math.max(-32, Math.min(32, -travel * 37)).toFixed(1)}px`);
    }
  };
  const queue = () => { if (!frame && active.size) frame = requestAnimationFrame(render); };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.isIntersecting ? active.add(entry.target) : active.delete(entry.target);
    queue();
  }, {rootMargin: '100px 0px'});
  figures.forEach(figure => observer.observe(figure));
  window.addEventListener('scroll', queue, {passive: true});
  window.addEventListener('resize', queue, {passive: true});
  window.addEventListener('pagehide', () => {
    observer.disconnect();
    window.removeEventListener('scroll', queue);
    window.removeEventListener('resize', queue);
    if (frame) cancelAnimationFrame(frame);
  }, {once: true});
}

export function initExperience(){
  const root = document.querySelector('[data-sc-root]');
  if (!root) return;
  window.ScrollCraft.mount(root);
  connectDetails();
  initResponsiveProof(root);
  initMaterialParallax(root);
}
