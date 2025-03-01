import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MainPlanet = ({ scene, textures, currentTextureIndex }) => {
    const planetRef = useRef(null);

    useEffect(() => {
        if (!scene || !textures || !textures[currentTextureIndex]) {
            console.error("🚨 Error: Escena, texturas o índice de textura no definidos.");
            return;
        }

        console.log("🌍 Creando planeta central...");

        // Cargar textura
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(
            textures[currentTextureIndex],
            undefined, // onLoad (no es necesario)
            undefined, // onProgress (no es necesario)
            (error) => {
                console.error("🚨 Error al cargar la textura:", error);
            }
        );

        // Geometría y material
        const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
        const sphereMaterial = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0.5, // Ajustar la rugosidad para un aspecto más realista
            metalness: 0.5, // Ajustar el metalness para un aspecto más realista
        });

        // Crear malla del planeta
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0); // Posición en el centro de la escena
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
    }, [scene, textures, currentTextureIndex]);

    return null; // No renderiza nada en React, solo maneja el objeto en Three.js
};

export default MainPlanet;