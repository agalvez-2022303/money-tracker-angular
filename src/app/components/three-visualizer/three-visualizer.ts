import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-visualizer',
  standalone: true,
  template: `<div #container class="w-full h-full"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ThreeVisualizer implements AfterViewInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private animationFrameId: number | null = null;
  private group: THREE.Group | null = null;
  private core: THREE.Mesh | null = null;
  private floatingObjects: THREE.Object3D[] = [];
  private clock = new THREE.Clock();

  private resizeListener = () => {
    if (!this.containerRef || !this.camera || !this.renderer) return;
    const container = this.containerRef.nativeElement;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  ngAfterViewInit() {
    this.initThree();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.group) {
      this.group.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          if ((object as THREE.Mesh).geometry) (object as THREE.Mesh).geometry.dispose();
          const mat = (object as THREE.Mesh).material;
          if (mat) {
            if (Array.isArray(mat)) {
              mat.forEach((m) => m.dispose());
            } else {
              mat.dispose();
            }
          }
        }
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree() {
    const container = this.containerRef.nativeElement;
    const w = container.clientWidth || 500;
    const h = container.clientHeight || 500;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 6;
    this.camera = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x22C55E, 1.5, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06B6D4, 0.8, 100);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xA855F7, 0.5, 100);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

    // Main group
    const group = new THREE.Group();
    scene.add(group);
    this.group = group;

    // === CORE: Central Icosahedron ===
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x1F2937,
      flatShading: true,
      shininess: 80
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);
    this.core = core;

    // Core wireframe overlay
    const coreWireGeo = new THREE.IcosahedronGeometry(0.72, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0x22C55E,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat);
    group.add(coreWire);
    this.floatingObjects.push(coreWire);

    // === ORBITAL RINGS ===
    const ringConfigs = [
      { radius: 2.0, tube: 0.02, color: 0x22C55E, opacity: 0.6, rotX: 0, rotY: 0, rotZ: 0 },
      { radius: 2.5, tube: 0.015, color: 0x06B6D4, opacity: 0.4, rotX: Math.PI / 3, rotY: 0, rotZ: Math.PI / 6 },
      { radius: 3.0, tube: 0.01, color: 0xA855F7, opacity: 0.3, rotX: -Math.PI / 4, rotY: Math.PI / 5, rotZ: 0 },
      { radius: 1.5, tube: 0.025, color: 0x22C55E, opacity: 0.5, rotX: Math.PI / 2, rotY: 0, rotZ: Math.PI / 4 },
    ];

    ringConfigs.forEach((cfg) => {
      const torusGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
      const torusMat = new THREE.MeshPhongMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        shininess: 100
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);
      group.add(torus);
      this.floatingObjects.push(torus);
    });

    // === FLOATING WIREFRAME POLYHEDRA (crypto-style) ===
    const polyConfigs = [
      { geo: new THREE.OctahedronGeometry(0.3, 0), pos: [2.5, 1.5, -1], color: 0x06B6D4, speed: 0.8 },
      { geo: new THREE.DodecahedronGeometry(0.25, 0), pos: [-2.2, -1.8, 0.5], color: 0x22C55E, speed: 1.2 },
      { geo: new THREE.TetrahedronGeometry(0.2, 0), pos: [1.8, -2.0, 1.5], color: 0xA855F7, speed: 1.0 },
      { geo: new THREE.OctahedronGeometry(0.15, 0), pos: [-1.5, 2.2, -0.5], color: 0xFBBF24, speed: 0.9 },
      { geo: new THREE.IcosahedronGeometry(0.2, 0), pos: [3.0, -0.5, -1.5], color: 0x22C55E, speed: 1.1 },
      { geo: new THREE.DodecahedronGeometry(0.18, 0), pos: [-2.8, 0.8, 1.0], color: 0x06B6D4, speed: 0.7 },
    ];

    polyConfigs.forEach((cfg) => {
      // Wireframe version
      const wireMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const wireMesh = new THREE.Mesh(cfg.geo.clone(), wireMat);
      wireMesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      wireMesh.userData['speed'] = cfg.speed;
      wireMesh.userData['baseY'] = cfg.pos[1];
      group.add(wireMesh);
      this.floatingObjects.push(wireMesh);

      // Solid inner version (smaller, subtle)
      const solidMat = new THREE.MeshPhongMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.15,
        flatShading: true
      });
      const solidMesh = new THREE.Mesh(cfg.geo.clone(), solidMat);
      solidMesh.position.copy(wireMesh.position);
      solidMesh.scale.setScalar(0.7);
      solidMesh.userData['speed'] = cfg.speed;
      solidMesh.userData['baseY'] = cfg.pos[1];
      group.add(solidMesh);
      this.floatingObjects.push(solidMesh);
    });

    // === FLOATING PARTICLES (Data Bits) ===
    const particleGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const particleColors = [0x22C55E, 0x06B6D4, 0xA855F7, 0xFBBF24];

    for (let i = 0; i < 80; i++) {
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const particleMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.6
      });
      const p = new THREE.Mesh(particleGeo, particleMat);
      const radius = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      p.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      p.userData['orbitSpeed'] = 0.001 + Math.random() * 0.003;
      p.userData['orbitRadius'] = radius;
      p.userData['orbitTheta'] = theta;
      p.userData['orbitPhi'] = phi;
      group.add(p);
      this.floatingObjects.push(p);
    }

    // === NETWORK LINES (connecting some particles) ===
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x22C55E,
      transparent: true,
      opacity: 0.08
    });

    for (let i = 0; i < 20; i++) {
      const points: THREE.Vector3[] = [];
      const count = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < count; j++) {
        const r = 1.5 + Math.random() * 3.5;
        points.push(new THREE.Vector3(
          (Math.random() - 0.5) * r * 2,
          (Math.random() - 0.5) * r * 2,
          (Math.random() - 0.5) * r * 2
        ));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
    }

    // === ANIMATION LOOP ===
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      const elapsed = this.clock.getElapsedTime();

      // Slow global rotation
      if (this.group) {
        this.group.rotation.y += 0.0015;
        this.group.rotation.x = Math.sin(elapsed * 0.1) * 0.05;
      }

      // Core rotation
      if (this.core) {
        this.core.rotation.y -= 0.008;
        this.core.rotation.x += 0.003;
      }

      // Animate floating objects
      this.floatingObjects.forEach((obj) => {
        if (obj.userData['speed'] !== undefined) {
          obj.rotation.x += 0.005 * obj.userData['speed'];
          obj.rotation.y += 0.008 * obj.userData['speed'];

          // Gentle float up and down
          if (obj.userData['baseY'] !== undefined) {
            obj.position.y = obj.userData['baseY'] + Math.sin(elapsed * obj.userData['speed']) * 0.15;
          }
        }

        // Orbit particles
        if (obj.userData['orbitSpeed'] !== undefined) {
          obj.userData['orbitTheta'] += obj.userData['orbitSpeed'];
          const r = obj.userData['orbitRadius'];
          const theta = obj.userData['orbitTheta'];
          const phi = obj.userData['orbitPhi'];
          obj.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          );
        }
      });

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
    setTimeout(() => this.resizeListener(), 100);
  }
}
