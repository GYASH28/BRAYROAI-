import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { createParticleField } from './particle-points.js';

const clamp = (value) => Math.max(0, Math.min(1, Number(value) || 0));

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uShape;
  uniform float uPixelRatio;

  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aSize;
  attribute float aKind;
  attribute float aFlow;
  attribute float aAlpha;

  varying vec3 vColor;
  varying float vAlpha;

  mat2 rotate2d(float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(cosine, -sine, sine, cosine);
  }

  void main() {
    vec3 transformed = position;
    float shape = smoothstep(0.0, 1.0, uShape);
    float orbitalDrift = uTime * (0.026 + aKind * 0.022)
      + shape * (0.055 + aKind * 0.105);

    transformed.xz = rotate2d(orbitalDrift) * transformed.xz;
    transformed.xy = rotate2d(-orbitalDrift * 0.12) * transformed.xy;

    vec3 orbitAxis = normalize(vec3(0.18, 1.0, 0.12));
    vec3 tangent = normalize(cross(orbitAxis, transformed) + vec3(0.0001));
    float coherentWave = sin(uTime * 0.31 + aPhase * 1.08 + transformed.y * 1.7);
    transformed += tangent * coherentWave
      * (0.005 + aKind * 0.011 + shape * aKind * 0.02);

    float pulse = sin(uTime * 0.24 + aPhase)
      * (0.004 + aKind * 0.006 + shape * 0.012);
    transformed *= 1.0 + pulse;

    float peel = smoothstep(0.64, 1.0, aFlow) * aKind * shape;
    transformed += vec3(0.065, 0.04, 0.025) * peel;

    vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
    float depthScale = clamp(7.0 / max(1.0, -viewPosition.z), 0.72, 1.48);
    float sizePulse = 1.0 + sin(uTime * 0.38 + aPhase * 1.7) * 0.065;
    gl_PointSize = clamp(aSize * uPixelRatio * depthScale * sizePulse, 0.7, 4.35);
    gl_Position = projectionMatrix * viewPosition;

    vColor = aColor * (0.93 + sin(uTime * 0.18 + aPhase) * 0.07);
    vAlpha = aAlpha * (0.94 + sin(uTime * 0.27 + aPhase * 1.3) * 0.06);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceSquared = dot(point, point) * 4.0;
    float disc = 1.0 - smoothstep(0.58, 1.0, distanceSquared);
    float heart = 1.0 - smoothstep(0.0, 0.28, distanceSquared);
    float alpha = disc * vAlpha * uOpacity;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(vColor * (0.76 + heart * 0.55), alpha);
  }
`;

function Sculpture({ host }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposeScene = null;
    let stopped = false;
    let targetShape = clamp(Number(document.querySelector('#sculpture-shape')?.value || 0) / 100);
    let targetTravel = clamp(host.closest('.studio-hero')?.dataset.heroProgress);
    if(!targetShape)targetShape=targetTravel*.65;
    let lastInteraction = performance.now();
    const shape = (event) => { targetShape = clamp(event.detail?.value); lastInteraction = performance.now(); };
    const progress = (event) => { targetShape = clamp(event.detail?.progress); lastInteraction = performance.now(); };
    const travelScene = (event) => { targetTravel = clamp(event.detail?.progress); lastInteraction = performance.now(); };
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
          powerPreference: 'low-power',
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

        const particleData = createParticleField();
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
        geometry.setAttribute('aColor', new THREE.BufferAttribute(particleData.colors, 3));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(particleData.phases, 1));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(particleData.sizes, 1));
        geometry.setAttribute('aKind', new THREE.BufferAttribute(particleData.kinds, 1));
        geometry.setAttribute('aFlow', new THREE.BufferAttribute(particleData.flows, 1));
        geometry.setAttribute('aAlpha', new THREE.BufferAttribute(particleData.alphas, 1));
        geometry.computeBoundingSphere();

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uShape: { value: targetShape },
            uPixelRatio: { value: 1 },
            uOpacity: { value: 0.92 },
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
        field.rotation.set(-0.055, -0.19, -0.075);
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
        let arrivalStartedAt = null;
        let elapsed = 0;
        let fieldShape = targetShape || 0.18;
        let travel = targetTravel;
        let cameraBaseZ = 6.45;
        const pointer = new THREE.Vector2();
        const easedPointer = new THREE.Vector2();

        const resize = () => {
          const rect = host.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          mobile = window.matchMedia('(max-width: 767px)').matches;
          const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(rect.width, rect.height, false);
          material.uniforms.uPixelRatio.value = pixelRatio;
          camera.aspect = rect.width / rect.height;
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
          if (arrivalStartedAt === null) arrivalStartedAt = time;
          const active = time - arrivalStartedAt < 2400 || time - lastInteraction < 1800
            || Math.abs(targetShape - fieldShape) > 0.002 || Math.abs(targetTravel - travel) > 0.002;
          const interval = 1000 / (active ? (mobile ? 30 : 45) : 24);
          if (previousTime && time - previousTime < interval) {
            frame = requestAnimationFrame(render);
            return;
          }
          const realDelta = previousTime ? (time - previousTime) / 1000 : 1 / 30;
          const delta = Math.min(realDelta, 0.05);
          previousTime = time;
          elapsed += delta;
          const easing = 1 - Math.exp(-Math.min(realDelta, 0.25) * 4.4);
          const arrival = targetShape === 0 ? Math.max(0, 1 - (time - arrivalStartedAt) / 1900) * 0.18 : 0;
          fieldShape += (Math.max(targetShape, arrival) - fieldShape) * easing;
          travel += (targetTravel - travel) * easing;
          const shaped = fieldShape * fieldShape * (3 - 2 * fieldShape);
          const travelEase = travel * travel * (3 - 2 * travel);
          easedPointer.lerp(pointer, easing);

          material.uniforms.uTime.value = elapsed;
          material.uniforms.uShape.value = shaped;
          material.uniforms.uOpacity.value = 0.9 + Math.sin(elapsed * 0.19) * 0.025;

          camera.position.x = Math.sin(travelEase * Math.PI * 0.58) * 0.2;
          camera.position.y = 0.05 + Math.sin(travelEase * Math.PI) * 0.085 + travelEase * 0.04;
          camera.position.z = cameraBaseZ * (1 - travelEase * 0.115);
          camera.lookAt(0, 0.05, 0);

          field.rotation.x = -0.055 + travelEase * 0.085 + easedPointer.y * 0.055
            + Math.sin(elapsed * 0.09) * 0.012;
          field.rotation.y = -0.19 + travelEase * 0.215 + easedPointer.x * 0.085
            + Math.sin(elapsed * 0.075) * 0.025;
          field.rotation.z = -0.075 - travelEase * 0.035 + Math.sin(elapsed * 0.065) * 0.012;
          field.position.y = 0.02 + Math.sin(elapsed * 0.14) * 0.012;

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
          pointer.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            ((event.clientY - rect.top) / rect.height) * 2 - 1,
          );
        };
        const leave = () => pointer.set(0, 0);
        const dialogObserver = new MutationObserver(() => {
          const nextOpen = Boolean(document.querySelector('dialog[open]'));
          if (nextOpen === modalOpen) return;
          modalOpen = nextOpen;
          if (modalOpen) suspend(); else resume();
        });
        dialogObserver.observe(document.body, {
          subtree: true,
          attributes: true,
          attributeFilter: ['open'],
          childList: true,
        });
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
          geometry.dispose();
          material.dispose();
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
