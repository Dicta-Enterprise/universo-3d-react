import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Galaxy({ position, color, rotation }) {
    const galaxyRef = useRef();

    useEffect(() => {
        const particles = 10000;
        const spiralArms = 7;
        const radius = 5;
        const spread = 0.5;
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        const threeColor = new THREE.Color(color);

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
            const adjustedColor = threeColor.clone().offsetHSL(0, 0, variation);

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

        galaxyRef.current = galaxy;

        return () => {
            // Limpiar la galaxia al desmontar el componente
            geometry.dispose();
            material.dispose();
        };
    }, [position, color, rotation]);

    return null; // No renderizamos nada directamente en el DOM
}