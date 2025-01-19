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

        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        const galaxies = [];
        const galaxyTitles = ["Peligros de Salud Social [R]", "Peligros Digitales [M]", "Peligros de Salud Física [C]", "Peligros de Salud Mental [V]"];
        const galaxyUrls = [//--------- LINKS DE LOS URL -----------
            "/ninos/salud_social",
            "/ninos/peligros_digitales",
            "/ninos/salud_fisica",
            "/ninos/salud_mental"
        ];
        const galaxyPositions = [//----------- POSICION DE LAS GALAXIAS -------------
            new THREE.Vector3(-13, 1, 0),
            new THREE.Vector3(13, 1, 0),
            new THREE.Vector3(0, -7, 0),
            new THREE.Vector3(0, 10, 0),
        ];

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isAnimating = false;

        // Crear un div para los títulos
        const titleDiv = document.createElement('div');
        titleDiv.style.position = 'absolute';
        titleDiv.style.top = '56px';
        titleDiv.style.width = '100%';
        titleDiv.style.textAlign = 'center';
        titleDiv.style.color = 'white';
        titleDiv.style.fontSize = '48px';
        titleDiv.style.display = 'none'; // Oculto inicialmente
        document.body.appendChild(titleDiv);

        const createGalaxy = (position, baseColor, rotation = { x: 0, y: 0, z: 0 }) => {
            const particles = 10000;
            const spiralArms = 7;//numero de brazos de las galaxias
            const radius = 5;
            const spread = 0.5;//dispersacion de las particulas
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
        };

        galaxyPositions.forEach((pos, index) => {
            const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
            const rotations = [
                { x: Math.PI / 5, y: 0, z: 0 },
                { x: Math.PI / 5, y: 0, z: 0 },
                { x: Math.PI / 17, y: 0, z: 0 },
                { x: Math.PI / 3, y: 0, z: 0 },
            ];
            createGalaxy(pos, colors[index], rotations[index]);
        });

        camera.position.set(0, 0, 18);

        const moveToGalaxy = (galaxy, title, url) => {
            if (isAnimating) return;
            isAnimating = true;

            const duration = 1.5;
            const distance = 9;
            const direction = new THREE.Vector3().subVectors(camera.position, galaxy.position).normalize();
            const targetPosition = new THREE.Vector3().copy(galaxy.position).add(direction.multiplyScalar(distance));
            const startPosition = new THREE.Vector3().copy(camera.position);
            let elapsed = 0;

            const animateMove = () => {
                elapsed += 0.01;
                const t = Math.min(elapsed / duration, 1);

                camera.position.lerpVectors(startPosition, targetPosition, t);
                camera.lookAt(galaxy.position);

                if (t < 1) {
                    requestAnimationFrame(animateMove);
                } else {
                    titleDiv.textContent = title;
                    titleDiv.style.display = 'block'; // Mostrar el título
                    setTimeout(() => {
                        window.location.href = url; // Redirigir a la URL
                    }, 1500); // Tiempo de retraso 1000 = 1seg
                    isAnimating = false;
                }
            };

            animateMove();
        };

        const onClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(galaxies);

            if (intersects.length > 0) {
                const targetGalaxy = intersects[0].object;
                const galaxyIndex = galaxies.indexOf(targetGalaxy);
                if (galaxyIndex !== -1) {
                    moveToGalaxy(targetGalaxy, galaxyTitles[galaxyIndex], galaxyUrls[galaxyIndex]);
                }
            }
        };

        renderer.domElement.addEventListener('click', onClick);

        const animate = () => {
            requestAnimationFrame(animate);
            galaxies.forEach((galaxy, index) => {
                const speed = 0.001 + index * 0.0003;
                galaxy.rotation.y += speed;
            });
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            titleDiv.remove();
            renderer.domElement.removeEventListener('click', onClick);
        };
    }, []);

    return null;
}
