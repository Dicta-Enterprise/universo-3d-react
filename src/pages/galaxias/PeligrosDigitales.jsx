import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import BackButton from '../../components/BackButton';
import DivCentral from '../../components/Planetas/DivCentral';
import ControlButtons from '../../components/Planetas/ControlButtons';
import InfoBox from '../../components/Planetas/InfoBox';
import CrearEstrellas3D from '../../components/FondoNIños/CrearEstrellas3D';
import crearLineaVertical from '../../components/FondoNIños/CrearLineaVerticalEstrella';
import crearCirculo from '../../components/FondoNIños/CrearCirculo';
import CreaCruzRedonda from '../../components/FondoNIños/CrearCruzRedonda';
import CrearTermometro from '../../components/FondoNIños/CrearTermometro';
import CrearNube from '../../components/FondoNIños/CrearNube';
import CrearLuna from '../../components/FondoNIños/CrearLuna';
import {nubeconfig, estrellasConfig, circulosConfig, crucesConfig, lineasConfig, TermometroConfig} from '../../components/FondoNIños/ArregloObjetos';

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
        '/assets/2k_jupiter.jpg',
        '/assets/2k_mars.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
    ];

    const texts = [
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta KIO\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Cyberbullying\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Artificialis",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta 2\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Grooming\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Pedofilus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta 3\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Retos Virales\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Falsus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta 4\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Phubbing\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Ignorus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta 5\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Teen Vamping\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Vampirus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta GRATUS\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Discriminación Digital\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Racistus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta SCIENTIA\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Pseudociencia\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Incultus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta GAUDIUM\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Domilización Drogas\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Drogus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta PAX\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Contenido Violento\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Barbarus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta LIBER\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Secuestro Electronico\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Amenazus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta REALIS\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Ciberextrocion\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Bandidus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta REPAUSARE\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Intoxicacion Digital\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Toxicus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta PRIVATUS\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Filtración de Datos\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Hurtus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta ACCU\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Deep Web\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Tnebrosus",
        "Tipo de riesgo: Salud Mental\nPlaneta: Planeta TRIPALLIARE\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Hackers\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Caretus",
    ];

    const planetUrls = [
        '/ninos/peligros_digitales/planeta_kio',
        '/ninos/peligros_digitales/planeta_2',
        '/ninos/peligros_digitales/planeta_3',
        '/ninos/peligros_digitales/planeta_4',
        '/ninos/peligros_digitales/planeta_5',
        '/ninos/peligros_digitales/planeta_gra',
        '/ninos/peligros_digitales/planeta_sci',
        '/ninos/peligros_digitales/planeta_gau',
        '/ninos/peligros_digitales/planeta_pax',
        '/ninos/peligros_digitales/planeta_lib',
        '/ninos/peligros_digitales/planeta_rea',
        '/ninos/peligros_digitales/planeta_rep',
        '/ninos/peligros_digitales/planeta_pri',
        '/ninos/peligros_digitales/planeta_acc',
        '/ninos/peligros_digitales/planeta_tri',
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
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.appendChild(renderer.domElement);

        /*const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;*/

        // Fondo de Niños ----------------------------------

        scene.background = new THREE.Color(0x001833);
        
        // Agregar 2 luz ambiental y una luz puntual
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Luz suave
        scene.add(ambientLight);

        const pointLight5 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight5.position.set(50, 0, 30);
        scene.add(pointLight5);

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

        // --------------------------------------------------

        const sphereGeometry = new THREE.SphereGeometry(6, 64, 64);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(textures[currentTextureIndex]),
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        /*const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(2, 5, 10);
        scene.add(pointLight);*/

        camera.position.set(0, 0, 18);

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

            // del Fondo Niños ---------------
                        
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

            sphere.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
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
            <BackButton redirectUrl="/ninos" color={'#cc99ff'} background= {'none'}/> {/* Pasa la URL dinámica */}
            <DivCentral title="Bienvenidos a la sección de Peligros Digitales">
                <InfoBox text={texts[currentTextureIndex]} color={'#cc99ff'} />
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
                color="#cc99ff"
            />
        </div>
    );
}