import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PlanetCarousel = ({ textures, planetUrls }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Agregar el renderizador al contenedor
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.zIndex = 1; // Asegurar que esté por encima de ThreeScene
        }

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        // Luces
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100); // Intensidad reducida
        pointLight.position.set(5, 5, 10);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Intensidad reducida
        scene.add(ambientLight);

        // Posición de la cámara
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);

        // Crear los planetas (solo 5 planetas)
        const planets = textures.slice(0, 5).map((texture, index) => {
            const isCentral = index === 2; // El tercer planeta es el central (KIO)
            const size = isCentral ? 2 : 1; // Tamaño más grande para el planeta central
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(texture),
                roughness: 0.7, // Aumentar la rugosidad para reducir el brillo
                metalness: 0.3, // Reducir el metalness para un aspecto menos reflectante
            });
            const planet = new THREE.Mesh(geometry, material);

            // Posición de los planetas
            if (isCentral) {
                planet.position.set(0, 0, 0); // Planeta central en el centro
            } else {
                // Distribuir los planetas horizontalmente
                const offset = (index - 2) * 4; // Ajustar el espaciado
                planet.position.set(offset, -17, -10);
            }

            planet.userData.url = planetUrls[index]; // Asignar la URL del planeta
            scene.add(planet);
            return planet;
        });

        // Raycaster para detectar clics en los planetas
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onDocumentClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets);
            if (intersects.length > 0) {
                window.location.href = intersects[0].object.userData.url;
            }
        };

        document.addEventListener('click', onDocumentClick);

        // Animación de los planetas
        const animate = () => {
            requestAnimationFrame(animate);
            planets.forEach((planet) => planet.rotation.y += 0.005); // Rotación de los planetas
            renderer.render(scene, camera);
        };
        animate();

        // Limpieza al desmontar el componente
        return () => {
            document.removeEventListener('click', onDocumentClick);
            renderer.dispose();
            if (mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [textures, planetUrls]);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1, // Asegurar que esté por encima de ThreeScene
                pointerEvents: 'none',
            }}
        />
    );
};

export default PlanetCarousel;