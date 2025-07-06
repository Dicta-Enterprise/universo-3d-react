import * as THREE from 'three';

export default function FondoAdultos(escena) {
  escena.background = new THREE.Color(0x000000);
  const objetosAnimables = [];

  // ⭐ Estrellas lejanas que palpitan con fade
  const createEstrellasLejanas = () => {
  const starCount = 4000;
  const positions = [];

  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 500;
    const y = (Math.random() - 0.5) * 500;
    const z = (Math.random() - 0.5) * 500;
    positions.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.7,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });

  const estrellas = new THREE.Points(geometry, material);
  escena.add(estrellas);

  objetosAnimables.push({
    animar: () => {
      // Hace que toda la nube de estrellas pulse suavemente
      material.opacity = 0.4 + Math.sin(Date.now() * 0.002) * 0.6;
    },
  });
};

  // 🌟 Estrellas doradas extruidas
  const createEstrellasDoradas = () => {
    const shape = new THREE.Shape();
    const s = 0.5;
    shape.moveTo(0, s);
    shape.quadraticCurveTo(s * 0.15, s * 0.5, s * 0.3, s * 0.3);
    shape.quadraticCurveTo(s * 0.5, s * 0.15, s, 0);
    shape.quadraticCurveTo(s * 0.5, -s * 0.15, s * 0.3, -s * 0.3);
    shape.quadraticCurveTo(s * 0.15, -s * 0.5, 0, -s);
    shape.quadraticCurveTo(-s * 0.15, -s * 0.5, -s * 0.3, -s * 0.3);
    shape.quadraticCurveTo(-s * 0.5, -s * 0.15, -s, 0);
    shape.quadraticCurveTo(-s * 0.5, s * 0.15, -s * 0.3, s * 0.3);
    shape.quadraticCurveTo(-s * 0.15, s * 0.5, 0, s);

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: s * 0.3, bevelEnabled: false });

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xFFD700) },
        edgeColor: { value: new THREE.Color(0x000000) },
        emissiveColor: { value: new THREE.Color(0xFFD700) },
        emissiveIntensity: { value: 1.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 color;
        uniform vec3 edgeColor;
        uniform vec3 emissiveColor;
        uniform float emissiveIntensity;
        void main() {
          float intensity = pow(2.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 baseColor = mix(color, edgeColor, intensity);
          vec3 emissive = emissiveColor * emissiveIntensity;
          gl_FragColor = vec4(baseColor + emissive, 1.0);
        }
      `,
    });

    const stars = [
      [1.6, 0, 0, -1], [1.4, 10, 10, -2], [1.5, -10, 10, -2],
      [1.0, 0, 14, -2], [0.9, 14, 0, -2], [1.0, -14, 0, -2],
      [0.7, 18, 6, -3], [0.6, -18, -6, -3], [0.8, 6, -18, -3],
      [0.6, -6, 18, -3], [1.2, 3, 0, 0], [1.2, -3, 0, 0],
    ];

    stars.forEach(([size, x, y, z]) => {
      const estrella = new THREE.Mesh(geometry, material.clone());
      estrella.scale.set(size, size, size);
      estrella.position.set(x, y, z);
      estrella.userData.phase = Math.random() * Math.PI * 2;
      escena.add(estrella);

      objetosAnimables.push({
        animar: () => {
          const pulse = 1 + 0.06 * Math.sin(performance.now() * 0.001 + estrella.userData.phase);
          estrella.scale.set(pulse, pulse, pulse);
        },
      });
    });
  };

  // 🪐 Planetas separados y variados
  const createPlanetas = () => {
    const planetas = [
      [0.8, 0xC3E4F5,  { x: -24, y: 16, z: -2 }],
      [0.6, 0xC3E4F5,  { x: 22, y: -14, z: -1 }],
      [0.7, 0xC3E4F5,  { x: 0,   y: 26, z: -1 }],
      [0.5, 0xC3E4F5,  { x: 0,  y: -28, z: -1 }],
      [0.9, 0xC3E4F5,  { x: -18, y: -20, z: -2 }],
      [0.6, 0xC3E4F5,  { x: 20,  y: 20, z: -2 }],
      [0.7, 0xC3E4F5,  { x: -26, y: 0,  z: -1 }],
      [0.8, 0xC3E4F5,  { x: 26,  y: 0,  z: -1 }],
      [0.4, 0xC3E4F5,  { x: -10, y: 8,  z: 1 }],
      [0.5, 0xFFD700,  { x: 8,  y: -6, z: 0 }],
      [0.6, 0xFFD700,  { x: -14, y: -16, z: -1 }],
      [0.4, 0xFFD700,  { x: 16, y: 6,  z: -1 }],
    ];

    planetas.forEach(([size, color, pos]) => {
      const geo = new THREE.SphereGeometry(size, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color });
      const planeta = new THREE.Mesh(geo, mat);
      planeta.position.set(pos.x, pos.y, pos.z);
      escena.add(planeta);

      objetosAnimables.push({
        animar: () => {
          planeta.rotation.y += 0.002;
        },
      });
    });
  };

  const createCirculos = () => {
    const posiciones = [
      [-12, 6, -1], [10, -8, -1], [0, 14, 0],
      [-8, -10, 0], [6, 10, -0.5], [14, 0, -1],
      [-14, 0, -1], [4, -14, 0], [-4, 12, 1],
    ];

    posiciones.forEach((pos, i) => {
      const base = 0.5 + Math.random() * 0.4;
      const grosor = base * 0.15;

      const geometry = new THREE.RingGeometry(base, base + grosor, 64);
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xFFD700 : 0xffffff,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.25,
        side: THREE.DoubleSide,
      });

      const circulo = new THREE.Mesh(geometry, material);
      circulo.position.set(...pos);
      circulo.rotation.x = Math.PI / 2;

      escena.add(circulo);

      circulo.userData.phase = Math.random() * Math.PI * 2;
      objetosAnimables.push({
        animar: () => {
          const pulse = 1 + 0.05 * Math.sin(performance.now() * 0.0012 + circulo.userData.phase);
          circulo.scale.set(pulse, pulse, pulse);
          circulo.rotation.z += 0.001;
        },
      });
    });
  };
  function createEstrellasFugaces() {
  const posiciones = [
    { x: -20, y: 20, z: -3 }, { x: 10, y: 20, z: -3 },
    { x: -15, y: 15, z: -3 }, { x: 15, y: 15, z: -3 },
    { x: 0, y: 25, z: -3 }, { x: -5, y: -15, z: -3 }
  ];

  const estrellasFugaces = [];

  posiciones.forEach((pos, i) => {
    const geo = new THREE.CylinderGeometry(0.03, 0.03, 6, 32);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xadd8e6) },
        opacityTop: { value: 0.0 },
        opacityBottom: { value: 0.8 }
      },
      vertexShader: `
        varying float vY;
        void main() {
          vY = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacityTop;
        uniform float opacityBottom;
        varying float vY;
        void main() {
          float opacity = mix(opacityBottom, opacityTop, (vY + 5.0) / 10.0);
          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true
    });

    const estrella = new THREE.Mesh(geo, mat);
    estrella.position.set(pos.x, pos.y, pos.z);
    estrella.userData.speed = 0.05 + Math.random() * 0.02;
    estrella.userData.initial = pos;
    escena.add(estrella);

    objetosAnimables.push({
      animar: () => {
        estrella.position.y -= estrella.userData.speed;
        if (estrella.position.y < -20) {
          estrella.position.set(
            estrella.userData.initial.x,
            estrella.userData.initial.y,
            estrella.userData.initial.z
          );
        }
      }
    });
  });
}

  createEstrellasLejanas();
  createEstrellasDoradas();
  createPlanetas();
  createCirculos();
  createEstrellasFugaces();

  // 🌈 ¡Todo listo!
  return objetosAnimables;
}
