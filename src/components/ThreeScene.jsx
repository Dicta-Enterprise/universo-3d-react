import { useEffect } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';



export default function ThreeScene({ onLoad }) {
    const navigate = useNavigate();

    useEffect(() => {

        // Crea la escena, cámara y renderizador
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Fondo espacial
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        // Crea la esfera (planeta) con la textura de la Tierra
        const planetTexture = new THREE.TextureLoader().load('/assets/earthx5400x2700.jpg');
        const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        scene.add(planet);

        // Añade luz para que el planeta sea visible

        // const light = new THREE.PointLight(0xffffff, 1.5, 150); // Aumenta la intensidad y el alcance

        // Luz principal (simula el sol)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Aumenta la intensidad y el alcance
        directionalLight.position.set(3, 3, 3); // Ubica la luz en una posición lejana y diagonal al planeta
        scene.add(directionalLight);

        // Luz ambiental para rellenar sombras
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Luz suave en todo el ambiente
        // scene.add(ambientLight);

        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x333333, 0.9); // Azul cielo y gris oscuro para el suelo
        // scene.add(hemisphereLight);

        // Posición inicial de la cámara
        camera.position.z = 3;

        // Función de animación para rotar el planeta
        //function animate() {
        //  requestAnimationFrame(animate);
        // planet.rotation.y += 0.004;  // Rotación del planeta sobre su eje Y
        //renderer.render(scene, camera);
        //}


        // Cargar el modelo del astronauta (usando GLTFLoader)
        /*const loader = new GLTFLoader();
        let astronaut;
        let mixer;  // Mezclador para animaciones (si el modelo tiene animaciones)
        
        // Cargar el modelo 3D del astronauta
        loader.load('/assets/astronaut/source/Astronaut.glb', function(gltf) {
            astronaut = gltf.scene;
            astronaut.scale.set(0.5, 0.5, 0.5); // Ajusta el tamaño del astronauta
            astronaut.position.set(1, 0, 0);  // Posición inicial sobre la superficie del planeta
            scene.add(astronaut);
        
            // Si el modelo tiene animaciones
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(astronaut);  // Crear el mezclador de animaciones
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play(); // Reproducir todas las animaciones del modelo
                });
            }
        });
        
        // Animación del astronauta (mover alrededor del planeta)
        let angle = 0; // Variable para animar el astronauta
        
        function animateAstronaut() {
            if (astronaut) {
                // Movimiento orbital alrededor del planeta
                angle += 0.01; // Aumenta el ángulo para mover al astronauta
                const radius = 1.2; // Radio para orbitar alrededor del planeta
                const x = radius * Math.cos(angle); // Coordenada x
                const z = radius * Math.sin(angle); // Coordenada z
                const y = Math.sin(angle) * 0.5; // Altura para que el astronauta esté ligeramente sobre el planeta
        
                // Actualiza la posición del astronauta
                astronaut.position.set(x, y, z);
        
                // Hace que el astronauta mire hacia el centro del planeta
                astronaut.lookAt(0, 0, 0);
            }
        }
        */

        /*// Crear el platillo volador
        const ufoGroup = new THREE.Group();
        
        // **Disco Principal** (más pequeño)
        const ufoDiskGeometry = new THREE.CylinderGeometry(0.2, 0.4, 0.1, 60); // Tamaño del disco
        const ufoDiskMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444, // Gris oscuro
            metalness: 0.8,
            roughness: 0.4,
        });
        const ufoDisk = new THREE.Mesh(ufoDiskGeometry, ufoDiskMaterial);
        ufoDisk.rotation.x = Math.PI / 2; // Orientación horizontal
        ufoGroup.add(ufoDisk);
        
        // **Cúpula Superior**
        const ufoDomeGeometry = new THREE.SphereGeometry(0.1, 32, 32, 0, Math.PI); // Media esfera
        const ufoDomeMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555, // Gris oscuro
            metalness: 0.8,
            roughness: 0.3,
        });
        const ufoDome = new THREE.Mesh(ufoDomeGeometry, ufoDomeMaterial);
        ufoDome.position.y = 0.1; // Ubicar sobre el disco
        ufoGroup.add(ufoDome);
        
        // **Luz Central Azul**
        const centerLightGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Esfera pequeña para la luz central
        const centerLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ccff }); // Luz azul brillante
        const centerLight = new THREE.Mesh(centerLightGeometry, centerLightMaterial);
        centerLight.position.set(0, -0.02, 0); // Debajo del disco
        ufoGroup.add(centerLight);
        
        // **Rayo de Luz Azul**
        const rayGeometry = new THREE.CylinderGeometry(0.05, 0.4, 2, 32, 1, true); // Forma de cono invertido
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ccff,
            opacity: 0.2, // Semi-transparente
            transparent: true,
        });
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.y = -1; // Posicionado debajo del disco
        ufoGroup.add(ray);
        
        // Configuración inicial del platillo
        ufoGroup.position.set(0, 1, -10); // Inicialmente en el fondo
        scene.add(ufoGroup);
        
        // **Animación del Platillo Volador (Movimiento Lineal)**
        function animateUFO() {
            if (ufoGroup.position.z < 3) {
                ufoGroup.position.z += 0.05; // Movimiento hacia adelante
            } else {
                ufoGroup.position.set(0, 1, -10); // Reiniciar posición
            }
        }*/

        const loader2 = new OBJLoader();
        let ufo; // Variable para el platillo

        // Cargar el modelo del platillo
        loader2.load(
            '/assets/platillo/UFO.obj', // Ruta del modelo
            function (object) {
                ufo = object;

                // Posición inicial del platillo fuera de la cámara, en el lado derecho
                ufo.position.set(30, 0, -50); // Posición inicial: a la derecha (X positivo) y lejos en Z
                ufo.scale.set(0.5, 0.5, 0.5); // Ajustar el tamaño si es necesario
                scene.add(ufo); // Añadir a la escena
                console.log('Platillo cargado con éxito');
            },
            function (xhr) {
                // Progreso de carga
                console.log((xhr.loaded / xhr.total * 100) + '% cargado');
            },
            function (error) {
                // Manejo de errores
                console.error('Error cargando el platillo:', error);
            }
        );

        // Variables para el movimiento y escala del platillo
        let ufoSpeedZ = 0.1;     // Velocidad en Z (hacia adelante)
        let ufoSpeedX = -0.05;   // Velocidad en X (hacia el centro)
        const startXUFO = 30;    // Posición inicial en X (derecha)
        const endXUFO = 0;       // Posición final en X (centro)
        const startZUFO = -50;   // Posición inicial en Z (lejos de la cámara)
        const endZUFO = 10;      // Posición final en Z (cerca de la cámara)
        let startScaleUFO = 0.2; // Escala inicial del platillo
        let endScaleUFO = 1.0;   // Escala final del platillo

        // Animación del platillo
        function animateUFO() {
            if (ufo) {
                // Mover el platillo hacia adelante en el eje Z
                ufo.position.z += ufoSpeedZ;

                // Mover el platillo desde la derecha hacia el centro en el eje X
                ufo.position.x += ufoSpeedX;

                // Interpolación para hacer que la escala crezca a medida que el platillo se acerca
                let progressZ = (ufo.position.z - startZUFO) / (endZUFO - startZUFO);
                let scale = startScaleUFO + (endScaleUFO - startScaleUFO) * progressZ;
                ufo.scale.set(scale, scale, scale); // Ajustar la escala en todos los ejes

                // Si el platillo pasa la posición final, reiniciar su posición y escala
                if (ufo.position.z > endZUFO) {
                    ufo.position.set(startXUFO, 0, startZUFO); // Reiniciar posición (derecha y lejos)
                    ufo.scale.set(startScaleUFO, startScaleUFO, startScaleUFO); // Restablecer la escala
                }
            }
        }




        // **Partículas**
        const particlesGroup = new THREE.Group(); // Crear un grupo para las partículas
        const sphereCount = 900; // Número de partículas
        const particles = []; // Arreglo para almacenar las partículas

        for (let i = 0; i < sphereCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8); // Pequeñas esferas como partículas
            const material = new THREE.MeshBasicMaterial({
                color: 0x888888, // gris oscuro
                transparent: true,
                opacity: Math.random() * 0.7 + 0.3, // Opacidad aleatoria
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                Math.random() * 100 - 50, // Posición aleatoria en X
                Math.random() * 100 - 50, // Posición aleatoria en Y
                Math.random() * -200 // Profundidad aleatoria en Z
            );
            particles.push(particle); // Agregar la partícula al arreglo
            particlesGroup.add(particle); // Agregar al grupo de partículas
        }

        scene.add(particlesGroup); // Agregar las partículas a la escena principal

        // **Animación de las Partículas**
        function animateParticles() {
            particles.forEach((particle) => {
                particle.position.z += 0.2; // Movimiento hacia adelante en Z
                if (particle.position.z > 100) {
                    // Reiniciar posición cuando salga del campo de visión
                    particle.position.z = Math.random() * -200;
                    particle.position.x = Math.random() * 100 - 50;
                    particle.position.y = Math.random() * 100 - 50;
                }
                // Variar ligeramente la opacidad para simular parpadeo
                particle.material.opacity = Math.random() * 0.7 + 0.3;
            });
        }


        // Cargar el modelo 3D del meteorito
        const loader1 = new GLTFLoader();
        let meteorite;

        // Cargar el modelo del meteorito
        loader1.load('/assets/meteor/meteor.glb', function (gltf) {
            meteorite = gltf.scene;

            // Posición inicial del meteorito fuera de la cámara, en el lado izquierdo
            meteorite.position.set(-30, 0, -50);  // Lejos de la cámara en Z
            scene.add(meteorite);
        },
            function (xhr) {
                // Monitoreo del progreso de carga
                console.log((xhr.loaded / xhr.total * 100) + '% cargado');
            },
            function (error) {
                // Muestra cualquier error que ocurra
                console.error('Error cargando el meteorito: ', error);
            });

        // Posición inicial de la cámara
        camera.position.z = 3;

        // Velocidades de movimiento
        let meteoriteSpeed = 0.1;  // Velocidad del meteorito

        // Rango del movimiento en el eje Z
        const startZ = -50;  // Posición inicial en Z (lejos de la cámara)
        const endZ = 10;     // Posición final en Z (cerca de la cámara)

        // Variables para controlar la escala del meteorito
        let startScale = 0.1;  // Escala inicial del meteorito (pequeño)
        let endScale = 5.0;    // Escala final del meteorito (grande)

        function animateMeteorite() {
            if (meteorite) {
                // Mover el meteorito hacia adelante en el eje Z
                meteorite.position.z += meteoriteSpeed;

                // Interpolación para hacer que la escala crezca a medida que el meteorito se acerca
                let progress = (meteorite.position.z - startZ) / (endZ - startZ);
                let scale = startScale + (endScale - startScale) * progress;
                meteorite.scale.set(scale, scale, scale);  // Ajustar la escala en todos los ejes

                // Si el meteorito pasa la posición final, reiniciar su posición y escala
                if (meteorite.position.z > endZ) {
                    meteorite.position.z = startZ;
                    meteorite.scale.set(startScale, startScale, startScale);  // Restablecer la escala
                }
            }
        }

        /*Crear la estrella fugaz
        const starGeometry = new THREE.SphereGeometry(0.04, 30, 30);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const shootingStar = new THREE.Mesh(starGeometry, starMaterial);
        shootingStar.position.set(-9, -5, -9); // Posición inicial
        scene.add(shootingStar);
        
        // Crear el rastro de la estrella fugaz
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
        const trailVertices = new Float32Array(6); // Línea entre 2 puntos
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailVertices, 3));
        const starTrail = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(starTrail);
        
        
        // Animación de la estrella fugaz
        function animateShootingStar() {
            if (shootingStar.position.x < 5) {
                shootingStar.position.x += 0.1; // Movimiento hacia la derecha
                shootingStar.position.y -= 0.03; // Movimiento descendente
                shootingStar.position.z += 0.05; // Movimiento hacia adelante
        
                // Actualizar rastro
                const positions = starTrail.geometry.attributes.position.array;
                positions[0] = shootingStar.position.x;
                positions[1] = shootingStar.position.y;
                positions[2] = shootingStar.position.z;
                positions[3] = shootingStar.position.x - 0.5;
                positions[4] = shootingStar.position.y + 0.2;
                positions[5] = shootingStar.position.z - 0.5;
                starTrail.geometry.attributes.position.needsUpdate = true;
            } else {
                shootingStar.position.set(-5, 2, -5); // Reiniciar posición
            }
        }
        
        */
        const rockets = [];
        const moons = []; // Array para almacenar las lunas

        function createMoon(position, index) {
            const loader = new GLTFLoader();
            const moonGroup = new THREE.Group();

            loader.load(
                '/assets/moon/scene.gltf',
                function (gltf) {
                    const moon = gltf.scene;
                    
                    // Ajustar la escala de la luna según el dispositivo
                    const isMobile = window.innerWidth <= 768;
                    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
                    
                    if (isMobile) {
                        moon.scale.set(0.3, 0.3, 0.3);
                    } else if (isTablet) {
                        moon.scale.set(0.4, 0.4, 0.4);
                    } else {
                        moon.scale.set(0.1, 0.1, 0.1);
                    }

                    // Añadir material con efecto de resplandor
                    moon.traverse((child) => {
                        if (child.isMesh) {
                            const material = new THREE.MeshStandardMaterial({
                                ...child.material,
                                emissive: new THREE.Color(0xf4e99b), // Color cálido para la luna
                                emissiveIntensity: 0.2,
                                roughness: 0.8,
                                metalness: 0.2
                            });
                            child.material = material;
                        }
                    });

                    // Crear luz para la luna
                    const moonLight = new THREE.PointLight(0xf4e99b, 1, 10);
                    moonLight.position.set(0, 0, 0);
                    moonGroup.add(moonLight);

                    moonGroup.add(moon);
                    scene.add(moonGroup);
                    moons.push(moonGroup);

                    // Configurar parámetros de órbita
                    moonGroup.userData.orbitRadius = 2.5; // Radio de la órbita
                    moonGroup.userData.orbitSpeed = 0.01; // Velocidad de la órbita
                    moonGroup.userData.orbitAngle = index * (Math.PI * 2 / 3); // Ángulo inicial (distribuido)
                    moonGroup.userData.orbitHeight = 0.5; // Altura de la órbita
                },
                undefined,
                function (error) {
                    console.error('Error al cargar el modelo de la luna:', error);
                }
            );
        }

        // Función para animar la órbita de las lunas
        function animateMoons() {
            moons.forEach((moon, index) => {
                if (moon.userData.orbitRadius) {
                    // Actualizar ángulo de órbita
                    moon.userData.orbitAngle += moon.userData.orbitSpeed;
                    
                    // Calcular nueva posición
                    const x = Math.cos(moon.userData.orbitAngle) * moon.userData.orbitRadius;
                    const z = Math.sin(moon.userData.orbitAngle) * moon.userData.orbitRadius;
                    const y = moon.userData.orbitHeight;
                    
                    // Aplicar posición
                    moon.position.set(x, y, z);
                    
                    // Hacer que la luna mire hacia el planeta
                    moon.lookAt(0, 0, 0);
                }
            });
        }

        function createRocket(position, index) {
            const loader = new GLTFLoader();
            const rocketGroup = new THREE.Group();

            loader.load(
                '/assets/cohete/scene.gltf',
                function (gltf) {
                    const rocket = gltf.scene;
                    
                    // Ajustar la escala del cohete según el dispositivo
                    const isMobile = window.innerWidth <= 768;
                    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
                    
                    if (isMobile) {
                        rocket.scale.set(5, 5, 5);
                    } else if (isTablet) {
                        rocket.scale.set(4, 4, 4);
                    } else {
                        rocket.scale.set(5, 5, 5);
                    }
                    
                    // Ajustar la rotación inicial
                    rocket.rotation.y = Math.PI;

                    // Agregar efecto de resplandor y materiales interactivos
                    rocket.traverse((child) => {
                        if (child.isMesh) {
                            const material = new THREE.MeshStandardMaterial({
                                ...child.material,
                                emissive: new THREE.Color(0x000000),
                                emissiveIntensity: 0
                            });
                            child.material = material;
                            child.userData.originalColor = material.color.clone();
                        }
                    });
                    
                    // Ajustar posición de los cohetes según el dispositivo
                    if (isMobile) {
                        const yOffset = 0.4;
                        rocketGroup.position.set(
                            0,
                            position.y - index * yOffset,
                            position.z + index * 1.5
                        );
                    } else if (isTablet) {
                        const xOffset = 1.5;
                        rocketGroup.position.set(
                            position.x * xOffset,
                            position.y,
                            position.z
                        );
                    } else {
                        rocketGroup.position.set(position.x, position.y, position.z);
                    }

                    // Agregar un bounding box para mejorar la detección de clics
                    const box = new THREE.Box3().setFromObject(rocket);
                    const helper = new THREE.Box3Helper(box, 0xffff00);
                    helper.visible = false;
                    rocketGroup.add(helper);

                    rocketGroup.add(rocket);
                    scene.add(rocketGroup);
                    rockets.push(rocketGroup);

                    rocketGroup.userData.url = position.url;
                    rocketGroup.userData.isHovered = false;
                },
                undefined,
                function (error) {
                    console.error('Error al cargar el modelo del cohete:', error);
                }
            );
        }

        // Crear cohetes y sus lunas correspondientes
        createRocket({ x: -1, y: -0.6, z: 5, url: '/ninos' }, 0);
        //createMoon({ x: -1, y: -0.6, z: 5 }, 0);
        
        createRocket({ x: 0, y: -0.6, z: 5, url: '/jovenes' }, 1);
        createMoon({ x: 0, y: -0.6, z: 5 }, 1);
        
        createRocket({ x: 1, y: -0.6, z: 5, url: '/padres' }, 2);
        //createMoon({ x: 1, y: -0.6, z: 5 }, 2);

        // Raycaster para detección de clics
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Función para manejar el hover
        function handleHover(event) {
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects([...rockets, ...moons], true);

            // Resetear todos los cohetes y lunas
            rockets.forEach(rocket => {
                if (rocket.userData.isHovered) {
                    rocket.traverse(child => {
                        if (child.isMesh && child.userData.originalColor) {
                            child.material.color.copy(child.userData.originalColor);
                            child.material.transparent = false;
                            child.material.opacity = 1;
                            child.material.emissiveIntensity = 0;
                        }
                    });
                    rocket.userData.isHovered = false;
                }
            });

            moons.forEach(moon => {
                moon.traverse(child => {
                    if (child.isMesh) {
                        child.material.emissiveIntensity = 0.2;
                    }
                });
            });

            // Resaltar el objeto hover
            if (intersects.length > 0) {
                const object = intersects[0].object.parent;
                if (rockets.includes(object)) {
                    // Es un cohete
                    object.traverse(child => {
                        if (child.isMesh && child.userData.originalColor) {
                            child.material.color.setHex(0xffffff);
                            child.material.transparent = true;
                            child.material.opacity = 1;
                            child.material.emissiveIntensity = isMobile ? 0.8 : (isTablet ? 0.6 : 0.5);
                        }
                    });
                    object.userData.isHovered = true;
                } else if (moons.includes(object)) {
                    // Es una luna
                    object.traverse(child => {
                        if (child.isMesh) {
                            child.material.emissiveIntensity = 0.8;
                        }
                    });
                }
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        }

        // Función para manejar clics
        function handleClick(event) {
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(rockets, true);

            if (intersects.length > 0) {
                const rocket = intersects[0].object.parent;
                
                // Efecto visual al hacer clic
                rocket.traverse(child => {
                    if (child.isMesh) {
                        const originalScale = child.scale.clone();
                        const scaleFactor = isMobile ? 1.3 : (isTablet ? 1.25 : 1.2);
                        child.scale.multiplyScalar(scaleFactor);
                        setTimeout(() => {
                            child.scale.copy(originalScale);
                        }, 200);
                    }
                });

                setTimeout(() => {
                    if (rocket.userData.url) {
                        window.location.href = rocket.userData.url;
                    }
                }, 300);
            }
        }

        // Agregar event listeners
        window.addEventListener('mousemove', handleHover);
        window.addEventListener('click', handleClick);
        // Agregar soporte para toques en dispositivos móviles
        window.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            const clickEvent = new MouseEvent('click', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            handleClick(clickEvent);
        });

        // Actualizar visibilidad y posición en función del scroll
        const maxScrollY = 2000;
        const cameraStartZ = 3;
        const cameraEndZ = 13;
        const cameraStartY = 0;
        const cameraEndY = -2;

        let scrollY = 0;
        let isScrolling = false;
        
        function updateOnScroll() {
            // Interpolación para la posición de la cámara
            const progress = Math.min(scrollY / maxScrollY, 1);
            camera.position.z = cameraStartZ + progress * (cameraEndZ - cameraStartZ);
            camera.position.y = cameraStartY + progress * (cameraEndY - cameraStartY);
        
            // Mostrar los cohetes progresivamente
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            rockets.forEach((rocket, index) => {
                if (isMobile) {
                    const threshold = maxScrollY * (0.3 + index * 0.1); // Más escalonado en móvil
                    rocket.visible = scrollY > threshold;
                } else if (isTablet) {
                    const threshold = maxScrollY * 0.2; // Todos visibles al mismo tiempo
                    rocket.visible = scrollY > threshold;
                } else {
                    const threshold = maxScrollY * 0.2; // Todos visibles al mismo tiempo
                    rocket.visible = scrollY > threshold;
                }
            });
        
            // Marcar que el scrolling terminó
            isScrolling = false;
        }
        
        // Escuchar el evento de scroll
        let isInRocketSection = false;

        // Modificar handleScroll para ocultar/mostrar el sol y las lunas igual que el planeta
        function handleScroll() {
            const scrollY = window.scrollY;
            // Verifica si el scroll ha llegado a la sección de las naves
            if (scrollY > 500 && !isInRocketSection) {
                isInRocketSection = true;
                // Inicia la desaparición del planeta
                planet.material.transparent = true;
                planet.material.opacity = 1;
                const fadeOutPlanet = () => {
                    if (planet.material.opacity > 0) {
                        planet.material.opacity -= 0.05;
                        requestAnimationFrame(fadeOutPlanet);
                    } else {
                        planet.visible = false;
                    }
                };
                fadeOutPlanet();
                // --- Fade out del sol ---
                if (sunGroup) {
                    sunGroup.traverse((child) => {
                        if (child.material && 'opacity' in child.material) {
                            child.material.transparent = true;
                            child.material.opacity = 1;
                        }
                    });
                    const fadeOutSun = () => {
                        let anyVisible = false;
                        sunGroup.traverse((child) => {
                            if (child.material && 'opacity' in child.material) {
                                if (child.material.opacity > 0) {
                                    child.material.opacity -= 0.05;
                                    anyVisible = true;
                                } else {
                                    child.material.opacity = 0;
                                }
                            }
                        });
                        if (anyVisible) {
                            requestAnimationFrame(fadeOutSun);
                        } else {
                            sunGroup.visible = false;
                        }
                    };
                    fadeOutSun();
                }
                // --- Fade out de las lunas ---
                moons.forEach((moonGroup) => {
                    moonGroup.traverse((child) => {
                        if (child.material && 'opacity' in child.material) {
                            child.material.transparent = true;
                            child.material.opacity = 1;
                        }
                    });
                    const fadeOutMoon = () => {
                        let anyVisible = false;
                        moonGroup.traverse((child) => {
                            if (child.material && 'opacity' in child.material) {
                                if (child.material.opacity > 0) {
                                    child.material.opacity -= 0.05;
                                    anyVisible = true;
                                } else {
                                    child.material.opacity = 0;
                                }
                            }
                        });
                        if (anyVisible) {
                            requestAnimationFrame(fadeOutMoon);
                        } else {
                            moonGroup.visible = false;
                        }
                    };
                    fadeOutMoon();
                });
            }
            // Restaurar el planeta, el sol y las lunas cuando el scroll vuelva a la parte superior
            if (scrollY < 500 && isInRocketSection) {
                isInRocketSection = false;
                planet.visible = true;
                planet.material.opacity = 1;
                // --- Fade in del sol ---
                if (sunGroup) {
                    sunGroup.visible = true;
                    sunGroup.traverse((child) => {
                        if (child.material && 'opacity' in child.material) {
                            child.material.opacity = 0;
                            child.material.transparent = true;
                        }
                    });
                    const fadeInSun = () => {
                        let anyFading = false;
                        sunGroup.traverse((child) => {
                            if (child.material && 'opacity' in child.material) {
                                if (child.material.opacity < 1) {
                                    child.material.opacity += 0.05;
                                    anyFading = true;
                                } else {
                                    child.material.opacity = 1;
                                }
                            }
                        });
                        if (anyFading) {
                            requestAnimationFrame(fadeInSun);
                        }
                    };
                    fadeInSun();
                }
                // --- Fade in de las lunas ---
                moons.forEach((moonGroup) => {
                    moonGroup.visible = true;
                    moonGroup.traverse((child) => {
                        if (child.material && 'opacity' in child.material) {
                            child.material.opacity = 0;
                            child.material.transparent = true;
                        }
                    });
                    const fadeInMoon = () => {
                        let anyFading = false;
                        moonGroup.traverse((child) => {
                            if (child.material && 'opacity' in child.material) {
                                if (child.material.opacity < 1) {
                                    child.material.opacity += 0.05;
                                    anyFading = true;
                                } else {
                                    child.material.opacity = 1;
                                }
                            }
                        });
                        if (anyFading) {
                            requestAnimationFrame(fadeInMoon);
                        }
                    };
                    fadeInMoon();
                });
            }
        }
        
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            handleScroll();

            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(updateOnScroll);
            }
        });

        // Crear el sol
        let sunGroup = null; // Referencia global al grupo del sol
        function createSun() {
            sunGroup = new THREE.Group();
            const loader = new GLTFLoader();

            loader.load(
                '/assets/sun/scene.gltf',
                function (gltf) {
                    const sun = gltf.scene;
                    
                    // Ajustar la escala del sol según el dispositivo
                    const isMobile = window.innerWidth <= 768;
                    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
                    
                    if (isMobile) {
                        sun.scale.set(0.05, 0.05, 0.05);
                    } else if (isTablet) {
                        sun.scale.set(0.1, 0.1, 0.1);
                    } else {
                        sun.scale.set(0.2, 0.2, 0.2);
                    }

                    // Añadir material con efecto de resplandor
                    sun.traverse((child) => {
                        if (child.isMesh) {
                            const material = new THREE.MeshStandardMaterial({
                                ...child.material,
                                emissive: new THREE.Color(0xffd700), // Color dorado
                                emissiveIntensity: 1.0,
                                roughness: 0.2,
                                metalness: 0.8,
                                transparent: true,
                                opacity: 1
                            });
                            child.material = material;
                        }
                    });

                    // Crear luz para el sol
                    const sunLight = new THREE.PointLight(0xffd700, 2, 50);
                    sunLight.position.set(0, 0, 0);
                    sunGroup.add(sunLight);

                    // Posicionar el sol en la esquina superior derecha
                    if (isMobile) {
                        sunGroup.position.set(5, 3, -10);
                    } else if (isTablet) {
                        sunGroup.position.set(8, 4, -15);
                    } else {
                        sunGroup.position.set(10, 5, -20);
                    }

                    sunGroup.add(sun);
                    scene.add(sunGroup);
                },
                undefined,
                function (error) {
                    console.error('Error al cargar el modelo del sol:', error);
                }
            );
        }

        // Crear el sol
        createSun();

        // Modificar la función animate para eliminar la animación del sol
        function animate() {
            requestAnimationFrame(animate);
            planet.rotation.y += 0.004;
            animateMoons();
            animateUFO();
            animateParticles();
            animateMeteorite();
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        
            // Recalcular posiciones de los cohetes y lunas
            const isMobile = width <= 768;
            const isTablet = width > 768 && width <= 1024;
            
            rockets.forEach((rocket, index) => {
                if (isMobile) {
                    const yOffset = 0.4;
                    rocket.position.set(
                        0,
                        -0.6 - index * yOffset,
                        5 + index * 1.5
                    );
                } else if (isTablet) {
                    const xOffset = 1.5;
                    rocket.position.set(
                        (index - 1) * xOffset,
                        -0.6,
                        5
                    );
                } else {
                    rocket.position.set(
                        index - 1,
                        -0.6,
                        5
                    );
                }
                // Actualizar posición de la luna correspondiente
                if (moons[index]) {
                    updateMoonPosition(moons[index], index);
                }
            });
        });
        
        // Llamamos a onLoad para indicar que Three.js ha cargado y la animación ha comenzado
        if (onLoad) {
            onLoad();
        }

        // Iniciar la animación
        animate();

        // Limpiar el renderizado al desmontar el componente
        return () => {
            document.body.removeChild(renderer.domElement);
        };

    }, [navigate, onLoad]); // Dependencia de onLoad para asegurarnos de que funcione correctamente

    return null;
}
