//Este componente es para las galaxias
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GalaxyScene({ isMobile, galaxiesData, onGalaxyClick }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        const galaxies = [];
        const galaxyMaterials = [];

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

        galaxiesData.forEach((data, index) => {
            createGalaxy(data.position, data.color, data.rotation);
        });

        camera.position.set(0, 0, 18);

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
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [isMobile, galaxiesData]);

    return <div ref={mountRef} />;
}