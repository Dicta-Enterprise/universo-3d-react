import * as THREE from 'three';
import CrearEstrellas3D from './objetos/CrearEstrellas3D';
import crearLineaVertical from './objetos/CrearLineaVerticalEstrella';
import crearCirculo from './objetos/CrearCirculo';
import CreaCruzRedonda from './objetos/CrearCruzRedonda';
import CrearTermometro from './objetos/CrearTermometro';
import CrearNube from './objetos/CrearNube';
import CrearLuna from './objetos/CrearLuna';

import {
  nubeconfig,
  estrellasConfig,
  circulosConfig,
  crucesConfig,
  lineasConfig,
  TermometroConfig
} from '../../../../components/FondoNiños/ArregloObjetos';

export default function FondoNinos(scene, onSeleccion) {
  if (!scene) return [];
  scene.background = new THREE.Color(0x001833);
  const objetosAnimables = [];

  // 🔁 Helper para animaciones
  const animar = (fn) => ({ animar: fn });

  // ☁️ Nubes flotantes
  nubeconfig.forEach((cfg, i) => {
    const nube = CrearNube();
    nube.position.set(cfg.x, cfg.y, cfg.z);
    nube.scale.set(cfg.escalado, cfg.escalado, cfg.escalado);
    const dir = i % 2 === 0 ? -1 : 1;
    nube.userData = animar(() => {
      const t = performance.now() * 0.0002;
      nube.position.x = cfg.x + Math.sin(t) * 10 * dir;
    });
    scene.add(nube);
    objetosAnimables.push(nube);
  });

  // 🌙 Lunas
  [
    { scale: 0.3, pos: [-13, 17, -10] },
    { scale: 0.05, pos: [10, 0, -10], s: 1.5 },
    { scale: 0.4, pos: [-20, -10, -10], s: 0.8 }
  ].forEach(({ scale, pos, s }) => {
    const luna = CrearLuna(scale);
    luna.position.set(...pos);
    if (s) luna.scale.set(s, s, s);
    scene.add(luna);
  });

  // 🌡️ Termómetros
  TermometroConfig.forEach((cfg) => {
    const t = CrearTermometro();
    t.position.set(cfg.x, cfg.y, cfg.z);
    t.rotation.set(cfg.rotationx, cfg.rotationy, cfg.rotationz);
    t.scale.set(0.5, 0.5, 0.5);
    const angulo = Math.random() * Math.PI * 2;
    t.userData = animar(() => {
      t.rotation.z = Math.sin(performance.now() * 0.02 + angulo) * 0.2;
    });
    scene.add(t);
    objetosAnimables.push(t);
  });

  // ✨ Estrellas
  estrellasConfig.forEach((cfg, i) => {
    const e = CrearEstrellas3D(cfg.color);
    e.position.set(cfg.x, cfg.y, cfg.z);
    e.rotation.set(cfg.rotationX, cfg.rotationY, cfg.rotationZ);
    e.scale.set(cfg.escalado, cfg.escalado, cfg.escalado);
    e.userData = animar(() => {
      const t = Date.now() * 0.001 + i * 0.3;
      e.position.y += Math.cos(t) * 0.01;
      e.rotation.z += 0.005;
    });
    scene.add(e);
    objetosAnimables.push(e);
  });

  // ➕ Cruces
  crucesConfig.forEach((cfg) => {
    const cruz = CreaCruzRedonda(cfg.color, cfg.altura, cfg.ancho, cfg.grosor);
    cruz.position.set(cfg.x, cfg.y, cfg.z);
    cruz.rotation.set(cfg.rotx, cfg.roty, cfg.rotz);
    cruz.userData = animar(() => {
      cruz.rotation.z += 0.005;
    });
    scene.add(cruz);
    objetosAnimables.push(cruz);
  });

  // 🟢 Círculos pulsantes
  circulosConfig.forEach((cfg) => {
    const c = crearCirculo(cfg.color, cfg.radio);
    c.position.set(cfg.x, cfg.y, cfg.z);
    let dir = 1;
    c.userData = animar(() => {
      c.scale.x += 0.005 * dir;
      c.scale.y += 0.005 * dir;
      if (c.scale.x > 1.2) dir = -1;
      if (c.scale.x < 1.0) dir = 1;
    });
    scene.add(c);
    objetosAnimables.push(c);
  });

  // 📏 Líneas
  lineasConfig.forEach((cfg) => {
    const l = crearLineaVertical(cfg.altura);
    l.position.set(cfg.x, cfg.y, cfg.z);
    scene.add(l); // no se anima
  });

  // 🪐 Planeta interactivo
  const planeta = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshStandardMaterial({ color: '#00ffcc' })
  );
  planeta.position.set(0, 10, -5);
  planeta.userData = {
    animar: () => (planeta.rotation.y += 0.005),
    onClick: () => {
      const confirmar = confirm('¿Ir a la galaxia de Salud Mental?');
      if (confirmar) onSeleccion('salud-mental');
    }
  };
  scene.add(planeta);
  objetosAnimables.push(planeta);

  return objetosAnimables;
}