import { useEffect } from 'react';
import * as THREE from 'three';
import BackButton from '../components/BackButton';

export default function Padres() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
    
        scene.background = new THREE.Color(0x000000);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(10, 10, 10);
        pointLight.castShadow = false; // Sin sombras
        scene.add(pointLight);

        // Array para almacenar todas las estrellas
        const stars = [];

        // Función para crear estrellas con diferentes tamaños y posiciones
        function createStar(size, positionX, positionY, positionZ) {
            const shape = new THREE.Shape();
            shape.moveTo(0, size);
            shape.quadraticCurveTo(size * 0.15, size * 0.5, size * 0.3, size * 0.3);
            shape.quadraticCurveTo(size * 0.5, size * 0.15, size, 0);
            shape.quadraticCurveTo(size * 0.5, -size * 0.15, size * 0.3, -size * 0.3);
            shape.quadraticCurveTo(size * 0.15, -size * 0.5, 0, -size);
            shape.quadraticCurveTo(-size * 0.15, -size * 0.5, -size * 0.3, -size * 0.3);
            shape.quadraticCurveTo(-size * 0.5, -size * 0.15, -size, 0);
            shape.quadraticCurveTo(-size * 0.5, size * 0.15, -size * 0.3, size * 0.3);
            shape.quadraticCurveTo(-size * 0.15, size * 0.5, 0, size);

            const extrudeSettings = { depth: size * 0.2, bevelEnabled: false };
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(0xFFD700) },   // Color dorado base
                    edgeColor: { value: new THREE.Color(0x000000) }, // Bordes oscuros
                    emissiveColor: { value: new THREE.Color(0xFFD700) }, // Color de emisión (brillo)
                    emissiveIntensity: { value: 1.5 }, // Intensidad del brillo
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vNormal;
                    uniform vec3 color;
                    uniform vec3 edgeColor;
                    uniform vec3 emissiveColor;
                    uniform float emissiveIntensity;
                    
                    void main() {
                        float intensity = pow(2.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
                        vec3 baseColor = mix(color, edgeColor, intensity);
                        
                        // Simulación de brillo: agrega el color de emisión basado en la intensidad
                        vec3 emissive = emissiveColor * emissiveIntensity;
            
                        gl_FragColor = vec4(baseColor + emissive, 1.0);
                    }
                `
            });

            const star = new THREE.Mesh(geometry, material);
            star.position.set(positionX, positionY, positionZ);

            // Asignar una fase aleatoria para el efecto de pulsación (titileo)
            star.userData.phase = Math.random() * Math.PI * 2;

            scene.add(star);
            stars.push(star);
        }
        
        // Crear múltiples estrellas
        const starsData = [
            [0.8, 0, 0, -5], [0.3, 30, 13, -5], [0.5, 28, -12, -5], [0.8, 26, 7, -5],
            [0.6, 24, -5, -5], [0.8, 34, 0, -6], [0.6, 15, 8, -7], [0.9, 10, -8, -8],
            [0.6, 5, 15, -6], [0.6, 3, -5, -7], [0.6, 2, -16, -6], [0.5, 0, 8, -9],
            [0.6, -3, 18, -8], [0.4, -7, 10, -7], [0.8, -9, -12, -5], [0.9, -12, 10, -8],
            [1.0, -14, -1, -6], [0.9, -18, 15, -9], [0.4, -19, 3, -7], [0.4, -20, -12, -8],
            [0.6, -39, -9, -8], [0.5, -31, -15, -8], [0.9, -32, 10, -8], [0.6, -37, 1, -8]
        ];

        const starsDataResponsive = [
            [0.8, 0, 0, -5], [0.3, 10, 13, -5],[0.6, 10, 5, -5], [0.8, 8, 0, -6], 
            [0.6, 15, 8, -7], [0.9, 10, -8, -8], [0.6, 5, 15, -6], [0.6, 3, -5, -7], 
            [0.6, 2, -13, -6], [0.5, 0, 8, -9], [0.6, -3, 18, -8], [0.4, -7, 10, -7], 
            [0.8, -9, -12, -5], [0.9, -12, 10, -8], [1.0, -10, -1, -6], [0.9, -11, 17, -9],
            [0.6, -8, -6, -8],
        ];

        //starsData.forEach(star => createStar(...star));

        function ResponsiveStars() {
            // Eliminar estrellas existentes
            stars.forEach(star => scene.remove(star));
            stars.length = 0;  // Vaciar la lista de estrellas
        
            // Elegir el dataset según el tamaño de la pantalla
            const data = window.innerWidth <= 768 ? starsDataResponsive : starsData;
        
            // Crear nuevas estrellas
            data.forEach(star => createStar(...star));
        }
        
        // Llamar a la función al cargar la página
        ResponsiveStars();
        window.addEventListener('resize', ResponsiveStars);

        // 1. Generar vértices y una fase aleatoria para cada estrella (conjunto 1)
        const starsVertices1 = [];
        const phases1 = [];
        
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = (Math.random() - 0.5) * 1000;
            starsVertices1.push(x, y, z);
            phases1.push(Math.random() * Math.PI * 2); // Fase aleatoria para el efecto de titilar
        }

        const starsGeometry1 = new THREE.BufferGeometry();
        starsGeometry1.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices1, 3));
        starsGeometry1.setAttribute('phase', new THREE.Float32BufferAttribute(phases1, 1));

        // 2. Crear un ShaderMaterial para controlar el efecto de titilar
        const starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float phase;
            uniform float time;
            void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            // Se varía el tamaño del punto con una función senoidal (efecto titilar)
            gl_PointSize = 2.0 + 2.0 * sin(time + phase);
            gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            void main() {
            // Crear un punto circular suavizando sus bordes
            vec2 coord = gl_PointCoord - vec2(0.5);
            float alpha = 1.0 - smoothstep(0.0, 0.5, length(coord));
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
            }
        `,
        transparent: true
        });

        // 3. Crear el objeto Points para el primer conjunto de estrellas y agregarlo a la escena
        const stars1 = new THREE.Points(starsGeometry1, starsMaterial);
        scene.add(stars1);

        // 4. (Opcional) Repetir el proceso para un segundo conjunto de estrellas
        const starsVertices2 = [];
        const phases2 = [];
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = (Math.random() - 0.5) * 1000;
            starsVertices2.push(x, y, z);
            phases2.push(Math.random() * Math.PI * 2);
        }

        const starsGeometry2 = new THREE.BufferGeometry();
        starsGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices2, 3));
        starsGeometry2.setAttribute('phase', new THREE.Float32BufferAttribute(phases2, 1));

        const stars2 = new THREE.Points(starsGeometry2, starsMaterial);
        scene.add(stars2);

        // Parámetros modificables para la posición inicial de cada estrella
        const initialPositionsDesktop = [
            { x: -26, y: 26, z: -5 }, { x: 12, y: 25, z: -5 }, { x: -22, y: 25, z: -5 },
            { x: 21, y: 23, z: -5 }, { x: -15, y: 30, z: -5 }, { x: 25, y: 30, z: -5 },
            { x: -10, y: 27, z: -5 }, { x: 5, y: 25, z: -5 }, { x: -3, y: 28, z: -5 },
            { x: 8, y: 29, z: -5 }, { x: -6, y: 25, z: -5 }, { x: 17, y: 26, z: -5 }
        ];
        
        // Posiciones ajustadas para pantallas pequeñas
        const initialPositionsMobile = [
            { x: -11, y: 22, z: -5 }, { x: 8, y: 22, z: -5 }, { x: -12, y: 22, z: -5 },
            { x: 10, y: 22, z: -5 }, { x: -7, y: 22, z: -5 }, { x: 13, y: 22, z: -5 },
            { x: -5, y: 22, z: -5 }, { x: 3, y: 22, z: -5 }, { x: -2, y: 22, z: -5 },
            { x: 4, y: 22, z: -5 }, { x: -3, y: 22, z: -5 }, { x: 9, y: 22, z: -5 }
        ];
        
        // Lista de estrellas fugaces
        let shootingStars = [];
        
        // Función para crear estrellas fugaces de forma responsive
        function createShootingStars() {
            // Eliminar las estrellas actuales
            shootingStars.forEach(star => scene.remove(star.trail));
            shootingStars = [];  // Vaciar el array
        
            // Seleccionar dataset según el tamaño de la pantalla
            const data = window.innerWidth <= 768 ? initialPositionsMobile : initialPositionsDesktop;
        
            // Crear nuevas estrellas fugaces
            for (let i = 0; i < data.length; i++) {
                const trailGeometry = new THREE.CylinderGeometry(0.03, 0.03, window.innerWidth <= 768 ? 5 : 8, 50);
                const trailMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        color: { value: new THREE.Color(0xadd8e6) },
                        opacityTop: { value: 0.0 },
                        opacityBottom: { value: 0.8 }
                    },
                    vertexShader: `
                        varying float vY;
                        void main() {
                            vY = position.y;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform vec3 color;
                        uniform float opacityTop;
                        uniform float opacityBottom;
                        varying float vY;
                        void main() {
                            float opacity = mix(opacityBottom, opacityTop, (vY + 5.0) / 10.0);
                            gl_FragColor = vec4(color, opacity);
                        }
                    `,
                    transparent: true
                });
        
                const trail = new THREE.Mesh(trailGeometry, trailMaterial);
                trail.position.set(data[i].x, data[i].y, data[i].z);
                scene.add(trail);
        
                shootingStars.push({ trail, initialPosition: data[i] });
            }
        }
        
        // Llamar a la función al cargar la página
        createShootingStars();
        
        // Escuchar cambios de tamaño de pantalla para actualizar las estrellas fugaces
        window.addEventListener('resize', createShootingStars);

        // Lista de planetas
        const planets = [];
        // Función para crear planetas con posiciones aleatorias o definidas
        function createPlanet(size, color, position) {
            const geometry = new THREE.SphereGeometry(size, 64, 64);
            const material = new THREE.MeshStandardMaterial({
                color: color,
            });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(position.x, position.y, position.z);
            scene.add(planet);
            planets.push(planet);
        }

        function clearPlanets() {
            planets.forEach(planet => scene.remove(planet));
            planets.length = 0; // Vacía el array
        }

        function responsivePlanets(){
            clearPlanets()

            if(window.innerWidth <= 768){
                createPlanet(0.8, 0xC3E4F5, { x: 16, y: 0, z: -25});
                createPlanet(0.8, 0xC3E4F5, { x: 10, y: 10, z: -25});
                createPlanet(1, 0xFFD700, { x: -5, y: -14, z: -25});
                createPlanet(0.4, 0xC3E4F5, { x: -10, y: 5, z: -25});
                createPlanet(0.7, 0xC3E4F5, { x: -17, y: -10, z: -25});
                createPlanet(0.4, 0xFFD700, { x: -10, y: 19, z: -25});
                createPlanet(0.4, 0xFFD700, { x: 0, y: 16, z: -25});
                createPlanet(0.4, 0xFFD700, { x: 12, y: -20, z: -25});
                createPlanet(0.4, 0xC3E4F5, { x: 5, y: -13, z: -25});
                createPlanet(0.5, 0xFFD700, { x: 5, y: 2, z: -25});
                createPlanet(0.4, 0xFFD700, { x: -5, y: -5, z: -25});
            }
            else{
                createPlanet(0.6, 0xFFD700, { x: 32, y: 17, z: -15});
                createPlanet(0.4, 0xC3E4F5, { x: 16, y: -14, z: -15});
                createPlanet(0.8, 0xC3E4F5, { x: 16, y: 0, z: -15});
                createPlanet(0.4, 0xFFD700, { x: -32, y: -10, z: -15});  
                createPlanet(0.6, 0xC3E4F5, { x: 10, y: 7, z: -15});
                createPlanet(0.8, 0xFFD700, { x: -5, y: -7, z: -15});
                createPlanet(0.4, 0xC3E4F5, { x: -10, y: 5, z: -15});
                createPlanet(0.8, 0xFFD700, { x: -30, y: 8, z: -15});
                createPlanet(0.2, 0xC3E4F5, { x: -30, y: 15, z: -15});
                createPlanet(0.15, 0xC3E4F5, { x: -40, y: 0, z: -15});
                createPlanet(0.5, 0xC3E4F5, { x: -25, y: -20, z: -15});
                createPlanet(0.7, 0xC3E4F5, { x: -18, y: -10, z: -15});
                createPlanet(0.4, 0xFFD700, { x: -10, y: 19, z: -15});
                createPlanet(0.2, 0xFFD700, { x: 0, y: 18, z: -15});
                createPlanet(0.4, 0xFFD700, { x: 12, y: -20, z: -15});
                createPlanet(0.6, 0xC3E4F5, { x: 20, y: 15, z: -15});
                createPlanet(0.6, 0xC3E4F5, { x: 28, y: 7, z: -15});
                createPlanet(0.6, 0xC3E4F5, { x: 27, y: -10, z: -15});
            }
        }

        responsivePlanets();
        window.addEventListener("resize", responsivePlanets);
        
        // Termina lo del Fondo
        
        const galaxies = [];
        const galaxyMaterials = [];
        const galaxyTitles = [
            "Peligros de Salud Social [R]",
            "Peligros Digitales [M]",
            "Peligros de Salud Física [C]",
            "Peligros de Salud Mental [V]"
        ];
        const galaxyUrls = [
            "/padres/salud_social",
            "/padres/peligros_digitales",
            "/padres/salud_fisica",
            "/padres/salud_mental"
        ];
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isAnimating = false;
        let hoveredGalaxy = null; // Almacena la galaxia actualmente resaltada
        const createGalaxy = (position, baseColor, rotation = { x: 0, y: 0, z: 0 }) => {
            const particles = 15000;
            const spiralArms = 5;
            const radius = 5;
            const spread = 0.8;
            const positions = new Float32Array(particles * 3);
            const colors = new Float32Array(particles * 3);
            const color = new THREE.Color(baseColor);

            for (let i = 0; i < particles; i++) {
                const i3 = i * 3;
                const r = Math.random() * radius;
                const angle = (i % spiralArms) * (Math.PI * 2 / spiralArms) + r * 0.8;

                const x = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
                const y = (Math.random() - 0.5) * spread;
                const z = Math.sin(angle) * r + (Math.random() - 0.5) * spread;

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = z;

                const variation = Math.random() * 0.5 - 0.25;
                const adjustedColor = color.clone().offsetHSL(0, 0.1, variation);

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
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const galaxy = new THREE.Points(geometry, material);
            galaxy.position.copy(position);
            galaxy.rotation.set(rotation.x, rotation.y, rotation.z);

            scene.add(galaxy);
            galaxies.push(galaxy);
            galaxyMaterials.push(material);
        };

        /*const galaxyPositions = [
            new THREE.Vector3(-13, 1, 0),
            new THREE.Vector3(13, 1, 0),
            new THREE.Vector3(0, -7, 0),
            new THREE.Vector3(0, 10, 0),
        ];*/

        function getGalaxyPositions() {
            const isMobile = window.innerWidth < 768; // Definir si es móvil según el ancho de la pantalla
        
            if (isMobile) {
                return [
                    { position: new THREE.Vector3(0, 10, 0), rotation: { x: Math.PI / 4, y: 0, z: 0 } },
                    { position: new THREE.Vector3(0, 5, 0), rotation: { x: Math.PI / 4, y: Math.PI / 2, z: 0 } },
                    { position: new THREE.Vector3(0, -4, 0), rotation: { x: Math.PI / 17, y: Math.PI, z: 0 } },
                    { position: new THREE.Vector3(0, -10, 0), rotation: { x: Math.PI / 20, y: -Math.PI / 2, z: 0 } },
                ];
            } else {
                return [
                    { position: new THREE.Vector3(-15, 1, 0), rotation: { x: Math.PI / 4, y: 0, z: 0 } },
                    { position: new THREE.Vector3(15, 1, 0), rotation: { x: Math.PI / 4, y: Math.PI / 2, z: 0 } },
                    { position: new THREE.Vector3(0, -7, 0), rotation: { x: Math.PI / 17, y: Math.PI, z: 0 } },
                    { position: new THREE.Vector3(0, 7, 0), rotation: { x: Math.PI / 4, y: -Math.PI / 2, z: 0 } },
                ];
            }
        }
        
        // Función para actualizar las posiciones de las galaxias
        const updateGalaxyData = () => {
            const newData = getGalaxyPositions(); // Obtener nuevos datos (posición y rotación)
            galaxies.forEach((galaxy, index) => {
                galaxy.position.copy(newData[index].position); // Actualizar posición
                galaxy.rotation.set(
                    newData[index].rotation.x,
                    newData[index].rotation.y,
                    newData[index].rotation.z
                ); // Actualizar rotación
            });
        };

        // Crear las galaxias iniciales
        const initialPositions = getGalaxyPositions();
        const colors = ['#8C7853', '#DAA520', '#878681', '#ADD8E6'];
        /*const rotations = [
            { x: Math.PI / 4, y: 0, z: 0 },
            { x: Math.PI / 4, y: 0, z: 0 },
            { x: Math.PI / 17, y: 0, z: 0 },
            { x: Math.PI / 4, y: 0, z: 0 },
        ];*/
        initialPositions.forEach((data, index) => {
            createGalaxy(data.position, colors[index], data.rotation); // Crear galaxia con posición y rotación
        });

        // Escuchar cambios de tamaño de pantalla para actualizar las posiciones de las galaxias
        window.addEventListener('resize', updateGalaxyData);

        /*const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
        const rotations = [
            { x: Math.PI / 5, y: 0, z: 0 },
            { x: Math.PI / 5, y: 0, z: 0 },
            { x: Math.PI / 17, y: 0, z: 0 },
            { x: Math.PI / 3, y: 0, z: 0 },
        ];
        galaxyPositions.forEach((pos, index) => createGalaxy(pos, colors[index], rotations[index]));*/

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
        
        /*const createNebula = (position, color) => {
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
        });*/


        let selectedGalaxyIndex = -1;

        // Crear contenedor de texto central responsive
        const centralDiv = document.createElement('div');
        centralDiv.style.position = 'absolute';
        centralDiv.style.top = '50%';
        centralDiv.style.left = '50%';
        centralDiv.style.transform = 'translate(-50%, -50%)';
        centralDiv.style.color = '#ffffff';
        centralDiv.style.fontSize = window.innerWidth < 768 ? '18px' : '24px';
        centralDiv.style.textAlign = 'center';
        centralDiv.style.background = 'rgba(0, 0, 0, 0.4)';
        centralDiv.style.padding = window.innerWidth < 768 ? '20px' : '30px';
        centralDiv.style.borderRadius = '15px';
        centralDiv.style.display = 'flex';
        centralDiv.style.flexDirection = 'column';
        centralDiv.style.alignItems = 'center';
        centralDiv.style.width = window.innerWidth < 768 ? '90%' : '450px';
        centralDiv.style.maxWidth = '450px';
        centralDiv.style.backdropFilter = 'blur(10px)';
        centralDiv.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        centralDiv.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
        document.body.appendChild(centralDiv);

        const centralText = document.createElement('p');
        centralText.textContent = "¿A dónde vamos a ir hoy? (Seleccione una de las siguientes galaxias)";
        centralText.style.margin = '0';
        centralText.style.fontWeight = '300';
        centralText.style.letterSpacing = '0.5px';
        centralText.style.lineHeight = '1.5';
        centralDiv.appendChild(centralText);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = "Confirmar";
        confirmButton.style.marginTop = '20px';
        confirmButton.style.padding = window.innerWidth < 768 ? '10px 25px' : '12px 30px';
        confirmButton.style.background = 'linear-gradient(135deg,rgb(255, 233, 110) 0%,rgb(213, 175, 52) 50%,rgb(169, 121, 0) 100%)';
        confirmButton.style.color = 'white';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '8px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.fontSize = window.innerWidth < 768 ? '14px' : '16px';
        confirmButton.style.fontWeight = '500';
        confirmButton.style.letterSpacing = '1px';
        confirmButton.style.boxShadow = '0 4px 15px rgba(218, 165, 32, 0.3)';
        confirmButton.style.transition = 'all 0.3s ease';
        confirmButton.style.display = 'none';

        confirmButton.addEventListener('mouseenter', () => {
            confirmButton.style.transform = 'translateY(-2px)';
            confirmButton.style.boxShadow = '0 6px 15px rgba(218, 165, 32, 0.3)';
        });

        confirmButton.addEventListener('mouseleave', () => {
            confirmButton.style.transform = 'translateY(0)';
            confirmButton.style.boxShadow = '0 4px 15px rgba(218, 165, 32, 0.3)';
            gala
        });

        centralDiv.appendChild(confirmButton);

        // Actualizar estilos en resize
        window.addEventListener('resize', () => {
            centralDiv.style.fontSize = window.innerWidth < 768 ? '18px' : '24px';
            centralDiv.style.padding = window.innerWidth < 768 ? '20px' : '30px';
            centralDiv.style.width = window.innerWidth < 768 ? '90%' : '450px';
            confirmButton.style.padding = window.innerWidth < 768 ? '10px 25px' : '12px 30px';
            confirmButton.style.fontSize = window.innerWidth < 768 ? '14px' : '16px';
        });

        const moveToGalaxy = (galaxy, title, url) => {
            if (isAnimating) return;
            isAnimating = true;
            
            // Hacer invisibles las galaxias no seleccionadas
            galaxies.forEach(g => {
                if(g === galaxy){
                    g.visible = true;
                }else{
                    g.visible = false;
                }
            });

            const duration = 1.5;
            const distance = 9;
            const direction = new THREE.Vector3().subVectors(camera.position, galaxy.position).normalize();
            const targetPosition = new THREE.Vector3().copy(galaxy.position).add(direction.multiplyScalar(distance));
            const startPosition = new THREE.Vector3().copy(camera.position);
            let elapsed = 0;

            const animateMove = () => {
                elapsed += 0.01;
                const t = Math.min(elapsed / duration, 1);
                const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                camera.position.lerpVectors(startPosition, targetPosition, easeT);
                camera.lookAt(galaxy.position);

                if (t < 1) {
                    requestAnimationFrame(animateMove);
                } else {
                    window.location.href = url;
                }
            };

            animateMove();
        };

        const onClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(galaxies);

            galaxyMaterials.forEach((material) => {
                material.size = 0.05;
                material.opacity = 0.8;
            });

            if (intersects.length > 0) {
                const targetGalaxy = intersects[0].object;
                const galaxyIndex = galaxies.indexOf(targetGalaxy);

                if (galaxyIndex !== -1) {
                    selectedGalaxyIndex = galaxyIndex;

                    galaxyMaterials[galaxyIndex].size = 0.08;
                    galaxyMaterials[galaxyIndex].opacity = 1;

                    centralText.textContent = `Iremos a ${galaxyTitles[galaxyIndex]}, ¿Correcto?`;
                    confirmButton.style.display = 'block';
                }
            }
        };
        
        confirmButton.addEventListener('click', () => {
            if (selectedGalaxyIndex !== -1) {
                centralDiv.style.display = 'none';
                moveToGalaxy(galaxies[selectedGalaxyIndex], galaxyTitles[selectedGalaxyIndex], galaxyUrls[selectedGalaxyIndex]);
                setTimeout(() => {
                    centralDiv.style.display = 'flex'; // Mostrar el centralDiv
                    isAnimating = false;
                }, 900); // Retraso adicional (opcional)
            }
        });

        renderer.domElement.addEventListener('click', onClick);
        
        let speed = 0.1;
        let currentStarIndex = 0; // Índice de la estrella actual en movimiento

        const animateShootingStar = (index) => {
            if (index >= shootingStars.length) {
                currentStarIndex = 0;
                animateShootingStar(currentStarIndex);
                return;
            }

            const { trail, initialPosition } = shootingStars[index];

            const dropStar = () => {
                trail.position.y -= speed;

                if (trail.position.y > -20) {
                    requestAnimationFrame(dropStar);
                } else {
                    trail.position.set(initialPosition.x, initialPosition.y, initialPosition.z);

                    setTimeout(() => {
                        currentStarIndex++;
                        animateShootingStar(currentStarIndex);
                    }, 500);
                }
            };

            dropStar();
        };

        //Final prueba
        const animate = () => {
            requestAnimationFrame(animate);
            galaxies.forEach((galaxy, index) => {
                const speed = 0.001 + index * 0.0003;
                galaxy.rotation.y += speed;
            });

            const time = performance.now();

            stars.forEach(star => {
                // Efecto de pulsación: la escala varía de forma sinusoidal
                const pulse = 1 + 0.1 * Math.sin(time * 0.002 + star.userData.phase);
                star.scale.set(pulse, pulse, pulse);
            });

            starsMaterial.uniforms.time.value = performance.now() * 0.002;

            /*shootingStars.forEach(({ star, trail, initialPosition }) => {
                star.position.y -= speed;
                trail.position.y = star.position.y + 5; // Mantener la estela arriba de la estrella
                
                // Rotación en el eje Z
                star.rotation.z += 0.05;
                
                if (star.position.y < -20) {
                    star.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
                    trail.position.set(star.position.x, star.position.y + 5, star.position.z);
                }
            });*/

            const timePlanet = performance.now() * 0.002; // Tiempo para la animación

            planets.forEach((planet) => {
                if (planet.rotation) {
                    planet.rotation.z += 0.01; // Rotación en el eje Y
                }
            });

            renderer.render(scene, camera);
        };

        renderer.domElement.addEventListener('mousemove', onMouseMove);
        animate();
        animateShootingStar(currentStarIndex);
        
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            centralDiv.remove();
        };
    
    }, []);
    
    return (
        <>
            <BackButton color={'#CCAC00'} background= {'none'}/>
        </>
    )
}