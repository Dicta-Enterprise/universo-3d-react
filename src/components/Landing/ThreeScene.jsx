import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ResizeHandler from './ResizeHandler';

const ThreeScene = ({ textures, planetUrls }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Refs to store persistent objects
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sphereRef = useRef(null); // Planet central
    const planetsRef = useRef([]); // Mini planets

    useEffect(() => {
        console.log("🚀 Iniciando escena...");

        // Crear cámara y renderizador (solo una vez)
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 24);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;

        // Agregar el renderizador al contenedor
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
            renderer.domElement.style.position = 'fixed'; // Fijo para cubrir toda la pantalla
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.zIndex = 0; // Asegurar que esté detrás de otros elementos
        }

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        spaceTexture.wrapS = THREE.RepeatWrapping;
        spaceTexture.wrapT = THREE.RepeatWrapping;
        spaceTexture.repeat.set(4, 4); // Ajusta el valor de repetición según sea necesario
        sceneRef.current.background = spaceTexture;
        console.log("✅ Fondo estrellado agregado.");

        // Luces (creadas solo una vez)
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100); // Intensidad reducida
        pointLight.position.set(5, 5, 10);
        sceneRef.current.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Intensidad reducida
        sceneRef.current.add(ambientLight);
        console.log("✅ Luces agregadas.");

        // Planeta central (creado solo una vez)
        if (!sphereRef.current) {
            const sphereGeometry = new THREE.SphereGeometry(6, 80, 80);
            const sphereMaterial = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(textures[0]), // Textura del planeta central
                roughness: 0.7, // Aumentar la rugosidad
                metalness: 0.3, // Reducir el metalness
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(0, 0, 0);
            sceneRef.current.add(sphere);
            sphereRef.current = sphere; // Store the planet central in a ref
            console.log("✅ Planeta central agregado.");
        }

        // Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        // Raycaster para detectar clics en los planetas
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onDocumentClick = (event) => {
            // Convertir las coordenadas del clic a coordenadas normalizadas (-1 a 1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Configurar el raycaster con la posición del clic y la cámara
            raycaster.setFromCamera(mouse, camera);

            // Detectar intersecciones con los planetas
            const intersects = raycaster.intersectObjects(planetsRef.current);

            // Si hay una intersección, redirigir a la URL correspondiente
            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                window.location.href = clickedPlanet.userData.url;
            }
        };

        // Agregar el listener de clic
        document.addEventListener('click', onDocumentClick);

        // Limpieza al desmontar el componente
        return () => {
            console.log("🗑 Limpiando escena...");
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', onDocumentClick); // Limpiar el listener de clic
            renderer.dispose();
            if (mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
                console.log("🗑 Renderizador eliminado.");
            }
        };
    }, [textures]); // Dependencia de textures para crear el planeta central solo una vez

    // Efecto para actualizar los mini planetas cuando cambia currentIndex
    useEffect(() => {
        console.log("🔄 Actualizando mini planetas...");
        console.log("Current index changed:", currentIndex);
    
        const createAndPositionPlanets = () => {
            // Eliminar solo los planetas del carrusel (no el planeta central ni las luces)
            sceneRef.current.children
                .filter((child) => child.userData?.isPlanet)
                .forEach((planet) => sceneRef.current.remove(planet));
    
            // Crear y posicionar los nuevos planetas
            const spacing = 2.5; // Espacio entre planetas
            const visiblePlanets = [
                textures[(currentIndex - 1 + textures.length) % textures.length], // Textura anterior
                textures[currentIndex], // Textura actual
                textures[(currentIndex + 1) % textures.length], // Textura siguiente
            ].map((texture, index) => {
                const geometry = new THREE.SphereGeometry(1, 32, 32);
                const material = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(texture),
                    roughness: 0.7,
                    metalness: 0.3,
                });
                const planet = new THREE.Mesh(geometry, material);
    
                // Asignar la URL correspondiente al planeta
                const urlIndex = (currentIndex + index - 1 + textures.length) % textures.length;
                planet.userData.url = planetUrls[urlIndex];
                planet.userData.isPlanet = true;
    
                // Posicionar los planetas
                const x = (index - 1) * spacing;
                const y = 9;
                const z = 0;
                planet.position.set(x, y, z);
    
                // Hacer el planeta central más grande
                if (index === 1) {
                    planet.scale.set(1.1, 1.1, 1.1);
                } else {
                    planet.scale.set(0.8, 0.8, 0.8);
                }
    
                sceneRef.current.add(planet);
                return planet;
            });
    
            planetsRef.current = visiblePlanets;
            console.log("✅ Planetas actualizados.");
        };
    
        // Crear y posicionar los planetas inicialmente
        createAndPositionPlanets();
    }, [textures, planetUrls, currentIndex]); // Dependencia de currentIndex

    // Efecto para manejar la animación
    useEffect(() => {
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotación del planeta central y mini planetas
            if (sphereRef.current) {
                sphereRef.current.rotation.y += 0.004;
            }
            planetsRef.current.forEach((planet) => (planet.rotation.y += 0.002));

            // Renderizar la escena
            if (rendererRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };

        animate();
    }, []); // Sin dependencias para que se ejecute solo una vez

    // Funciones para manejar los botones de next y prev
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % textures.length); // Reiniciar si llega al final
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + textures.length) % textures.length); // Reiniciar si llega al inicio
    };

    // SVG para las flechas
    const LeftArrow = () => (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );

    const RightArrow = () => (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    );

    // Dentro del return de ThreeScene.js
    return (
        <div style={{
            position: 'fixed', // Fijo para cubrir toda la pantalla
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0, // Asegura que esté detrás del contenido principal
        }}>
            <div ref={mountRef} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }} />
            {/* Botones de next y prev */}
            <button
                onClick={handlePrev}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '48px',
                    position: 'fixed', // Usar fixed para que siempre estén visibles
                    bottom: '830px',
                    left: isMobile ? '10%' : '40%',
                    transform: 'translateX(-50%)',
                    zIndex: 3, // Asegurar que estén por encima del contenido
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
            >
                <LeftArrow />
            </button>
            <button
                onClick={handleNext}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '48px',
                    position: 'fixed', // Usar fixed para que siempre estén visibles
                    bottom: '830px',
                    right: isMobile ? '10%' : '40%',
                    transform: 'translateX(50%)',
                    zIndex: 3,
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(50%) scale(1.2)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(50%) scale(1)'}
            >
                <RightArrow />
            </button>
            {/* Integrar el ResizeHandler */}
            <ResizeHandler setIsMobile={setIsMobile} />
        </div>
    );
};

export default ThreeScene;