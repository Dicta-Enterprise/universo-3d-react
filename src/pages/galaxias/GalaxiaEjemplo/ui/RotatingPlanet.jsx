import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function RotatingPlanet({ width, height, textureUrl }) {
    const mountRef = useRef(null);

    useEffect(() => {
        
        // Escena, cámara y renderizador
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
        renderer.setSize(width, height);
        renderer.setClearColor( 0xffffff, 0);
        mountRef.current.appendChild(renderer.domElement);

        // Textura del planeta
        const texture = new THREE.TextureLoader().load(textureUrl);
        
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        spaceTexture.wrapS = THREE.RepeatWrapping;
        spaceTexture.wrapT = THREE.RepeatWrapping;
        spaceTexture.repeat.set(4, 4); // Ajusta el valor de repetición según sea necesario
        mountRef.current.background = spaceTexture;
        console.log("✅ Fondo estrellado agregado.");


        // Geometría y material del planeta
        const geometry = new THREE.SphereGeometry(6, 80, 80);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const planet = new THREE.Mesh(geometry, material);
        scene.add(planet);

        // Luz
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 200);
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
    }, [textureUrl]);

    return <div ref={mountRef} id='planeta-container' style={{position:"relative", width:"100%", height:"100%", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}}/>;
}