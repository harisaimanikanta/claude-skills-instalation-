// Demo made with the threejs-3d-video skill: a glossy knot over a rippling ring of pillars.
export const duration = 8;

const smooth = p => p * p * (3 - 2 * p);
function mulberry32(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

export async function setup({ THREE, canvas, width, height }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d12);
  scene.fog = new THREE.Fog(0x0b0d12, 9, 22);
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0x9fb8ff, 0x1a1410, 0.5));
  const key = new THREE.DirectionalLight(0xfff1e0, 3);
  key.position.set(5, 8, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 });
  scene.add(key);
  const rim = new THREE.PointLight(0x5aa0ff, 30, 20);
  rim.position.set(-4, 3, -4);
  scene.add(rim);
  const warm = new THREE.PointLight(0xff8a5c, 25, 20);
  warm.position.set(4, 1.5, -3);
  scene.add(warm);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 64),
    new THREE.MeshStandardMaterial({ color: 0x15181f, roughness: 0.35, metalness: 0.2 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.26, 220, 32),
    new THREE.MeshPhysicalMaterial({ color: 0xd97757, metalness: 0.6, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 }));
  knot.castShadow = true;
  scene.add(knot);

  const N = 36, pillars = [];
  const pillarGeo = new THREE.BoxGeometry(0.28, 1, 0.28);
  for (let i = 0; i < N; i++) {
    const a = i / N * Math.PI * 2;
    const m = new THREE.Mesh(pillarGeo, new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.58 + 0.08 * Math.sin(a), 0.5, 0.55), roughness: 0.4, metalness: 0.3 }));
    m.position.set(Math.cos(a) * 3.2, 0, Math.sin(a) * 3.2);
    m.rotation.y = -a;
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
    pillars.push({ m, a });
  }

  const rnd = mulberry32(7), P = 400, pos = new Float32Array(P * 3);
  for (let i = 0; i < P; i++) {
    const r = 5 + rnd() * 9, a = rnd() * Math.PI * 2;
    pos.set([Math.cos(a) * r, 0.5 + rnd() * 7, Math.sin(a) * r], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffd9b8, size: 0.04, transparent: true, opacity: 0.8 }));
  scene.add(dust);

  return {
    render(t) {
      const p = t / duration;
      const intro = smooth(Math.min(1, t / 2));

      knot.position.y = 1.6 + 0.12 * Math.sin(t * 1.6);
      knot.rotation.set(t * 0.5, t * 0.8, 0);
      knot.scale.setScalar(0.4 + 0.6 * intro);

      for (const { m, a } of pillars) {
        const wave = 0.5 + 0.5 * Math.sin(a * 3 - t * 2.5);
        const h = (0.25 + 1.2 * wave) * intro;
        m.scale.y = Math.max(0.001, h);
        m.position.y = h / 2;
      }
      dust.rotation.y = t * 0.05;

      const orbit = -0.6 + smooth(p) * 1.8;
      const dist = 10 - 2 * smooth(p);
      camera.position.set(Math.sin(orbit) * dist, 3.2 + 1.5 * (1 - intro), Math.cos(orbit) * dist);
      camera.lookAt(0, 1.1, 0);
      renderer.render(scene, camera);
    },
  };
}
