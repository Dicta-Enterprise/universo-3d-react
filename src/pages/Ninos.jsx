import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CentralText from '../components/Galaxias/CentralText';
import BackButton from '../components/BackButton';

export default function Ninos() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [selectedGalaxy, setSelectedGalaxy] = useState(null);
    const galaxiesRef = useRef([]); // Referencia para almacenar las galaxias
    const cameraRef = useRef(null); // Referencia para la cámara
    const isAnimatingRef = useRef(false); // Referencia para controlar la animación

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            setIsMobile(newIsMobile);
    
            // Actualizar el tamaño del renderer
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
    
            // Actualizar las posiciones de las galaxias
            galaxiesRef.current.forEach((galaxy, index) => {
                const newPosition = newIsMobile ? galaxyPositionsMobile[index] : galaxyPositionsPC[index];
                galaxy.position.copy(newPosition);
            });
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
    
        cameraRef.current = camera;
    
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;
    
        const galaxies = [];
        const galaxyMaterials = [];
        const galaxyTitles = [
            "Peligros de Salud Social [R]",
            "Peligros Digitales [M]",
            "Peligros de Salud Física [C]",
            "Peligros de Salud Mental [V]"
        ];
        const galaxyUrls = [
            "/ninos/salud_social",
            "/ninos/peligros_digitales",
            "/ninos/salud_fisica",
            "/ninos/salud_mental"
        ];
        const galaxyPositionsPC = [
            new THREE.Vector3(-13, 1, 0),
            new THREE.Vector3(13, 1, 0),
            new THREE.Vector3(0, -7, 0),
            new THREE.Vector3(0, 10, 0),
        ];
        const galaxyPositionsMobile = [
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(0, 3, 0),
            new THREE.Vector3(0, -4, 0),
            new THREE.Vector3(0, -11, 0),
        ];
    
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
    
        const createGalaxy = (position, baseColor, rotation = { x: 0, y: 0, z: 0 }) => {
            const particles = 10000;
            const spiralArms = 7;
            const radius = 5;
            const spread = 0.5;
            const positions = new Float32Array(particles * 3);
            const colors = new Float32Array(particles * 3);
            const color = new THREE.Color(baseColor);
    
            for (let i = 0; i < particles; i++) {
                const i3 = i * 3;
                const r = Math.random() * radius;
                const angle = (i % spiralArms) * (Math.PI * 2 / spiralArms) + r * 0.5 + Math.random() * spread;
    
                const x = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
                const y = (Math.random() - 0.5) * spread;
                const z = Math.sin(angle) * r + (Math.random() - 0.5) * spread;
    
                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = z;
    
                const variation = Math.random() * 0.4 - 0.2;
                const adjustedColor = color.clone().offsetHSL(0, 0, variation);
    
                colors[i3] = adjustedColor.r;
                colors[i3 + 1] = adjustedColor.g;
                colors[i3 + 2] = adjustedColor.b;
            }
    
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
            });
    
            const galaxy = new THREE.Points(geometry, material);
            galaxy.position.copy(position);
            galaxy.rotation.set(rotation.x, rotation.y, rotation.z);
    
            scene.add(galaxy);
            galaxies.push(galaxy);
            galaxyMaterials.push(material);
        };
    
        // Posicionar las galaxias según el tamaño de la pantalla inicial
        const initialPositions = isMobile ? galaxyPositionsMobile : galaxyPositionsPC;
        initialPositions.forEach((pos, index) => {
            const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
            const rotations = [
                { x: Math.PI / 3.5, y: 0, z: 0 }, //rojo
                { x: Math.PI / 5, y: 0, z: 0 }, //morado
                { x: Math.PI / 10, y: 0, z: 0 }, //celeste
                { x: Math.PI / 20, y: 0, z: 0 }, //verde
            ];
            createGalaxy(pos, colors[index], rotations[index]);
        });
    
        galaxiesRef.current = galaxies;
    
        camera.position.set(0, 0, 18);
    
        const onClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(galaxies);
    
            galaxyMaterials.forEach((material) => {
                material.size = 0.05;
                material.color.setHex(0xffffff);
            });
    
            if (intersects.length > 0) {
                const targetGalaxy = intersects[0].object;
                const galaxyIndex = galaxies.indexOf(targetGalaxy);
    
                if (galaxyIndex !== -1) {
                    galaxyMaterials[galaxyIndex].size = 0.1;
                    galaxyMaterials[galaxyIndex].color.setHex(0xffffff);
    
                    setSelectedGalaxy({
                        title: galaxyTitles[galaxyIndex],
                        url: galaxyUrls[galaxyIndex],
                        index: galaxyIndex,
                    });
                }
            } else {
                setSelectedGalaxy(null);
            }
        };
    
        renderer.domElement.addEventListener('click', onClick);
    
        const animate = () => {
            requestAnimationFrame(animate);
            galaxies.forEach((galaxy, index) => {
                const speed = 0.0002 + index * 0.0002;
                galaxy.rotation.y += speed;
            });
            renderer.render(scene, camera);
        };
        animate();
    
        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [isMobile]);

    const handleConfirm = () => {
        if (selectedGalaxy && !isAnimatingRef.current) {
            const selectedGalaxyIndex = selectedGalaxy.index;
            const galaxy = galaxiesRef.current[selectedGalaxyIndex];
            const url = selectedGalaxy.url;

            // Iniciar la animación de acercamiento
            isAnimatingRef.current = true;

            const duration = 1.5; // Duración de la animación
            const distance = 9; // Distancia a la que se acerca la cámara
            const direction = new THREE.Vector3().subVectors(cameraRef.current.position, galaxy.position).normalize();
            const targetPosition = new THREE.Vector3().copy(galaxy.position).add(direction.multiplyScalar(distance));
            const startPosition = new THREE.Vector3().copy(cameraRef.current.position);
            let elapsed = 0;

            const animateMove = () => {
                elapsed += 0.01;
                const t = Math.min(elapsed / duration, 1);

                // ANIMACION DE ACERCAMINETO DE GALAXIA
                cameraRef.current.position.lerpVectors(startPosition, targetPosition, t);
                cameraRef.current.lookAt(galaxy.position);

                if (t < 1) {
                    requestAnimationFrame(animateMove);
                } else {
                    setTimeout(() => {
                        window.location.href = url;
                    }, 1000);//DURACION DE ANIMACION DE ACERCAMIENTO -------------- 
                }
            };

            animateMove();
        }
    };

    return (
        <>
            <CentralText selectedGalaxy={selectedGalaxy} onConfirm={handleConfirm} />
            <BackButton />
        </>
    );
}