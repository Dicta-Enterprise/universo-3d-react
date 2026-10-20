import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';



const ThreeScene = forwardRef(function ThreeScene({ onLoad, onPlanetTransform, estrellasAlternas, mostrarAstronautas }, ref) {
    const navigate = useNavigate();
    const revealPlanetRef = useRef(() => {});
    const moveToCornerRef = useRef(() => {});
    const moveToCenterRef = useRef(() => {});
    const resetIntroRef = useRef(() => {});
    // Guarda siempre la última versión de onPlanetTransform sin tener que meterla en las
    // dependencias del useEffect grande de más abajo (eso reconstruiría toda la escena 3D
    // de nuevo cada vez que Home.jsx pasara una función con identidad distinta).
    const onPlanetTransformRef = useRef(onPlanetTransform);
    useEffect(() => { onPlanetTransformRef.current = onPlanetTransform; }, [onPlanetTransform]);
    // Segundo efecto de estrellas (parpadeo): el de por defecto (el fondo fijo de siempre) no
    // se toca; este es aparte, apagado salvo que el botón de la esquina lo prenda. Mismo patrón
    // de ref que onPlanetTransform, para no reconstruir la escena.
    const estrellasAlternasRef = useRef(estrellasAlternas);
    useEffect(() => { estrellasAlternasRef.current = estrellasAlternas; }, [estrellasAlternas]);
    // Pantalla "Anticípate..." (diseño de Figma): los 4 astronautas flotando solo se
    // ven en esa fase -- Home.jsx manda cuándo, con el mismo patrón de ref de arriba.
    const mostrarAstronautasRef = useRef(mostrarAstronautas);
    useEffect(() => { mostrarAstronautasRef.current = mostrarAstronautas; }, [mostrarAstronautas]);

    useImperativeHandle(ref, () => ({
        revealPlanet: () => revealPlanetRef.current(),
        moveToCorner: () => moveToCornerRef.current(),
        moveToCenter: () => moveToCenterRef.current(),
        resetIntro: () => resetIntroRef.current(),
    }), []);

    useEffect(() => {

        // Evita volver a descargar/decodificar un mismo archivo (cohete, texturas) si ya se pidió antes
        THREE.Cache.enabled = true;

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

        // --- Segundo efecto de estrellas (parpadeo) ---
        // Aparte del fondo de arriba (que no se toca, sigue siendo el de siempre): un grupo de
        // estrellas que brillan y parpadean de verdad, pensado para probarlo con el botón de la
        // esquina y comparar contra el fondo fijo -- empieza APAGADO (visible=false), así que si
        // nadie lo prende, nada cambia de cómo se ve hoy la página.
        const ESTRELLAS_ALTERNAS_CANTIDAD = 220;
        const estrellasAlternasGroup = new THREE.Group();
        const estrellasAlternas = [];
        for (let i = 0; i < ESTRELLAS_ALTERNAS_CANTIDAD; i++) {
            const tamano = 0.04 + Math.random() * 0.07;
            const geometry = new THREE.SphereGeometry(tamano, 6, 6);
            // depthWrite:false es la parte clave -- sin esto, estas estrellas (aunque transparentes)
            // "tapaban" a las partículas que ya se movían (quedaban escritas en el buffer de
            // profundidad, y Three.js las usaba para ocultar lo que hubiera detrás). Sin este
            // ajuste, al prender el parpadeo las partículas que ya se movían desaparecían.
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, depthWrite: false });
            const estrella = new THREE.Mesh(geometry, material);
            // Dispersas en una especie de domo grande alrededor del recorrido de la cámara
            // (la cámara va de z=3 a z=13 con el scroll), para que se vean durante todo el scroll.
            const angulo = Math.random() * Math.PI * 2;
            const radio = 25 + Math.random() * 45;
            const posicionBase = new THREE.Vector3(
                Math.cos(angulo) * radio,
                (Math.random() - 0.5) * 50,
                Math.sin(angulo) * radio - 10,
            );
            estrella.position.copy(posicionBase);
            estrella.userData.posicionBase = posicionBase;
            estrella.userData.fase = Math.random() * Math.PI * 2;
            estrella.userData.velocidad = 0.0015 + Math.random() * 0.002;
            // Para que floten un poco, no solo que parpadeen quietas
            estrella.userData.faseFlote = Math.random() * Math.PI * 2;
            estrella.userData.velocidadFlote = 0.0004 + Math.random() * 0.0006;
            estrella.userData.amplitudFlote = 0.6 + Math.random() * 1.2;
            estrellasAlternasGroup.add(estrella);
            estrellasAlternas.push(estrella);
        }
        estrellasAlternasGroup.visible = false;
        scene.add(estrellasAlternasGroup);

        // Las dos son mutuamente excluyentes: con el botón prendido se ven SOLO las que
        // parpadean (las que ya se movían se ocultan); apagado, vuelve a ser como siempre.
        function actualizarEstrellasAlternas() {
            const activo = estrellasAlternasRef.current;
            estrellasAlternasGroup.visible = activo;
            particlesGroup.visible = !activo;
            if (!activo) return;
            const ahora = performance.now();
            estrellasAlternas.forEach((estrella) => {
                // Mismo truco que ya se usaba en Landing/ThreeSceneBackground.jsx: escala pulsando
                // con una onda seno, desfasada por estrella para que no parpadeen todas a la vez.
                const pulso = 1 + 0.5 * Math.sin(ahora * estrella.userData.velocidad + estrella.userData.fase);
                estrella.scale.setScalar(pulso);
                estrella.material.opacity = 0.5 + 0.5 * pulso;
                // Flote suave alrededor de su posición base, en vez de quedarse fijas
                const { posicionBase, velocidadFlote, faseFlote, amplitudFlote } = estrella.userData;
                estrella.position.y = posicionBase.y + Math.sin(ahora * velocidadFlote + faseFlote) * amplitudFlote;
                estrella.position.x = posicionBase.x + Math.cos(ahora * velocidadFlote * 0.8 + faseFlote) * amplitudFlote * 0.6;
            });
        }

        // --- Fondo largo ---
        // Imagen muy alta (5692x25732) que va detrás de todo lo demás, delante de las estrellas
        // (las estrellas de scene.background no se tocan, se siguen viendo alrededor). Al hacer
        // scroll se desliza verticalmente de arriba a abajo, dando sensación de ir avanzando.
        // Es hija de la cámara para que siempre cubra toda la pantalla sin importar cómo se
        // mueva la cámara (igual que un fondo fijo detrás de todo).
        const fondoLargoTexture = new THREE.TextureLoader().load('/assets/fondo-md-extend.png');
        fondoLargoTexture.wrapS = THREE.ClampToEdgeWrapping;
        fondoLargoTexture.wrapT = THREE.ClampToEdgeWrapping;
        const FONDO_LARGO_ASPECT = 5692 / 25732; // ancho / alto reales del PNG
        const FONDO_LARGO_DISTANCIA = 80; // detrás del planeta/cohetes (que usan z hasta -50)
        const fondoLargoGeometry = new THREE.PlaneGeometry(1, 1);
        const fondoLargoMaterial = new THREE.MeshBasicMaterial({ map: fondoLargoTexture, depthWrite: false });
        const fondoLargo = new THREE.Mesh(fondoLargoGeometry, fondoLargoMaterial);
        fondoLargo.position.z = -FONDO_LARGO_DISTANCIA;
        fondoLargo.renderOrder = -1; // se dibuja antes que el resto, para quedar siempre detrás
        camera.add(fondoLargo);
        scene.add(camera); // una cámara con hijos debe estar en la escena para que se rendericen

        // Recalcula el tamaño del plano para que cubra toda la pantalla a su distancia fija,
        // y cuánto de la imagen se ve de una vez (como "background-size: cover", recortando
        // por altura ya que la imagen es mucho más alta que ancha).
        function actualizarFondoLargo() {
            const alturaVisible = 2 * FONDO_LARGO_DISTANCIA * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const anchoVisible = alturaVisible * camera.aspect;
            fondoLargo.scale.set(anchoVisible, alturaVisible, 1);
            fondoLargoTexture.repeat.set(1, Math.min(FONDO_LARGO_ASPECT / camera.aspect, 1));
        }
        actualizarFondoLargo();

        // progress: 0 = inicio del scroll (arriba de la imagen), 1 = final (abajo de la imagen)
        function actualizarDesplazamientoFondoLargo(progress) {
            fondoLargoTexture.offset.y = (1 - fondoLargoTexture.repeat.y) * (1 - progress);
        }

        // Crea la esfera (planeta) con la textura del ícono de Mundo Dictariano
        const planetTexture = new THREE.TextureLoader().load('/assets/TTNN.png');
        const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
        // MeshBasicMaterial a propósito (no MeshStandardMaterial): ese respondía a la luz
        // direccional y le dejaba una sombra marcada en un lado. Con esta, el planeta se ve
        // siempre parejo, como el ícono plano del Figma, sin afectar la luz de cohetes/astronautas.
        const planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        scene.add(planet);

        // El planeta arranca oculto: aparece con la transición de entrada (ver revealPlanet)
        planet.visible = false;
        const PLANET_FINAL_Y = 0;
        const PLANET_START_Y = -2.2;
        planet.position.y = PLANET_START_Y;
        planet.scale.setScalar(0.05);

        let planetReveal = null; // { startTime, duration } mientras la animación de entrada corre
        // Se guarda para que moveToCenter sepa a qué tamaño volver (es el mismo escalaFinal de
        // revealPlanet, pero esa variable era local a esa función nada más).
        let escalaRevelada = 1;

        function easeOutBack(t) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        }

        revealPlanetRef.current = () => {
            if (planet.visible) return; // Evita reiniciar la animación si ya se reveló
            planet.visible = true;
            planet.material.opacity = 1; // por si quedó en 0 de un desvanecido anterior (resetIntro ya lo hace, esto es doble seguro)
            // En pantallas angostas (celulares) el mundo grande se ve desproporcionado si queda
            // del mismo tamaño que en laptop, así que su tamaño final es un poco menor ahí.
            const escalaFinal = window.innerWidth <= 700 ? 0.65 : 1;
            escalaRevelada = escalaFinal;
            planetReveal = { startTime: performance.now(), duration: 1800, escalaFinal };
        };

        function updatePlanetReveal() {
            if (!planetReveal) return;
            const elapsed = performance.now() - planetReveal.startTime;
            const t = Math.min(elapsed / planetReveal.duration, 1);
            const eased = easeOutBack(t);
            planet.scale.setScalar(0.05 + eased * (planetReveal.escalaFinal - 0.05));
            planet.position.y = PLANET_START_Y + eased * (PLANET_FINAL_Y - PLANET_START_Y);
            if (t >= 1) planetReveal = null;
        }

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Encuentra el punto del mundo que cae justo en (ndcX, ndcY) de la pantalla
        // (coordenadas -1..1) sobre el plano z = targetZ, para mandar el planeta a una esquina.
        function screenToWorld(ndcX, ndcY, targetZ) {
            const punto = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
            const direccion = punto.sub(camera.position).normalize();
            const distancia = (targetZ - camera.position.z) / direccion.z;
            return camera.position.clone().add(direccion.multiplyScalar(distancia));
        }

        // Punto de la pantalla (NDC) y escala donde debe quedar el planeta al ir a la esquina.
        // Se reutiliza también al redimensionar la ventana, para que no se desalinee.
        // En pantallas angostas se acerca un poco al centro (~1%) para no quedar pegado al borde.
        function obtenerNdcEsquina() {
            return window.innerWidth <= 712
                ? { x: 0.78, y: 0.72 }
                : { x: 0.8, y: 0.74 };
        }
        // Se manda más lejos de la cámara (en vez de dejarlo a la misma distancia que al centro)
        // y se compensa con más escala: así se evita el efecto "huevo" que da una esfera real
        // cuando queda muy hacia la orilla de una cámara de ángulo amplio.
        const ESQUINA_TARGET_Z = -6;
        const ESQUINA_ESCALA = 0.65;
        // Debe coincidir con la duración de "transition" de .titulo-intro en styles.css,
        // para que el planeta y el texto se muevan juntos, como un solo bloque.
        const ESQUINA_DURACION_MS = 1600;

        let cornerMove = null; // { startTime, duration, from, to, scaleFrom, scaleTo, opacityFrom, opacityTo, alTerminarOcultar }
        let enEsquina = false; // true una vez que el planeta ya llegó (o está yendo) a la esquina
        planet.material.transparent = true; // hace falta desde ya para poder desvanecerlo

        // Antes el planeta llegaba a la esquina y se quedaba ahí parqueado todo "Anticípate...".
        // Ahora se desvanece EN EL CAMINO hacia la esquina, llegando invisible justo cuando
        // empieza esa pantalla (en vez de encogerse y quedarse de golpe, o quedarse visible
        // estorbando).
        moveToCornerRef.current = () => {
            if (!planet.visible || cornerMove) return;
            enEsquina = true;
            const ndc = obtenerNdcEsquina();
            const destino = screenToWorld(ndc.x, ndc.y, ESQUINA_TARGET_Z);
            cornerMove = {
                startTime: performance.now(),
                duration: ESQUINA_DURACION_MS,
                from: planet.position.clone(),
                to: destino,
                scaleFrom: planet.scale.x,
                scaleTo: ESQUINA_ESCALA,
                opacityFrom: planet.material.opacity,
                opacityTo: 0,
                alTerminarOcultar: true,
            };
        };

        // Camino de regreso: igual que moveToCorner pero al revés -- reaparece (fade in) mientras
        // regresa del punto de la esquina al centro. Se usa cuando el usuario vuelve de la
        // pantalla "Anticípate..." a la de la frase bajo el planeta.
        moveToCenterRef.current = () => {
            if (cornerMove) return; // ya no se revisa planet.visible: ahora normalmente está oculto en este punto
            enEsquina = false;
            planet.visible = true;
            planet.material.opacity = 0;
            const ndc = obtenerNdcEsquina();
            cornerMove = {
                startTime: performance.now(),
                duration: ESQUINA_DURACION_MS,
                from: screenToWorld(ndc.x, ndc.y, ESQUINA_TARGET_Z), // reaparece desde el punto de la esquina
                to: new THREE.Vector3(0, PLANET_FINAL_Y, 0),
                scaleFrom: ESQUINA_ESCALA,
                scaleTo: escalaRevelada,
                opacityFrom: 0,
                opacityTo: 1,
                alTerminarOcultar: false,
            };
        };

        // Vuelve el planeta a su estado de antes de revelarse (oculto, chiquito, centrado),
        // cancelando cualquier animación en curso. Se usa cuando el usuario hace scroll de
        // vuelta hasta arriba del todo, para que la intro se pueda ver de nuevo desde cero.
        resetIntroRef.current = () => {
            planetReveal = null;
            cornerMove = null;
            enEsquina = false;
            planet.visible = false;
            planet.position.set(0, PLANET_START_Y, 0);
            planet.scale.setScalar(0.05);
            planet.material.opacity = 1; // para que la próxima revelación no arranque invisible
        };

        function updateCornerMove() {
            if (!cornerMove) return;
            const elapsed = performance.now() - cornerMove.startTime;
            const t = Math.min(elapsed / cornerMove.duration, 1);
            const eased = easeInOutCubic(t);
            planet.position.lerpVectors(cornerMove.from, cornerMove.to, eased);
            planet.scale.setScalar(cornerMove.scaleFrom + (cornerMove.scaleTo - cornerMove.scaleFrom) * eased);
            planet.material.opacity = cornerMove.opacityFrom + (cornerMove.opacityTo - cornerMove.opacityFrom) * eased;
            if (t >= 1) {
                if (cornerMove.alTerminarOcultar) planet.visible = false;
                cornerMove = null;
            }
        }

        // Si la ventana cambia de tamaño mientras el planeta está en la esquina, recalcula su
        // posición para ese nuevo ancho/alto — si no, se queda "congelado" en el punto del
        // mundo 3D que le tocaba con el tamaño anterior, y se desalinea del texto (que sí es CSS
        // responsivo).
        function realinearEsquinaSiAplica() {
            if (!enEsquina || cornerMove) return;
            const ndc = obtenerNdcEsquina();
            planet.position.copy(screenToWorld(ndc.x, ndc.y, ESQUINA_TARGET_Z));
        }

        // --- 4 astronautas flotando, pantalla "Anticípate..." (diseño de Figma) ---
        // Representan niño/joven/padre-madre. Todavía no se ha entregado el modelo real (el de la
        // carita de mascota) -- mientras tanto se usa el mismo astronauta de muestra del demo de
        // personalización de color (DemoTrajeAstronauta.jsx), con un color distinto cada uno nada
        // más para distinguirlos. Cambiar ASTRONAUTA_FLOTANTE_URL cuando llegue el definitivo.
        const ASTRONAUTA_FLOTANTE_URL = '/assets/demo/astronauta-ejemplo-placeholder.glb';
        const astronautasFlotantes = [];
        const ASTRONAUTAS_COLORES = [0x60a5fa, 0xfb7185, 0x4ade80, 0xfbbf24]; // provisional, no son los colores finales de las mascotas
        // Posiciones en coordenadas de PANTALLA (NDC -1..1), no del mundo 3D -- lejos del bloque
        // de texto central (arriba y abajo de él), para que no se crucen con las letras. Se
        // convierten a un punto del mundo 3D
        // con screenToWorld, la misma función que ya usa el planeta para ir a la esquina -- pero
        // OJO: hay que llamarla en el momento en que se muestran, no antes, porque la cámara se
        // sigue moviendo con el scroll (si se calcula una sola vez al cargar la página, cuando de
        // verdad aparecen ya no corresponde a esos NDC y vuelven a cruzarse con el texto).
        const ASTRONAUTAS_NDC = [
            { x: 0.72, y: 0.62 },   // arriba-derecha, encima del texto
            { x: -0.78, y: 0.5 },   // arriba-izquierda
            { x: -0.7, y: -0.72 },  // abajo-izquierda, debajo de los botones
            { x: 0.76, y: -0.68 },  // abajo-derecha
        ];
        const ASTRONAUTA_TARGET_Z = -4;

        new GLTFLoader().load(
            ASTRONAUTA_FLOTANTE_URL,
            (gltf) => {
                ASTRONAUTAS_NDC.forEach((ndc, i) => {
                    const clon = gltf.scene.clone(true);
                    clon.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material = child.material.clone();
                            child.material.color.set(ASTRONAUTAS_COLORES[i]);
                        }
                    });
                    clon.scale.setScalar(0.001); // arranca en 0 para la entrada con "pop"
                    clon.visible = false;
                    clon.userData.ndc = ndc;
                    clon.userData.posicionBase = null; // se calcula al activarse, ver más abajo
                    clon.userData.fase = Math.random() * Math.PI * 2;
                    clon.userData.escalaDestino = window.innerWidth <= 700 ? 0.55 : 0.85;
                    scene.add(clon);
                    astronautasFlotantes.push(clon);
                });
            },
            undefined,
            (error) => console.error('Astronautas flotantes: no se pudo cargar el modelo de muestra.', error),
        );

        let astronautasEstabanActivos = false;

        function actualizarAstronautasFlotantes() {
            if (astronautasFlotantes.length === 0) return; // todavía cargando
            const activo = mostrarAstronautasRef.current;
            const ahora = performance.now();

            if (activo && !astronautasEstabanActivos) {
                // Se acaba de activar: calcula AHORA dónde cae cada NDC, con la cámara de este
                // instante (ver nota de arriba -- esto es lo que corrige que se crucen con el texto).
                astronautasFlotantes.forEach((a) => {
                    a.userData.posicionBase = screenToWorld(a.userData.ndc.x, a.userData.ndc.y, ASTRONAUTA_TARGET_Z);
                    a.position.copy(a.userData.posicionBase);
                });
            }
            if (!activo && astronautasEstabanActivos) {
                // Se acaba de apagar: reinicia la escala a 0 para que la próxima vez que se
                // muestren, vuelvan a aparecer con el mismo "pop" de entrada, no ya grandes de golpe.
                astronautasFlotantes.forEach((a) => a.scale.setScalar(0.001));
            }
            astronautasEstabanActivos = activo;

            astronautasFlotantes.forEach((a) => {
                if (!activo) {
                    a.visible = false;
                    return;
                }
                a.visible = true;
                // Flote libre alrededor de su posición base
                const { posicionBase, fase } = a.userData;
                a.position.x = posicionBase.x + Math.cos(ahora * 0.0003 + fase) * 0.35;
                a.position.y = posicionBase.y + Math.sin(ahora * 0.00035 + fase) * 0.3;
                a.rotation.y += 0.0025;
                a.rotation.z = Math.sin(ahora * 0.0004 + fase) * 0.08;
                // Entrada con un pequeño "pop" (como el planeta al revelarse) en vez de aparecer de golpe
                if (a.scale.x < a.userData.escalaDestino) {
                    a.scale.setScalar(Math.min(a.userData.escalaDestino, a.scale.x + 0.025));
                }
            });
        }

        // Añade luz para que el planeta sea visible

        // const light = new THREE.PointLight(0xffffff, 1.5, 150); // Aumenta la intensidad y el alcance

        // Luz principal (simula el sol)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Aumenta la intensidad y el alcance
        directionalLight.position.set(3, 3, 3); // Ubica la luz en una posición lejana y diagonal al planeta
        scene.add(directionalLight);

        // Luz ambiental para rellenar sombras (antes no se agregaba a la escena,
        // por eso el lado sin luz directa se veía demasiado oscuro)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Luz suave en todo el ambiente
        scene.add(ambientLight);

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

        // Nave/platillo: quitada de la vista inicial a pedido (solo quedan estrellas + planeta)
        let ufo; // Se mantiene sin asignar para que animateUFO() no haga nada

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


        // Meteorito: quitado de la vista inicial a pedido (solo quedan estrellas + planeta)
        let meteorite; // Se mantiene sin asignar para que animateMeteorite() no haga nada

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

        // Piezas del cohete infantil (Kenney Space Kit, CC0) y cómo apilarlas verticalmente
        const PIEZAS_COHETE = [
            { name: 'rocket_baseA', offsetY: 0 },
            { name: 'rocket_finsA', offsetY: 0 },
            { name: 'rocket_sidesA', offsetY: 1.15 },
            { name: 'rocket_topA', offsetY: 2.15 },
        ];
        const CENTRO_PIEZAS_COHETE = new THREE.Vector3(-2.0, 0, -1.5);

        function createRocket(position, index) {
            const loader = new GLTFLoader();
            const rocketGroup = new THREE.Group();
            const rocket = new THREE.Group(); // Ensambla las piezas del cohete
            let piezasCargadas = 0;

            PIEZAS_COHETE.forEach(({ name, offsetY }) => {
                loader.load(
                    `/assets/cohete_kenney/${name}.glb`,
                    function (gltf) {
                        const pieza = gltf.scene;
                        pieza.position.add(CENTRO_PIEZAS_COHETE);
                        pieza.position.y += offsetY;
                        rocket.add(pieza);

                        piezasCargadas++;
                        if (piezasCargadas < PIEZAS_COHETE.length) return;

                        // Todas las piezas cargaron: ensamblar el cohete completo
                        // Ajustar la escala del cohete según el dispositivo
                        const isMobile = window.innerWidth <= 768;
                        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

                        if (isMobile) {
                            rocket.scale.set(0.1, 0.1, 0.1);
                        } else if (isTablet) {
                            rocket.scale.set(0.13, 0.13, 0.13);
                        } else {
                            rocket.scale.set(0.16, 0.16, 0.16);
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
                            const xOffset = 0.55; // Separa los 3 cohetes en horizontal para que no se amontonen
                            rocketGroup.position.set(
                                position.x * xOffset,
                                position.y,
                                position.z
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
                        console.error(`Error al cargar la pieza del cohete (${name}):`, error);
                    }
                );
            });
        }

        // Crear cohetes
        createRocket({ x: -1, y: -0.6, z: 5, url: '/ninos' }, 0);
        createRocket({ x: 0, y: -0.6, z: 5, url: '/jovenes' }, 1);
        createRocket({ x: 1, y: -0.6, z: 5, url: '/padres' }, 2);

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
            const intersects = raycaster.intersectObjects(rockets, true);

            // Resetear todos los cohetes
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

                // Remover cualquier popup existente
                const existingPopup = document.querySelector('.rocket-popup');
                if (existingPopup) {
                    document.body.removeChild(existingPopup);
                }

                // Crear y mostrar el popup
                const popup = document.createElement('div');
                popup.className = 'rocket-popup';
                popup.style.cssText = `
                    position: fixed;
                    top: 80%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.95);
                    padding: 30px;
                    border: 3px solid white;
                    border-radius: 15px;
                    color: white;
                    text-align: center;
                    z-index: 1000;
                    min-width: 300px;
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                    font-family: Arial, sans-serif;
                `;

                const message = document.createElement('p');
                message.textContent = `¿Deseas ir a ${rocket.userData.url === '/ninos' ? 'Niños' : rocket.userData.url === '/jovenes' ? 'Jóvenes' : 'Padres'}?`;
                message.style.cssText = `
                    margin-bottom: 25px;
                    font-size: 1.2em;
                    color: #FF746C;
                `;
                popup.appendChild(message);

                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                `;

                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'Aceptar';
                acceptButton.style.cssText = `
                    padding: 10px 25px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background 0.3s;
                `;
                acceptButton.onmouseover = () => {
                    acceptButton.style.background = '#45a049';
                };
                acceptButton.onmouseout = () => {
                    acceptButton.style.background = '#4CAF50';
                };
                acceptButton.onclick = () => {
                    document.body.removeChild(popup);
                    window.location.href = rocket.userData.url;
                };

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancelar';
                cancelButton.style.cssText = `
                    padding: 10px 25px;
                    background: #f44336;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background 0.3s;
                `;
                cancelButton.onmouseover = () => {
                    cancelButton.style.background = '#da190b';
                };
                cancelButton.onmouseout = () => {
                    cancelButton.style.background = '#f44336';
                };
                cancelButton.onclick = () => {
                    document.body.removeChild(popup);
                };

                buttonContainer.appendChild(acceptButton);
                buttonContainer.appendChild(cancelButton);
                popup.appendChild(buttonContainer);

                document.body.appendChild(popup);
            }
        }

        // Agregar event listeners
        window.addEventListener('mousemove', handleHover);
        window.addEventListener('click', handleClick);
        // Agregar soporte para toques en dispositivos móviles
        function handleTouchStart(event) {
            const touch = event.touches[0];
            const clickEvent = new MouseEvent('click', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            handleClick(clickEvent);
        }
        window.addEventListener('touchstart', handleTouchStart);

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
            actualizarDesplazamientoFondoLargo(progress);

            // Mostrar los cohetes progresivamente
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            // maxScrollY * 0.5 = 1000 -- debe ser el mismo valor que UMBRAL_COHETES en Home.jsx
            // (se corrió de 0.2/400 a 0.5/1000 para hacerle espacio a la fase "Anticípate..."
            // nueva, que va entre la frase del planeta y los cohetes).
            const UMBRAL_COHETES_SCROLL = maxScrollY * 0.5;
            rockets.forEach((rocket) => {
                rocket.visible = scrollY > UMBRAL_COHETES_SCROLL;
            });
        
            // Marcar que el scrolling terminó
            isScrolling = false;
        }
        
        // El planeta ya no se desvanece solo con el scroll -- ahora Home.jsx manda explícitamente
        // moveToCorner()/moveToCenter() en el momento justo de cada cambio de fase (ver fase
        // "Anticípate..."), así que esta función ya no hace falta.

        function handleScrollEvent() {
            scrollY = window.scrollY;

            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(updateOnScroll);
            }
        }
        window.addEventListener('scroll', handleScrollEvent);

        let animationFrameId;
        // Avisa dónde quedó el planeta en la pantalla (en % de ancho/alto) y qué tan grande se ve
        // ahora comparado con cuando se reveló -- así el texto HTML que va debajo (en Home.jsx)
        // se puede mover/achicar junto con él y no se quedan desincronizados cuando la cámara se
        // aleja o se vuelve a acercar con el scroll. Se llama en cada frame (no solo al scrollear)
        // para que también se vea sincronizado durante la animación de entrada del planeta.
        function notificarTransformPlaneta() {
            if (!onPlanetTransformRef.current || !planet.visible) return;
            camera.updateMatrixWorld();
            const centro = planet.position.clone();
            const borde = planet.position.clone();
            borde.y -= planet.scale.y; // punto del borde inferior de la esfera, en espacio mundo
            const ndcCentro = centro.project(camera);
            const ndcBorde = borde.project(camera);
            const xPct = (ndcCentro.x * 0.5 + 0.5) * 100;
            const yPct = (1 - (ndcCentro.y * 0.5 + 0.5)) * 100;
            // Qué tan abajo del centro queda el borde de la esfera, en % de pantalla -- así el
            // texto se puede dejar justo debajo del planeta (no de su centro) sin importar qué
            // tan grande se vea en ese momento.
            const radioPct = Math.max((1 - (ndcBorde.y * 0.5 + 0.5)) * 100 - yPct, 0);
            const distanciaActual = camera.position.distanceTo(planet.position);
            const distanciaBase = Math.abs(cameraStartZ); // distancia cuando se revela (cámara en z=3, planeta en z=0)
            const escala = distanciaActual > 0 ? distanciaBase / distanciaActual : 1;
            onPlanetTransformRef.current({ xPct, yPct, radioPct, escala, opacidad: planet.material.opacity });
        }

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            planet.rotation.y += 0.004;
            updatePlanetReveal();
            updateCornerMove();
            animateParticles();
            actualizarEstrellasAlternas();
            actualizarAstronautasFlotantes();
            notificarTransformPlaneta();
            renderer.render(scene, camera);
        }

        function handleResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            actualizarFondoLargo();

            // El planeta de la esquina depende de la cámara recién actualizada, así que va después
            realinearEsquinaSiAplica();

            // Recalcular posiciones de los cohetes
            const isMobile = width <= 768;
            const isTablet = width > 768 && width <= 1024;
            
            rockets.forEach((rocket, index) => {
                if (isMobile) {
                    const xOffset = 0.55; // Igual que en createRocket: separa en horizontal
                    rocket.position.set(
                        (index - 1) * xOffset,
                        -0.6,
                        5
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
            });
        }
        window.addEventListener('resize', handleResize);

        // Llamamos a onLoad para indicar que Three.js ha cargado y la animación ha comenzado
        if (onLoad) {
            onLoad();
        }

        // Iniciar la animación
        animate();

        // Limpiar todo al desmontar el componente: sin esto, un remount (StrictMode,
        // o cualquier cambio futuro) dejaba escuchadores y un segundo bucle de animación
        // huérfanos corriendo para siempre, duplicando cámaras/cohetes "fantasma".
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleHover);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('scroll', handleScrollEvent);
            window.removeEventListener('resize', handleResize);
            camera.remove(fondoLargo);
            fondoLargoGeometry.dispose();
            fondoLargoMaterial.dispose();
            fondoLargoTexture.dispose();
            estrellasAlternas.forEach((estrella) => {
                estrella.geometry.dispose();
                estrella.material.dispose();
            });
            document.body.removeChild(renderer.domElement);
        };

    }, [navigate, onLoad]); // Dependencia de onLoad para asegurarnos de que funcione correctamente

    return null;
});

export default ThreeScene;
