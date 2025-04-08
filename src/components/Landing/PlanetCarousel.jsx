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
        }

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        // Crear los planetas
        const planets = textures.map((texture, index) => {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(texture),
            });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.x = (index - 2) * 4;
            planet.position.y = -17;
            planet.position.z = -10;
            planet.userData.url = planetUrls[index];
            scene.add(planet);
            return planet;
        });

        // Luces
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 10);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        // Posición de la cámara
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);

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
            planets.forEach((planet) => planet.rotation.y += 0.005);
            renderer.render(scene, camera);
        };
        animate();

        // Limpieza al desmontar el componente
        return () => {
            document.removeEventListener('click', onDocumentClick);
            renderer.dispose();

            // Verificar si mountRef.current existe antes de eliminar el renderer.domElement
            if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
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
                zIndex: 2, // Asegurar que esté por encima de otros elementos
                pointerEvents: 'none', // Permitir interacción con los planetas
            }}
        />
    );
};

export default PlanetCarousel;