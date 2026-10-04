import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext.jsx';
import { Pause, Play, RotateCcw } from 'lucide-react';

export const LogisticsHero3D = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const [webglSupported, setWebglSupported] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('iso');
  const pausedRef = useRef(false);
  const presetRef = useRef('iso');

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    presetRef.current = cameraPreset;
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      pausedRef.current = true;
      setIsPaused(true);
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 400;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    const handleContextLost = (e) => {
      e.preventDefault();
      setWebglSupported(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(7.2, 5.4, 8.2);
    camera.lookAt(0, 0.5, 0);

    const ambientLight = new THREE.AmbientLight(
      theme === 'dark' ? 0x94a3b8 : 0xffffff,
      theme === 'dark' ? 0.85 : 1.05
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, theme === 'dark' ? 1.5 : 1.7);
    keyLight.position.set(8, 12, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, theme === 'dark' ? 1.2 : 0.75);
    rimLight.position.set(-7, 6, -6);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Platform Base
    const dockGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.22, 48);
    const dockMat = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x1e293b : 0xe2e8f0,
      roughness: 0.65,
      metalness: 0.15,
    });
    const dockMesh = new THREE.Mesh(dockGeo, dockMat);
    dockMesh.position.y = -1.25;
    dockMesh.receiveShadow = true;
    rootGroup.add(dockMesh);

    const ringGeo = new THREE.RingGeometry(3.85, 3.98, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: theme === 'dark' ? 0x38bdf8 : 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.13;
    rootGroup.add(ringMesh);

    // Truck Assembly
    const truckGroup = new THREE.Group();
    rootGroup.add(truckGroup);

    const chassisGeo = new THREE.BoxGeometry(4.2, 0.25, 1.7);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.4,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.set(-0.2, -0.75, 0);
    truckGroup.add(chassis);

    const containerGeo = new THREE.BoxGeometry(2.9, 1.65, 1.62);
    const containerMat = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0xf8fafc : 0xffffff,
      roughness: 0.35,
      metalness: 0.1,
    });
    const containerBox = new THREE.Mesh(containerGeo, containerMat);
    containerBox.position.set(-0.75, 0.2, 0);
    containerBox.castShadow = true;
    truckGroup.add(containerBox);

    const stripeGeo = new THREE.BoxGeometry(2.94, 0.26, 1.65);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.2,
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(-0.75, 0.35, 0);
    truckGroup.add(stripe);

    const cabGeo = new THREE.BoxGeometry(1.1, 1.25, 1.54);
    const cabMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.25,
    });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(1.32, 0.0, 0);
    cab.castShadow = true;
    truckGroup.add(cab);

    const glassGeo = new THREE.BoxGeometry(0.15, 0.52, 1.38);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.8,
    });
    const windshield = new THREE.Mesh(glassGeo, glassMat);
    windshield.position.set(1.82, 0.22, 0);
    truckGroup.add(windshield);

    const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.26, 24);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });
    const wheelPositions = [
      [-1.55, -0.82, 0.78],
      [-1.55, -0.82, -0.78],
      [-0.1, -0.82, 0.78],
      [-0.1, -0.82, -0.78],
      [1.3, -0.82, 0.78],
      [1.3, -0.82, -0.78],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      truckGroup.add(wheel);
    });

    // Moving Boxes
    const kraftMat = new THREE.MeshStandardMaterial({
      color: 0xd99b66,
      roughness: 0.65,
      metalness: 0.05,
    });
    const tapeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
    });

    const createMovingBox = (w, h, d) => {
      const boxGroup = new THREE.Group();
      const mainBox = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), kraftMat);
      mainBox.castShadow = true;
      boxGroup.add(mainBox);

      const tape = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.06, d * 0.22), tapeMat);
      tape.position.y = h / 2;
      boxGroup.add(tape);
      return boxGroup;
    };

    const floatingBoxes = [];
    const boxConfigs = [
      { size: [0.85, 0.75, 0.85], pos: [-2.75, -0.76, 1.35], phase: 0 },
      { size: [0.7, 0.65, 0.7], pos: [-2.75, -0.05, 1.35], phase: 0.8 },
      { size: [0.9, 0.8, 0.75], pos: [-1.85, -0.72, 1.75], phase: 1.5 },
      { size: [0.65, 0.65, 0.65], pos: [2.1, 1.15, -1.1], phase: 2.2 },
      { size: [0.78, 0.58, 0.78], pos: [-2.3, 1.35, -1.2], phase: 3.1 },
    ];

    boxConfigs.forEach((cfg, idx) => {
      const box = createMovingBox(...cfg.size);
      box.position.set(...cfg.pos);
      rootGroup.add(box);
      if (idx >= 3) {
        floatingBoxes.push({ mesh: box, baseY: cfg.pos[1], phase: cfg.phase });
      }
    });

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!pausedRef.current) {
        rootGroup.rotation.y = elapsed * 0.22;
        floatingBoxes.forEach((fb) => {
          fb.mesh.position.y = fb.baseY + Math.sin(elapsed * 1.6 + fb.phase) * 0.14;
          fb.mesh.rotation.y = Math.sin(elapsed * 0.8 + fb.phase) * 0.2;
        });
      }

      const targetPos =
        presetRef.current === 'iso'
          ? new THREE.Vector3(7.2, 5.4, 8.2)
          : new THREE.Vector3(0.2, 2.8, 9.6);
      camera.position.lerp(targetPos, 0.06);
      camera.lookAt(0, 0.2, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 540;
      const newH = container.clientHeight || 400;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [theme]);

  if (!webglSupported) {
    return (
      <div
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4 mpms-surface-subtle rounded-4"
        style={{ minHeight: '360px' }}
      >
        <svg
          width="180"
          height="140"
          viewBox="0 0 180 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="35"
            width="90"
            height="55"
            rx="6"
            fill="#0284C7"
            fillOpacity="0.18"
            stroke="#0284C7"
            strokeWidth="2"
          />
          <rect x="110" y="50" width="38" height="40" rx="5" fill="#0284C7" />
          <circle cx="45" cy="94" r="10" fill="#0F172A" />
          <circle cx="90" cy="94" r="10" fill="#0F172A" />
          <circle cx="128" cy="94" r="10" fill="#0F172A" />
          <rect x="35" y="48" width="24" height="24" rx="3" fill="#D99B66" />
          <rect x="65" y="48" width="24" height="24" rx="3" fill="#D99B66" />
        </svg>
        <div className="small fw-semibold mt-2">MPMS 3D Fleet &amp; Cargo Visualizer</div>
        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
          2D Vector Fallback Active (WebGL Hardware Acceleration Disabled)
        </div>
      </div>
    );
  }

  return (
    <div
      className="position-relative w-100 rounded-4 overflow-hidden mpms-surface"
      style={{ height: '410px' }}
    >
      <div ref={mountRef} className="w-100 h-100" />

      <div
        className="position-absolute bottom-0 end-0 m-3 d-flex align-items-center gap-2 p-1 rounded-3"
        style={{
          backgroundColor:
            theme === 'dark' ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(6px)',
          border: '1px solid var(--mpms-border)',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          className="btn btn-sm py-1 px-2 d-inline-flex align-items-center gap-1 small"
          style={{ color: 'var(--mpms-text)', fontSize: '0.75rem' }}
          title={isPaused ? 'Resume 3D Rotation' : 'Pause 3D Rotation'}
        >
          {isPaused ? <Play size={13} /> : <Pause size={13} />}
          <span>{isPaused ? 'Play 3D' : 'Pause 3D'}</span>
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset((c) => (c === 'iso' ? 'side' : 'iso'))}
          className="btn btn-sm py-1 px-2 d-inline-flex align-items-center gap-1 small"
          style={{ color: 'var(--mpms-text)', fontSize: '0.75rem' }}
          title="Switch 3D Camera Perspective"
        >
          <RotateCcw size={13} />
          <span>{cameraPreset === 'iso' ? 'Side View' : 'Isometric'}</span>
        </button>
      </div>

      <div
        className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-2 small"
        style={{
          backgroundColor:
            theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid var(--mpms-border)',
          color: 'var(--mpms-text-muted)',
          fontSize: '0.75rem',
          zIndex: 10,
        }}
      >
        3D Fleet &amp; Cargo Load Simulation · WebGL
      </div>
    </div>
  );
};

export default LogisticsHero3D;
