import * as THREE from 'three';
import galaxiasData from '../../../../data/DataGalaxia'; // Ajusta la ruta si es necesario
import { fetchGalaxias } from '../data/galaxia';
import React, { useEffect, useState } from 'react';
import { fetchCategorias } from '../data/categoria';

/**
 * Genera galaxias de partículas con rotaciones independientes para cada una.
 * @param {Object} props
 * @param {THREE.Scene} props.scene - La escena 3D donde insertar las galaxias.
 * @param {Array} [props.definiciones] - Opcional: definiciones externas de galaxias.
 * @param {string} props.grupo - Grupo actual (niños, jóvenes, adultos).
 * @param {function} props.onSeleccion - Función callback cuando se hace clic en una galaxia.
 * @returns {THREE.Points[]} Lista de objetos animables (galaxias)
 */
export default function GeneradorGalaxias({ scene, definiciones, grupo, onSeleccion }) {
  const galaxias = [];

  // Usa las definiciones externas si existen, si no las internas (filtrando solo las activas)
  const defs = (definiciones || (galaxiasData[grupo] || [])).filter(g => g.active);

  defs.forEach(({ tema, color, posicion, rotacion }) => {
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

function MiComponente() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetchCategorias().then(setCategorias).catch(console.error);
  }, []);

  // Usa 'categorias' en tu render
}