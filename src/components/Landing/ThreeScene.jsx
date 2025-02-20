import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import MainPlanet from './MainPlanet';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene()); // 🔥 Guardamos la escena en un ref

    useEffect(() => {
        console.log("🚀 Iniciando escena...");
        
        // Crear escena, cámara y renderizador
        const scene = sceneRef.current;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
            console.log("✅ Renderizador agregado al DOM.");
        }

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;
        console.log("✅ Fondo estrellado agregado.");

        // Luces
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 10);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        console.log("✅ Luces agregadas.");

        // Posicionar cámara
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);
        console.log("✅ Cámara posicionada.");

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
        console.log("🔄 Renderizando...");

        return () => {
            console.log("🗑 Limpiando escena...");
            renderer.dispose();
            if (mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
                console.log("🗑 Renderizador eliminado.");
            }
        };
    }, []);

    return (
        <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }}>
            <MainPlanet scene={sceneRef.current} /> {/* ✅ Se agrega el planeta aquí */}
        </div>
    );
};

export default ThreeScene;
