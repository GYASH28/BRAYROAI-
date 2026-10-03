import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { createParticleField } from './particle-points.js';
import { createPointBudget, createRasterBudget } from './raster-budget.js';

const clamp = (value) => Math.max(0, Math.min(1, Number(value) || 0));

function createStratifiedPointOrder(count) {
  const ArrayType = count > 65535 ? Uint32Array : Uint16Array;
  const order = new ArrayType(count);
  const ranges = [[0, count - 1]];
  let read = 0;
  let write = 0;
  while (read < ranges.length && write < count) {
    const [start, end] = ranges[read++];
    if (start > end) continue;
    const middle = Math.floor((start + end) / 2);
    order[write++] = middle;
    if (start <= middle - 1) ranges.push([start, middle - 1]);
    if (middle + 1 <= end) ranges.push([middle + 1, end]);
  }
  return order;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAssembly;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPointerAspect;

  attribute vec3 aLoosePosition;
  attribute vec3 aMarkPosition;
  attribute vec3 aColor;
  attribute vec3 aTargetColor;
  attribute vec4 aChoreography;
  attribute vec3 aArcOffset;
  attribute vec3 aCurlOffset;
  attribute float aPhase;
  attribute float aSize;
  attribute float aFlow;
  attribute float aAlpha;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vPointerGlow;
  varying float vSpark;
  varying float vFlowLight;

  void main() {
    float assembly = smoothstep(0.0, 1.0, uAssembly);
    float localAssembly = smoothstep(aChoreography.x, aChoreography.y, assembly);
    float loose = 1.0 - localAssembly;
    float arcEnvelope = 4.0 * localAssembly * (1.0 - localAssembly);
    float curlEnvelope = 0.0;
    if (arcEnvelope > 0.0005) {
      curlEnvelope = arcEnvelope * 0.62
        * sin(localAssembly * 6.2831853 + aPhase);
    }

    vec3 transformed = mix(aLoosePosition, aMarkPosition, localAssembly)
      + aArcOffset * arcEnvelope
      + aCurlOffset * curlEnvelope;

    // Two shared waves replace the old stack of independent trigonometric
    // evaluations. The composition keeps its drift, pulse and ribbon life
    // while substantially reducing per-point shader work.
    float wave = sin(aPhase + aFlow * 12.0 - uTime * 0.92);
    float drift = sin(aPhase * 0.67 + uTime * 0.41);
    float filamentLight = 0.5 + 0.5 * wave;
    transformed.y += wave * loose * (0.024 + aChoreography.w * 0.012);
    transformed.z += drift * loose * (0.022 + aChoreography.w * 0.016);
    transformed.x += drift * loose * 0.011;

    float role = aChoreography.z;
    if (role > 0.5 && localAssembly > 0.001) {
      vec2 orbitTangent = normalize(vec2(-aMarkPosition.y * 1.3, aMarkPosition.x * 0.72)
        + vec2(0.0001));
      float orbitFlow = drift * 0.05 * localAssembly;
      transformed.xy += orbitTangent * orbitFlow;
      transformed.z += wave * 0.017 * localAssembly;
    }

    vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
    float pointerGlow = 0.0;
    if (uPointerStrength > 0.001) {
      vec4 pointerClip = projectionMatrix * viewPosition;
      vec2 particleNdc = pointerClip.xy / max(0.0001, pointerClip.w);
      vec2 pointerDelta = particleNdc - uPointer;
      vec2 pointerMetric = vec2(pointerDelta.x * uPointerAspect, pointerDelta.y);
      float pointerDistance = length(pointerMetric);
      float pointerInfluence = 1.0 - smoothstep(0.055, 0.34, pointerDistance);
      float ripple = 0.5 + 0.5 * sin(pointerDistance * 32.0 - uTime * 6.0 + aPhase * 0.14);
      float pointerForce = min(0.225, pointerInfluence * (0.105 + ripple * 0.07))
        * uPointerStrength;
      vec2 pointerDirection = normalize(pointerDelta + vec2(0.0001));
      vec2 swirlDirection = vec2(-pointerDirection.y, pointerDirection.x);
      float swirlForce = min(0.105, pointerInfluence * (0.035 + ripple * 0.052))
        * uPointerStrength;
      viewPosition.xy += pointerDirection * pointerForce + swirlDirection * swirlForce * wave;
      viewPosition.z += pointerInfluence * uPointerStrength * (0.025 + ripple * 0.035);
      pointerGlow = pointerInfluence * uPointerStrength;
    }

    float depthScale = clamp(7.0 / max(1.0, -viewPosition.z), 0.72, 1.48);
    float sizePulse = 1.0 + drift * 0.05;
    float pointSize = mix(aSize, max(aSize, 1.0), localAssembly)
      * (1.0 + pointerGlow * 0.32 + aChoreography.w * 0.18 + filamentLight * loose * 0.16);
    gl_PointSize = clamp(pointSize * uPixelRatio * depthScale * sizePulse, 1.0, 5.2);
    gl_Position = projectionMatrix * viewPosition;

    vColor = mix(aColor, aTargetColor, localAssembly) * (0.94 + wave * 0.06);
    float formedAlpha = mix(0.64 + aAlpha * 0.22, 0.44 + aAlpha * 0.3, role);
    vAlpha = mix(aAlpha, formedAlpha, localAssembly) * (0.95 + drift * 0.05);
    vPointerGlow = pointerGlow;
    vSpark = aChoreography.w;
    vFlowLight = filamentLight * loose + role * localAssembly * filamentLight;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vPointerGlow;
  varying float vSpark;
  varying float vFlowLight;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceSquared = dot(point, point) * 4.0;
    float disc = 1.0 - smoothstep(0.58, 1.0, distanceSquared);
    float heart = 1.0 - smoothstep(0.0, 0.28, distanceSquared);
    float halo = 1.0 - smoothstep(0.0, 1.0, distanceSquared);
    float alpha = (disc * vAlpha + halo * (vPointerGlow * 0.14 + vSpark * 0.055)) * uOpacity;
    if (alpha < 0.008) discard;
    vec3 glowColor = mix(vColor, vec3(1.0, 0.56, 0.24), vPointerGlow * 0.18);
    gl_FragColor = vec4(glowColor
      * (0.88 + heart * 0.55 + vPointerGlow * 0.24 + vFlowLight * 0.16), alpha);
  }
`;

function Sculpture({ host }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposeScene = null;
    let stopped = false;
    const assemblyParent = host.closest('[data-assembly-progress]') || host.parentElement;
    let targetAssembly = clamp(assemblyParent?.dataset.assemblyProgress ?? host.dataset.assembly);
    let targetTravel = clamp(host.closest('.studio-hero')?.dataset.heroProgress);
    const setAssembly = (event) => {
      targetAssembly = clamp(event.detail?.progress ?? event.detail?.value);
    };
    // The aliases keep older callers harmless while studio:assembly is the
    // authored cloud-to-mark signal.
    const shape = setAssembly;
    const progress = setAssembly;
    const travelScene = (event) => { targetTravel = clamp(event.detail?.progress); };
    host.addEventListener('studio:assembly', setAssembly);
    host.addEventListener('studio:shape', shape);
    host.addEventListener('studio:progress', progress);
    host.addEventListener('studio:travel', travelScene);

    function start() {
      if (stopped || disposeScene || motionPreference.matches) return;
      host.dataset.renderState = 'loading';
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          alpha: true,
          precision: 'mediump',
          stencil: false,
          powerPreference: 'high-performance',
        });
      } catch {
        host.dataset.renderState = 'fallback';
        return;
      }

      try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 24);
        camera.position.set(0, 0.05, 6.45);
        camera.lookAt(0, 0.05, 0);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.sortObjects = false;

        const particleData = createParticleField();
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
        geometry.setAttribute('aLoosePosition', new THREE.BufferAttribute(particleData.loosePositions, 3));
        geometry.setAttribute('aMarkPosition', new THREE.BufferAttribute(particleData.markPositions, 3));
        geometry.setAttribute('aColor', new THREE.BufferAttribute(particleData.colors, 3));
        geometry.setAttribute('aTargetColor', new THREE.BufferAttribute(particleData.targetColors, 3));
        geometry.setAttribute('aChoreography', new THREE.BufferAttribute(particleData.choreography, 4));
        geometry.setAttribute('aArcOffset', new THREE.BufferAttribute(particleData.arcOffsets, 3));
        geometry.setAttribute('aCurlOffset', new THREE.BufferAttribute(particleData.curlOffsets, 3));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(particleData.phases, 1));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(particleData.sizes, 1));
        geometry.setAttribute('aFlow', new THREE.BufferAttribute(particleData.flows, 1));
        geometry.setAttribute('aAlpha', new THREE.BufferAttribute(particleData.alphas, 1));
        // A single low-discrepancy index lets adaptive draw ranges keep an
        // even sample of both the BR mark and surrounding ribbons.
        geometry.setIndex(new THREE.BufferAttribute(createStratifiedPointOrder(particleData.count), 1));
        geometry.setDrawRange(0, particleData.count);
        geometry.computeBoundingSphere();

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uAssembly: { value: targetAssembly },
            uPixelRatio: { value: 1 },
            uOpacity: { value: 0.92 },
            uPointer: { value: new THREE.Vector2() },
            uPointerStrength: { value: 0 },
            uPointerAspect: { value: 1 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        });

        const field = new THREE.Points(geometry, material);
        field.frustumCulled = false;
        field.rotation.set(0, 0, 0);
        field.position.set(0.12, 0.02, 0);
        scene.add(field);

        let frame = 0;
        let visible = !document.hidden;
        let intersecting = true;
        let modalOpen = Boolean(document.querySelector('dialog[open]'));
        let mobile = window.matchMedia('(max-width: 767px)').matches;
        let contextLost = false;
        let rendered = false;
        let previousTime = 0;
        let elapsed = 0;
        let fieldAssembly = targetAssembly;
        let travel = targetTravel;
        let cameraBaseZ = 6.45;
        const pointer = new THREE.Vector2();
        const easedPointer = new THREE.Vector2();
        let pointerInside = false;
        let pointerStrength = 0;
        let touchPulse = 0;
        let pendingPointer = null;
        let pixelRatio = 1;
        let qualityScale = 1;
        const rasterBudget = createRasterBudget();
        const pointBudget = createPointBudget(particleData.count);
        let activePointCount = particleData.count;
        let bufferWidth = 0;
        let bufferHeight = 0;

        const applyPointCount = (count) => {
          const next = Math.max(1, Math.min(particleData.count, Math.round(count)));
          if (next === activePointCount) return;
          activePointCount = next;
          geometry.setDrawRange(0, activePointCount);
          host.dataset.renderPoints = String(activePointCount);
          host.dataset.renderQuality = `${Math.round(activePointCount / particleData.count * 100)}%`;
        };
        host.dataset.renderQuality = '100%';

        const resize = () => {
          rasterBudget.reset();
          if (rendered) pointBudget.reset();
          // CSS scene travel scales the visual bounds. Allocate from layout
          // dimensions so resizing mid-scroll does not magnify the buffer twice.
          const width = host.clientWidth;
          const height = host.clientHeight;
          if (!width || !height) return;
          mobile = window.matchMedia('(max-width: 767px)').matches;
          pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25) * qualityScale;
          // setPixelRatio itself calls setSize. Update all three dimensions
          // together, and skip the observer's identical initial notification.
          if (bufferWidth !== width || bufferHeight !== height
            || renderer.getPixelRatio() !== pixelRatio) {
            renderer.setDrawingBufferSize(width, height, pixelRatio);
            bufferWidth = width;
            bufferHeight = height;
          }
          material.uniforms.uPixelRatio.value = pixelRatio;
          camera.aspect = width / height;
          material.uniforms.uPointerAspect.value = camera.aspect;
          cameraBaseZ = (mobile ? 6.85 : 6.45) / Math.min(1, Math.max(0.38, camera.aspect));
          camera.position.z = cameraBaseZ;
          field.position.x = mobile ? 0 : 0.12;
          field.scale.setScalar(mobile ? 0.9 : 1);
          camera.updateProjectionMatrix();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();

        function render(time) {
          frame = 0;
          if (!visible || !intersecting || modalOpen || contextLost) return;
          const realDelta = previousTime ? (time - previousTime) / 1000 : 0;
          const delta = Math.min(realDelta, 0.05);
          previousTime = time;
          const nextScale = rasterBudget.sample(realDelta);
          if (nextScale !== null) { qualityScale = nextScale; resize(); }
          const nextPointCount = pointBudget.sample(realDelta);
          if (nextPointCount !== null) applyPointCount(nextPointCount);
          if (pendingPointer) {
            // Read once per input frame, after the authored scale/translation.
            const rect = host.getBoundingClientRect();
            pointer.set(((pendingPointer.x - rect.left) / rect.width) * 2 - 1,
              1 - ((pendingPointer.y - rect.top) / rect.height) * 2);
            pendingPointer = null;
          }
          elapsed += delta;
          const easing = 1 - Math.exp(-Math.min(realDelta, 0.25) * 12);
          fieldAssembly += (targetAssembly - fieldAssembly) * easing;
          travel += (targetTravel - travel) * easing;
          const assembled = fieldAssembly * fieldAssembly * (3 - 2 * fieldAssembly);
          const loose = 1 - assembled;
          const travelEase = travel * travel * (3 - 2 * travel);
          touchPulse *= Math.exp(-Math.min(realDelta, 0.25) * 4.6);
          const pointerTarget = Math.max(pointerInside ? 1 : 0, touchPulse);
          const pointerEasing = 1 - Math.exp(-Math.min(realDelta, 0.25) * (pointerTarget > 0.01 ? 11 : 5.2));
          easedPointer.lerp(pointer, pointerEasing);
          pointerStrength += (pointerTarget - pointerStrength) * pointerEasing;

          material.uniforms.uTime.value = elapsed;
          material.uniforms.uAssembly.value = fieldAssembly;
          material.uniforms.uOpacity.value = 0.9 + Math.sin(elapsed * 0.19) * 0.025;
          material.uniforms.uPointer.value.copy(easedPointer);
          material.uniforms.uPointerStrength.value = pointerStrength;

          camera.position.x = loose * Math.sin(travelEase * Math.PI * 0.58) * 0.15;
          camera.position.y = 0.05 + loose * (Math.sin(travelEase * Math.PI) * 0.06 + travelEase * 0.03);
          camera.position.z = cameraBaseZ * (1 - loose * travelEase * 0.075);
          camera.lookAt(0, 0.05, 0);

          field.rotation.x = loose * (-0.035 + travelEase * 0.06
            + Math.sin(elapsed * 0.09) * 0.012);
          field.rotation.y = loose * (-0.08 + travelEase * 0.1
            + Math.sin(elapsed * 0.075) * 0.025);
          field.rotation.z = loose * (-0.025 - travelEase * 0.02
            + Math.sin(elapsed * 0.065) * 0.012);
          field.position.y = 0.02 + Math.sin(elapsed * 0.14) * (0.002 + loose * 0.008);

          try {
            renderer.render(scene, camera);
            if (!rendered) {
              rendered = true;
              host.dataset.drawCalls = String(renderer.info.render.calls);
              host.dataset.renderPoints = String(renderer.info.render.points);
              host.classList.add('is-ready');
              host.dataset.renderState = 'ready';
              host.dispatchEvent(new Event('studio:ready'));
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
            rasterBudget.reset();
            pointBudget.reset();
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
          pointerInside = true;
          pendingPointer = { x: event.clientX, y: event.clientY };
        };
        const leave = () => {
          pointerInside = false;
          pendingPointer = null;
        };
        const press = (event) => {
          pendingPointer = null;
          const rect = host.getBoundingClientRect();
          pointer.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            1 - ((event.clientY - rect.top) / rect.height) * 2,
          );
          easedPointer.copy(pointer);
          touchPulse = 1;
        };
        const dialogObserver = new MutationObserver(() => {
          const nextOpen = Boolean(document.querySelector('dialog[open]'));
          if (nextOpen === modalOpen) return;
          modalOpen = nextOpen;
          if (modalOpen) suspend(); else resume();
        });
        dialogObserver.observe(document.documentElement, {subtree:true,attributes:true,attributeFilter:['open']});
        const lost = (event) => {
          event.preventDefault();
          contextLost = true;
          suspend();
          host.classList.remove('is-ready');
          host.dataset.renderState = 'fallback';
        };
        const restored = () => {
          contextLost = false;
          rendered = false;
          resume();
        };
        host.addEventListener('pointermove', move, { passive: true });
        host.addEventListener('pointerdown', press, { passive: true });
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
          host.removeEventListener('pointerdown', press);
          host.removeEventListener('pointerleave', leave);
          document.removeEventListener('visibilitychange', visibility);
          canvas.removeEventListener('webglcontextlost', lost);
          canvas.removeEventListener('webglcontextrestored', restored);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          host.classList.remove('is-ready');
          host.removeAttribute('data-draw-calls');
          host.removeAttribute('data-render-points');
          host.removeAttribute('data-render-quality');
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
      host.removeEventListener('studio:assembly', setAssembly);
      host.removeEventListener('studio:shape', shape);
      host.removeEventListener('studio:progress', progress);
      host.removeEventListener('studio:travel', travelScene);
      motionPreference.removeEventListener('change', motionChange);
    };
  }, [host]);

  return (
    <canvas
      ref={canvasRef}
      className="sculpture-canvas"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
    />
  );
}

/** Mount once per host. Call the returned function when the island is removed. */
export function mountSculpture(host) {
  if (!host) return () => {};
  const root = createRoot(host);
  root.render(<Sculpture host={host} />);
  return () => root.unmount();
}
