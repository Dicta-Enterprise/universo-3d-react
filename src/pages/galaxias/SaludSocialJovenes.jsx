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
        '/assets/2k_mars.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
        '/assets/2k_neptune.jpg',
        '/assets/2k_venus_surface.jpg',
        '/assets/2k_uranus.jpg',
        '/assets/2k_venus_atmosphere.jpg',
        '/assets/2k_earth_clouds.jpg',
        '/assets/2k_jupiter.jpg',
        '/assets/2k_mars.jpg',//2k_makemake_fictional.jpg
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
        "NOVENO PLANETA - - - - - ",
        "DECIMO PLANETA - - - - - ",
    ];

    const planetUrls = [
        '/jovenes/salud_social/planeta_comp',
        '/jovenes/salud_social/planeta_mer',
        '/jovenes/salud_social/planeta_ven',
        '/jovenes/salud_social/planeta_4',
        '/jovenes/salud_social/planeta_5',
        '/jovenes/salud_social/planeta_6',
        '/jovenes/salud_social/planeta_7',
        '/jovenes/salud_social/planeta_8',
        '/jovenes/salud_social/planeta_9',
        '/jovenes/salud_social/planeta_10',
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
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.appendChild(renderer.domElement);

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

        /*const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;*/

        // Fondo de Jovenes ----------------------------------

        // Fondo y luces
        const backgroundColor = new THREE.Color('#0a0014');
        scene.background = backgroundColor;

        const ambientLight = new THREE.AmbientLight(0x2a1f3d, 1.5);//0x2a1f3d, 1.5
        scene.add(ambientLight);

        const pointLight5 = new THREE.PointLight(0x7b2fdd, 2, 100); ///0x7b2fdd, 2, 100
        pointLight5.position.set(50, 0, 30);
        scene.add(pointLight5);

        const pointLight2 = new THREE.PointLight(0xff3366, 2, 100); //0xff3366, 2, 100
        pointLight2.position.set(-50, 0, 30); 
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0x00ffcc, 1.5, 80);
        pointLight3.position.set(0, 50, 30); // Luz desde arriba
        scene.add(pointLight3);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(0, 10, -50);
        scene.add(dirLight);

        function createPlanet(radius, color, position, rings = false) {
            const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);

            // Material con brillo y efecto de luz
            const planetMaterial = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 50,  // Más brillo para reflejar luz
                emissive: color,  // Emisión del mismo color del planeta
                emissiveIntensity: 0.3,  // Ajusta la intensidad de la luz propia
                bumpScale: 0.05
            });

            // Crear la esfera del planeta
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.position.copy(position);

            // Agregar luz sutil al planeta (para destacar más)
            const planetLight = new THREE.PointLight(color, 0.6, 50); // Luz con el mismo color
            // planetLight.position.copy(position);
            // scene.add(planetLight);

            // Si el planeta tiene anillos, los creamos
            if (rings) {
                const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.4
                });

                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 4;
                planet.add(ring);

                // Hacer que el anillo también rote lentamente
                function animateRing() {
                    ring.rotation.z += 0.001;
                    requestAnimationFrame(animateRing);
                }
                animateRing();
            }

            // Animación de rotación del planeta sobre su propio eje
            function animatePlanet() {
                planet.rotation.y += 0.02; // Rota lentamente sobre su eje 0.002
                planet.rotation.x += 0.02; // Rota lentamente sobre su eje 0.002
                requestAnimationFrame(animatePlanet);
            }
            animatePlanet();

            scene.add(planet);
            return planet;
        }

        //Fin de prueba de planetas mejorado
        // Función para crear estrellas brillantes
        function createShiningStars() {
            const starsGeometry = new THREE.BufferGeometry();
            const starsMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.15,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
            });

            const starsVertices = [];
            const starsColors = []; // Array para colores individuales
            const opacityOffsets = []; // Array para desfases de opacidad

            for (let i = 0; i < 1800; i++) {
                const x = (Math.random() - 0.5) * 70;
                const y = (Math.random() - 0.5) * 40;
                const z = (Math.random() - 0.9) * 50;
                starsVertices.push(x, y, z);

                // Asignar un color base blanco con opacidad individual
                const baseOpacity = Math.random() * 0.5 + 0.5; // Opacidad base entre 0.5 y 1
                starsColors.push(1, 1, 1); // RGB blanco

                // Guardar un offset aleatorio para la animación
                opacityOffsets.push(Math.random() * Math.PI * 2);
            }

            starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
            starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));

            const stars = new THREE.Points(starsGeometry, starsMaterial);
            stars.userData.opacityOffsets = opacityOffsets; // Guardar los offsets para usar en la animación

            scene.add(stars);
            return stars;
        }

        // Función para crear líneas verticales luminosas
        function createLightBeams() {
            const beams = new THREE.Group();
            const beamMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.2
            });

            for (let i = 0; i < 20; i++) {
                const height = Math.random() * 20 + 10;
                const beamGeometry = new THREE.CylinderGeometry(0.02, 0.02, height, 8);
                const beam = new THREE.Mesh(beamGeometry, beamMaterial);

                beam.position.set(
                    (Math.random() - 0.5) * 60,
                    height / 2,
                    (Math.random() - 0.5) * 60
                );

                beams.add(beam);
            }

            scene.add(beams);
            return beams;
        }

        // Función para crear nebulosas mejorada
        function createNebula(position, color, size = 10) {
            const geometry = new THREE.BufferGeometry();
            const particles = 3000; // Aumentado para más densidad
            const positions = new Float32Array(particles * 3);
            const colors = new Float32Array(particles * 3);
            const baseColor = new THREE.Color(color);

            for (let i = 0; i < particles; i++) {
                const radius = Math.random() * size;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI * 2;

                positions[i * 3] = position.x + radius * Math.sin(theta) * Math.cos(phi);
                positions[i * 3 + 1] = position.y + radius * Math.sin(theta) * Math.sin(phi);
                positions[i * 3 + 2] = position.z + radius * Math.cos(theta);

                const colorVariation = Math.random() * 0.3 - 0.15;
                const particleColor = baseColor.clone().offsetHSL(0, 0, colorVariation);
                colors[i * 3] = particleColor.r;
                colors[i * 3 + 1] = particleColor.g;
                colors[i * 3 + 2] = particleColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.15,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const nebula = new THREE.Points(geometry, material);
            scene.add(nebula);
            return nebula;
        }
        //Nuevos diseños de nebulosas
        // Función para crear nebulosa espiral
    function createSpiralNebula(position, color, size = 10) {
        const geometry = new THREE.BufferGeometry();
        const particles = 5000;
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        const baseColor = new THREE.Color(color);
        
        for (let i = 0; i < particles; i++) {
            const t = Math.random() * Math.PI * 2;
            const radius = Math.random() * size;
            const spiral = t * 2; // Factor espiral
            
            positions[i * 3] = position.x + radius * Math.cos(t + spiral) * Math.exp(-0.1 * t);
            positions[i * 3 + 1] = position.y + radius * Math.sin(t + spiral) * Math.exp(-0.1 * t);
            positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * size * 0.2;
            
            const colorVariation = Math.random() * 0.4 - 0.2;
            const particleColor = baseColor.clone().offsetHSL(colorVariation, 0.1, 0);
            colors[i * 3] = particleColor.r;
            colors[i * 3 + 1] = particleColor.g;
            colors[i * 3 + 2] = particleColor.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        
        const nebula = new THREE.Points(geometry, material);
        scene.add(nebula);
        return nebula;
    }

    // Función para crear nebulosa con forma de anillo
    function createRingNebula(position, color, size = 10) {
        const geometry = new THREE.BufferGeometry();
        const particles = 4000;
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        const baseColor = new THREE.Color(color);
        
        // Ángulo de rotación en radianes (30 grados)
        const rotationAngle = THREE.MathUtils.degToRad(30);

        for (let i = 0; i < particles; i++) {
            const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio en radianes
            const radiusVariation = (Math.random() - 0.5) * size * 0.3;
            const baseRadius = size * 0.7;
            const height = (Math.random() - 0.5) * size * 0.2;

            // Coordenadas iniciales de la partícula
            const x = position.x + height;
            const y = position.y + (baseRadius + radiusVariation) * Math.cos(angle);
            const z = position.z + (baseRadius + radiusVariation) * Math.sin(angle);

            // Aplicar rotación en el eje Y
            const cosTheta = Math.cos(rotationAngle);
            const sinTheta = Math.sin(rotationAngle);

            const xRotated = x * cosTheta - z * sinTheta;
            const yRotated = y;
            const zRotated = x * sinTheta + z * cosTheta;

            // Asignar las coordenadas rotadas
            positions[i * 3] = xRotated;
            positions[i * 3 + 1] = yRotated;
            positions[i * 3 + 2] = zRotated;

            // Color basado en la distancia
            const distanceFactor = Math.sqrt(x * x + z * z) / size;
            const particleColor = baseColor.clone().offsetHSL(0, distanceFactor * 0.2, 0);

            colors[i * 3] = particleColor.r;
            colors[i * 3 + 1] = particleColor.g;
            colors[i * 3 + 2] = particleColor.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });
        
        const nebula = new THREE.Points(geometry, material);
        scene.add(nebula);
        return nebula;
    }

    // Función para crear nebulosa con forma de vórtice
    function createVortexNebula(position, color, size = 10) {
        const geometry = new THREE.BufferGeometry();
        const particles = 6000;
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        const baseColor = new THREE.Color(color);
        
        for (let i = 0; i < particles; i++) {
            const t = Math.random() * Math.PI * 4; // Más vueltas para el vórtice
            const radius = Math.random() * size;
            const heightScale = Math.random() * size * 0.5;
            
            // Ecuaciones paramétricas para el vórtice
            positions[i * 3] = position.x + radius * Math.cos(t) * Math.exp(-0.1 * t);
            positions[i * 3 + 1] = position.y + heightScale * Math.sin(t * 0.5);
            positions[i * 3 + 2] = position.z + radius * Math.sin(t) * Math.exp(-0.1 * t);
            
            // Color basado en la altura y distancia
            const heightFactor = (positions[i * 3 + 1] - position.y) / (size * 0.5);
            const distanceFactor = Math.sqrt(
                Math.pow(positions[i * 3] - position.x, 2) +
                Math.pow(positions[i * 3 + 2] - position.z, 2)
            ) / size;
            
            const hueShift = heightFactor * 0.1;
            const saturationShift = distanceFactor * 0.2;
            const particleColor = baseColor.clone().offsetHSL(hueShift, saturationShift, 0);
            
            colors[i * 3] = particleColor.r;
            colors[i * 3 + 1] = particleColor.g;
            colors[i * 3 + 2] = particleColor.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        
        const nebula = new THREE.Points(geometry, material);
        scene.add(nebula);
        return nebula;
    }

    // Ejemplo de uso en tu escena:
    const spiralNebula = createSpiralNebula(new THREE.Vector3(-20, 0, -200), 0x9d4edd);
    const ringNebula = createRingNebula(new THREE.Vector3(20, 0, -200), 0x00ff88);
    const vortexNebula = createVortexNebula(new THREE.Vector3(0, 15, -200), 0xff5500);

// Parámetros modificables para la posición inicial de cada estrella
const initialPositionsDesktop = [
    { x: -17, y: 22, z: -10 }, { x: 12, y: 22, z: -10 }, { x: -12, y: 22, z: -10 },
    { x: 14, y: 22, z: -10 }, { x: -15, y: 22, z: -10 }, { x: 2, y: 22, z: -10 },
    { x: -10, y: 22, z: -10 }, { x: 5, y: 22, z: -10 }, { x: -3, y: 22, z: -10 },
    { x: 8, y: 22, z: -10 }, { x: -6, y: 22, z: -10 }, { x: 17, y: 22, z: -10 }
];

// Posiciones ajustadas para pantallas pequeñas
const initialPositionsMobile = [
    { x: -11, y: 30, z: -30 }, { x: 8, y: 30, z: -30 }, { x: -12, y: 30, z: -30 },
    { x: 10, y: 30, z: -30 }, { x: -7, y: 30, z: -30 }, { x: 13, y: 30, z: -30 },
    { x: -5, y: 30, z: -30 }, { x: 3, y: 30, z: -30 }, { x: -2, y: 30, z: -30 },
    { x: 4, y: 30, z: -30 }, { x: -3, y: 30, z: -30 }, { x: 9, y: 30, z: -30 }
];

// Lista de estrellas fugaces
let shootingStars2 = [];

// Función para crear estrellas fugaces de forma responsive
function createShootingStars() {
    // Eliminar las estrellas actuales
    shootingStars2.forEach(star => scene.remove(star.trail));
    shootingStars2 = [];  // Vaciar el array

    // Seleccionar dataset según el tamaño de la pantalla
    const data = window.innerWidth <= 768 ? initialPositionsMobile : initialPositionsDesktop;

    // Crear nuevas estrellas fugaces
    for (let i = 0; i < data.length; i++) {
        const trailGeometry = new THREE.CylinderGeometry(0.03, 0.03, window.innerWidth <= 768 ? 5 : 6, 50);
        const trailMaterial = new THREE.ShaderMaterial({
            uniforms: {
                colorTop: { value: new THREE.Color(1, 1, 1) },  // Blanco en la punta
                colorBottom: { value: new THREE.Color(1, 0.7, 1) },  // Magenta degradado
                opacityTop: { value: 0.0 },
                opacityBottom: { value: 1 }
            },
            vertexShader: `
                varying float vY;
                void main() {
                    vY = position.y;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 colorTop;
                uniform vec3 colorBottom;
                uniform float opacityTop;
                uniform float opacityBottom;
                varying float vY;
                void main() {
                    float factor = (vY + 5.0) / 10.0;
                    vec3 color = mix(colorBottom, colorTop, factor);  // Mezclar colores según la altura
                    float opacity = mix(opacityBottom, opacityTop, factor);
                    gl_FragColor = vec4(color, opacity);
                }
            `,
            transparent: true
        });

        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.position.set(data[i].x, data[i].y, data[i].z);
        scene.add(trail);

        shootingStars2.push({ trail, initialPosition: data[i] });
    }
}

// Llamar a la función al cargar la página
createShootingStars();

// Escuchar cambios de tamaño de pantalla para actualizar las estrellas fugaces
window.addEventListener('resize', createShootingStars);

let speed = 0.1;
let currentStarIndex = 0; // Índice de la estrella actual en movimiento

const animateShootingStar = (index) => {
    if (index >= shootingStars2.length) {
        currentStarIndex = 0;
        animateShootingStar(currentStarIndex);
        return;
    }

    const { trail, initialPosition } = shootingStars2[index];

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

        // Fin de modificado meteoritos
        // Arrays para almacenar las estrellas fugaces y meteoritos
        const shootingStars = [];
        const meteors = [];

        // Función para actualizar estrellas fugaces
        function updateShootingStars() {
            if (Math.random() < 0.02 && shootingStars.length < 6) { // Reducida la frecuencia
                const star = createShootingStar();
                scene.add(star);
                shootingStars.push(star);
            }
            
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const star = shootingStars[i];
                const positions = star.geometry.attributes.position.array;
                
                positions[0] += star.velocity.x;
                positions[1] += star.velocity.y;
                positions[2] += star.velocity.z;
                
                for (let j = positions.length - 3; j > 0; j -= 3) {
                    positions[j] = positions[j - 3];
                    positions[j + 1] = positions[j - 2];
                    positions[j + 2] = positions[j - 1];
                }
                
                star.geometry.attributes.position.needsUpdate = true;
                
                if (positions[1] < -100 || positions[0] > 150 || positions[0] < -150 || positions[2] > 50) {
                    scene.remove(star);
                    shootingStars.splice(i, 1);
                }
            }
        }

        const planets = [];
        const numPlanets = 70;
        const minDistance = 105; // Distancia mínima para evitar superposición con galaxias
        const minSeparation = 20; // Separación mínima entre planetas

        for (let i = 0; i < numPlanets; i++) {
            const size = Math.random() * 1 + 0.8;  // Tamaño entre 1.5 y 3.5
            const color = Math.random() * 0xffffff;  // Color aleatorio
            let position;
            let tooClose;
            let x, y, z;

            do {
                //x = (Math.random() * 700) - 350;
                //y = (Math.random() * 300) - 150;
                //z = -200;

                x = (Math.random() * 360) - 180;
                y = (Math.random() * 140) - 70;
                z = -200;

                position = new THREE.Vector3(x, y, z);

                // Verifica si la posición está demasiado cerca de una galaxia o de otro planeta
                tooClose = planets.some(planet => position.distanceTo(planet.position) < minSeparation);
            } while (tooClose); // Si está cerca, se genera otra posición

            const hasRings = Math.random() < 0.3;  // 30% de probabilidad de tener anillos

            const newPlanet = createPlanet(size, color, position, hasRings);
            planets.push(newPlanet);
        }

        const shiningStars = createShiningStars();

        // Posicionar las nebulosas en eje z
        spiralNebula.position.z = -700;
        ringNebula.position.z = -700;
        vortexNebula.position.z = -700;

        spiralNebula.visible = false;
        ringNebula.visible = false;
        vortexNebula.visible = false;

        let currentNebula = 0;


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

        camera.position.set(0, 0, 36);

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

            // del Fondo Jovenes ---------------

            // Crear una lista de velocidades únicas para cada anillo
            let ringRotations = planets.map(() => (Math.random() * 0.001) + 0.001); // Velocidad entre 0.001 y 0.005
            let ringDirections = planets.map(() => (Math.random() < 0.3 ? 1 : -1)); // 50% de probabilidades de ser horario o antihorario

            // Animar planetas
            planets.forEach((planet, index) => {
                planet.rotation.y += 0.0001 * (index + 1);
                if (planet.children.length > 0) { // Si tiene anillos
                    planet.children[0].rotation.z += ringRotations[index]  * ringDirections[index];
                }
            });

            // Animar estrellas brillantes
            const time = Date.now() * 0.001;
            const colors = shiningStars.geometry.attributes.color.array;
            const opacityOffsets = shiningStars.userData.opacityOffsets;
            
            for (let i = 0; i < opacityOffsets.length; i++) {
                const offset = opacityOffsets[i];
                const opacity = 0.5 + Math.sin(time * 0.5 + offset) * 0.2; // Reducido el factor de variación a 0.2
                
                // Actualizar el color RGB con la opacidad
                const i3 = i * 3;
                colors[i3] = opacity;     // R
                colors[i3 + 1] = opacity; // G
                colors[i3 + 2] = opacity; // B
            }
            
            shiningStars.geometry.attributes.color.needsUpdate = true;

            updateShootingStars();

            // Recorrer cada nebulosa y moverla hacia la cámara
             if (currentNebula === 0) {
                spiralNebula.visible = true;
                spiralNebula.position.z += 1;
                if (spiralNebula.position.z > 300) {
                    spiralNebula.position.z = -700;
                    spiralNebula.visible = false;
                    currentNebula = 1; // Cambia a la siguiente nebulosa
                }
            } else if (currentNebula === 1) {
                ringNebula.visible = true;
                ringNebula.position.z += 1;
                if (ringNebula.position.z > 200) {
                    ringNebula.position.z = -700;
                    ringNebula.visible = false;
                    currentNebula = 2; // Cambia a la siguiente nebulosa
                }
            } else if (currentNebula === 2) {
                vortexNebula.visible = true;
                vortexNebula.position.z += 1;
                if (vortexNebula.position.z > 200) {
                    vortexNebula.position.z = -700;
                    vortexNebula.visible = false;
                    currentNebula = 0; // Reinicia el ciclo
                }
            }

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
            <BackButton redirectUrl="/jovenes" background= {'none'}/> {/* Pasa la URL dinámica */}
            <DivCentral title="Bienvenidos a la sección de Salud Social">
                <InfoBox text={texts[currentTextureIndex]} />
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
                
            />
        </div>
    );
}