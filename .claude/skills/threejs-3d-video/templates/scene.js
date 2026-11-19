// Scene template for the threejs-3d-video skill.
// Contract: export `duration` (seconds) and `setup({ THREE, canvas, width, height })`
// returning `{ render(t) }`, where t is time in seconds. Everything must derive from t
// (no Date.now / performance.now / Math.random without a seed) so every frame is reproducible.

export const duration = 6;

export async function setup({ THREE, canvas, width, height }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101418);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x202020, 0.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(4, 6, 3);
  sun.castShadow = true;
  scene.add(sun);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0x22262c }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xd97757 }));
  box.position.y = 0.5;
  box.castShadow = true;
  scene.add(box);

  return {
    render(t) {
      const p = t / duration;                       // 0 → 1 over the clip
      box.rotation.y = p * Math.PI * 2;
      const a = p * Math.PI * 0.5;
      camera.position.set(Math.sin(a) * 5, 2.5, Math.cos(a) * 5);
      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
    },
  };
}
