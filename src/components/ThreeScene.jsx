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

        function createRocket(position, index) {
            const rocketGroup = new THREE.Group();

            // Geometría y material del cuerpo del cohete
            const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            rocketGroup.add(body);

            // Nariz del cohete
            const noseGeometry = new THREE.ConeGeometry(0.1, 0.3, 32);
            const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
            const nose = new THREE.Mesh(noseGeometry, noseMaterial);
            nose.position.y = 0.65;
            rocketGroup.add(nose);

            // Aletas del cohete
            const finGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05);
            const finMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
            for (let i = 0; i < 3; i++) {
                const fin = new THREE.Mesh(finGeometry, finMaterial);
                fin.position.set(
                    Math.cos((i * Math.PI * 2) / 3) * 0.2,
                    -0.5,
                    Math.sin((i * Math.PI * 2) / 3) * 0.2
                );
                fin.rotation.y = (i * Math.PI * 2) / 3;
                rocketGroup.add(fin);
            }

            // Ajustar posición de los cohetes según el dispositivo
            const isMobile = window.innerWidth <= 712;
            if (isMobile) {
                const yOffset = 0.4; // Ajuste progresivo en Y
                rocketGroup.position.set(
                    0, // X fijo para móvil
                    position.y - index * yOffset, // Ajuste progresivo en Y basado en el índice
                    position.z + index * 1.5 // Z ajustado para espaciamiento
                );
            } else {
                rocketGroup.position.set(position.x, position.y, position.z);
            }


            // Asociar URL y agregar al grupo
            rocketGroup.userData.url = position.url;
            scene.add(rocketGroup);
            rockets.push(rocketGroup);
        }



        // Nuevo cohetes
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        document.body.appendChild(labelRenderer.domElement);

        const buttonCohetes = document.createElement('button');
        //Código general de lunas
        //Probando cargando la luna
        function cargarModeloGLTF(ruta, posicion, escala = 1, callback) {
            const loader = new GLTFLoader();

            loader.load(
                ruta,
                function (gltf) {
                    const modelo = gltf.scene;

                    // Aplicar escala y posición
                    modelo.scale.set(escala, escala, escala);
                    modelo.position.set(posicion.x, posicion.y, posicion.z);

                    // Si hay un callback, lo ejecutamos (para personalizar el modelo)
                    if (callback) callback(modelo);

                    // Agregar el modelo a la escena
                    scene.add(modelo);
                },
                undefined,
                function (error) {
                    console.error('Error al cargar el modelo glTF:', error);
                }
            );
        }


        // Función para agregar lunas que orbitan alrededor de los cohetes
        function agregarLunasOrbitando(cohete, radioOrbita = 2.5, velocidadOrbita = 0.01) {
            const moonColor = 0xf4e99b; // Blanco cálido inicial
            const rutaModeloLuna = '/assets/moon/scene.gltf'; // Ruta del modelo de la luna

            // Grupo que contendrá la luna y la luz
            const lunaGrupo = new THREE.Group();

            // Cargar el modelo 3D de la luna
            const loader = new GLTFLoader();
            loader.load(
                rutaModeloLuna,
                function (gltf) {
                    const modeloLuna = gltf.scene;

                    // Escalar y posicionar la luna
                    modeloLuna.scale.set(0.6, 0.6, 0.6);
                    modeloLuna.position.set(radioOrbita, 0, 0); // Inicia en un lado de la órbita

                    // Agregar la luna al grupo
                    lunaGrupo.add(modeloLuna);
                },
                undefined,
                function (error) {
                    console.error('Error al cargar el modelo de la luna:', error);
                }
            );

            // Crear la luz de la luna
            const moonLight = new THREE.PointLight(moonColor, 5, 5); //Color, intensidad y distancia
            moonLight.position.set(radioOrbita, 0, 0); // Misma posición que la luna
            lunaGrupo.add(moonLight); // Añadir la luz al grupo

            // Añadir el grupo de la luna al cohete
            cohete.add(lunaGrupo);

            // Variable de ángulo para la órbita
            let angulo = 0;

            // Agregar la animación de la órbita en cada frame
            function actualizarOrbita() {
                angulo += velocidadOrbita; // Incrementar el ángulo

                // Calcular la nueva posición en la órbita
                const x = Math.cos(angulo) * radioOrbita;
                const z = Math.sin(angulo) * radioOrbita;

                // Aplicar la nueva posición al grupo de la luna (luz y modelo)
                lunaGrupo.position.set(x, 0, z);

                // Hacer que la luz siempre apunte al cohete
                moonLight.position.set(x, 0, z);
                moonLight.lookAt(cohete.position);

                // Seguir actualizando en cada frame
                requestAnimationFrame(actualizarOrbita);
            }

            // Iniciar la animación de la órbita
            actualizarOrbita();
            // Guardamos el color original en `userData`
            cohete.userData.moonLight = moonLight;
            cohete.userData.originalMoonColor = moonColor;
            cohete.userData.index = rockets.indexOf(cohete); // Guardamos el índice del cohete

            // Función para cambiar el color de la luz al pasar el mouse
            cohete.userData.cambiarColorLuna = function () {
                if (cohete.userData.index === 0) {
                    moonLight.color.set(0x00ff00); // Verde
                } else if (cohete.userData.index === 1) {
                    moonLight.color.set(0x0000ff); // Azul
                } else if (cohete.userData.index === 2) {
                    moonLight.color.set(0xff0000); // Rojo
                }
            };

            // Función para restaurar el color original de la luz
            cohete.userData.restaurarColor = function () {
               // moonLight.color.set(cohete.userData.originalMoonColor);
                moonLight.color.set(0xf4e99b); // Blanco cálido
            };




            // Verifica que las funciones estén asignadas correctamente
            console.log("Aqui cambiarluna",cohete.userData.cambiarColorLuna); // Debería mostrar la función
            console.log(cohete.userData.restaurarColor); // Debería mostrar la función
        }









        //Fin de código general de lunas

        function crearCohete(position, index, modelPath) {
            const rocketGroup = new THREE.Group(); // Grupo para el cohete

            //Código de lunas 
            /*
                // Lunas (reflectores)
            const moonColor = 0xf4e99b; // Blanco cálido inicial
            const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            const moonMaterial = new THREE.MeshBasicMaterial({
                color: moonColor,
                transparent: true,
                opacity: 0.8,
            });

            // Crear luna izquierda
            const moonLeft = new THREE.Mesh(moonGeometry, moonMaterial);
            moonLeft.position.set(position.x - 2.5, position.y + 1, position.z - 5); // Detrás a la izquierda
            scene.add(moonLeft);

            // Crear luna derecha
            const moonRight = new THREE.Mesh(moonGeometry, moonMaterial);
            moonRight.position.set(position.x + 2.5, position.y + 1, position.z - 5); // Detrás a la derecha
            scene.add(moonRight);

            // Crear luz de la luna
            const moonLightLeft = new THREE.PointLight(moonColor, 1.5, 10);
            moonLightLeft.position.copy(moonLeft.position);
            scene.add(moonLightLeft);

            const moonLightRight = new THREE.PointLight(moonColor, 1.5, 10);
            moonLightRight.position.copy(moonRight.position);
            scene.add(moonLightRight);
*/
            // Fin de código de lunas

            // Cargar el modelo .gltf usando GLTFLoader
            const loader = new GLTFLoader();
            loader.load(
                modelPath,
                function (gltf) {
                    /*const rocketModel = gltf.scene;
                    // **Aurora de luz**
                    const auroraGeometry = new THREE.SphereGeometry(0.5, 22, 22); // Ajusta el tamaño
                    const auroraMaterial = new THREE.MeshBasicMaterial({
                        color: position.auroraColor, // Color específico para este cohete
                        transparent: true,
                        opacity: 0.05,
                        blending: THREE.AdditiveBlending
                    });
                    const aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);
                    aurora.position.set(0, -0.5, 0); // Centrada en el cohete
                    rocketGroup.add(aurora);
*/
                    const rocketModel = gltf.scene;
                    // **Plataforma bajo el cohete**
                    const auroraGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32); // Geometría cilíndrica plana
                    const auroraMaterial = new THREE.MeshStandardMaterial({
                        color: position.auroraColor, // Color específico
                        roughness: 0.8,
                        metalness: 0.2,
                        opacity: 1,
                        transparent: false
                    });
                    const aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);

                    // Posicionar la plataforma justo debajo del cohete
                    aurora.position.set(0, -0.5, 0); // Ajusta Y para que quede bajo el cohete
                    rocketGroup.add(aurora);

                    /*
                                        const auroraLight = new THREE.PointLight(position.auroraColor, 2.5, 6); // Color, intensidad y distancia de la luz
                                        auroraLight.position.set(0, 0, 0); // Posiciona la luz en la aurora
                                        rocketGroup.add(auroraLight); // Añádela al grupo del cohete
                    */
                    const platformLight = new THREE.PointLight(position.auroraColor, 1, 5); // Luz puntual
                    platformLight.position.set(0, -0.3, 0); // Ajustar un poco encima de la plataforma
                    rocketGroup.add(platformLight);



                    // Calcular el tamaño del modelo
                    const box = new THREE.Box3().setFromObject(rocketModel);
                    const size = new THREE.Vector3();
                    box.getSize(size); // Dimensiones del modelo

                    // Escalar el modelo para una altura uniforme (ejemplo: 3 unidades de altura)
                    const desiredHeight = 0.9;
                    const currentHeight = size.y;
                    const scaleFactor = desiredHeight / currentHeight;
                    rocketModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

                    // Centrar el modelo
                    const center = new THREE.Vector3();
                    box.getCenter(center); // Centro del modelo
                    rocketModel.position.set(-center.x, -center.y, -center.z); // Centrar el modelo en el grupo

                    rocketGroup.add(rocketModel); // Agregar el modelo al grupo



                    // **Etiqueta de texto**
                    /*
                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'label';
                    labelDiv.textContent = position.label; // Texto específico para el cohete
                    labelDiv.style.color = 'white';
                    labelDiv.style.fontSize = '106px';
                    labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
 
                    const label = new CSS2DObject(labelDiv);
                    label.position.set(0, -0.3, -0.3); // Posición de la etiqueta
                    rocketGroup.add(label);
                    */
                    // **Botón como etiqueta**

                    const buttonCohetes = document.createElement('button');
                    buttonCohetes.className = 'label-button'; // Clase CSS para estilos
                    buttonCohetes.textContent = position.label; // Texto específico para el botón
                    buttonCohetes.style.color = 'white';
                    buttonCohetes.style.fontSize = '20px';
                    buttonCohetes.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    buttonCohetes.style.border = 'none';
                    buttonCohetes.style.padding = '10px 20px';
                    buttonCohetes.style.borderRadius = '10px';
                    buttonCohetes.style.cursor = 'pointer';
                    buttonCohetes.style.transition = 'transform 0.3s, background-color 0.3s'; // Animaciones suaves

                    const labelButton = new CSS2DObject(buttonCohetes);
                    labelButton.position.set(0, 0.5, 0); // Posición debajo del cohete
                    rocketGroup.add(labelButton);


                    //Interacción con las lunas 

                    // Agregar interacción para cambiar el color de las lunas al pasar el mouse
                    rocketGroup.onMouseOver = () => {
             //           window.addEventListener('mousemove', detectarInteraccion);
                        //         detectarInteraccion();
                        if (index === 0) {
                            //                    moonLightLeft.color.set(0x00ff00); // Verde
                            //                    moonLightRight.color.set(0x00ff00);
                            //                     moonLight.color.set(0x00ff00);
                            platformLight.color.set(0x00ff00); // Cambia el color a rojo, por ejemplo
                            //moonLight.color.set(0x00ff00);
                           // aurora.material.color.set(0xff0000);




                        } else if (index === 1) {
                            //                    moonLightLeft.color.set(0x0000ff); // Azul
                            //                    moonLightRight.color.set(0x0000ff);
                            //                      moonLight.color.set(0x0000ff);
                            platformLight.color.set(0x0000ff); // Cambia el color a rojo, por ejemplo

                        } else if (index === 2) {
                            //                    moonLightLeft.color.set(0xff0000); // Rojo
                            //                    moonLightRight.color.set(0xff0000);
                            //                     moonLight.color.set(0xff0000);
                            platformLight.color.set(0xff0000); // Cambia el color a rojo, por ejemplo


                        }
                    };

                    rocketGroup.onMouseOut = () => {
                        //               moonLightLeft.color.set(moonColor); // Volver a blanco cálido
                        //               moonLightRight.color.set(moonColor);
                        // moonLight.color.set(0xf4e99b);
                    };

                    // Fin de la interacción con las lunas




                    console.log('¡Modelo cargado exitosamente cohete!'); // Mensaje en la consola
                    agregarLunasOrbitando(rocketGroup, 2.5, 0.01);

                },
                undefined,
                function (error) {
                    console.error('Error al cargar el modelo de cohete:', error);
                }
            );


            // Asignar URL y posicionar el grupo del cohete
            rocketGroup.position.set(position.x, position.y, position.z);
            rocketGroup.userData.url = position.url; // Asignar URL asociada
            scene.add(rocketGroup); // Agregar el cohete a la escena
            rockets.push(rocketGroup); // Guardar el grupo en el arreglo de cohetes
        }

        //

        // Crear cohetes con posiciones específicas
        //createRocket({ x: -1.5, y: -0.6, z: 5, url: '/ninos' }, 0);
        //createRocket({ x: 0, y: -0.6, z: 5, url: '/jovenes' }, 1);
        //createRocket({ x: 1.5, y: -0.6, z: 5, url: '/padres' }, 2);
        //crearCohete({ x: -1.5, y: -0.6, z: 5, url: '/ninos' }, 2, '/assets/toy_rocket/scene.gltf');
        //crearCohete({ x: 0, y: -0.6, z: 5, url: '/jovenes' }, 2, '/assets/toy_rocket//scene.gltf');
        //crearCohete({ x: 1.5, y: -0.6, z: 5, url: '/padres' }, 2, '/assets/toy_rocket//scene.gltf');


        crearCohete(
            {
                x: -1.5,
                y: -0.6,
                z: 5,
                url: '/ninos',
                label: 'Niño', // Texto de la etiqueta
                auroraColor: 0x00ff00 // Color verde para la aurora
            },
            0,
            '/assets/toy_rocket/scene.gltf' // Ruta al modelo
        );

        crearCohete(
            {
                x: 0,
                y: -0.6,
                z: 5,
                url: '/jovenes',
                label: 'Joven', // Texto de la etiqueta
                auroraColor: 0x0000ff // Color azul para la aurora
            },
            1,
            '/assets/toy_rocket/scene.gltf' // Ruta al modelo
        );

        crearCohete(
            {
                x: 1.5,
                y: -0.6,
                z: 5,
                url: '/padres',
                label: 'Padre', // Texto de la etiqueta
                auroraColor: 0xff0000 // Color rojo para la aurora
            },
            2,
            '/assets/toy_rocket/scene.gltf' // Ruta al modelo
        );


/*
        // Aplicar lunas orbitando a cada cohete
        rockets.forEach(rocket => {
            agregarLunasOrbitando(rocket, 15, 0.02); // Radio de 2.5 y velocidad 0.02
            agregarLunasOrbitando(rocket, 25, 0.015); // Segunda luna (órbita más lejana y lenta)
            agregarLunasOrbitando(rocket, 35, 0.005); // Segunda luna (órbita más lejana y lenta)


        });

*/




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
            const isMobile = window.innerWidth <= 712;
            rockets.forEach((rocket, index) => {
                if (isMobile) {
                    const threshold = maxScrollY * (0.3 + index * 0.1); // Más escalonado en móvil
                    rocket.visible = scrollY > threshold;
                } else {
                    const threshold = maxScrollY * 0.2; // Todos visibles al mismo tiempo
                    rocket.visible = scrollY > threshold;
                }
            });

            // Marcar que el scrolling terminó
            isScrolling = false;
        }


        // Escuchar el evento de scroll// Variable para saber si ya se ha desplazado a la sección de las naves
        let isInRocketSection = false;

        // Función para ocultar el planeta y mostrar los cohetes
        function handleScroll() {
            const scrollY = window.scrollY;

            // Verifica si el scroll ha llegado a la sección de las naves
            if (scrollY > 500 && !isInRocketSection) {  // Ajusta el valor de scrollY según tu página
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
            }

            // Restaurar el planeta cuando el scroll vuelva a la parte superior (opcional)
            if (scrollY < 500 && isInRocketSection) {
                isInRocketSection = false;
                planet.visible = true;
                planet.material.opacity = 1;  // Restaurar la visibilidad
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


        // Manejar clics en los cohetes
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(rockets, true);
            if (intersects.length > 0) {
                const clickedRocket = intersects[0].object.parent;
                if (clickedRocket.userData.url) {
                    window.location.href = clickedRocket.userData.url;
                }
            }
        });

        //Animacion de las lunas
        // Detectar movimiento del mouse
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        //Fin de las animaciones de las lunas
        //Prueba de animación de cambio de color lunas cohetes 
        // Variables para la detección de mouse
        //  const raycaster = new THREE.Raycaster();
        //  const mouse = new THREE.Vector2();
        let objetoSeleccionado = null; // Para guardar el objeto sobre el que está el mouse

        // Función para detectar el mouse sobre los cohetes
        function detectarInteraccion(event) {
            // Normalizar coordenadas del mouse (de -1 a 1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Lanzar un rayo desde la cámara hacia la escena
            raycaster.setFromCamera(mouse, camera);

            // Detectar intersecciones con los cohetes
            const intersects = raycaster.intersectObjects(rockets, true);

            if (intersects.length > 0) {
                const cohete = intersects[0].object.parent; // Obtener el grupo del cohete

                // Si el objeto es diferente al anterior
                if (cohete !== objetoSeleccionado) {
                    if (objetoSeleccionado) {
                        objetoSeleccionado.userData.restaurarColor(); // Restaurar color anterior
                    }

                    // Guardar el nuevo objeto seleccionado
                    objetoSeleccionado = cohete;
                    objetoSeleccionado.userData.cambiarColorLuna(); // Cambiar color
                }
            } else {
                // Si el mouse no está sobre ningún cohete, restauramos el color
                if (objetoSeleccionado) {
                    objetoSeleccionado.userData.restaurarColor();
                    objetoSeleccionado = null;
                }
            }
        }

        // Escuchar el evento de movimiento del mouse
        window.addEventListener('mousemove', detectarInteraccion);
        // Fin de prueba Animación de lunas de los cohetes 

        //Animación de botones debajo de los cohetes 

        // Evento al pasar el mouse
        buttonCohetes.addEventListener('mouseover', () => {
            buttonCohetes.style.transform = 'scale(1.1)'; // Incremento leve de tamaño
            buttonCohetes.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Cambio de color
            buttonCohetes.style.color = 'black'; // Cambio de color de texto
        });

        // Evento al quitar el mouse
        buttonCohetes.addEventListener('mouseout', () => {
            buttonCohetes.style.transform = 'scale(1)'; // Regresa al tamaño normal
            buttonCohetes.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Color original
            buttonCohetes.style.color = 'white'; // Color de texto original
        });

        // Evento al hacer clic
        buttonCohetes.addEventListener('click', () => {
            alert(`¡Has seleccionado ${position.label}!`); // Acciones adicionales
        });

        //
        // Lunas reflectoras
        // Crear la luna reflectora
        /*
        // Crear las lunas reflectoras
        function createMoon(color, xPosition, yPosition, zPosition) {
            const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Geometría de la luna
            const moonMaterial = new THREE.MeshBasicMaterial({
                color: color, // Color inicial blanco cálido
                transparent: true,
                opacity: 0.8,
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);

            moon.position.set(xPosition, yPosition, zPosition); // Posicionar detrás de los cohetes
            scene.add(moon);

            return moon;
        }

        // Crear lunas para cada lado
        const moonLeft = createMoon(0xf4e99b, -2.5, 1, -5); // Luna izquierda (blanco cálido inicial)
        const moonRight = createMoon(0xf4e99b, 2.5, 1, -5); // Luna derecha


        // Crear luces de las lunas
        function createMoonLight(color, xPosition, yPosition, zPosition) {
            const light = new THREE.PointLight(color, 1, 10); // Luz cálida con rango limitado
            light.position.set(xPosition, yPosition, zPosition);
            scene.add(light);
            return light;
        }

        // Luz para cada luna
        const moonLightLeft = createMoonLight(0xf4e99b, -2.5, 1, -5); // Luz cálida inicial
        const moonLightRight = createMoonLight(0xf4e99b, 2.5, 1, -5); // Luz cálida inicial


        // Cambiar color al pasar el mouse
        function changeMoonColor(light, moon, color) {
            moon.material.color.set(color); // Cambiar color de la luna
            light.color.set(color); // Cambiar color de la luz
        }

        // Eventos de interacción
        cohete1.addEventListener('mouseover', () => {
            changeMoonColor(moonLightLeft, moonLeft, 0x00ff00); // Verde
        });
        cohete2.addEventListener('mouseover', () => {
            changeMoonColor(moonLightRight, moonRight, 0x0000ff); // Azul
        });
        cohete3.addEventListener('mouseover', () => {
            changeMoonColor(moonLightRight, moonRight, 0xff0000); // Rojo
        });

        // Volver al color inicial al quitar el mouse
        function resetMoonColor(light, moon) {
            const warmWhite = 0xf4e99b; // Blanco cálido
            changeMoonColor(light, moon, warmWhite);
        }

        cohete1.addEventListener('mouseout', () => {
            resetMoonColor(moonLightLeft, moonLeft);
        });
        cohete2.addEventListener('mouseout', () => {
            resetMoonColor(moonLightRight, moonRight);
        });
        cohete3.addEventListener('mouseout', () => {
            resetMoonColor(moonLightRight, moonRight);
        });
        moonLeft.position.set(-2.5, 1, -5); // Detrás de los cohetes
        moonRight.position.set(2.5, 1, -5); // Detrás de los cohetes
*/
        //Fin de lunas reflectoras



        // Animación general
        function animate() {
            requestAnimationFrame(animate);
            planet.rotation.y += 0.004;

            animateUFO();

            animateParticles();
            animateMeteorite();
            animarLunas(); // Animación de las lunas

            /*
                        //Animación de las lunas
                        // Actualizar raycaster
                        raycaster.setFromCamera(mouse, camera);
            
                        // Detectar intersecciones
                        const intersects = raycaster.intersectObjects(rockets, true);
            
                        // Restablecer todas las interacciones
                        rockets.forEach((rocket) => {
                            if (rocket.onMouseOut) rocket.onMouseOut();
                        });
            
                        // Activar interacción en el objeto intersectado
                        if (intersects.length > 0) {
                            const rocket = intersects[0].object.parent;
                            if (rocket && rocket.onMouseOver) {
                                rocket.onMouseOver();
                            }
                        }
              */
            //Fin de animación de las lunas
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera); // Renderiza las etiquetas con el CSS2DRenderer

        }

        function animarLunas() {
            // Actualizar raycaster
            raycaster.setFromCamera(mouse, camera);

            // Detectar intersecciones
            const intersects = raycaster.intersectObjects(rockets, true);

            // Restablecer todas las interacciones
            rockets.forEach((rocket) => {
                if (rocket.onMouseOut) rocket.onMouseOut();
            });

            // Activar interacción en el objeto intersectado
            if (intersects.length > 0) {
                const rocket = intersects[0].object.parent;
                if (rocket && rocket.onMouseOver) {
                    rocket.onMouseOver();
                }
            }
        }


        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // Recalcular posiciones de los cohetes
            const isMobile = width <= 712; // Verificar si es móvil
            rockets.forEach((rocket, index) => {
                const yOffset = 0.4; // Ajuste progresivo en Y
                if (isMobile) {
                    rocket.position.set(
                        0, // X fijo para móvil
                        -0.6 - index * yOffset, // Ajuste progresivo en Y basado en el índice
                        5 + index * 1.5 // Z ajustado para espaciamiento
                    );
                } else {
                    const positions = [
                        { x: -1.5, y: -0.6, z: 5 },
                        { x: 0, y: -0.6, z: 5 },
                        { x: 1.5, y: -0.6, z: 5 },
                    ];
                    const position = positions[index];
                    rocket.position.set(position.x, position.y, position.z);
                }
            });
        });

        // Llamamos a onLoad para indicar que Three.js ha cargado y la animación ha comenzado
        if (onLoad) {
            onLoad();  // Esto notificará a Home que Three.js está listo
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
