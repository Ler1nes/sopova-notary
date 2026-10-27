import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type Variant = 'hero' | 'principles';

interface ScalesSceneOptions {
  variant?: Variant;
  reducedMotion?: boolean;
}

/**
 * РџСЂРѕС†РµРґСѓСЂРЅР°СЏ РјРѕРґРµР»СЊ РІРµСЃРѕРІ: С‚С‘РјРЅР°СЏ СЃС‚Р°Р»СЊ + Р»Р°С‚СѓРЅСЊ.
 * РћРґРЅР° СЃС†РµРЅР° РЅР° РєР°РЅРІР°СЃ, СЂРµРЅРґРµСЂ РѕСЃС‚Р°РЅР°РІР»РёРІР°РµС‚СЃСЏ, РєРѕРіРґР° СЃРµРєС†РёСЏ РІРЅРµ РІСЊСЋРїРѕСЂС‚Р°.
 */
export class ScalesScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly variant: Variant;
  private readonly reducedMotion: boolean;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly root = new THREE.Group();
  private readonly beam = new THREE.Group();
  private readonly pans: THREE.Group[] = [];
  private readonly clock = new THREE.Clock();
  private readonly startTime = performance.now();
  private readonly pointer = new THREE.Vector2();
  private readonly pointerTarget = new THREE.Vector2();

  private dust: THREE.Points | null = null;
  private dustPositions: Float32Array | null = null;
  private raf = 0;
  private running = false;
  private progress = 0;
  private targetProgress = 0;
  private baseZ = 6.7;
  private intro = 0;
  private resizeObserver: ResizeObserver | null = null;
  private onPointerMove: ((e: PointerEvent) => void) | null = null;

  private disposed = false;

  constructor(canvas: HTMLCanvasElement, options: ScalesSceneOptions = {}) {
    this.canvas = canvas;
    this.variant = options.variant ?? 'hero';
    this.reducedMotion = options.reducedMotion ?? false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60);

    this.setupEnvironment();
    this.buildModel();
    this.setupLights();
    this.setupDust();
    this.resize();
    this.bindEvents();
    this.renderScene(0);

    if (!this.reducedMotion) {
      this.start();
    }
  }

  /* ------------------------------------------------------------------ */

  private setupEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04);
    this.scene.environment = env.texture;
    this.scene.environmentIntensity = 0.72;
    pmrem.dispose();
  }

  private setupLights() {
    const key = new THREE.DirectionalLight(0xffe2bd, 3.1);
    key.position.set(4.5, 6.5, 4.5);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x8fa9d8, 2.4);
    rim.position.set(-5.5, 3.2, -3.6);
    this.scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffffff, 0.42);
    fill.position.set(-1.5, -2.5, 3.5);
    this.scene.add(fill);

    const glow = new THREE.PointLight(0xc9a25e, 8, 7, 2);
    glow.position.set(2.1, 1.5, 2.2);
    this.scene.add(glow);
  }

  private buildModel() {
    const steel = new THREE.MeshStandardMaterial({
      color: 0x2c3037,
      metalness: 1,
      roughness: 0.32,
      envMapIntensity: 1.15,
    });
    const steelDark = new THREE.MeshStandardMaterial({
      color: 0x14171b,
      metalness: 1,
      roughness: 0.42,
      envMapIntensity: 0.9,
    });
    const brass = new THREE.MeshStandardMaterial({
      color: 0xc9a25e,
      metalness: 1,
      roughness: 0.22,
      envMapIntensity: 1.5,
    });
    const brassDark = new THREE.MeshStandardMaterial({
      color: 0x9a7538,
      metalness: 1,
      roughness: 0.3,
      envMapIntensity: 1.2,
    });
    const steelSide = steel.clone();
    steelSide.side = THREE.DoubleSide;
    const chainMat = new THREE.MeshStandardMaterial({
      color: 0x8f6e3c,
      metalness: 1,
      roughness: 0.34,
      envMapIntensity: 1.3,
    });

    this.root.position.y = -0.02;
    this.root.rotation.y = -0.4;
    this.scene.add(this.root);

    /* --- base --- */
    const baseProfile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.96, 0.0),
      new THREE.Vector2(1.0, 0.022),
      new THREE.Vector2(0.985, 0.052),
      new THREE.Vector2(0.78, 0.072),
      new THREE.Vector2(0.74, 0.105),
      new THREE.Vector2(0.46, 0.13),
      new THREE.Vector2(0.4, 0.17),
      new THREE.Vector2(0.2, 0.2),
      new THREE.Vector2(0.0, 0.205),
    ];
    const base = new THREE.Mesh(new THREE.LatheGeometry(baseProfile, 96), steelDark);
    this.root.add(base);

    const baseRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.008, 16, 96),
      brassDark,
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.108;
    this.root.add(baseRing);

    /* --- column --- */
    const column = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.05, 1.92, 48, 1),
      steel,
    );
    shaft.position.y = 0.205 + 1.92 / 2;
    column.add(shaft);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.05, 0.09, 48), brass);
    collar.position.y = 0.26;
    column.add(collar);

    const collarTop = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.028, 48), brassDark);
    collarTop.position.y = 1.86;
    column.add(collarTop);

    const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.052, 0.1, 48), brass);
    capital.position.y = 2.12;
    column.add(capital);

    const capitalLip = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.02, 48), brassDark);
    capitalLip.position.y = 2.18;
    column.add(capitalLip);
    this.root.add(column);

    /* --- beam --- */
    this.beam.position.y = 2.2;
    this.root.add(this.beam);

    const beamBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.019, 0.019, 2.34, 32),
      steel,
    );
    beamBar.rotation.z = Math.PI / 2;
    this.beam.add(beamBar);

    const beamCore = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 32), brass);
    beamCore.rotation.z = Math.PI / 2;
    this.beam.add(beamCore);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.045, 32, 24), brass);
    finial.position.y = 0.055;
    this.beam.add(finial);

    const finialStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 16), brassDark);
    finialStem.position.y = 0.01;
    this.beam.add(finialStem);

    /* --- pans + chains --- */
    const dishProfile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.09, 0.004),
      new THREE.Vector2(0.19, 0.014),
      new THREE.Vector2(0.29, 0.038),
      new THREE.Vector2(0.35, 0.072),
      new THREE.Vector2(0.372, 0.098),
      new THREE.Vector2(0.362, 0.108),
    ];
    const dishGeo = new THREE.LatheGeometry(dishProfile, 80);

    const sides: Array<-1 | 1> = [-1, 1];
    sides.forEach((side) => {
      const endX = side * 1.17;

      const beamCap = new THREE.Mesh(new THREE.SphereGeometry(0.036, 24, 18), brass);
      beamCap.position.set(endX, 0, 0);
      this.beam.add(beamCap);

      const hanger = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.007, 12, 24), brassDark);
      hanger.position.set(endX, -0.035, 0);
      hanger.rotation.y = Math.PI / 2;
      this.beam.add(hanger);

      const pan = new THREE.Group();
      pan.position.set(endX, 1.5, 0);

      const dish = new THREE.Mesh(dishGeo, steelSide);
      pan.add(dish);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.368, 0.0055, 12, 96), brass);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.104;
      pan.add(rim);

      const top = new THREE.Vector3(0, 0.7, 0);
      for (let i = 0; i < 3; i += 1) {
        const angle = Math.PI / 2 + (i * Math.PI * 2) / 3;
        const rimPoint = new THREE.Vector3(Math.cos(angle) * 0.33, 0.1, Math.sin(angle) * 0.33);
        const dir = new THREE.Vector3().subVectors(top, rimPoint);
        const length = dir.length();
        const chain = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0032, 0.0032, length, 8, 1),
          chainMat,
        );
        chain.position.copy(rimPoint).add(dir.clone().multiplyScalar(0.5));
        chain.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        pan.add(chain);
      }

      this.root.add(pan);
      this.pans.push(pan);
    });

    /* --- ground shadow + warm halo --- */
    const shadowTexture = this.createRadialTexture('rgba(0,0,0,0.9)', 'rgba(0,0,0,0)');
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 4.6),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    this.scene.add(shadow);

    const haloTexture = this.createRadialTexture('rgba(201,162,94,0.5)', 'rgba(201,162,94,0)');
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({
        map: haloTexture,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.03;
    this.scene.add(halo);
  }

  private createRadialTexture(inner: string, outer: string) {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, inner);
      g.addColorStop(0.55, inner.replace(/[\d.]+\)$/, '0.16)'));
      g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  private setupDust() {
    const count = this.variant === 'principles' ? 340 : 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 1] = Math.random() * 3.2 - 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.4;
    }
    this.dustPositions = positions;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xe7d3ab,
      size: 0.014,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.dust = new THREE.Points(geometry, material);
    this.scene.add(this.dust);
  }

  private bindEvents() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement ?? this.canvas);

    if (this.variant === 'hero') {
      this.onPointerMove = (event: PointerEvent) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        this.pointerTarget.set((event.clientX / w) * 2 - 1, (event.clientY / h) * 2 - 1);
      };
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    }
  }

  private resize() {
    const parent = this.canvas.parentElement;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;
    if (!width || !height) return;

    const maxDpr = this.variant === 'principles' ? 1.4 : width < 700 ? 1.6 : 1.8;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;

    const aspect = this.camera.aspect;
    const viewport = window.innerWidth;
    if (this.variant === 'principles') {
      this.baseZ = aspect < 1 ? 7.4 : 6.15;
      this.camera.position.set(0.35, 2.1, this.baseZ);
      this.root.position.x = aspect > 1.05 ? 1 : 0;
    } else {
      this.baseZ = viewport < 680 ? 9.3 : viewport < 1100 ? 7.8 : 6.7;
      this.camera.position.set(0, 2.15, this.baseZ);
      this.root.position.x = 0;
    }
    this.camera.lookAt(0, 1.32, 0);
    this.camera.updateProjectionMatrix();
    this.renderScene(this.clock.getElapsedTime());
  }

  /* ------------------------------------------------------------------ */

  setProgress(value: number) {
    this.targetProgress = THREE.MathUtils.clamp(value, 0, 1);
    if (this.reducedMotion) {
      this.progress = this.targetProgress;
      this.renderScene(0);
    }
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.clock.start();
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(this.clock.getDelta(), 0.05);
      this.update(dt);
      this.renderScene(this.clock.getElapsedTime());
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private update(dt: number) {
    const t = (performance.now() - this.startTime) / 1000;

    this.progress += (this.targetProgress - this.progress) * Math.min(dt * 4.2, 1);
    this.pointer.lerp(this.pointerTarget, Math.min(dt * 3.4, 1));

    if (this.intro < 1) {
      this.intro = Math.min(this.intro + dt / 1.5, 1);
    }
    const introEase = 1 - Math.pow(1 - this.intro, 3);

    const isHero = this.variant === 'hero';
    const baseSpin = isHero ? -0.4 + this.progress * 0.75 : -0.55 + this.progress * 3.4;
    const idle = this.reducedMotion ? 0 : Math.sin(t * 0.32) * 0.045;

    this.root.rotation.y = baseSpin + idle + this.pointer.x * (isHero ? 0.16 : 0.05);
    this.root.rotation.x = this.pointer.y * (isHero ? 0.045 : 0.02);
    this.root.rotation.z = Math.sin(t * 0.26) * 0.006;

    this.root.position.y = -0.3 * (1 - introEase);
    this.root.scale.setScalar(0.94 + 0.06 * introEase);

    const camZ = isHero
      ? this.baseZ - this.progress * 0.5 + (1 - introEase) * 0.35
      : this.baseZ - this.progress * 0.7;
    this.camera.position.z += (camZ - this.camera.position.z) * Math.min(dt * 3, 1);
    this.camera.position.y = 2.15 + this.progress * 0.32;
    this.camera.position.x = (isHero ? 0 : 0.35) + this.pointer.x * (isHero ? 0.12 : 0);
    this.camera.lookAt(0, 1.32 + this.progress * 0.22, 0);

    this.pans.forEach((pan, index) => {
      const phase = index === 0 ? -1 : 1;
      pan.rotation.z = Math.sin(t * 0.55 + index * 1.7) * 0.012;
      pan.rotation.x = Math.sin(t * 0.42 + index) * 0.008 * phase;
      if (this.variant === 'principles') {
        pan.position.y = 1.5 + Math.sin(t * 0.5 + index * 2) * 0.006 - this.progress * 0.04;
      }
    });

    this.beam.rotation.z = Math.sin(t * 0.38) * 0.006;

    if (this.dust && this.dustPositions) {
      const pos = this.dust.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += dt * 0.035;
        arr[i] += Math.sin(t * 0.25 + i) * 0.00045;
        if (arr[i + 1] > 3.1) arr[i + 1] = -0.15;
      }
      pos.needsUpdate = true;
      this.dust.rotation.y = t * 0.014;
    }
  }

  private renderScene(_time: number) {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.resizeObserver?.disconnect();
    if (this.onPointerMove) {
      window.removeEventListener('pointermove', this.onPointerMove);
    }
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else {
        material?.dispose();
      }
    });
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }
}

