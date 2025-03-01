import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeScene = ({ textures, planetUrls }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const [currentIndex, setCurrentIndex] = useState(0); // Índice actual para mostrar los planetas

    // Refs to store persistent objects
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sphereRef = useRef(null); // Planet central
    const planetsRef = useRef([]); // Mini planets

    useEffect(() => {
        console.log("🚀 Iniciando escena...");

        // Crear cámara y renderizador (solo una vez)
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;

        // Agregar el renderizador al contenedor
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.zIndex = 0; // Asegurar que esté detrás de otros elementos
        }

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
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
            const sphereGeometry = new THREE.SphereGeometry(4.5, 64, 64);
            const sphereMaterial = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(textures[0]), // Textura del planeta Kio
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

        // Función para crear y posicionar los planetas visibles
        const createAndPositionPlanets = () => {
            // Eliminar solo los planetas del carrusel (no el planeta central ni las luces)
            sceneRef.current.children
                .filter((child) => child.userData?.isPlanet)
                .forEach((planet) => sceneRef.current.remove(planet));

            // Crear y posicionar los nuevos planetas
            const spacing = 3; // Espacio entre planetas
            const visiblePlanets = [
                textures[(currentIndex + textures.length - 1) % textures.length], // Textura anterior (textura 10)
                textures[currentIndex], // Textura actual (textura 1)
                textures[(currentIndex + 1) % textures.length], // Textura siguiente (textura 2)
            ].map((texture, index) => {
                const geometry = new THREE.SphereGeometry(1, 32, 32); // Tamaño fijo para todos los mini planetas
                const material = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(texture),
                    roughness: 0.7, // Aplicar los mismos ajustes a los mini planetas
                    metalness: 0.3,
                });
                const planet = new THREE.Mesh(geometry, material);
                planet.userData.url = planetUrls[(currentIndex + index - 1 + textures.length) % textures.length]; // Asignar la URL correspondiente
                planet.userData.isPlanet = true; // Marcar como planeta del carrusel

                // Posicionar los planetas
                const x = (index - 1) * spacing; // Centrar los planetas en la escena
                const y = -10; // Altura de los planetas (ajusta este valor para cambiar la altura)
                const z = 0; // Profundidad de los planetas
                planet.position.set(x, y, z); // Posición en fila

                // Hacer el planeta central más grande
                if (index === 1) { // Si es el planeta central (textura 1)
                    planet.scale.set(1.2, 1.2, 1.2); // Escala más grande
                } else {
                    planet.scale.set(0.8, 0.8, 0.8); // Escala normal para los otros planetas
                }

                sceneRef.current.add(planet);
                return planet;
            });

            planetsRef.current = visiblePlanets; // Store the mini planets in a ref
            console.log("✅ Planetas actualizados.");
        };

        // Crear y posicionar los planetas inicialmente
        createAndPositionPlanets();
    }, [textures, planetUrls, currentIndex]); // Dependencia de currentIndex para actualizar los planetas

    // Efecto para manejar la animación
    useEffect(() => {
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotación del planeta central y mini planetas
            if (sphereRef.current) {
                sphereRef.current.rotation.y += 0.005;
            }
            planetsRef.current.forEach((planet) => (planet.rotation.y += 0.005));

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

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
            {/* Botones de next y prev */}
            <button
                onClick={handlePrev}
                style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1, padding: '10px', fontSize: '20px' }}
            >
                Prev
            </button>
            <button
                onClick={handleNext}
                style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1, padding: '10px', fontSize: '20px' }}
            >
                Next
            </button>
        </div>
    );
};

export default ThreeScene;