import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

import FondoNinos from '../Fondos/FondoNinos';
import DivCentrado from '../ui/DivCentrado';
import BotonAtras from '../ui/BotonAtras';
import GeneradorGalaxias from '../componentes/GeneradorGalaxias';
import TarjetaConfirmacion from '../ui/Tarjeta'; // Importar el componente de tarjeta

export default function Ninos() {
  const containerRef = useRef();
  const cameraRef = useRef();
  const objetosAnimables = useRef([]);
  const navigate = useNavigate();
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [showCard, setShowCard] = useState(false); // Estado para mostrar la tarjeta
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const onSeleccion = (tema) => {
      setSelectedGalaxy({
        title: `¿Ir a la galaxia de ${tema.replace('-', ' ')}?`,
        tema,
      });
      setShowCard(true); // Mostrar la tarjeta de confirmación directamente
    };

    // Agregar objetos: fondo + galaxias
    const fondo = FondoNinos(scene, onSeleccion);
    const galaxias = GeneradorGalaxias({ scene, grupo: 'niños', onSeleccion });
    objetosAnimables.current = [...fondo, ...galaxias];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        // Asegúrate de que no se está llamando a un confirm() aquí
        intersects[0].object.userData?.onClick?.();
      } else {
        setSelectedGalaxy(null);
        setShowCard(false); // Ocultar tarjeta si no se selecciona una galaxia
      }
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      objetosAnimables.current.forEach((obj) => obj.userData?.animar?.());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleConfirm = () => {
    if (!selectedGalaxy || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const tema = selectedGalaxy.tema;
    const destino = `/galaxia/ninos/${tema}`;
    const camera = cameraRef.current;
    const start = camera.position.clone();
    const end = new THREE.Vector3(0, 0, 5);
    let t = 0;

    const animar = () => {
      t += 0.02;
      camera.position.lerpVectors(start, end, t);
      camera.lookAt(0, 0, 0);
      if (t < 1) {
        requestAnimationFrame(animar);
      } else {
        navigate(destino);
      }
    };
    animar();
    setShowCard(false); // Ocultar la tarjeta después de confirmar
  };

  const handleClose = () => {
    setShowCard(false); // Cerrar la tarjeta sin realizar ninguna acción
  };

  return (
    <>
      {/* Mostrar tarjeta solo si una galaxia está seleccionada */}
      {showCard && selectedGalaxy && (
        <TarjetaConfirmacion
          title={selectedGalaxy.title}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      )}
      <BotonAtras color="#ffffff" />
      <div ref={containerRef} />
    </>
  );
}
