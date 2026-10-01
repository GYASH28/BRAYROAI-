import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';

const TAU = Math.PI * 2;
const clamp = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const sectionTwist = (angle) => 0.24 + Math.sin(angle + 0.5) * 0.88 + Math.sin(angle * 2 - 0.4) * 0.32;
const sectionScale = (angle) => 0.98 + Math.sin(angle - 0.5) * 0.17 + Math.cos(angle * 3) * 0.07;

// A spatial ellipse with unequal shoulders. Collars use the curve's local frame,
// rather than pointing at a common centre as gear teeth would.
function curveFrame(angle) {
  const center = new THREE.Vector3(
    1.25 * Math.cos(angle) + 0.13 * Math.cos(angle * 2),
    0.82 * Math.sin(angle) + 0.07 * Math.sin(angle * 3),
    0.23 * Math.sin(angle * 2 - 0.25) + 0.08 * Math.cos(angle),
  );
  const tangent = new THREE.Vector3(
    -1.25 * Math.sin(angle) - 0.26 * Math.sin(angle * 2),
    0.82 * Math.cos(angle) + 0.21 * Math.cos(angle * 3),
    0.46 * Math.cos(angle * 2 - 0.25) - 0.08 * Math.sin(angle),
  ).normalize();
  const outward = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
  outward.addScaledVector(tangent, -outward.dot(tangent)).normalize();
  const normal = new THREE.Vector3().crossVectors(outward, tangent).normalize();
  const orientation = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(outward, tangent, normal));
  return { center, tangent, outward, normal, orientation };
}

function collarLayout() {
  const clusters = [
    [-0.26, 0.42, 9], [0.7, 1.31, 8], [1.64, 2.1, 7],
    [2.42, 3.18, 10], [3.55, 4.25, 9], [4.65, 5.7, 11],
  ];
  return clusters.flatMap(([start, end, count], cluster) => Array.from({ length: count }, (_, index) => {
    const fraction = index / (count - 1);
    const angle = start + (end - start) * (fraction + Math.sin(fraction * Math.PI) * 0.045);
    const dark = index === 0 || ((cluster === 2 || cluster === 5) && index === count - 1);
    return {
      ...curveFrame(angle), angle, cluster, dark,
      width: dark ? 0.112 : 0.061 + Math.sin(index * 1.31 + cluster) * 0.015 + (index === count - 2 ? 0.018 : 0),
      crossScale: sectionScale(angle),
    };
  }));
}

function roundedSection(width, height, radius) {
  const section = new THREE.Shape();
  const x = width / 2;
  const y = height / 2;
  section.moveTo(-x + radius, -y);
  section.lineTo(x - radius, -y);
  section.absarc(x - radius, -y + radius, radius, -Math.PI / 2, 0);
  section.lineTo(x, y - radius);
  section.absarc(x - radius, y - radius, radius, 0, Math.PI / 2);
  section.lineTo(-x + radius, y);
  section.absarc(-x + radius, y - radius, radius, Math.PI / 2, Math.PI);
  section.lineTo(-x, -y + radius);
  section.absarc(-x + radius, -y + radius, radius, Math.PI, Math.PI * 1.5);
  return section;
}

function ribbonGeometry() {
  const contour = roundedSection(0.566, 0.446, 0.195).getPoints(5);
  contour.pop();
  const segments = 128;
  const stride = contour.length + 1;
  const positions = [];
  const indices = [];
  for (let ring = 0; ring <= segments; ring++) {
    const angle = ring / segments * TAU;
    const twist = sectionTwist(angle);
    const frame = curveFrame(angle);
    const crossScale = sectionScale(angle);
    for (let point = 0; point <= contour.length; point++) {
      const section = contour[point % contour.length];
      const radial = Math.cos(twist) * section.x + Math.sin(twist) * section.y;
      const depth = -Math.sin(twist) * section.x + Math.cos(twist) * section.y;
      const position = frame.center.clone().addScaledVector(frame.outward, radial * crossScale).addScaledVector(frame.normal, depth * crossScale);
      positions.push(position.x, position.y, position.z);
      if (ring < segments && point < contour.length) {
        const a = ring * stride + point;
        const b = a + stride;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Large softboxes and a warm bounce card become real metal reflections through PMREM.
// The entire scene is procedural: there are no model or texture network requests.
function studioEnvironment(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = '#1d2024';
  context.fillRect(0, 0, 1024, 512);
  const glow = context.createLinearGradient(0, 0, 0, 512);
  glow.addColorStop(0, '#16191c');
  glow.addColorStop(0.48, '#3e4245');
  glow.addColorStop(0.58, '#151718');
  glow.addColorStop(1, '#080a0c');
  context.fillStyle = glow;
  context.fillRect(0, 0, 1024, 512);
  context.filter = 'blur(12px)';
  context.fillStyle = '#ffffff';
  context.fillRect(190, 72, 58, 290);
  context.fillStyle = '#b9d8ff';
  context.fillRect(650, 95, 110, 235);
  context.fillStyle = '#254ee9';
  context.fillRect(775, 90, 52, 300);
  context.fillStyle = '#fdf7ea';
  context.fillRect(315, 24, 330, 50);
  context.fillStyle = '#b25926';
  context.fillRect(940, 225, 70, 190);
  context.filter = 'none';
  context.fillStyle = '#f8f5ef';
  context.fillRect(198, 90, 24, 248);
  context.fillRect(691, 121, 12, 163);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromEquirectangular(texture);
  texture.dispose();
  generator.dispose();
  return environment;
}

function contactShadow() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const gradient = context.createRadialGradient(64, 64, 1, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,0.32)');
  gradient.addColorStop(0.36, 'rgba(0,0,0,0.16)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function Sculpture({ host }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposeScene = null;
    let stopped = false;
    let targetExpansion = clamp(Number(document.querySelector('#sculpture-shape')?.value || 0) / 100);
    let lastInteraction = performance.now();
    const shape = (event) => { targetExpansion = clamp(event.detail?.value); lastInteraction = performance.now(); };
    const progress = (event) => { targetExpansion = clamp(event.detail?.progress); lastInteraction = performance.now(); };
    host.addEventListener('studio:shape', shape);
    host.addEventListener('studio:progress', progress);

    function start() {
      if (stopped || disposeScene || motionPreference.matches) return;
      host.dataset.renderState = 'loading';
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch {
        host.dataset.renderState = 'fallback';
        return;
      }

      try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
      camera.position.set(0, 0.12, 6.9);
      camera.lookAt(0, 0, 0);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      let environment = studioEnvironment(renderer);
      if (environment) scene.environment = environment.texture;

      const key = new THREE.DirectionalLight(0xfff3e3, 1.8);
      key.position.set(-3, 5, 5);
      const rim = new THREE.DirectionalLight(0x6088ff, 2.4);
      rim.position.set(4, 1, -2);
      const fill = new THREE.DirectionalLight(0xffa36e, 0.4);
      fill.position.set(-2, -3, 3);
      scene.add(key, rim, fill, new THREE.AmbientLight(0xffffff, 0.18));
      const movingLight = new THREE.PointLight(0xff9a5b, 3.2, 8, 2);
      movingLight.position.set(-0.4, 0.8, 2.6);
      scene.add(movingLight);

      const sculpture = new THREE.Group();
      sculpture.rotation.set(0.68, -0.42, 0.38);
      sculpture.position.x = 0.31;
      scene.add(sculpture);
      const metal = new THREE.MeshStandardMaterial({ color: 0xd2d5d9, metalness: 1, roughness: 0.2, envMapIntensity: 1.65 });
      const finSection = roundedSection(0.69, 0.57, 0.22);
      const hole = roundedSection(0.58, 0.46, 0.19).getPoints(5).reverse();
      finSection.holes.push(new THREE.Path(hole));
      const finGeometry = new THREE.ExtrudeGeometry(finSection, {
        depth: 0.06, bevelEnabled: true, bevelSegments: 1,
        steps: 1, bevelSize: 0.005, bevelThickness: 0.005, curveSegments: 5,
      });
      finGeometry.translate(0, 0, -0.03);
      finGeometry.rotateX(Math.PI / 2);
      const collars = collarLayout();
      const silverCollars = collars.filter((collar) => !collar.dark);
      const darkCollars = collars.filter((collar) => collar.dark);
      const fins = new THREE.InstancedMesh(finGeometry, metal, silverCollars.length);
      fins.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      // The exploding pose extends beyond the folded geometry's bounding sphere.
      fins.frustumCulled = false;
      sculpture.add(fins);
      const ceramic = new THREE.MeshStandardMaterial({ color: 0x18212e, metalness: 0.68, roughness: 0.31, envMapIntensity: 1.2 });
      const contrast = new THREE.InstancedMesh(finGeometry, ceramic, darkCollars.length);
      const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x81a5ed, metalness: 0.9, roughness: 0.19, envMapIntensity: 1.8 });
      const trims = new THREE.InstancedMesh(finGeometry, trimMaterial, darkCollars.length * 2);
      for (const mesh of [contrast, trims]) {
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.frustumCulled = false;
        sculpture.add(mesh);
      }

      const orange = new THREE.MeshPhysicalMaterial({
        color: 0xf36618, metalness: 0.72, roughness: 0.18,
        clearcoat: 0.6, clearcoatRoughness: 0.15, envMapIntensity: 1.55,
      });
      const bandGeometry = ribbonGeometry();
      const band = new THREE.Mesh(bandGeometry, orange);
      sculpture.add(band);

      const shadowTexture = contactShadow();
      let shadow;
      if (shadowTexture) {
        shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 0.72), new THREE.MeshBasicMaterial({
          map: shadowTexture, transparent: true, opacity: 0.7, depthWrite: false,
        }));
        shadow.position.set(0.04, -1.57, -0.4);
        scene.add(shadow);
      }

      const particleGeometry = new THREE.BoxGeometry(0.014, 0.014, 0.014);
      const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xc0d5ed, roughness: 0.18, metalness: 1, envMapIntensity: 2.4 });
      const glintFrames = [0.48, 1.45, 2.22, 3.34, 4.44, 5.98].map(curveFrame);
      const particles = new THREE.InstancedMesh(particleGeometry, particleMaterial, glintFrames.length);
      particles.frustumCulled = false;
      sculpture.add(particles);
      const dummy = new THREE.Object3D();
      const yAxis = new THREE.Vector3(0, 1, 0);
      const twist = new THREE.Quaternion();
      let frame = 0;
      let visible = !document.hidden;
      let intersecting = true;
      let modalOpen = Boolean(document.querySelector('dialog[open]'));
      let mobile = window.matchMedia('(max-width: 767px)').matches;
      let contextLost = false;
      let rendered = false;
      let previousTime = 0;
      let arrivalStartedAt = null;
      let elapsed = 0;
      let expansion = targetExpansion || 0.32;
      const pointer = new THREE.Vector2();
      const easedPointer = new THREE.Vector2();

      const resize = () => {
        const rect = host.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        mobile = window.matchMedia('(max-width: 767px)').matches;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        // Keep the complete loop in portrait islands and leave room for expansion.
        camera.position.z = (mobile ? 6.9 : 7.1) / Math.min(1, Math.max(0.3, camera.aspect));
        sculpture.position.x = mobile ? -0.24 : 0.31;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      function render(time) {
        frame = 0;
        if (!visible || !intersecting || modalOpen || contextLost) return;
        if (arrivalStartedAt === null) arrivalStartedAt = time;
        const active = time - arrivalStartedAt < 2300 || time - lastInteraction < 1800 || Math.abs(targetExpansion - expansion) > 0.002;
        const interval = 1000 / (active ? (mobile ? 30 : 45) : 24);
        if (previousTime && time - previousTime < interval) {
          frame = requestAnimationFrame(render);
          return;
        }
        const realDelta = previousTime ? (time - previousTime) / 1000 : 1 / 30;
        const delta = Math.min(realDelta, 0.05);
        previousTime = time;
        elapsed += delta;
        const easing = 1 - Math.exp(-Math.min(realDelta, 0.25) * 4.6);
        const arrival = targetExpansion === 0 ? Math.max(0, 1 - (time - arrivalStartedAt) / 1800) * 0.32 : 0;
        expansion += (Math.max(targetExpansion, arrival) - expansion) * easing;
        easedPointer.lerp(pointer, easing);
        sculpture.rotation.x = 0.68 + easedPointer.y * 0.08 + Math.sin(elapsed * 0.23) * 0.035;
        sculpture.rotation.y = -0.42 + easedPointer.x * 0.12 + Math.sin(elapsed * 0.17) * 0.1;
        sculpture.rotation.z = 0.38 + Math.sin(elapsed * 0.13) * 0.04 - expansion * 0.1;
        sculpture.position.y = Math.sin(elapsed * 0.42) * 0.028;
        // Hold the outer silhouette in its island while the collars separate from the core.
        sculpture.scale.setScalar(0.96 / (1 + expansion * 0.29));
        scene.environmentRotation.y = -0.12 + Math.sin(elapsed * 0.11) * 0.16;
        movingLight.position.x = -0.4 + Math.sin(elapsed * 0.27) * 0.6;
        movingLight.position.y = 0.8 + Math.cos(elapsed * 0.19) * 0.5;

        const poseCollar = (collar, trimSide = 0) => {
          const opening = expansion * (0.36 + Math.sin(collar.cluster * 1.9) * 0.075);
          dummy.position.copy(collar.center)
            .addScaledVector(collar.outward, opening)
            .addScaledVector(collar.normal, expansion * Math.sin(collar.angle * 2 + 0.4) * 0.2)
            .addScaledVector(collar.tangent, trimSide * collar.width * 0.38);
          dummy.quaternion.copy(collar.orientation);
          twist.setFromAxisAngle(yAxis, sectionTwist(collar.angle) + expansion * Math.sin(collar.angle + collar.cluster) * 0.32);
          dummy.quaternion.multiply(twist);
          const scale = collar.crossScale * (trimSide ? 1.008 : 1);
          dummy.scale.set(scale, trimSide ? 0.095 : collar.width / 0.06, scale);
          dummy.updateMatrix();
        };
        for (let index = 0; index < silverCollars.length; index++) {
          poseCollar(silverCollars[index]);
          fins.setMatrixAt(index, dummy.matrix);
        }
        fins.instanceMatrix.needsUpdate = true;
        for (let index = 0; index < darkCollars.length; index++) {
          poseCollar(darkCollars[index]);
          contrast.setMatrixAt(index, dummy.matrix);
          poseCollar(darkCollars[index], -1);
          trims.setMatrixAt(index * 2, dummy.matrix);
          poseCollar(darkCollars[index], 1);
          trims.setMatrixAt(index * 2 + 1, dummy.matrix);
        }
        contrast.instanceMatrix.needsUpdate = true;
        trims.instanceMatrix.needsUpdate = true;
        band.scale.setScalar(1 - expansion * 0.025);
        if (shadow) {
          shadow.scale.x = 1 + expansion * 0.25;
          shadow.material.opacity = 0.7 - expansion * 0.16;
        }
        for (let index = 0; index < glintFrames.length; index++) {
          const glint = glintFrames[index];
          dummy.position.copy(glint.center)
            .addScaledVector(glint.outward, 0.4 + expansion * 0.25)
            .addScaledVector(glint.normal, 0.08 + Math.sin(elapsed * 0.32 + index) * 0.024);
          dummy.rotation.set(index, index * 0.4, elapsed * 0.12 + index);
          dummy.scale.setScalar((0.45 + expansion * 0.8) * (0.7 + index % 3 * 0.2));
          dummy.updateMatrix();
          particles.setMatrixAt(index, dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;
        try {
          renderer.render(scene, camera);
          if (!rendered) {
            rendered = true;
            host.classList.add('is-ready');
            host.dataset.renderState = 'ready';
          }
        } catch {
          contextLost = true;
          host.classList.remove('is-ready');
          host.dataset.renderState = 'fallback';
          return;
        }
        frame = requestAnimationFrame(render);
      }
      const resume = () => {
        if (!frame && visible && intersecting && !modalOpen && !contextLost) {
          previousTime = 0;
          frame = requestAnimationFrame(render);
        }
      };
      const suspend = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
      };
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        intersecting = entry.isIntersecting;
        if (intersecting) resume(); else suspend();
      });
      intersectionObserver.observe(host);
      const visibility = () => {
        visible = !document.hidden;
        if (visible) resume(); else suspend();
      };
      const move = (event) => {
        if (event.pointerType === 'touch') return;
        lastInteraction = performance.now();
        const rect = host.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
      };
      const leave = () => pointer.set(0, 0);
      const dialogObserver = new MutationObserver(() => {
        const nextOpen = Boolean(document.querySelector('dialog[open]'));
        if (nextOpen === modalOpen) return;
        modalOpen = nextOpen;
        if (modalOpen) suspend(); else resume();
      });
      dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'], childList: true });
      const lost = (event) => {
        event.preventDefault();
        contextLost = true;
        suspend();
        host.classList.remove('is-ready');
        host.dataset.renderState = 'fallback';
      };
      const restored = () => {
        try {
          environment?.dispose();
          environment = studioEnvironment(renderer);
          scene.environment = environment?.texture || null;
        } catch {
          host.dataset.renderState = 'fallback';
          return;
        }
        contextLost = false;
        rendered = false;
        resume();
      };
      host.addEventListener('pointermove', move, { passive: true });
      host.addEventListener('pointerleave', leave);
      document.addEventListener('visibilitychange', visibility);
      canvas.addEventListener('webglcontextlost', lost);
      canvas.addEventListener('webglcontextrestored', restored);
      resume();

      disposeScene = () => {
        suspend();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        dialogObserver.disconnect();
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
        document.removeEventListener('visibilitychange', visibility);
        canvas.removeEventListener('webglcontextlost', lost);
        canvas.removeEventListener('webglcontextrestored', restored);
        const geometries = new Set();
        const materials = new Set();
        scene.traverse((object) => {
          if (object.geometry) geometries.add(object.geometry);
          if (object.material) {
            const items = Array.isArray(object.material) ? object.material : [object.material];
            items.forEach((material) => materials.add(material));
          }
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        fins.dispose();
        contrast.dispose();
        trims.dispose();
        particles.dispose();
        shadowTexture?.dispose();
        environment?.dispose();
        renderer.dispose();
        host.classList.remove('is-ready');
      };
      } catch {
        renderer.dispose();
        host.classList.remove('is-ready');
        host.dataset.renderState = 'fallback';
      }
    }

    const motionChange = () => {
      if (motionPreference.matches) {
        disposeScene?.();
        disposeScene = null;
        host.dataset.renderState = 'reduced-motion';
      } else start();
    };
    motionPreference.addEventListener('change', motionChange);
    if (motionPreference.matches) host.dataset.renderState = 'reduced-motion';
    else start();
    return () => {
      stopped = true;
      disposeScene?.();
      host.removeEventListener('studio:shape', shape);
      host.removeEventListener('studio:progress', progress);
      motionPreference.removeEventListener('change', motionChange);
    };
  }, [host]);

  return <canvas ref={canvasRef} className="sculpture-canvas" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />;
}

/** Mount once per host. Call the returned function when the island is removed. */
export function mountSculpture(host) {
  if (!host) return () => {};
  const root = createRoot(host);
  root.render(<Sculpture host={host} />);
  return () => root.unmount();
}
