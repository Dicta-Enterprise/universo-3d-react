import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function RotatingPlanet({ textureUrl }) {
    const mountRef = useRef(null);

    useEffect(() => {
        // Escena, cámara y renderizador
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Textura del planeta
        const texture = new THREE.TextureLoader().load(textureUrl);

        // Geometría y material del planeta
        const geometry = new THREE.SphereGeometry(5, 64, 64);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const planet = new THREE.Mesh(geometry, material);
        scene.add(planet);

        // Luz
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Posición de la cámara
        camera.position.z = 15;

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);
            planet.rotation.y += 0.005;
            renderer.render(scene, camera);
        };
        animate();

        // Limpieza
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [textureUrl]);

    return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />;
}