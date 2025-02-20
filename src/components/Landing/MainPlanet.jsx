import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MainPlanet = ({ scene }) => {
    const planetRef = useRef(null);

    useEffect(() => {
        if (!scene) return;

        console.log("🌍 Creando planeta central...");

        // Geometría y material
        const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

        // Crear malla del planeta
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);
        planetRef.current = sphere;

        console.log("✅ Planeta central agregado a la escena.");

        // Limpieza al desmontar
        return () => {
            if (planetRef.current) {
                scene.remove(planetRef.current);
                planetRef.current.geometry.dispose();
                planetRef.current.material.dispose();
                console.log("🗑 Planeta central eliminado.");
            }
        };
    }, [scene]);

    return null; // No renderiza nada en React, solo maneja el objeto en Three.js
};

export default MainPlanet;
