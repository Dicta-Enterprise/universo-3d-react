import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import BackButton from '../../components/BackButton';
import DivCentral from '../../components/Planetas/DivCentral';
import ControlButtons from '../../components/Planetas/ControlButtons';
import InfoBox from '../../components/Planetas/InfoBox';

export default function EsferaTexturizada() {
    const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const clickSoundRef = useRef(null); // Referencia para el sonido de clic
    const planetSoundRef = useRef(null); // Referencia para el sonido de "Planet.mp3"

    const textures = [
        '/assets/2k_makemake_fictional.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
        '/assets/2k_neptune.jpg',
        '/assets/2k_venus_surface.jpg',
        '/assets/2k_uranus.jpg',
        '/assets/2k_venus_atmosphere.jpg',
        '/assets/2k_earth_clouds.jpg',
        //'/assets/2k_jupiter.jpg',
        //'/assets/2k_mars.jpg',
    ];

    const texts = [
        "Tipo de riesgo: Peligro digital\nPlaneta: Planeta KIO\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Ciberbullying\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Ciberbull",
        "SEGUNDO PLANETA - - ",
        "TERCER PLANETA - - - ",
        "CUARTO PLANETA - - - - ",
        "QUINTO PLANETA - - - - - ",
        "SEXTO PLANETA - - - - - ",
        "SEPTIMO PLANETA - - - - - ",
        "OCTAVO PLANETA - - - - - ",

    ];

    const planetUrls = [
        '/padres/salud_fisica/planeta_kio',
        '/padres/salud_fisica/planeta_2',
        '/padres/salud_fisica/planeta_3',
        '/padres/salud_fisica/planeta_4',
        '/padres/salud_fisica/planeta_5',
        '/padres/salud_fisica/planeta_6',
        '/padres/salud_fisica/planeta_7',
        '/padres/salud_fisica/planeta_8',

    ];

    const changeTexture = (direction) => {
        setCurrentTextureIndex((prevIndex) => {
            let nextIndex = prevIndex;
            if (direction === 'next') {
                nextIndex = (prevIndex + 1) % textures.length;
            } else if (direction === 'prev') {
                nextIndex = (prevIndex - 1 + textures.length) % textures.length;
            }
            return nextIndex;
        });
    };

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.appendChild(renderer.domElement);

        /*const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;*/

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
    
            // Actualizar el tamaño del renderizador
            renderer.setSize(width, height);
    
            // Actualizar la relación de aspecto de la cámara
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        // Escuchar el evento de cambio de tamaño
        window.addEventListener('resize', handleResize);

        // Fondo de Padres ----------------------------------

        scene.background = new THREE.Color(0x000000);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const pointLight5 = new THREE.PointLight(0xffffff, 2);
        pointLight5.position.set(10, 10, 10);
        pointLight5.castShadow = false; // Sin sombras
        scene.add(pointLight5);

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
            [0.8, 0, 0, -20], [0.3, 30, 13, -20], [0.5, 28, -12, -20], [0.8, 26, 7, -20],
            [0.6, 24, -5, -20], [0.8, 34, 0, -20], [0.6, 15, 8, -20], [0.9, 10, -8, -20],
            [0.6, 5, 15, -20], [0.6, 3, -5, -20], [0.6, 2, -16, -20], [0.5, 0, 8, -20],
            [0.6, -3, 18, -20], [0.4, -7, 10, -20], [0.8, -9, -12, -20], [0.9, -12, 10, -20],
            [1.0, -14, -1, -20], [0.9, -18, 15, -20], [0.4, -19, 3, -20], [0.4, -20, -12, -20],
            [0.6, -39, -9, -20], [0.5, -31, -15, -20], [0.9, -32, 10, -20], [0.6, -37, 1, -20]
        ];

        const starsDataResponsive = [
            [0.8, 0, 0, -11], [0.3, 10, 13, -11],[0.6, 10, 5, -11], [0.8, 8, 0, -11], 
            [0.6, 15, 8, -11], [0.9, 10, -8, -11], [0.6, 5, 15, -11], [0.6, 3, -5, -11], 
            [0.6, 2, -13, -11], [0.5, 0, 8, -11], [0.6, -3, 18, -11], [0.4, -7, 10, -11], 
            [0.8, -9, -12, -11], [0.9, -12, 10, -11], [1.0, -10, -1, -11], [0.9, -11, 17, -11],
            [0.6, -8, -6, -11],
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
                createPlanet(0.4, 0xC3E4F5, { x: 16, y: -10, z: -15});
                createPlanet(0.8, 0xC3E4F5, { x: 16, y: 0, z: -15});
                createPlanet(0.6, 0xC3E4F5, { x: 10, y: 7, z: -15});
                createPlanet(0.8, 0xFFD700, { x: -5, y: -7, z: -15});
                createPlanet(0.4, 0xC3E4F5, { x: -10, y: 5, z: -15});
                createPlanet(0.8, 0xFFD700, { x: -20, y: 8, z: -15});
                createPlanet(0.5, 0xC3E4F5, { x: -25, y: -20, z: -15});
                createPlanet(0.7, 0xC3E4F5, { x: -18, y: -8, z: -15});
                createPlanet(0.6, 0xC3E4F5, { x: 20, y: 10, z: -15});
                createPlanet(0.6, 0xC3E4F5, { x: -24, y: 0, z: -15});
            }
        }

        responsivePlanets();
        window.addEventListener("resize", responsivePlanets);

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

        // --------------------------------------------------

        const sphereGeometry = new THREE.SphereGeometry(6, 64, 64);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(textures[currentTextureIndex]),
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(2, 5, 10);
        scene.add(pointLight);

        camera.position.set(0, 0, 24);

        // Configurar el AudioListener
        const listener = new THREE.AudioListener();
        camera.add(listener);

        // Cargar el sonido de clic
        const clickSound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/assets/sounds/click-space.mp3', (buffer) => {
            clickSound.setBuffer(buffer);
            clickSound.setLoop(false);
            clickSound.setVolume(0.5);
        });
        clickSoundRef.current = clickSound;

        // Cargar el sonido de "Planeta.mp3"
        const planetSound = new THREE.Audio(listener);
        audioLoader.load('/assets/sounds/Planeta.mp3', (buffer) => {
            planetSound.setBuffer(buffer);
            planetSound.setLoop(false);
            planetSound.setVolume(0.5);
        });
        planetSoundRef.current = planetSound;

        const animate = () => {
            requestAnimationFrame(animate);

            // Animación de zoom
            if (isZooming && camera.position.z > 7) {
                camera.position.z -= 0.1; // Ajusta la velocidad del zoom
            }

            // del Fondo Padres ---------------

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

            // ---------------------------------
            sphere.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [currentTextureIndex, textures, isZooming]); // Añade isZooming como dependencia

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <BackButton redirectUrl="/padres" color={'#d0eaf2'} background= {'none'}/> {/* Pasa la URL dinámica */}
            <DivCentral title="Bienvenidos a la sección de Salud Fisica">
                <InfoBox text={texts[currentTextureIndex]} color={'#d0eaf2'}/>
            </DivCentral>
            <ControlButtons
                onPrev={() => changeTexture('prev')}
                onNext={() => changeTexture('next')}
                onViewMore={() => {
                    setIsZooming(true); // Activa la animación de zoom
                    setTimeout(() => {
                        setIsZooming(false); // Desactiva la animación
                        window.location.href = planetUrls[currentTextureIndex]; // Redirige
                    }, 1000); // Ajusta el tiempo según la duración de la animación
                }}
                clickSoundRef={clickSoundRef}
                planetSoundRef={planetSoundRef}
                color={'#d0eaf2'}
            />
        </div>
    );
}