import { useEffect } from 'react';
import * as THREE from 'three';

export default function Galaxias() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        // Crear galaxia roja
        const particles = 20000;
        const spiralArms = 6;
        const radius = 10;
        const spread = 0.5;
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        const color = new THREE.Color('#9d4edd');

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
        galaxy.position.set(0, 2, 0); // Posición de la galaxia
        galaxy.rotation.set(Math.PI / 5, 0, 0); // Rotación inicial de la galaxia
        scene.add(galaxy);

        // Crear esfera roja (sol)
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Esfera con un radio de 0.5
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: '#9d4edd' });
        const sun = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sun.position.set(0, 2, 0); // Posición central de la galaxia
        scene.add(sun);

        camera.position.set(0, 0, 18);

        const animate = () => {
            requestAnimationFrame(animate);
            galaxy.rotation.y += 0.001; // Animación de rotación
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return <h1>Bienvenidos a la sección de Peligros Digitales</h1>;
}
    
