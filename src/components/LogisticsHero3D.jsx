import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext.jsx';
import { Pause, Play, RotateCcw, Package, RefreshCw } from 'lucide-react';

export const LogisticsHero3D = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const [webglSupported, setWebglSupported] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('iso');
  const [loadedCount, setLoadedCount] = useState(0);

  const pausedRef = useRef(false);
  const presetRef = useRef('iso');
  const resetCargoHandlerRef = useRef(null);

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
    const height = container.clientHeight || 410;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'default';

    const handleContextLost = (e) => {
      e.preventDefault();
      setWebglSupported(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(7.2, 5.4, 8.2);
    camera.lookAt(0, 0.2, 0);

    // ==========================================
    // LIGHTING SETUP (Studio PBR illumination)
    // ==========================================
    const isDark = theme === 'dark';
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0xa0aec0 : 0xffffff,
      isDark ? 1.05 : 1.25
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, isDark ? 1.75 : 1.95);
    keyLight.position.set(8.5, 12, 7.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, isDark ? 1.4 : 0.95);
    rimLight.position.set(-7, 6, -6);
    scene.add(rimLight);

    const frontFillLight = new THREE.DirectionalLight(0xffffff, isDark ? 0.6 : 0.5);
    frontFillLight.position.set(6, 2, -4);
    scene.add(frontFillLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ==========================================
    // 1. DOCK & PLATFORM CALCULATION
    // ==========================================
    // Platform cylinder: height = 0.22, center Y = -1.25.
    // Top surface of the platform is strictly:
    // PLATFORM_SURFACE_Y = -1.25 + (0.22 / 2) = -1.14
    const PLATFORM_Y = -1.25;
    const PLATFORM_HEIGHT = 0.22;
    const PLATFORM_SURFACE_Y = PLATFORM_Y + PLATFORM_HEIGHT / 2; // -1.14
    const PLATFORM_RADIUS = 4.2;

    const dockGeo = new THREE.CylinderGeometry(PLATFORM_RADIUS, 4.4, PLATFORM_HEIGHT, 48);
    const dockMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e293b : 0xe2e8f0,
      roughness: 0.65,
      metalness: 0.15,
    });
    const dockMesh = new THREE.Mesh(dockGeo, dockMat);
    dockMesh.position.y = PLATFORM_Y;
    dockMesh.receiveShadow = true;
    rootGroup.add(dockMesh);

    // Ground Contact Shadow directly under the truck
    const shadowGeo = new THREE.PlaneGeometry(5.2, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x090d16,
      transparent: true,
      opacity: isDark ? 0.55 : 0.28,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(-0.25, PLATFORM_SURFACE_Y + 0.002, 0);
    rootGroup.add(contactShadow);

    // Platform decorative glow ring
    const ringGeo = new THREE.RingGeometry(3.85, 3.98, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = PLATFORM_SURFACE_Y + 0.005;
    rootGroup.add(ringMesh);

    // Staging zone floor outline around rear dock
    const stagingGeo = new THREE.RingGeometry(1.9, 3.5, 32, 1, 0.7 * Math.PI, 1.6 * Math.PI);
    const stagingMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x64748b : 0x94a3b8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const stagingMesh = new THREE.Mesh(stagingGeo, stagingMat);
    stagingMesh.rotation.x = -Math.PI / 2;
    stagingMesh.position.set(-0.5, PLATFORM_SURFACE_Y + 0.003, 0);
    rootGroup.add(stagingMesh);

    // ==========================================
    // 2. REALISTIC TRUCK MODEL ASSEMBLY
    // ==========================================
    const truckGroup = new THREE.Group();
    rootGroup.add(truckGroup);

    // Container calculation:
    // Center Y = 0.20, Height = 1.65.
    // Truck interior bed floor height is strictly:
    // TRUCK_BED_Y = 0.20 - (1.65 / 2) = -0.625
    const CONTAINER_CENTER_Y = 0.20;
    const CONTAINER_HEIGHT = 1.65;
    const CONTAINER_WIDTH_X = 2.9;
    const CONTAINER_DEPTH_Z = 1.62;
    const TRUCK_BED_Y = CONTAINER_CENTER_Y - CONTAINER_HEIGHT / 2; // -0.625

    // Materials Palette for Realism
    const cabPaintMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Glossy corporate blue
      roughness: 0.22,
      metalness: 0.35,
    });
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6,
      metalness: 0.5,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.12,
      metalness: 0.88,
    });
    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.88,
      metalness: 0.05,
    });
    const wheelRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.82,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x091428,
      roughness: 0.08,
      metalness: 0.9,
    });
    const headlampMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.4,
      roughness: 0.1,
    });
    const indicatorMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.1,
      roughness: 0.2,
    });
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });

    // 2.1 Heavy-Duty Steel I-Beam Chassis Rails
    const railGeo = new THREE.BoxGeometry(4.35, 0.22, 0.12);
    [-0.45, 0.45].forEach((rz) => {
      const rail = new THREE.Mesh(railGeo, darkChassisMat);
      rail.position.set(-0.25, -0.73, rz);
      rail.castShadow = true;
      rail.receiveShadow = true;
      truckGroup.add(rail);
    });

    // Chassis Crossmembers
    [-1.8, -0.8, 0.3, 1.2].forEach((cx) => {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.85), darkChassisMat);
      cross.position.set(cx, -0.73, 0);
      cross.castShadow = true;
      truckGroup.add(cross);
    });

    // 2.2 Cylindrical Aluminum Fuel Tank (Left Side)
    const fuelTankGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.92, 24);
    const fuelTank = new THREE.Mesh(fuelTankGeo, chromeMat);
    fuelTank.rotation.z = Math.PI / 2;
    fuelTank.position.set(-0.82, -0.76, 0.65);
    fuelTank.castShadow = true;
    truckGroup.add(fuelTank);

    // Fuel Tank Straps & Cap
    [-0.26, 0.26].forEach((offset) => {
      const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 24), darkChassisMat);
      strap.rotation.z = Math.PI / 2;
      strap.position.set(-0.82 + offset, -0.76, 0.65);
      truckGroup.add(strap);
    });
    const fuelCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16), chromeMat);
    fuelCap.position.set(-0.82, -0.5, 0.65);
    truckGroup.add(fuelCap);

    // 2.3 Battery Storage Box & Compressed Air Cylinders (Right Side)
    const batteryBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 0.36), darkChassisMat);
    batteryBox.position.set(-0.75, -0.75, -0.65);
    batteryBox.castShadow = true;
    truckGroup.add(batteryBox);

    [-0.58, -0.72].forEach((ay) => {
      const airTank = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.72, 16), chromeMat);
      airTank.rotation.z = Math.PI / 2;
      airTank.position.set(-0.15, ay, -0.64);
      truckGroup.add(airTank);
    });

    // 2.4 Solid Interior Cargo Bed Plate with Non-Slip Ribs
    const cargoBed = new THREE.Mesh(
      new THREE.BoxGeometry(CONTAINER_WIDTH_X - 0.04, 0.05, CONTAINER_DEPTH_Z - 0.04),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.85,
        metalness: 0.3,
      })
    );
    cargoBed.position.set(-0.75, TRUCK_BED_Y, 0);
    cargoBed.receiveShadow = true;
    truckGroup.add(cargoBed);

    // 2.5 Translucent Ribbed Container Body
    // Transparent inspection walls so boxes are visible inside
    const containerMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xf8fafc : 0xffffff,
      roughness: 0.28,
      metalness: 0.12,
      transparent: true,
      opacity: isDark ? 0.44 : 0.54,
      depthWrite: false,
    });
    const containerBox = new THREE.Mesh(
      new THREE.BoxGeometry(CONTAINER_WIDTH_X, CONTAINER_HEIGHT, CONTAINER_DEPTH_Z),
      containerMat
    );
    containerBox.position.set(-0.75, CONTAINER_CENTER_Y, 0);
    containerBox.castShadow = true;
    truckGroup.add(containerBox);

    // Steel Structural Corner Posts & Edge Rails (ISO Container frame)
    const frameEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.5,
    });
    // Top Longitudinal Rails
    [-CONTAINER_DEPTH_Z / 2, CONTAINER_DEPTH_Z / 2].forEach((fz) => {
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(CONTAINER_WIDTH_X + 0.02, 0.06, 0.06), frameEdgeMat);
      topRail.position.set(-0.75, CONTAINER_CENTER_Y + CONTAINER_HEIGHT / 2, fz);
      truckGroup.add(topRail);

      const botRail = new THREE.Mesh(new THREE.BoxGeometry(CONTAINER_WIDTH_X + 0.02, 0.06, 0.06), frameEdgeMat);
      botRail.position.set(-0.75, CONTAINER_CENTER_Y - CONTAINER_HEIGHT / 2, fz);
      truckGroup.add(botRail);
    });

    // Vertical Ribs for authentic commercial container corrugation
    for (let rx = -2.0; rx <= 0.5; rx += 0.35) {
      [-CONTAINER_DEPTH_Z / 2 - 0.005, CONTAINER_DEPTH_Z / 2 + 0.005].forEach((rz) => {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.04, CONTAINER_HEIGHT - 0.1, 0.02), frameEdgeMat);
        rib.position.set(rx, CONTAINER_CENTER_Y, rz);
        truckGroup.add(rib);
      });
    }

    // Corporate Blue Branding Stripe with MPMS Accent
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(CONTAINER_WIDTH_X + 0.04, 0.28, CONTAINER_DEPTH_Z + 0.03),
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.3,
        metalness: 0.25,
        transparent: true,
        opacity: 0.88,
      })
    );
    stripe.position.set(-0.75, 0.35, 0);
    truckGroup.add(stripe);

    // 2.6 Rear Cargo Door Frame, Locking Cam Bars & Bumper
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, CONTAINER_HEIGHT + 0.04, CONTAINER_DEPTH_Z + 0.04),
      frameEdgeMat
    );
    doorFrame.position.set(-0.75 - CONTAINER_WIDTH_X / 2 - 0.02, CONTAINER_CENTER_Y, 0);
    doorFrame.castShadow = true;
    truckGroup.add(doorFrame);

    // Dual Vertical Chrome Locking Bars with Lever Handles
    [-0.32, 0.32].forEach((lz) => {
      const lockBar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, CONTAINER_HEIGHT - 0.1, 16), chromeMat);
      lockBar.position.set(-0.75 - CONTAINER_WIDTH_X / 2 - 0.05, CONTAINER_CENTER_Y, lz);
      truckGroup.add(lockBar);

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.12), chromeMat);
      handle.position.set(-0.75 - CONTAINER_WIDTH_X / 2 - 0.07, CONTAINER_CENTER_Y - 0.18, lz + 0.04);
      truckGroup.add(handle);
    });

    // Rear Under-run ICC Bumper with Hazard Chevrons & Tail Lights
    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 1.58), darkChassisMat);
    rearBumper.position.set(-2.28, -0.74, 0);
    truckGroup.add(rearBumper);

    // Tail Lights (Brake Red + Indicator Amber + Reverse White)
    [-0.62, 0.62].forEach((tz) => {
      const tailRed = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.14), taillightMat);
      tailRed.position.set(-2.35, -0.74, tz);
      truckGroup.add(tailRed);

      const tailAmber = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.08), indicatorMat);
      tailAmber.position.set(-2.35, -0.74, tz > 0 ? tz - 0.12 : tz + 0.12);
      truckGroup.add(tailAmber);
    });

    // Rear Loading Ramp connecting platform to truck bed
    const rampLength = 0.85;
    const rampHeightDiff = TRUCK_BED_Y - PLATFORM_SURFACE_Y; // ~0.515
    const rampAngle = Math.atan2(rampHeightDiff, rampLength);
    const ramp = new THREE.Mesh(
      new THREE.BoxGeometry(rampLength, 0.04, 1.25),
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.5,
        metalness: 0.45,
      })
    );
    ramp.rotation.z = -rampAngle;
    ramp.position.set(
      -0.75 - CONTAINER_WIDTH_X / 2 - rampLength / 2 + 0.02,
      PLATFORM_SURFACE_Y + rampHeightDiff / 2,
      0
    );
    ramp.receiveShadow = true;
    truckGroup.add(ramp);

    // 2.7 AERODYNAMIC DRIVER CABIN (Modern Faceted Commercial Truck Cab)
    const cabGroup = new THREE.Group();
    cabGroup.position.set(1.36, 0.02, 0);
    truckGroup.add(cabGroup);

    // Main Cab Body
    const cabMain = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.26, 1.54), cabPaintMat);
    cabMain.position.set(0, 0, 0);
    cabMain.castShadow = true;
    cabGroup.add(cabMain);

    // Aerodynamic Sloped Roof Deflector / Wind Wing
    const deflectorShape = new THREE.Shape();
    deflectorShape.moveTo(-0.6, 0.63);
    deflectorShape.lineTo(-0.6, 0.98);
    deflectorShape.lineTo(0.38, 0.63);
    deflectorShape.closePath();
    const deflectorExtrude = new THREE.ExtrudeGeometry(deflectorShape, {
      depth: 1.48,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    const deflectorMesh = new THREE.Mesh(deflectorExtrude, cabPaintMat);
    deflectorMesh.position.set(0, 0, -0.74);
    deflectorMesh.castShadow = true;
    cabGroup.add(deflectorMesh);

    // Slanted Front Windshield Glass
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.56, 1.42), glassMat);
    windshield.position.set(0.57, 0.24, 0);
    windshield.rotation.z = -0.08;
    cabGroup.add(windshield);

    // Dark Sun Visor Over Windshield
    const sunVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 1.52),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
    );
    sunVisor.position.set(0.58, 0.54, 0);
    sunVisor.rotation.z = 0.15;
    cabGroup.add(sunVisor);

    // Side Door Windows
    [-0.78, 0.78].forEach((sz) => {
      const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.46, 0.05), glassMat);
      sideGlass.position.set(0.12, 0.24, sz);
      cabGroup.add(sideGlass);

      // Chrome Door Handles
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.03), chromeMat);
      handle.position.set(-0.15, -0.08, sz > 0 ? sz + 0.01 : sz - 0.01);
      cabGroup.add(handle);

      // Cab Entry Footstep Pegs
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.14), darkChassisMat);
      step.position.set(0.08, -0.66, sz > 0 ? sz - 0.05 : sz + 0.05);
      cabGroup.add(step);
    });

    // Front Radiator Grille & Chrome Badge
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.42, 1.18),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.6,
      })
    );
    grille.position.set(0.62, -0.16, 0);
    cabGroup.add(grille);

    // Grille Chrome Slats
    [-0.1, 0.0, 0.1].forEach((gy) => {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 1.12), chromeMat);
      slat.position.set(0.63, -0.16 + gy, 0);
      cabGroup.add(slat);
    });

    // MPMS Center Chrome Emblem
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16), chromeMat);
    emblem.rotation.z = Math.PI / 2;
    emblem.position.set(0.67, -0.16, 0);
    cabGroup.add(emblem);

    // Heavy-Duty Front Bumper
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.26, 1.62), darkChassisMat);
    frontBumper.position.set(0.58, -0.54, 0);
    frontBumper.castShadow = true;
    cabGroup.add(frontBumper);

    // Commercial License Plate
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.09, 0.38),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 })
    );
    plate.position.set(0.7, -0.54, 0);
    cabGroup.add(plate);

    // Dual High-Power LED Headlight Clusters
    [-0.56, 0.56].forEach((hz) => {
      // Main LED Projector Beam
      const headlamp = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.16), headlampMat);
      headlamp.position.set(0.64, -0.34, hz);
      cabGroup.add(headlamp);

      // Amber Corner Indicator
      const ind = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.06), indicatorMat);
      ind.position.set(0.64, -0.34, hz > 0 ? hz + 0.11 : hz - 0.11);
      cabGroup.add(ind);

      // Fog lamp recessed in bumper
      const fog = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16), headlampMat);
      fog.rotation.z = Math.PI / 2;
      fog.position.set(0.7, -0.54, hz * 0.7);
      cabGroup.add(fog);
    });

    // Aerodynamic Side View Mirrors
    [-0.88, 0.88].forEach((mz) => {
      const mirrorGroup = new THREE.Group();
      mirrorGroup.position.set(0.25, 0.28, mz);

      // Dual Mounting Brackets
      [-0.12, 0.12].forEach((by) => {
        const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), darkChassisMat);
        bracket.rotation.x = Math.PI / 2;
        bracket.position.set(0, by, mz > 0 ? -0.06 : 0.06);
        mirrorGroup.add(bracket);
      });

      // Mirror Housing (Black Aerodynamic Shell)
      const mirrorShell = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.08), darkChassisMat);
      mirrorShell.position.set(0, 0, 0);
      mirrorGroup.add(mirrorShell);

      // Silver Reflective Mirror Face
      const mirrorFace = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.29, 0.02), chromeMat);
      mirrorFace.position.set(-0.02, 0, mz > 0 ? -0.04 : 0.04);
      mirrorGroup.add(mirrorFace);

      cabGroup.add(mirrorGroup);
    });

    // 2.8 REALISTIC COMMERCIAL HEAVY-DUTY WHEELS & RIMS
    // 6-wheel configuration: 2 front steering + 4 rear tandem drive
    const wheelPositions = [
      [-1.55, -0.82, 0.78],
      [-1.55, -0.82, -0.78],
      [-0.1, -0.82, 0.78],
      [-0.1, -0.82, -0.78],
      [1.3, -0.82, 0.78],
      [1.3, -0.82, -0.78],
    ];

    const createRealisticWheel = () => {
      const wheelGroup = new THREE.Group();

      // Outer Deep Rubber Tire with Tread Profile
      const tireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.28, 28);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      tire.receiveShadow = true;
      wheelGroup.add(tire);

      // Chrome/Alloy Wheel Rim
      const rimGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.29, 24);
      const rim = new THREE.Mesh(rimGeo, wheelRimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Central Axle Hubcap
      const hubGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.31, 16);
      const hub = new THREE.Mesh(hubGeo, chromeMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      // Radial Lug Nuts ring for realistic commercial wheel detailing
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const lug = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.32), chromeMat);
        lug.position.set(Math.cos(angle) * 0.16, Math.sin(angle) * 0.16, 0);
        wheelGroup.add(lug);
      }

      return wheelGroup;
    };

    wheelPositions.forEach(([wx, wy, wz]) => {
      const wGroup = createRealisticWheel();
      wGroup.position.set(wx, wy, wz);
      truckGroup.add(wGroup);
    });

    // Realistic Curved Wheel Mudguards & Rubber Flaps
    // Front Wheel Mudguards
    [-0.78, 0.78].forEach((fz) => {
      const frontFender = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.32, 16, 1, false, Math.PI * 0.15, Math.PI * 0.7),
        darkChassisMat
      );
      frontFender.rotation.z = Math.PI / 2;
      frontFender.rotation.y = Math.PI / 2;
      frontFender.position.set(1.3, -0.66, fz);
      truckGroup.add(frontFender);
    });

    // Rear Tandem Wheel Arches & Mudflaps
    [-0.78, 0.78].forEach((rz) => {
      const rearFender = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.08, 0.34), darkChassisMat);
      rearFender.position.set(-0.82, -0.46, rz);
      truckGroup.add(rearFender);

      // Black Rubber Mudflaps with White Safety Reflectors hanging down behind rear wheels
      const flap = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.32), rubberMat);
      flap.position.set(-1.82, -0.74, rz);
      truckGroup.add(flap);

      const reflector = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.06, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      reflector.position.set(-1.83, -0.84, rz);
      truckGroup.add(reflector);
    });

    // ==========================================
    // 3. TRUCK CARGO SNAP SLOTS & GUIDES
    // ==========================================
    // 5 distinct non-overlapping slots inside the truck bed
    const TRUCK_SLOTS = [
      { id: 0, x: 0.15, z: -0.38, label: 'Front-Left' },
      { id: 1, x: 0.15, z: 0.38, label: 'Front-Right' },
      { id: 2, x: -0.65, z: -0.38, label: 'Mid-Left' },
      { id: 3, x: -0.65, z: 0.38, label: 'Mid-Right' },
      { id: 4, x: -1.45, z: 0.0, label: 'Rear-Center' },
    ];

    // Visual snap target indicators on the cargo bed floor
    const slotIndicatorMeshes = [];
    TRUCK_SLOTS.forEach((slot) => {
      const padGeo = new THREE.PlaneGeometry(0.68, 0.62);
      const padMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(slot.x, TRUCK_BED_Y + 0.03, slot.z);
      truckGroup.add(pad);
      slotIndicatorMeshes.push(pad);
    });

    // ==========================================
    // 4. CARGO BOXES (GROUND POSITIONS & DIMENSIONS)
    // ==========================================
    // All 5 brown cargo boxes rest on the platform surface by default.
    // Box center Y = PLATFORM_SURFACE_Y + height / 2.
    // Zero floating, zero clipping through platform, zero overlapping!
    const kraftMat = new THREE.MeshStandardMaterial({
      color: 0xd99b66,
      roughness: 0.68,
      metalness: 0.05,
    });
    const tapeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
    });
    const selectedOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
    });

    const createMovingBox = (w, h, d) => {
      const boxGroup = new THREE.Group();

      const mainBox = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), kraftMat);
      mainBox.castShadow = true;
      mainBox.receiveShadow = true;
      boxGroup.add(mainBox);

      // Packing tape on top seam
      const tapeTop = new THREE.Mesh(new THREE.BoxGeometry(w + 0.015, 0.03, d * 0.25), tapeMat);
      tapeTop.position.y = h / 2 + 0.01;
      boxGroup.add(tapeTop);

      // Packing tape band around sides
      const tapeBand = new THREE.Mesh(new THREE.BoxGeometry(w * 0.26, 0.03, d + 0.015), tapeMat);
      tapeBand.position.y = h / 2 + 0.01;
      boxGroup.add(tapeBand);

      // Selection indicator wireframe (hidden by default)
      const outline = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, h + 0.04, d + 0.04), selectedOutlineMat);
      outline.visible = false;
      boxGroup.add(outline);

      return { boxGroup, mainBox, outline };
    };

    // Box configurations: sizes and neat non-overlapping ground staging positions
    const BOX_CONFIGS = [
      { id: 0, size: [0.82, 0.72, 0.78], groundX: -2.45, groundZ: 1.45 },
      { id: 1, size: [0.72, 0.62, 0.68], groundX: -1.55, groundZ: 1.75 },
      { id: 2, size: [0.82, 0.72, 0.78], groundX: -2.45, groundZ: -1.45 },
      { id: 3, size: [0.68, 0.56, 0.64], groundX: -1.55, groundZ: -1.75 },
      { id: 4, size: [0.76, 0.60, 0.72], groundX: -3.3, groundZ: 0.0 },
    ];

    const cargoBoxes = BOX_CONFIGS.map((cfg) => {
      const [w, h, d] = cfg.size;
      const { boxGroup, mainBox, outline } = createMovingBox(w, h, d);

      // Exact platform surface Y-coordinate:
      const groundY = PLATFORM_SURFACE_Y + h / 2;
      const groundPos = new THREE.Vector3(cfg.groundX, groundY, cfg.groundZ);

      boxGroup.position.copy(groundPos);
      rootGroup.add(boxGroup);

      return {
        id: cfg.id,
        mesh: boxGroup,
        mainBox,
        outline,
        width: w,
        height: h,
        depth: d,
        groundPos,
        targetPos: groundPos.clone(),
        isLoaded: false,
        slotIndex: null,
      };
    });

    // Provide reset functionality
    resetCargoHandlerRef.current = () => {
      cargoBoxes.forEach((b) => {
        b.isLoaded = false;
        b.slotIndex = null;
        b.targetPos.copy(b.groundPos);
        b.outline.visible = false;
      });
      setLoadedCount(0);
    };

    // ==========================================
    // 5. INTERACTIVE DRAG & SNAP ENGINE
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let draggedBox = null;
    let dragPointerStart = { x: 0, y: 0, time: 0 };
    let isOverLoadingBay = false;

    // Mathematical plane at drag lift height
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();

    // Helper: is local coordinate inside truck's valid cargo area?
    const isInLoadingArea = (localX, localZ) => {
      return localX >= -2.45 && localX <= 0.85 && Math.abs(localZ) <= 0.95;
    };

    const updateLoadedState = () => {
      const count = cargoBoxes.filter((b) => b.isLoaded).length;
      setLoadedCount(count);
    };

    const getPointerCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      return { x, y };
    };

    const onPointerDown = (e) => {
      const coords = getPointerCoords(e);
      pointer.x = coords.x;
      pointer.y = coords.y;

      dragPointerStart = { x: e.clientX, y: e.clientY, time: Date.now() };

      raycaster.setFromCamera(pointer, camera);
      const targetMeshes = cargoBoxes.map((b) => b.mainBox);
      const intersects = raycaster.intersectObjects(targetMeshes, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const box = cargoBoxes.find((b) => b.mainBox === hitMesh);
        if (box) {
          isDragging = true;
          draggedBox = box;
          box.outline.visible = true;
          canvas.style.cursor = 'grabbing';

          // Set horizontal drag plane at slightly lifted height
          const liftHeight = box.isLoaded ? TRUCK_BED_Y + 0.6 : PLATFORM_SURFACE_Y + 0.6;
          dragPlane.constant = -liftHeight;
        }
      }
    };

    const onPointerMove = (e) => {
      const coords = getPointerCoords(e);
      pointer.x = coords.x;
      pointer.y = coords.y;

      if (isDragging && draggedBox) {
        raycaster.setFromCamera(pointer, camera);

        if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
          // Convert world intersection point into rootGroup's local coordinate space
          const localPoint = rootGroup.worldToLocal(planeIntersect.clone());

          // Constrain drag point to platform radius boundary
          const distFromCenter = Math.hypot(localPoint.x, localPoint.z);
          if (distFromCenter > 3.85) {
            const scale = 3.85 / distFromCenter;
            localPoint.x *= scale;
            localPoint.z *= scale;
          }

          // Check if hovering over truck loading area
          isOverLoadingBay = isInLoadingArea(localPoint.x, localPoint.z);

          // Update slot indicator glow
          slotIndicatorMeshes.forEach((mesh) => {
            mesh.material.opacity = isOverLoadingBay ? 0.75 : 0.25;
            mesh.material.color.setHex(isOverLoadingBay ? 0x22c55e : 0x38bdf8);
          });

          // Lift box slightly during active drag
          const dragY = isOverLoadingBay
            ? TRUCK_BED_Y + draggedBox.height / 2 + 0.25
            : PLATFORM_SURFACE_Y + draggedBox.height / 2 + 0.25;

          draggedBox.mesh.position.set(localPoint.x, dragY, localPoint.z);
        }
      } else {
        // Hover cursor effect
        raycaster.setFromCamera(pointer, camera);
        const targetMeshes = cargoBoxes.map((b) => b.mainBox);
        const intersects = raycaster.intersectObjects(targetMeshes, false);
        canvas.style.cursor = intersects.length > 0 ? 'grab' : 'default';
      }
    };

    const onPointerUp = (e) => {
      if (!isDragging || !draggedBox) {
        isDragging = false;
        draggedBox = null;
        return;
      }

      const moveDist = Math.hypot(e.clientX - dragPointerStart.x, e.clientY - dragPointerStart.y);
      const elapsed = Date.now() - dragPointerStart.time;
      const isQuickClick = moveDist < 6 && elapsed < 250;

      draggedBox.outline.visible = false;
      canvas.style.cursor = 'grab';

      // Reset slot indicator appearance
      slotIndicatorMeshes.forEach((mesh) => {
        mesh.material.opacity = 0.25;
        mesh.material.color.setHex(0x38bdf8);
      });

      if (isQuickClick) {
        // Tap-to-toggle feature for quick loading/unloading
        if (draggedBox.isLoaded) {
          // Unload: return to ground
          draggedBox.isLoaded = false;
          draggedBox.slotIndex = null;
          draggedBox.targetPos.copy(draggedBox.groundPos);
        } else {
          // Load: find first available slot
          const occupiedSlots = new Set(
            cargoBoxes.filter((b) => b.isLoaded && b.slotIndex !== null).map((b) => b.slotIndex)
          );
          const freeSlot = TRUCK_SLOTS.find((s) => !occupiedSlots.has(s.id));
          if (freeSlot) {
            draggedBox.isLoaded = true;
            draggedBox.slotIndex = freeSlot.id;
            draggedBox.targetPos.set(
              freeSlot.x,
              TRUCK_BED_Y + draggedBox.height / 2,
              freeSlot.z
            );
          }
        }
      } else {
        // Drag-and-drop resolution
        const currentPos = draggedBox.mesh.position;
        const droppedInTruck = isInLoadingArea(currentPos.x, currentPos.z);

        if (droppedInTruck) {
          // Find nearest unoccupied slot inside the truck
          const occupiedSlots = new Set(
            cargoBoxes
              .filter((b) => b.id !== draggedBox.id && b.isLoaded && b.slotIndex !== null)
              .map((b) => b.slotIndex)
          );

          let bestSlot = null;
          let minDist = Infinity;

          TRUCK_SLOTS.forEach((slot) => {
            if (!occupiedSlots.has(slot.id)) {
              const d = Math.hypot(currentPos.x - slot.x, currentPos.z - slot.z);
              if (d < minDist) {
                minDist = d;
                bestSlot = slot;
              }
            }
          });

          if (bestSlot) {
            // Snap cleanly into valid truck slot
            draggedBox.isLoaded = true;
            draggedBox.slotIndex = bestSlot.id;
            draggedBox.targetPos.set(
              bestSlot.x,
              TRUCK_BED_Y + draggedBox.height / 2,
              bestSlot.z
            );
          } else {
            // Truck is full: return to original ground position
            draggedBox.isLoaded = false;
            draggedBox.slotIndex = null;
            draggedBox.targetPos.copy(draggedBox.groundPos);
          }
        } else {
          // Dropped outside truck: return to original ground position
          draggedBox.isLoaded = false;
          draggedBox.slotIndex = null;
          draggedBox.targetPos.copy(draggedBox.groundPos);
        }
      }

      isDragging = false;
      draggedBox = null;
      updateLoadedState();
    };

    const onPointerCancel = () => {
      if (draggedBox) {
        draggedBox.outline.visible = false;
        draggedBox.targetPos.copy(
          draggedBox.isLoaded && draggedBox.slotIndex !== null
            ? new THREE.Vector3(
                TRUCK_SLOTS[draggedBox.slotIndex].x,
                TRUCK_BED_Y + draggedBox.height / 2,
                TRUCK_SLOTS[draggedBox.slotIndex].z
              )
            : draggedBox.groundPos
        );
      }
      isDragging = false;
      draggedBox = null;
      canvas.style.cursor = 'default';
      slotIndicatorMeshes.forEach((mesh) => {
        mesh.material.opacity = 0.25;
        mesh.material.color.setHex(0x38bdf8);
      });
      updateLoadedState();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);

    // ==========================================
    // 6. ANIMATION & RENDER LOOP
    // ==========================================
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Only auto-rotate when not paused and not actively dragging
      if (!pausedRef.current && !isDragging) {
        rootGroup.rotation.y += delta * 0.22;
      }

      // Smoothly interpolate boxes to target positions
      cargoBoxes.forEach((b) => {
        if (!isDragging || draggedBox !== b) {
          b.mesh.position.lerp(b.targetPos, 0.22);
        }
      });

      // Camera preset transitions
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
      const newH = container.clientHeight || 410;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [theme]);

  const handleResetCargo = useCallback(() => {
    if (resetCargoHandlerRef.current) {
      resetCargoHandlerRef.current();
    }
  }, []);

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

      {/* Top Left Simulation Info & Live Status Badge */}
      <div
        className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1"
        style={{ zIndex: 10, maxWidth: 'calc(100% - 24px)' }}
      >
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-2 shadow-sm"
          style={{
            backgroundColor:
              theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--mpms-border)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--mpms-text)',
          }}
        >
          <span
            className="rounded-circle d-inline-block"
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: loadedCount === 5 ? '#22c55e' : '#0284c7',
              boxShadow: loadedCount === 5 ? '0 0 6px #22c55e' : '0 0 6px #0284c7',
            }}
          />
          <span>3D Fleet &amp; Cargo Load Simulation</span>
        </div>

        <div
          className="d-inline-flex align-items-center gap-2 px-2 py-1 rounded-2 shadow-sm"
          style={{
            backgroundColor:
              theme === 'dark' ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--mpms-border)',
            fontSize: '0.72rem',
            width: 'fit-content',
          }}
        >
          <span className="badge rounded-pill bg-primary px-2 py-0.5 text-white">
            <Package size={11} className="me-1 d-inline" />
            {loadedCount}/5 Loaded
          </span>
          <span style={{ color: 'var(--mpms-text-muted)' }}>
            {loadedCount === 5
              ? 'Truck capacity full!'
              : 'Drag boxes into truck cargo bay to load'}
          </span>
        </div>
      </div>

      {/* Bottom Right Controls: Play/Pause, View Preset, Reset Cargo */}
      <div
        className="position-absolute bottom-0 end-0 m-3 d-flex align-items-center gap-1 p-1 rounded-3 shadow-sm"
        style={{
          backgroundColor:
            theme === 'dark' ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(6px)',
          border: '1px solid var(--mpms-border)',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          className="btn btn-sm py-1 px-2 d-inline-flex align-items-center gap-1"
          style={{ color: 'var(--mpms-text)', fontSize: '0.75rem' }}
          title={isPaused ? 'Resume 3D Rotation' : 'Pause 3D Rotation'}
        >
          {isPaused ? <Play size={13} /> : <Pause size={13} />}
          <span>{isPaused ? 'Play' : 'Pause'}</span>
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset((c) => (c === 'iso' ? 'side' : 'iso'))}
          className="btn btn-sm py-1 px-2 d-inline-flex align-items-center gap-1"
          style={{ color: 'var(--mpms-text)', fontSize: '0.75rem' }}
          title="Switch 3D Camera Perspective"
        >
          <RotateCcw size={13} />
          <span>{cameraPreset === 'iso' ? 'Side View' : 'Isometric'}</span>
        </button>

        <button
          type="button"
          onClick={handleResetCargo}
          className="btn btn-sm py-1 px-2 d-inline-flex align-items-center gap-1"
          style={{
            color: loadedCount > 0 ? '#0284c7' : 'var(--mpms-text-muted)',
            fontSize: '0.75rem',
            fontWeight: loadedCount > 0 ? 600 : 400,
          }}
          title="Return all cargo boxes to ground"
        >
          <RefreshCw size={12} />
          <span>Reset Cargo</span>
        </button>
      </div>
    </div>
  );
};

export default LogisticsHero3D;
