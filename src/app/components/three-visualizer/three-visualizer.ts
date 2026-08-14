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
    
    // Dispose resources to prevent WebGL memory leaks
    if (this.group) {
      this.group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
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
    camera.position.z = 5;
    this.camera = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x22C55E, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);
    this.group = group;

    // 1. Torus Ring (Floating Orbit)
    const torusGeo = new THREE.TorusGeometry(2, 0.05, 16, 100);
    const torusMat = new THREE.MeshPhongMaterial({ color: 0x22C55E, transparent: true, opacity: 0.6 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    group.add(torus);

    // 2. Central Polyhedron (Data Core)
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshPhongMaterial({ color: 0x1F2937, flatShading: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);
    this.core = core;

    // 3. Floating Particles (Data Bits)
    const particleGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x22C55E });
    for (let i = 0; i < 40; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      p.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      group.add(p);
    }

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      
      if (this.group) {
        this.group.rotation.y += 0.002;
        this.group.rotation.x += 0.001;
      }
      
      if (this.core) {
        this.core.rotation.y -= 0.01;
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
    // Run initial resize to verify aspect ratio
    setTimeout(() => this.resizeListener(), 100);
  }
}
