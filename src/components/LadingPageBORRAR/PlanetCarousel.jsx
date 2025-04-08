import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function PlanetCarousel({ textures, planetUrls }) {
    const mountRef = useRef(null);

    useEffect(() => {
        // Escena, cámara y renderizador
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Crear planetas
        const planets = textures.map((texture, index) => {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(texture),
            });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.x = (index - 2) * 4; // Distribuir los planetas
            planet.position.y = -10;
            planet.position.z = -10;
            planet.userData.url = planetUrls[index]; // Guardar la URL del planeta
            scene.add(planet);
            return planet;
        });

        // Luz
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Posición de la cámara
        camera.position.z = 15;

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);
            planets.forEach(planet => planet.rotation.y += 0.005);
            renderer.render(scene, camera);
        };
        animate();

        // Limpieza
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [textures, planetUrls]);

    return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />;
}