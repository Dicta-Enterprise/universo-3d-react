import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ResizeHandler from './ResizeHandler';


const ThreeSceneBackground = ({ textures, planetUrls, showCarousel, initialPlanetIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialPlanetIndex); // Para el planeta principal
    const [carouselIndex, setCarouselIndex] = useState(initialPlanetIndex); // Para los mini planetas
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    

    // Refs to store persistent objects
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sphereRef = useRef(null); // Planet central
    const planetsRef = useRef([]); // Mini planets




    useEffect(() => {
        console.log("🚀 Iniciando escena...");

        // Crear cámara y renderizador (solo una vez)
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 24);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;

        // Agregar el renderizador al contenedor
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
            renderer.domElement.style.position = 'fixed'; // Fijo para cubrir toda la pantalla
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.zIndex = 0; // Asegurar que esté detrás de otros elementos
        }

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        spaceTexture.wrapS = THREE.RepeatWrapping;
        spaceTexture.wrapT = THREE.RepeatWrapping;
        spaceTexture.repeat.set(4, 4); // Ajusta el valor de repetición según sea necesario
        sceneRef.current.background = spaceTexture;
        console.log("✅ Fondo estrellado agregado.");

        // Luces (creadas solo una vez)
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100); // Intensidad reducida
        pointLight.position.set(5, 5, 10);
        sceneRef.current.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Intensidad reducida
        sceneRef.current.add(ambientLight);
        console.log("✅ Luces agregadas.");

        

        // Planeta central (creado solo una vez)
        if (!sphereRef.current) {
            const sphereGeometry = new THREE.SphereGeometry(6, 80, 80);
            const sphereMaterial = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(textures[0]), // Textura del planeta central
                roughness: 0.7, // Aumentar la rugosidad
                metalness: 0.3, // Reducir el metalness
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(0, 0, 0);
            sceneRef.current.add(sphere);
            sphereRef.current = sphere; // Store the planet central in a ref
            console.log("✅ Planeta central agregado.");
        }

        // Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        // window.addEventListener('resize', onWindowResizeNube);
        // window.addEventListener('resize', onWindowResizeEstrella);
        // window.addEventListener('resize', onWindowResizeLineas);
        // window.addEventListener('resize', onWindowResizeTermometro);
        // window.addEventListener('resize', onWindowResizeCruces);
        // window.addEventListener('resize', onWindowResizeLuna);
        // window.addEventListener('resize', onWindowResizeCirculos);
        window.addEventListener('resize', handleResize);

        // Raycaster para detectar clics en los planetas
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onDocumentClick = (event) => {
            // Convertir las coordenadas del clic a coordenadas normalizadas (-1 a 1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Configurar el raycaster con la posición del clic y la cámara
            raycaster.setFromCamera(mouse, camera);

            // Detectar intersecciones con los planetas
            const intersects = raycaster.intersectObjects(planetsRef.current);

            // Si hay una intersección, redirigir a la URL correspondiente
            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                window.location.href = clickedPlanet.userData.url;
            }
        };

        // Agregar el listener de clic
        document.addEventListener('click', onDocumentClick);

        

        // Limpieza al desmontar el componente
        return () => {
            console.log("🗑 Limpiando escena...");
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', onDocumentClick); // Limpiar el listener de clic
            renderer.dispose();
            if (mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
                console.log("🗑 Renderizador eliminado.");
            }
        };
    }, [textures]); // Dependencia de textures para crear el planeta central solo una vez

    useEffect(() => {
        // Asegurarse de que el planeta inicial se cargue
        if (sphereRef.current) {
            const texture = new THREE.TextureLoader().load(textures[initialPlanetIndex]);
            sphereRef.current.material.map = texture;
            sphereRef.current.material.needsUpdate = true;
        }
    }, [ initialPlanetIndex, textures]);

    





    // Modificar createAndPositionPlanets para usar el índice correcto

    


    //modifica    


    //------ Estrellas ------

useEffect(() => {
    console.log("🚀 Cargando efectos escena...");
    
    // Datos de posición de estrellas
    const starsData = [
        [0.8, 0, 0, -20], [0.3, 30, 13, -20], [0.5, 28, -12, -20], [0.8, 26, 7, -20],
            [0.6, 24, -5, -20], [0.8, 34, 0, -20], [0.6, 15, 8, -20], [0.9, 10, -8, -20],
            [0.6, 5, 15, -20], [0.6, 3, -5, -20], [0.6, 2, -16, -20], [0.5, 0, 8, -20],
            [0.6, -3, 18, -20], [0.4, -7, 10, -20], [0.8, -9, -12, -20], [0.9, -12, 10, -20],
            [1.0, -14, -1, -20], [0.9, -18, 15, -20], [0.4, -19, 3, -20], [0.4, -20, -12, -20],
            [0.6, -39, -9, -20], [0.5, -31, -15, -20], [0.9, -32, 10, -20], [0.6, -37, 1, -20],
        // ...existing starsData array
    ];

    const starsDataResponsive = [   
        [0.8, 0, 0, -11], [0.3, 10, 13, -11],[0.6, 10, 5, -11], [0.8, 8, 0, -11], 
            [0.6, 15, 8, -11], [0.9, 10, -8, -11], [0.6, 5, 15, -11], [0.6, 3, -5, -11], 
            [0.6, 2, -13, -11], [0.5, 0, 8, -11], [0.6, -3, 18, -11], [0.4, -7, 10, -11], 
            [0.8, -9, -12, -11], [0.9, -12, 10, -11], [1.0, -10, -1, -11], [0.9, -11, 17, -11],
            [0.6, -8, -6, -11],
        // ...existing starsDataResponsive array
    ];

    // Array para almacenar las estrellas
    const stars = [];

    // Función para crear una estrella
    function createStar(size, positionX, positionY, positionZ) {
        // Crear forma de estrella
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

        // Configuración de extrusión
        const extrudeSettings = { depth: size * 0.2, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Material con shader personalizado
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xFFD700) },
                edgeColor: { value: new THREE.Color(0x000000) },
                emissiveColor: { value: new THREE.Color(0xFFD700) },
                emissiveIntensity: { value: 1.5 }
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
                    vec3 emissive = emissiveColor * emissiveIntensity;
                    gl_FragColor = vec4(baseColor + emissive, 1.0);
                }
            `
        });

        // Crear mesh y configurar
        const star = new THREE.Mesh(geometry, material);
        star.position.set(positionX, positionY, positionZ);
        star.userData.phase = Math.random() * Math.PI * 2;
        sceneRef.current.add(star);
        stars.push(star);
    }

    // Función para manejar el responsive
    function ResponsiveStars() {
        // Limpiar estrellas existentes
        stars.forEach(star => sceneRef.current.remove(star));
        stars.length = 0;

        // Crear nuevas estrellas según el tamaño de pantalla
        const data = window.innerWidth <= 768 ? starsDataResponsive : starsData;
        data.forEach(star => createStar(...star));
    }

    // Crear estrellas iniciales
    ResponsiveStars();

    // Listener para resize
    window.addEventListener('resize', ResponsiveStars);

    // Animación de estrellas
    const animate = () => {
        requestAnimationFrame(animate);
        const time = performance.now();

        stars.forEach(star => {
            // Efecto de pulsación
            const pulse = 1 + 0.1 * Math.sin(time * 0.002 + star.userData.phase);
            star.scale.set(pulse, pulse, pulse);
        });

        if (rendererRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    };

    animate();

    // Cleanup
    return () => {
        window.removeEventListener('resize', ResponsiveStars);
        stars.forEach(star => {
            sceneRef.current.remove(star);
            star.geometry.dispose();
            star.material.dispose();
        });
    };
}, []); // Sin dependencias para que se ejecute solo una vez


 //------ Estrellas Fugases ------

useEffect(() => {
    console.log("🚀 Cargando campo de estrellas...");

    // 1. Crear geometría para todas las estrellas
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000; // Cantidad de estrellas

    // 2. Crear arrays para posiciones y fases de parpadeo
    const positions = new Float32Array(starCount * 3);
    const phases = new Float32Array(starCount);

    // 3. Generar posiciones aleatorias en todo el espacio
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Distribuir estrellas en un espacio más amplio
        positions[i3] = (Math.random() - 0.5) * 100; // x
        positions[i3 + 1] = (Math.random() - 0.5) * 100; // y
        positions[i3 + 2] = (Math.random() - 0.5) * 50; // z
        phases[i] = Math.random() * Math.PI * 2; // Fase aleatoria para parpadeo
    }

    // 4. Añadir atributos a la geometría
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    // 5. Crear material con shader personalizado
    const starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            size: { value: 3.0 }, // Tamaño base de las estrellas
            twinkleSpeed: { value: 2.0 } // Velocidad de parpadeo
        },
        vertexShader: `
            attribute float phase;
            uniform float time;
            uniform float size;
            uniform float twinkleSpeed;
            
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float twinkle = sin(time * twinkleSpeed + phase) * 0.5 + 0.5;
                gl_PointSize = size * twinkle;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
                gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // 6. Crear el sistema de partículas
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    sceneRef.current.add(starField);

    // 7. Animación
    const animate = () => {
        const animationId = requestAnimationFrame(animate);
        starsMaterial.uniforms.time.value = performance.now() * 0.001;

        if (rendererRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    };

    animate();

    // 8. Cleanup
    return () => {
        sceneRef.current.remove(starField);
        starsGeometry.dispose();
        starsMaterial.dispose();
    };
}, []);

 //------ Fin Estrellas Fugases ------

//------- Esferas de colores En toda la pantalla -------

useEffect(() => {
    console.log("🚀 Cargando esferas de colores...");
    
    const sphereCount = 100;
    const spheres = [];
    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32); // Reducido el tamaño a 0.2
    
    // Array de colores para las esferas
    const colors = [
        0x4287f5, // Azul
        0x42f5ef, // Cyan
        0xf542f5, // Magenta
        0xf5f542, // Amarillo
        0x42f54b  // Verde
    ];

    // Crear y posicionar cada esfera
    for (let i = 0; i < sphereCount; i++) {
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            roughness: 0.7,
            metalness: 0.3,
            transparent: true,
            opacity: 0.6
        });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // Posición aleatoria en un rango más amplio
        sphere.position.set(
            (Math.random() - 0.5) * 60, // X: -30 a 30
            (Math.random() - 0.5) * 60, // Y: -30 a 30
            (Math.random() - 0.5) * 40  // Z: -20 a 20
        );

        // Velocidad aleatoria para la animación
        sphere.userData.speed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };

        sceneRef.current.add(sphere);
        spheres.push(sphere);
    }

    // Función de animación
    const animate = () => {
        const animationId = requestAnimationFrame(animate);

        spheres.forEach(sphere => {
            // Mover la esfera
            sphere.position.x += sphere.userData.speed.x;
            sphere.position.y += sphere.userData.speed.y;
            sphere.position.z += sphere.userData.speed.z;

            // Efecto de pulso en la opacidad
            sphere.material.opacity = 0.3 + Math.sin(performance.now() * 0.001) * 0.3;

            // Rebote en los límites
            if (Math.abs(sphere.position.x) > 30) sphere.userData.speed.x *= -1;
            if (Math.abs(sphere.position.y) > 30) sphere.userData.speed.y *= -1;
            if (Math.abs(sphere.position.z) > 20) sphere.userData.speed.z *= -1;
        });

        if (rendererRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    };

    animate();

    // Cleanup
    return () => {
        spheres.forEach(sphere => {
            sceneRef.current.remove(sphere);
            sphere.geometry.dispose();
            sphere.material.dispose();
        });
    };
}, []);

//------- Fin Esferas de colores En toda la pantalla-------



    useEffect(() => {
        console.log("🔄 Actualizando mini planetas...");
        console.log("Carousel index:", carouselIndex);

        const createAndPositionPlanets = () => {
            // Limpiar planetas existentes
            sceneRef.current.children
                .filter((child) => child.userData?.isPlanet)
                .forEach((planet) => sceneRef.current.remove(planet));

            const spacing = 2.5;
            const visiblePlanets = [
                textures[(carouselIndex - 1 + textures.length) % textures.length],
                textures[carouselIndex],
                textures[(carouselIndex + 1) % textures.length],
            ].map((texture, index) => {
                const geometry = new THREE.SphereGeometry(1, 32, 32);
                const material = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(texture),
                    roughness: 0.7,
                    metalness: 0.3,
                });
                const planet = new THREE.Mesh(geometry, material);

                // Actualizar URL y metadata usando carouselIndex
                const urlIndex = (carouselIndex + index - 1 + textures.length) % textures.length;
                planet.userData = {
                    url: planetUrls[urlIndex],
                    isPlanet: true,
                    index: urlIndex
                };

                // Posicionamiento
                planet.position.set((index - 1) * spacing, -9, 0);
                planet.scale.set(index === 1 ? 1.1 : 0.8, index === 1 ? 1.1 : 0.8, index === 1 ? 1.1 : 0.8);
                
                sceneRef.current.add(planet);
                return planet;
            });

            planetsRef.current = visiblePlanets;
        };

        createAndPositionPlanets();
    }, [carouselIndex, textures, planetUrls, showCarousel]); // Cambiar dependencia a carouselIndex

    // 4. Mantener el useEffect del planeta principal sin cambios
    useEffect(() => {
        if (sphereRef.current) {
            const texture = new THREE.TextureLoader().load(textures[currentIndex]);
            sphereRef.current.material.map = texture;
            sphereRef.current.material.needsUpdate = true;
        }
    }, [currentIndex, textures]);



    // Efecto para manejar la animación
    useEffect(() => {
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotación del planeta central y mini planetas
            if (sphereRef.current) {
                sphereRef.current.rotation.y += 0.004;
            }
            planetsRef.current.forEach((planet) => (planet.rotation.y += 0.002));

            // Renderizar la escena
            if (rendererRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };

        animate();
    }, []); // Sin dependencias para que se ejecute solo una vez

    
    useEffect(() => {
        // -------- Fondo básico --------
        sceneRef.current.background = new THREE.Color(0x000000);
        
        // Luces básicas
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        sceneRef.current.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(50, 0, 30);
        sceneRef.current.add(pointLight);

        // Eliminar todas las creaciones de objetos:
        // - Lunas
        // - Estrellas
        // - Cruces
        // - Termómetros
        // - Círculos
        // - Nubes
        // - Líneas

        const animate = () => {
            requestAnimationFrame(animate);
            
            // Solo mantener la renderización básica
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        animate();

        return () => {
            rendererRef.current.dispose();
        };
    }, []);

    // Funciones para manejar los botones de next y prev
    const handleNext = () => {
        setCarouselIndex((prev) => (prev + 1) % textures.length);
    };

    const handlePrev = () => {
        setCarouselIndex((prev) => (prev - 1 + textures.length) % textures.length);
    };

    // SVG para las flechas
    const LeftArrow = () => (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );

    const RightArrow = () => (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    );

    // Dentro del return de ThreeScene.js
    return (
        <div style={{
            position: 'fixed', // Fijo para cubrir toda la pantalla
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0, // Asegura que esté detrás del contenido principal
        }}>
            <div ref={mountRef} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }} />
            {/* Botones de next y prev */}
            <button
                onClick={handlePrev}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '48px',
                    position: 'fixed', // Usar fixed para que siempre estén visibles
                    bottom: '30px',
                    left: isMobile ? '10%' : '40%',
                    transform: 'translateX(-50%)',
                    zIndex: 3, // Asegurar que estén por encima del contenido
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
            >
                <LeftArrow />
            </button>
            <button
                onClick={handleNext}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '48px',
                    position: 'fixed', // Usar fixed para que siempre estén visibles
                    bottom: '30px',
                    right: isMobile ? '10%' : '40%',
                    transform: 'translateX(50%)',
                    zIndex: 3,
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(50%) scale(1.2)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(50%) scale(1)'}
            >
                <RightArrow />
            </button>
            {/* Integrar el ResizeHandler */}
            <ResizeHandler setIsMobile={setIsMobile} />
        </div>
        
    );
    
};

export default ThreeSceneBackground;