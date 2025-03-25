import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import CrearEstrellas3D from '../components/FondoNIños/CrearEstrellas3D';
import crearLineaVertical from '../components/FondoNIños/CrearLineaVerticalEstrella';
import crearCirculo from '../components/FondoNIños/CrearCirculo';
import CreaCruzRedonda from '../components/FondoNIños/CrearCruzRedonda';
import CrearTermometro from '../components/FondoNIños/CrearTermometro';
import CrearNube from '../components/FondoNIños/CrearNube';
import CrearLuna from '../components/FondoNIños/CrearLuna';
import {nubeconfig, estrellasConfig, circulosConfig, crucesConfig, lineasConfig, TermometroConfig} from '../components/FondoNIños/ArregloObjetos';

export default function Ninos() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [selectedGalaxy, setSelectedGalaxy] = useState(null);
    const [galaxiesVisible, setGalaxiesVisible] = useState(true); // Estado para controlar la visibilidad de las galaxias

    const galaxiesRef = useRef([]); // Referencia para almacenar las galaxias
    const cameraRef = useRef(null); // Referencia para la cámara
    const isAnimatingRef = useRef(false); // Referencia para controlar la animación
    const audioListenerRef = useRef(null); // Referencia para el AudioListener
    const clickSoundRef = useRef(null); // Referencia para el sonido de clic
    const magicSoundRef = useRef(null); // Referencia para el sonido de animación

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            setIsMobile(newIsMobile);

            // Actualizar el tamaño del renderer
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            // Actualizar las posiciones de las galaxias
            galaxiesRef.current.forEach((galaxy, index) => {
                const newPosition = newIsMobile ? galaxyPositionsMobile[index] : galaxyPositionsPC[index];
                galaxy.position.copy(newPosition);
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        scene.background = new THREE.Color(0x001833);
        // -------------------------

        // Agregar 2 luz ambiental y una luz puntual
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Luz suave
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(50, 0, 30);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight2.position.set(-50, 0, 30);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight2.position.set(-60, -30, 30);
        scene.add(pointLight3);

        // Uso en la escena
        const lunaCreciente = CrearLuna(0.3);
        scene.add(lunaCreciente);
        lunaCreciente.position.set(-13,17,-10);

        const lunaCreciente2 = CrearLuna(0.05);
        scene.add(lunaCreciente2);
        lunaCreciente2.position.set(10,0,-10);
        lunaCreciente2.scale.set(1.5,1.5,1.5);
        
        const lunaCreciente3 = CrearLuna(0.4);
        scene.add(lunaCreciente3);
        lunaCreciente3.position.set(-20,-10,-10);
        lunaCreciente3.scale.set(0.8,0.8,0.8);

        const estrellas = [];
        const cruces = [];
        const termometros = [];
        const circulos = [];
        const nubes = [];
        const lineas = [];

        nubeconfig.forEach(config => {
            const nube = CrearNube();
            nube.position.set(config.x, config.y, config.z);
            nube.scale.set(config.escalado, config.escalado, config.escalado);
            scene.add(nube);
            nubes.push(nube);
        });

        // Crear y posicionar estrellas con colores fijos
        TermometroConfig.forEach(config => {
            const termometro = CrearTermometro();
            termometro.position.set(config.x, config.y, config.z);
            termometro.rotation.set(config.rotationx, config.rotationy, config.rotationz);
            termometro.scale.set(0.5,0.5,0.5);
        
            scene.add(termometro);
            termometros.push(termometro);

            // Animación de oscilación
            termometro.userData = { angle: Math.random() * Math.PI * 2 }; // Guardamos un ángulo inicial aleatorio

            const swingSpeed = 0.005; // Velocidad de oscilación

            termometro.animation = () => {
                termometro.userData.angle += swingSpeed; // Aumentamos el ángulo en cada frame
                termometro.rotation.z = Math.sin(termometro.userData.angle) * 0.2; // Aplicamos el movimiento de oscilación
            };
        });
        
        // Crear y posicionar estrellas con colores fijos
        estrellasConfig.forEach(config => {
            const estrella = CrearEstrellas3D(config.color)
            estrella.position.set(config.x, config.y, config.z);

            estrella.rotation.set(config.rotationX, config.rotationY, config.rotationZ);
            estrella.scale.set(config.escalado,config.escalado,config.escalado);

            scene.add(estrella);
            estrellas.push(estrella);
        });

        // Crear y agregar líneas a la escena
        lineasConfig.forEach((config) => {
            const linea = crearLineaVertical(config.altura);
            linea.position.set(config.x, config.y, config.z);
            scene.add(linea);
            lineas.push(linea);
            
        });

        // Crear y posicionar círculos con colores fijos
        circulosConfig.forEach(config => {
            const circulo = crearCirculo(config.color,config.radio);
            circulo.position.set(config.x, config.y, config.z);
            scene.add(circulo);
            circulos.push(circulo);
        });

        // Crear y posicionar cruces redondas con colores fijos
        crucesConfig.forEach(config => {
            const cruz = CreaCruzRedonda(config.color, config.altura, config.ancho, config.grosor);
            cruz.position.set(config.x, config.y, config.z);
            cruz.rotation.set(config.rotx, config.roty, config.rotz);
            scene.add(cruz);
            cruces.push(cruz);
        });

        galaxiesRef.current = galaxies;

        camera.position.set(0, 0, 18);

        let velocidadMovimiento = 0.00003; // Velocidad de la oscilación
        let rangoOscilacion = 25; // El rango máximo de oscilación en el eje X
        
        // Función para actualizar la velocidad y el rango de oscilación en función del tamaño de la pantalla
        const actualizarParametrosAnimacion = () => {
            const isMobile = window.innerWidth < 768;

            // Ajustar la velocidad y el rango de oscilación para pantallas pequeñas (móviles)
            if (isMobile) {
                velocidadMovimiento = 0.00005;  // Menor velocidad en móviles
                rangoOscilacion = 5;            // Menor rango en móviles
            } else {
                velocidadMovimiento = 0.00005;  // Velocidad normal en pantallas grandes
                rangoOscilacion = 25;            // Rango normal en pantallas grandes
            }
        };

        // Creamos las nubes con direcciones iniciales
        nubes.forEach((nube, index) => {
            // Asignamos la dirección de inicio a cada nube
            nube.direccion = (index % 2 === 0) ? -1 : 1;  // Primera nube izquierda (-1), segunda nube derecha (+1)
        });

        function moverNubes() {
            nubes.forEach(nube => {
                // Usamos Math.sin para crear un movimiento oscilante
                let posicionX = rangoOscilacion * Math.sin(velocidadMovimiento * performance.now());
        
                // Modificamos la dirección de la nube según la asignada
                nube.position.x = posicionX * nube.direccion;
            });
        }

        // Función para manejar el redimensionamiento de la ventana
        const onWindowResizeNube = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            nubeconfig.forEach((config, index) => {
                const nube = nubes[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index === 0) {
                        nube.scale.set(0.4, 0.4, 0.4); // Primera nube más pequeña
                    } else {
                        nube.scale.set(0.2, 0.2, 0.2); // Segunda nube más pequeña
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    nube.scale.set(config.escalado, config.escalado, config.escalado);
                }
            });

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onWindowResizeEstrella = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            estrellasConfig.forEach((config, index) => {
                const estrella = estrellas[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        estrella.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                        estrella.scale.set(config.escalado/1.7,config.escalado/1.7,config.escalado/1.7);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    estrella.position.set(config.x, config.y, config.z);
                    estrella.scale.set(config.escalado,config.escalado,config.escalado);
                }
            });
        };

        const onWindowResizeLineas = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            lineasConfig.forEach((config, index) => {
                const linea = lineas[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        linea.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    linea.position.set(config.x, config.y, config.z);
                }
            });
        };

        const onWindowResizeTermometro = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            TermometroConfig.forEach((config, index) => {
                const termometro = termometros[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        termometro.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    termometro.position.set(config.x, config.y, config.z);
                }
            });
        };

        const onWindowResizeCruces = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            crucesConfig.forEach((config, index) => {
                const cruz = cruces[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        cruz.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                        cruz.scale.set(0.7,0.7,0.7);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    cruz.position.set(config.x, config.y, config.z);
                    cruz.scale.set(1,1,1);
                }
            });
        };

        const onWindowResizeLuna = () => {
            const isMobile = window.innerWidth < 768;
            
            lunaCreciente.position.set(isMobile ? -10 : -13, isMobile ? 15 : 17, -10);
            lunaCreciente.scale.set(isMobile ? 0.7 : 1, isMobile ? 0.7 : 1, isMobile ? 0.7 : 1);
            lunaCreciente2.position.set(isMobile ? 6 : 10, isMobile ? 0 : 0, -10);
            lunaCreciente2.scale.set(isMobile ? 1.2 : 1.5, isMobile ? 1.2 : 1.5, isMobile ? 1.2 : 1.5);
            lunaCreciente3.position.set(isMobile ? -10 : -20, isMobile ? -6 : -10, -10);
            lunaCreciente3.scale.set(isMobile ? 0.6 : 0.8, isMobile ? 0.6 : 0.8, isMobile ? 0.6 : 0.8);
        };

        const onWindowResizeCirculos = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            circulosConfig.forEach((config, index) => {
                const circulo = circulos[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= circulos.length - 1) {
                        circulo.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                        circulo.scale.set(0.5,0.5,0.5);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    circulo.position.set(config.x, config.y, config.z);
                    circulo.scale.set(1,1,1);
                }
            });
        };

        // Escuchar el evento de redimensionamiento de la ventana
        window.addEventListener('resize', onWindowResizeNube);
        window.addEventListener('resize', actualizarParametrosAnimacion);
        window.addEventListener('resize', onWindowResizeEstrella);
        window.addEventListener('resize', onWindowResizeLineas);
        window.addEventListener('resize', onWindowResizeTermometro);
        window.addEventListener('resize', onWindowResizeCruces);
        window.addEventListener('resize', onWindowResizeLuna);
        window.addEventListener('resize', onWindowResizeCirculos);
        
        onWindowResizeNube();
        actualizarParametrosAnimacion();
        onWindowResizeEstrella();
        onWindowResizeLineas();
        onWindowResizeTermometro();
        onWindowResizeCruces();
        onWindowResizeLuna();
        onWindowResizeCirculos();

        let time = 0;
        let scaleDirection = 1; // 1 para agrandar, -1 para achicar
        let scaleSpeed = 0.002; // Velocidad de cambio de escala
        let minScale = 0.3; // Límite de escala mínimo

        const animate = () => {
            requestAnimationFrame(animate);
            
            let scaleLimit = window.innerWidth < 768 ? 0.7 : 1.5; // Límite de escala máximo
            
            time += 0.02;
            console.log(time);
            
            cruces.forEach(cruz => {
                cruz.rotation.z += 0.005;  // Rotación en el eje X
            });

            const tiempoBase = Date.now() * 0.001;

            estrellas.forEach((estrella, index) => {
                const velocidad = 1; // Ajusta la velocidad del rebote
                const amplitud = 0.03; // Ajusta la altura del rebote
                const tiempo = tiempoBase + index * 0.3; // Desfase entre estrellas
                

                estrella.position.y += Math.cos(tiempo * velocidad) * amplitud * 0.5 ;
                estrella.rotation.z += 0.005; // Rotación continua
            });

            circulos.forEach((circulo, index) => {
                const velocidad = 0.5; // Ajusta la velocidad del rebote
                const amplitud = 0.01; // Ajusta la altura del rebote
                const tiempo = tiempoBase + index * 0.3; // Desfase entre círculos
            
            
                circulo.position.y += Math.cos(tiempo * velocidad) * amplitud;
            
                // Efecto de escala pulsante
                if (scaleDirection === 1) {
                    circulo.scale.set(
                        circulo.scale.x + scaleSpeed,
                        circulo.scale.y + scaleSpeed,
                        circulo.scale.z + scaleSpeed
                    );
                } else {
                    circulo.scale.set(
                        circulo.scale.x - scaleSpeed,
                        circulo.scale.y - scaleSpeed,
                        circulo.scale.z - scaleSpeed
                    );
                }
            
                if (circulo.scale.x >= scaleLimit || circulo.scale.x <= minScale) {
                    scaleDirection *= -1;
                }
            });

            termometros.forEach(termometro => {
                termometro.animation(); // Llamamos a la animación de cada termómetro
            });

            moverNubes();
            
            renderer.render(scene, camera);
        };
        
        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [isMobile, galaxiesVisible]); // Asegúrate de incluir galaxiesVisible en las dependencias

    const handleConfirm = () => {
        if (selectedGalaxy && !isAnimatingRef.current) {
            const selectedGalaxyIndex = selectedGalaxy.index;
            const galaxy = galaxiesRef.current[selectedGalaxyIndex];
            const url = selectedGalaxy.url;
    
            // Ocultar todas las galaxias excepto la seleccionada
            galaxiesRef.current.forEach((galaxy, index) => {
                galaxy.visible = index === selectedGalaxyIndex; // Solo la seleccionada es visible
            });
    
            // Iniciar la animación de acercamiento
            isAnimatingRef.current = true;
    
            // Reproducir el sonido de animación (magic.mp3)
            if (magicSoundRef.current) {
                magicSoundRef.current.play();
            }
    
            const duration = 1.5; // Duración de la animación
            const distance = 9; // Distancia a la que se acerca la cámara
            const direction = new THREE.Vector3().subVectors(cameraRef.current.position, galaxy.position).normalize();
            const targetPosition = new THREE.Vector3().copy(galaxy.position).add(direction.multiplyScalar(distance));
            const startPosition = new THREE.Vector3().copy(cameraRef.current.position);
            let elapsed = 0;
    
            const animateMove = () => {
                elapsed += 0.01;
                const t = Math.min(elapsed / duration, 1);
    
                // ANIMACION DE ACERCAMINETO DE GALAXIA
                cameraRef.current.position.lerpVectors(startPosition, targetPosition, t);
                cameraRef.current.lookAt(galaxy.position);
    
                if (t < 1) {
                    requestAnimationFrame(animateMove);
                } else {
                    setTimeout(() => {
                        // Restaurar la visibilidad de todas las galaxias antes de redirigir
                        galaxiesRef.current.forEach((galaxy) => {
                            galaxy.visible = true;
                        });
                        window.location.href = url;
                    }, 1000); // DURACION DE ANIMACION DE ACERCAMIENTO --------------
                }
            };
    
            animateMove();
        }
    };

    return (
        <>
            <CentralText selectedGalaxy={selectedGalaxy} onConfirm={handleConfirm} />
            <BackButton redirectUrl="/" /> {/* Pasa la URL dinámica */}
        </>
    );
}