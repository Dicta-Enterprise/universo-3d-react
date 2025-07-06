import * as THREE from 'three';

/**
 * Genera galaxias de partículas con rotaciones independientes para cada una.
 * @param {Object} props
 * @param {THREE.Scene} props.scene - La escena 3D donde insertar las galaxias.
 * @param {string} props.grupo - Grupo actual (niños, jóvenes, adultos).
 * @param {function} props.onSeleccion - Función callback cuando se hace clic en una galaxia.
 * @returns {THREE.Points[]} Lista de objetos animables (galaxias)
 */
export default function GeneradorGalaxias({ scene, grupo, onSeleccion }) {
  const galaxias = [];

  const definiciones = [
    {
      tema: 'salud-mental',
      color: '#8FE968',
      posicion: [0, 8, 4],
      rotacion: [Math.PI / 1.3, 0, -5], // vista desde arriba
    },
    {
      tema: 'salud-fisica',
      color: '#36CEDC',
      posicion: [0, -7, 5],
      rotacion: [Math.PI / 4, 0, -2], // ligera diagonal
    },
    {
      tema: 'peligros-digitales',
      color: '#A587CA',
      posicion: [13, 1, 3],
      rotacion: [Math.PI / 1.7, 0, 5], // vista inclinada 3D
    },
    {
      tema: 'salud-social',
      color: '#FE797B',
      posicion: [-13, 1, 3],
      rotacion: [Math.PI / 1.7, 0, 5], // vista lateral
    },
  ];

  definiciones.forEach(({ tema, color, posicion, rotacion }) => {
    const particles = 9000;
    const radius = 5;
    const spread = 0.5;

    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    const baseColor = new THREE.Color(color);

    for (let i = 0; i < particles; i++) {
      const i3 = i * 3;
      const r = (i / particles) * radius;
      const angle = r * 5;

      const x = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
      const y = Math.sin(angle) * r + (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      const variation = Math.random() * 0.3 - 0.15;
      const adjustedColor = baseColor.clone().offsetHSL(0, 0, variation);

      colors[i3] = adjustedColor.r;
      colors[i3 + 1] = adjustedColor.g;
      colors[i3 + 2] = adjustedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
    });

    const galaxy = new THREE.Points(geometry, material);
    galaxy.position.set(...posicion);
    galaxy.rotation.set(...rotacion);

    galaxy.userData = {
      animar: () => {
        galaxy.rotation.z += 0.0015;
      },
      onClick: () => {
      onSeleccion(tema);
    },
    };

    scene.add(galaxy);
    galaxias.push(galaxy);
  });

  return galaxias;
}