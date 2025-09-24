import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ResizeHandler from '../../../../components/Landing/ResizeHandler';
import CrearLuna from '../../../../components/FondoNiños/CrearLuna';
import CrearEstrellas3D from '../../../../components/FondoNiños/CrearEstrellas3D';
import crearLineaVertical from '../../../../components/FondoNiños/CrearLineaVerticalEstrella';
import crearCirculo from '../../../../components/FondoNiños/CrearCirculo';
import CreaCruzRedonda from '../../../../components/FondoNiños/CrearCruzRedonda';
import CrearTermometro from '../../../../components/FondoNiños/CrearTermometro';
import CrearNube from '../../../../components/FondoNiños/CrearNube';
import {nubeconfigLandinPage, estrellasConfigLandinPage, lineasConfigLandinPage, TermometroConfigLandinPage, circulosConfigLandinPage, crucesConfigLandinPage} from '../../../../components/FondoNiños/ArregloObjetos';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ThreeScene = ({ textures }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [abierto, setAbierto] = useState(false);

    // Refs to store persistent objects
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sphereRef = useRef(null); // Planet central
    const planetsRef = useRef([]); // Mini planets
    let model;
    let angle = 0;


    useEffect(() => {
        if(abierto) return;
        setAbierto(true)
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
            renderer.domElement.style.top = '5vh';
            renderer.domElement.style.left = '2.5vw';
            renderer.domElement.style.zIndex = 0; // Asegurar que esté detrás de otros elementos
            
            renderer.domElement.style.borderRadius = '.5rem';
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

        const loader = new GLTFLoader();

        loader.load(
            "/assets/cohete/scene.gltf",
            function (gltf) {
              model = gltf.scene;
              // Posición inicial del meteorito fuera de la cámara, en el lado izquierdo
              model.position.set(0, 0, 0); // Lejos de la cámara en Z
              model.scale.set(10, 10, 10);
              model.rotation.set(0, 0, 0);
              
              sceneRef.current.add(model);
      
              if (gltf.animations && gltf.animations.length > 0) {
                setupAnimation(model, gltf.animations);
              }
      
              gltf.scene; // THREE.Group
              gltf.scenes; // Array<THREE.Group>
              gltf.cameras; // Array<THREE.Camera>
              gltf.asset;
            },
            function (xhr) {
              // Monitoreo del progreso de carga
              console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
            },
            function (error) {
              // Muestra cualquier error que ocurra
              console.error("Error cargando el meteorito: ", error);
            }
          );
        

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
                return;
                window.location.href = clickedPlanet.userData.url;
            }
        };

        // Agregar el listener de clic
        document.addEventListener('click', onDocumentClick);

        

        
        
    }, [textures]); // Dependencia de textures para crear el planeta central solo una vez

    // Efecto para actualizar los mini planetas cuando cambia currentIndex
    useEffect(() => {
        if(abierto) return;
        setAbierto(true)
    }, [textures, currentIndex]); // Dependencia de currentIndex

    // Efecto para manejar la animación
    useEffect(() => {
        const animate = () => {
            requestAnimationFrame(animate);
            if(model){
                angle += 0.01;
                var radAng = angle * (Math.PI / 180)
                /*var radAng = angle * (Math.PI / 180);
                const radius = 1;
                const x = Math.cos(radAng)*radius
                const z = Math.sin(radAng)*radius*/
                model.rotation.z = Math.sin(angle);
                model.scale.x = 30;
                model.scale.y = 30;
                model.scale.z = 30;
                model.position.z = Math.sin(angle)*8;
                model.position.x = Math.cos(angle)*8;
                model.position.y = Math.cos(angle)*8;
                model.rotation.y = Math.sin(angle);
                
                
            }

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
        // -------- Fondo de Niños --------
        
        sceneRef.current.background = new THREE.Color(0x001833);
        
        // Uso en la escena
        const lunaCreciente = CrearLuna(0.3);
        sceneRef.current.add(lunaCreciente);
        lunaCreciente.position.set(-13,17,-10);

        const lunaCreciente2 = CrearLuna(0.05);
        sceneRef.current.add(lunaCreciente2);
        lunaCreciente2.position.set(10,0,-10);
        lunaCreciente2.scale.set(1.5,1.5,1.5);
        
        const lunaCreciente3 = CrearLuna(0.4);
        sceneRef.current.add(lunaCreciente3);
        lunaCreciente3.position.set(-20,-10,-10);
        lunaCreciente3.scale.set(0.8,0.8,0.8);

        const estrellas = [];
        const cruces = [];
        const termometros = [];
        const circulos = [];
        const nubes = [];
        const lineas = [];

        nubeconfigLandinPage.forEach(config => {
            const nube = CrearNube();
            nube.position.set(config.x, config.y, config.z);
            nube.scale.set(config.escalado, config.escalado, config.escalado);
            sceneRef.current.add(nube);
            nubes.push(nube);
        });

        TermometroConfigLandinPage.forEach(config => {
            const termometro = CrearTermometro();
            termometro.position.set(config.x, config.y, config.z);
            termometro.rotation.set(config.rotationx, config.rotationy, config.rotationz);
            termometro.scale.set(0.5,0.5,0.5);
        
            sceneRef.current.add(termometro);
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
        estrellasConfigLandinPage.forEach(config => {
            const estrella = CrearEstrellas3D(config.color)
            estrella.position.set(config.x, config.y, config.z);

            estrella.rotation.set(config.rotationX, config.rotationY, config.rotationZ);
            estrella.scale.set(config.escalado,config.escalado,config.escalado);

            sceneRef.current.add(estrella);
            estrellas.push(estrella);
        });

        // Crear y agregar líneas a la escena
        lineasConfigLandinPage.forEach((config) => {
            const linea = crearLineaVertical(config.altura);
            linea.position.set(config.x, config.y, config.z);
            sceneRef.current.add(linea);
            lineas.push(linea);
            
        });

        // Crear y posicionar círculos con colores fijos
        circulosConfigLandinPage.forEach(config => {
            const circulo = crearCirculo(config.color,config.radio);
            circulo.position.set(config.x, config.y, config.z);
            sceneRef.current.add(circulo);
            circulos.push(circulo);
        });

        // Crear y posicionar cruces redondas con colores fijos
        crucesConfigLandinPage.forEach(config => {
            const cruz = CreaCruzRedonda(config.color, config.altura, config.ancho, config.grosor);
            cruz.position.set(config.x, config.y, config.z);
            cruz.rotation.set(config.rotx, config.roty, config.rotz);
            sceneRef.current.add(cruz);
            cruces.push(cruz);
        });

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

        const onWindowResizeNube = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            nubeconfigLandinPage.forEach((config, index) => {
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

            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            if(window.innerWidth > 600){
                rendererRef.current.setSize(window.innerWidth*19/20 - 16, window.innerHeight*9/10);
                rendererRef.current.domElement.style.top = '5vh';
                rendererRef.current.domElement.style.left = '2.5vw';
            }else{
                rendererRef.current.setSize(window.innerWidth - 16, window.innerHeight);
                rendererRef.current.domElement.style.top = '0';
                rendererRef.current.domElement.style.left = '0';
            }
        };
        
        const onWindowResizeEstrella = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            estrellasConfigLandinPage.forEach((config, index) => {
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
            lineasConfigLandinPage.forEach((config, index) => {
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
            TermometroConfigLandinPage.forEach((config, index) => {
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
            crucesConfigLandinPage.forEach((config, index) => {
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
            circulosConfigLandinPage.forEach((config, index) => {
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
        // ---------- Termina fondo Niños ---------

        let time = 0;
        let scaleDirection = 1; // 1 para agrandar, -1 para achicar
        let scaleSpeed = 0.002; // Velocidad de cambio de escala
        let minScale = 0.3; // Límite de escala mínimo

        const animateFondo = () => {
            requestAnimationFrame(animateFondo);
            let scaleLimit = window.innerWidth < 768 ? 0.7 : 1.5; // Límite de escala máximo
            
            time += 0.02;
            //console.log(time);
            
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
            
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            
        };
        animateFondo();
        
        return () => {
            rendererRef.current.dispose();
        };
    }, []); // Sin dependencias para que se ejecute solo una vez

    
    // Dentro del return de ThreeScene.js
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0, // Asegura que esté detrás del contenido principal
            pointerEvents:"none"
        }}>
            <div ref={mountRef} id='overlay-container-bg' style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 0
            }} />
            {/* Botones de next y prev */}
            
            {/* Integrar el ResizeHandler */}
            <ResizeHandler setIsMobile={setIsMobile} />
        </div>
    );
};

export default ThreeScene;