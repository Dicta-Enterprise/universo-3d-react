import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import fondos from './Fondos';

import BotonAtras from './ui/BotonAtras';
import DivCentrado from './ui/DivCentrado';
import BotonFlecha from './ui/BotonFlecha';
import BotonCentral from './ui/BotonCentral';
import InfoPlaneta from './ui/InfoPlaneta';
import './ui/stylesUI.css';

export default function GalaxiaGenerica({ titulo, color, planetas, backUrl, tipoFondo = null }) {
  const [indice, setIndice] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const clickSoundRef = useRef(null);
  const planetSoundRef = useRef(null);

  const planetasOrdenados = [...planetas].sort((a, b) => a.id - b.id);
  const planetaActual = planetasOrdenados[indice];

  const cambiarPlaneta = (direccion) => {
    setIndice((prev) => {
      const total = planetas.length;
      return direccion === 'next' ? (prev + 1) % total : (prev - 1 + total) % total;
    });
  };


  const formatearTexto = (info, nombre) => {
    return (
      `Tipo de riesgo: ${info.tipoRiesgo}\n` +
      `Planeta: ${nombre}\n` +
      `Tamaño del planeta: ${info.tamaño}\n` +
      `Composición: ${info.composición}\n` +
      `Nombre del riesgo: ${info.riesgo}\n` +
      `Nivel de riesgo: ${info.nivel}\n` +
      `Ambiente: ${info.ambiente}\n` +
      `Temperatura: ${info.temperatura}\n` +
      `Villano: ${info.villano}`
    );
  };

  const rotacionRef = useRef(0.002);
  const velocidadTarget = useRef(0.002);

  useEffect(() => {
    const escena = new THREE.Scene();

    // 🪐 Carga el fondo correcto según tipoFondo
    const FondoSeleccionado = tipoFondo && fondos[tipoFondo];
    const objetosAnimables = FondoSeleccionado ? FondoSeleccionado(escena) : [];

    const camara = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 0.5, 1000);
    camara.position.z = 18; // ver el planeta mas grande o chico

    const render = new THREE.WebGLRenderer({ antialias: true });

    let isDragging = false;
    let prevX = null;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      prevX = e.clientX;

      const factor = 0.0002; // sensibilidad
      velocidadTarget.current = THREE.MathUtils.clamp(
        rotacionRef.current + deltaX * factor,
        -0.05,
        0.05
      );
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    render.domElement.addEventListener('mousedown', handleMouseDown);
    render.domElement.addEventListener('mousemove', handleMouseMove);
    render.domElement.addEventListener('mouseup', handleMouseUp);

    render.setSize(window.innerWidth, window.innerHeight);
    render.setPixelRatio(window.devicePixelRatio);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(render.domElement);

    // 📐 Ajustes responsivos por zoom y resize
    let prevDPR = window.devicePixelRatio;

    const handleResizeOrZoom = () => {
      const newDPR = window.devicePixelRatio;
      if (newDPR !== prevDPR) {
        prevDPR = newDPR;
        render.setPixelRatio(newDPR);
      }

      camara.aspect = window.innerWidth / window.innerHeight;
      camara.updateProjectionMatrix();
      render.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResizeOrZoom);
    const dprInterval = setInterval(() => {
      if (window.devicePixelRatio !== prevDPR) {
        handleResizeOrZoom();
      }
    }, 300);

    // 🌟 Luces y planeta
    const luz = new THREE.AmbientLight(0xffffff, 2);
    escena.add(luz);

    const geometria = new THREE.SphereGeometry(6, 64, 64);
    const cargadorTextura = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
      map: cargadorTextura.load(planetaActual.textura),
    });

    const esfera = new THREE.Mesh(geometria, material);

    esfera.position.z = 0;
    const originalZ = esfera.position.z;
    escena.add(esfera);

    let zoomTarget = 1;
    let zoomCurrent = 1;

    const handleWheel = (event) => {
      const delta = -event.deltaY * 0.001;
      zoomTarget = Math.min(Math.max(zoomTarget + delta, 0.6), 1.6);
    };

    render.domElement.addEventListener('wheel', handleWheel);
    

    // 🔊 Sonidos
    const listener = new THREE.AudioListener();
    camara.add(listener);

    const clickSound = new THREE.Audio(listener);
    const planetSound = new THREE.Audio(listener);
    const loaderAudio = new THREE.AudioLoader();

    loaderAudio.load('/assets/sounds/click-space.mp3', (buffer) => {
      clickSound.setBuffer(buffer);
      clickSound.setLoop(false);
      clickSound.setVolume(0.5);
    });
    clickSoundRef.current = clickSound;

    loaderAudio.load('/assets/sounds/Planeta.mp3', (buffer) => {
      planetSound.setBuffer(buffer);
      planetSound.setLoop(false);
      planetSound.setVolume(0.5);
    });
    planetSoundRef.current = planetSound;

    // 🔁 Animación
    const animar = () => {
      requestAnimationFrame(animar);

      if (isZooming && camara.position.z > 7) {
        camara.position.z -= 0.1;
      }

      rotacionRef.current += (velocidadTarget.current - rotacionRef.current) * 0.05;
      esfera.rotation.y += rotacionRef.current;

      objetosAnimables.forEach((obj) => {
        obj.userData?.animar && obj.userData.animar();
      });

      zoomCurrent += (zoomTarget - zoomCurrent) * 0.05;
      esfera.scale.set(zoomCurrent, zoomCurrent, zoomCurrent);

      esfera.position.z = originalZ - (zoomCurrent - 1) * 6;

      render.render(escena, camara);
    };

    animar();

    return () => {
      render.dispose();
      render.domElement.removeEventListener('wheel', handleWheel);
      document.body.removeChild(render.domElement);
      window.removeEventListener('resize', handleResizeOrZoom);
      clearInterval(dprInterval);
    };
  }, [planetaActual, isZooming, tipoFondo]);

  return (
    <div style={{ '--main-color': color, position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <BotonAtras color={color} redirectUrl={backUrl} />
      <DivCentrado title={titulo} color={color}>
        <InfoPlaneta text={formatearTexto(planetaActual.info, planetaActual.nombre)} color={color}/>
      </DivCentrado>
      <div className="botones-galaxia">
        <BotonFlecha
          direccion="izquierda"
          onClick={() => {
            clickSoundRef.current?.play();
            cambiarPlaneta('prev');
          }}
          color={color}
        />

        <BotonCentral
          onClick={() => {
            planetSoundRef.current?.play();
            setIsZooming(true);
            setTimeout(() => {
              setIsZooming(false);
              window.location.href = planetaActual.url;
            }, 1000);
          }}
          color={color}
          textoColor="#ffffff" 
          texto="Ingresar"
        />
        <BotonFlecha
          direccion="derecha"
          onClick={() => {
            clickSoundRef.current?.play();
            cambiarPlaneta('next');
          }}
          color={color}
        />
      </div>

    </div>
  );
}