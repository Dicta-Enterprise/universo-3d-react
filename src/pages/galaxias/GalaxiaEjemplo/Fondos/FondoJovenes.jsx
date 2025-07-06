import * as THREE from 'three';

export default function FondoJovenes(scene) {
  const objetosAnimables = [];

  // 🔷 Color de fondo
  scene.background = new THREE.Color('#0a0014');

  // 💡 Luces
  scene.add(new THREE.AmbientLight(0x2a1f3d, 1.5));
  const pointLights = [
    { color: 0x7b2fdd, position: [50, 0, 30] },
    { color: 0xff3366, position: [-50, 0, 30] },
    { color: 0x00ffcc, position: [0, 50, 30] },
  ];
  pointLights.forEach(({ color, position }) => {
    const light = new THREE.PointLight(color, 2, 100);
    light.position.set(...position);
    scene.add(light);
  });

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 10, -50);
  scene.add(dirLight);

  // 🌠 Estrellas brillantes (más grandes y cercanas)
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const starPositions = [];
  const starColors = [];
  const opacityOffsets = [];

  for (let i = 0; i < 1800; i++) {
    const x = (Math.random() - 0.5) * 70;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 20; // Antes -0.9 * 50
    starPositions.push(x, y, z);
    starColors.push(1, 1, 1);
    opacityOffsets.push(Math.random() * Math.PI * 2);
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  stars.userData.opacityOffsets = opacityOffsets;

  scene.add(stars);
  objetosAnimables.push({
    userData: {
      animar: () => {
        const time = Date.now() * 0.001;
        const colors = stars.geometry.attributes.color.array;
        for (let i = 0; i < opacityOffsets.length; i++) {
          const offset = opacityOffsets[i];
          const opacity = 0.5 + Math.sin(time * 0.5 + offset) * 0.2;
          const i3 = i * 3;
          colors[i3] = colors[i3 + 1] = colors[i3 + 2] = opacity;
        }
        stars.geometry.attributes.color.needsUpdate = true;
      },
    },
  });

  // 🪐 Planetas (más grandes y más cerca)
  const planetas = [];
  const numPlanetas = 60;
  const minSeparation = 22;

  for (let i = 0; i < numPlanetas; i++) {
    const size = Math.random() * 1.5 + 2; // Tamaño aumentado
    const color = Math.random() * 0xffffff;
    let position;
    let tooClose;

    do {
      const x = (Math.random() - 0.5) * 620;
      const y = (Math.random() - 0.5) * 320;
      const z = -200; // Antes -200
      position = new THREE.Vector3(x, y, z);
      tooClose = planetas.some(p => position.distanceTo(p.position) < minSeparation);
    } while (tooClose);

    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color,
      shininess: 50,
      emissive: color,
      emissiveIntensity: 0.3,
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.position.copy(position);

    if (Math.random() < 0.3) {
      const ringGeo = new THREE.RingGeometry(size * 1.5, size * 2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 4;
      planet.add(ring);

      objetosAnimables.push({
        userData: {
          animar: () => {
            ring.rotation.z += 0.009;
          },
        },
      });
    }

    scene.add(planet);
    planetas.push(planet);

    objetosAnimables.push({
      userData: {
        animar: () => {
          planet.rotation.y += 0.009;
        },
      },
    });
  }

  return objetosAnimables;
}