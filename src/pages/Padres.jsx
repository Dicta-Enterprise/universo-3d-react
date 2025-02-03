import { useEffect } from 'react';
import * as THREE from 'three';
export default function Padres() {
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
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredGalaxy = null; // Almacena la galaxia actualmente resaltada
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
        };
        const galaxyPositions = [
            new THREE.Vector3(-13, 1, 0),
            new THREE.Vector3(13, 1, 0),
            new THREE.Vector3(0, -7, 0),
            new THREE.Vector3(0, 10, 0),
        ];
        const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
        const rotations = [
            { x: Math.PI / 5, y: 0, z: 0 },
            { x: Math.PI / 5, y: 0, z: 0 },
            { x: Math.PI / 17, y: 0, z: 0 },
            { x: Math.PI / 3, y: 0, z: 0 },
        ];
        galaxyPositions.forEach((pos, index) => createGalaxy(pos, colors[index], rotations[index]));
        camera.position.set(0, 0, 18);
        const highlightGalaxy = (galaxy) => {
            if (!galaxy) return;
            galaxy.material.size = 0.09; // Aumentar el tamaño de las partículas
            galaxy.material.color.set('#ffffff'); // Cambiar a color blanco
        };
        const resetGalaxy = (galaxy) => {
            if (!galaxy) return;
            galaxy.material.size = 0.05; // Restaurar el tamaño original
            galaxy.material.color.set(galaxy.material.vertexColors ? null : galaxy.material.color); // Restaurar color original
        };
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(galaxies);
            if (intersects.length > 0) {
                const targetGalaxy = intersects[0].object;
                if (hoveredGalaxy !== targetGalaxy) {
                    resetGalaxy(hoveredGalaxy); // Quitar el resaltado de la galaxia anterior
                    hoveredGalaxy = targetGalaxy; // Actualizar la galaxia resaltada
                    highlightGalaxy(hoveredGalaxy); // Resaltar la nueva galaxia
                }
            } else if (hoveredGalaxy) {
                resetGalaxy(hoveredGalaxy); // Quitar el resaltado si el mouse no apunta a ninguna galaxia
                hoveredGalaxy = null;
            }
        };
        //Probhar 
        const createStars = () => {
            const starCount = 5000;
            const positions = new Float32Array(starCount * 3);
        
            for (let i = 0; i < starCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 100; // Coordenadas aleatorias
                positions[i3 + 1] = (Math.random() - 0.5) * 100;
                positions[i3 + 2] = (Math.random() - 0.5) * 100;
            }
        
            const starGeometry = new THREE.BufferGeometry();
            starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
            const starMaterial = new THREE.PointsMaterial({
                size: 0.02,
                color: '#ffffff',
                transparent: true,
                opacity: 0.8,
            });
        
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);
        
            // Animación de titilación
            const animateStars = () => {
                requestAnimationFrame(animateStars);
                starMaterial.opacity = 0.6 + Math.sin(Date.now() * 0.001) * 0.2; // Variar opacidad
            };
            animateStars();
        };
        
        createStars();
        
        const createNebula = (position, color) => {
            const textureLoader = new THREE.TextureLoader();
            const nebulaTexture = textureLoader.load('/assets/nebula.png'); // Añade una textura de nebulosa
        
            const nebulaMaterial = new THREE.SpriteMaterial({
                map: nebulaTexture,
                color: color,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
            });
        
            const nebula = new THREE.Sprite(nebulaMaterial);
            nebula.position.copy(position);
            nebula.scale.set(10, 10, 1); // Ajusta el tamaño de la nebulosa
            scene.add(nebula);
        
            // Animación sutil
            const animateNebula = () => {
                requestAnimationFrame(animateNebula);
                nebula.material.opacity = 0.5 + Math.sin(Date.now() * 0.001) * 0.2; // Cambiar opacidad
            };
            animateNebula();
        };
        
        // Crear nebulosas alrededor de las galaxias
        galaxyPositions.forEach((pos, index) => {
            const colors = ['#ff9999', '#9999ff', '#99ffff', '#99ff99'];
            createNebula(pos, colors[index]);
        });
        
        const createHalo = (galaxy, color) => {
            const textureLoader = new THREE.TextureLoader();
            const haloTexture = textureLoader.load('/assets/halo.png'); // Textura circular de halo
        
            const haloMaterial = new THREE.SpriteMaterial({
                map: haloTexture, // Asignar la textura circular
                color: color,
                transparent: true,
                opacity: 0.4, // Opacidad más baja para evitar un aspecto sólido
                blending: THREE.AdditiveBlending, // Efecto de brillo natural
            });
        
            const halo = new THREE.Sprite(haloMaterial);
            halo.scale.set(8, 8, 1); // Tamaño del halo, ajusta según sea necesario
            halo.position.copy(galaxy.position);
        
            galaxy.halo = halo;
            scene.add(halo);
        };
        
        
        galaxies.forEach((galaxy, index) => {
            const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
            createHalo(galaxy, colors[index]);
        });
        
 
        //Final prueba
        const animate = () => {
            requestAnimationFrame(animate);
            galaxies.forEach((galaxy, index) => {
                const speed = 0.001 + index * 0.0003;
                galaxy.rotation.y += speed;
            });
            renderer.render(scene, camera);
        };
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        animate();
        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
        };
    
    }, []);
    
    return null;
}