import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { getJourney, altoViaje, VIAJE_Y, rangoInicial, unidad, TOTAL_U } from './journey';
import { reproducirClic, reproducirMotor, detenerMotor } from './sonidos'; // efectos de sonido // línea de tiempo compartida con SpaceJourney.jsx



const ThreeScene = forwardRef(function ThreeScene({ onLoad, onPlanetTransform, estrellasAlternas, mostrarAstronautas, onRocketClick }, ref) {
    const navigate = useNavigate();
    const revealPlanetRef = useRef(() => {});
    const moveToCornerRef = useRef(() => {});
    const moveToCenterRef = useRef(() => {});
    const resetIntroRef = useRef(() => {});
    // Cohetes: preparar/cancelar/ejecutar el despegue (los llama Home.jsx a través de RocketCards)
    const prepareLaunchRef = useRef(() => {});
    const cancelLaunchRef = useRef(() => {});
    const launchRef = useRef(() => 0);
    // Secuencia de scroll del cohete elegido (giro + descenso + centrado). Los llama Home.jsx.
    const armSequenceRef = useRef(() => {});
    const disarmSequenceRef = useRef(() => {});
    // Clic sobre un cohete 3D: NO abre un popup propio; avisa a Home para que use el MISMO popup
    // de las tarjetas (así nunca hay dos popups distintos).
    const onRocketClickRef = useRef(onRocketClick);
    useEffect(() => { onRocketClickRef.current = onRocketClick; }, [onRocketClick]);
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
        prepareLaunch: (index) => prepareLaunchRef.current(index),
        cancelLaunch: () => cancelLaunchRef.current(),
        launch: (index) => launchRef.current(index), // devuelve los ms que dura el despegue
        armSequence: (index, startY) => armSequenceRef.current(index, startY),
        disarmSequence: () => disarmSequenceRef.current(),
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
        // Contraste del fondo (Figma): el PNG solo trae dos tonos y sus olas se ven muy sutiles. Aquí se
        // reasignan esos dos tonos a otros con más separación (el oscuro baja al tono de las capas oscuras
        // del Figma, #1b2362, y el claro sube un poco) para que las olas se vean más. SOLO afecta a este
        // plano de fondo, no a los modelos. Valores RGB 0-255; cámbialos aquí para afinar.
        const FONDO_PNG_OSCURO = [32, 40, 103];   // #202867 (tono oscuro real del PNG)
        const FONDO_PNG_CLARO = [40, 49, 116];    // #283174 (tono claro real del PNG)
        const FONDO_NUEVO_OSCURO = [27, 35, 98];  // #1b2362 (Figma)
        const FONDO_NUEVO_CLARO = [46, 55, 126];  // un poco más claro que el Figma (#293074) para que se note
        {
            const f3 = (a) => `vec3(${a.map((v) => (v / 255).toFixed(5)).join(', ')})`;
            const pendiente = FONDO_PNG_OSCURO.map((lo, i) =>
                (FONDO_NUEVO_CLARO[i] - FONDO_NUEVO_OSCURO[i]) / (FONDO_PNG_CLARO[i] - lo));
            const desplaz = FONDO_PNG_OSCURO.map((lo, i) => (FONDO_NUEVO_OSCURO[i] - lo * pendiente[i]) / 255);
            fondoLargoMaterial.onBeforeCompile = (shader) => {
                shader.fragmentShader = shader.fragmentShader
                    .replace('void main() {', `const vec3 FONDO_S = ${f3(pendiente.map((v) => v * 255))};\nconst vec3 FONDO_T = ${f3(desplaz.map((v) => v * 255))};\nvoid main() {`)
                    .replace('#include <map_fragment>', '#include <map_fragment>\n    diffuseColor.rgb = clamp(diffuseColor.rgb * FONDO_S + FONDO_T, 0.0, 1.0);');
            };
        }
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
        // El desplazamiento del fondo oficial = scroll de la página (hasta 2000 px, como siempre) + un tramo extra,
        // FONDO_PROGRESO_VIAJE, que avanza con el MISMO progreso suavizado del cohete durante el recorrido.
        // Se reserva ese tramo (el scroll normal usa el resto) para que el fondo siga avanzando en el mismo sentido
        // después de los 2000 px. Solo se mueve este plano de fondo: nada más de la interfaz.
        const FONDO_PROGRESO_VIAJE = 0.08;   // fracción de la altura de la imagen que recorre durante el viaje (sutil)
        let viajeFondo = 0;                  // 0..1: progreso del recorrido del cohete (lo actualiza actualizarCohetes)
        function actualizarDesplazamientoFondoLargo(progress) {
            const p = progress * (1 - FONDO_PROGRESO_VIAJE) + FONDO_PROGRESO_VIAJE * viajeFondo;
            fondoLargoTexture.offset.y = (1 - fondoLargoTexture.repeat.y) * (1 - p);
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
        // Posiciones FINALES en coordenadas de PANTALLA (NDC -1..1), tomadas del Figma (Frame 74):
        //   0 = arriba-izquierda, 1 = arriba-derecha, 2 = abajo-izquierda, 3 = abajo-derecha.
        // Quedan fuera del bloque central (título, campo, botones y guía). Se convierten al mundo 3D en
        // CADA frame con screenToWorld (la cámara se mueve con el scroll), así la composición no se desplaza.
        const ASTRONAUTAS_NDC_PC = [
            { x: -0.46, y: 0.36 }, { x: 0.29, y: 0.64 }, { x: -0.65, y: -0.40 }, { x: 0.73, y: -0.32 },
        ];
        const ASTRONAUTAS_NDC_MOVIL = [
            { x: -0.55, y: 0.72 }, { x: 0.6, y: 0.62 }, { x: -0.62, y: -0.78 }, { x: 0.62, y: -0.8 },
        ];
        // Desde dónde entran: fuera de la pantalla, hacia el borde/esquina que les corresponde (flechas del Figma)
        const ASTRONAUTAS_ENTRADA_NDC = [
            { x: -1.6, y: 0.9 }, { x: 1.2, y: 1.7 }, { x: -1.6, y: -1.2 }, { x: 1.6, y: -1.2 },
        ];
        const ASTRONAUTAS_RETRASO_MS = [0, 350, 700, 1050]; // entrada escalonada
        const ASTRONAUTAS_ENTRADA_MS = 1800;
        const ASTRONAUTAS_SALIDA_MS = 700;
        // Flote en gravedad cero: cada uno con su propio ritmo (fx, fy), alcance (ax, ay) e inclinación
        // (rx, ry, rz en radianes). Son oscilaciones leves, nunca giros completos.
        const ASTRONAUTAS_FLOTE = [
            { fx: 0.00031, fy: 0.00042, ax: 0.30, ay: 0.26, rx: 0.06, ry: 0.35, rz: 0.10 },
            { fx: 0.00026, fy: 0.00036, ax: 0.36, ay: 0.30, rx: 0.07, ry: 0.30, rz: 0.08 },
            { fx: 0.00034, fy: 0.00029, ax: 0.26, ay: 0.34, rx: 0.05, ry: 0.40, rz: 0.12 },
            { fx: 0.00023, fy: 0.00039, ax: 0.32, ay: 0.28, rx: 0.08, ry: 0.28, rz: 0.09 },
        ];
        const ASTRONAUTA_TARGET_Z = -4;
        const astroReducirMov = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const astroSuave = (x) => 1 - Math.pow(1 - x, 3); // easeOutCubic

        new GLTFLoader().load(
            ASTRONAUTA_FLOTANTE_URL,
            (gltf) => {
                ASTRONAUTAS_NDC_PC.forEach((_, i) => {
                    const clon = gltf.scene.clone(true);
                    clon.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material = child.material.clone();
                            child.material.color.set(ASTRONAUTAS_COLORES[i]);
                        }
                    });
                    clon.scale.setScalar(window.innerWidth <= 700 ? 0.55 : 0.85); // misma escala de siempre
                    clon.visible = false;
                    clon.userData.fase = Math.random() * Math.PI * 2;
                    clon.userData.e = 0;       // presencia 0 (fuera) .. 1 (en su sitio)
                    clon.userData.inicio = 0;  // cuándo empieza a entrar (ms)
                    scene.add(clon);
                    astronautasFlotantes.push(clon);
                });
            },
            undefined,
            (error) => console.error('Astronautas flotantes: no se pudo cargar el modelo de muestra.', error),
        );

        let astronautasEstabanActivos = false;
        let astroUltimoMs = performance.now();

        // Un solo punto de actualización (lo llama el bucle de animación que ya existe; no hay otro bucle)
        function actualizarAstronautasFlotantes() {
            if (astronautasFlotantes.length === 0) return; // todavía cargando
            const activo = mostrarAstronautasRef.current;
            const ahora = performance.now();
            const dtMs = Math.min(ahora - astroUltimoMs, 100);
            astroUltimoMs = ahora;
            const destinos = window.innerWidth <= 700 ? ASTRONAUTAS_NDC_MOVIL : ASTRONAUTAS_NDC_PC;

            if (activo && !astronautasEstabanActivos) {
                // Recién activados: cada uno programa su entrada con su retraso
                astronautasFlotantes.forEach((a, i) => { a.userData.inicio = ahora + (astroReducirMov ? 0 : ASTRONAUTAS_RETRASO_MS[i]); });
            }
            astronautasEstabanActivos = activo;

            astronautasFlotantes.forEach((a, i) => {
                const ud = a.userData;
                if (activo) {
                    if (ahora >= ud.inicio) ud.e = Math.min(1, ud.e + dtMs / (astroReducirMov ? 1 : ASTRONAUTAS_ENTRADA_MS));
                } else {
                    ud.e = Math.max(0, ud.e - dtMs / ASTRONAUTAS_SALIDA_MS); // sale por donde entró
                }
                if (ud.e <= 0.001) { a.visible = false; return; }
                a.visible = true;

                const k = astroSuave(ud.e);
                const base = screenToWorld(destinos[i].x, destinos[i].y, ASTRONAUTA_TARGET_Z);
                const fuera = screenToWorld(ASTRONAUTAS_ENTRADA_NDC[i].x, ASTRONAUTAS_ENTRADA_NDC[i].y, ASTRONAUTA_TARGET_Z);
                a.position.copy(base).lerp(fuera, 1 - k);

                // Flote: su amplitud crece al terminar de entrar (sin tirón)
                const f = ASTRONAUTAS_FLOTE[i];
                const amp = k * (astroReducirMov ? 0.35 : 1);
                a.position.x += Math.cos(ahora * f.fx + ud.fase) * f.ax * amp;
                a.position.y += Math.sin(ahora * f.fy + ud.fase) * f.ay * amp;
                a.rotation.set(
                    Math.sin(ahora * f.fy * 0.8 + ud.fase) * f.rx * amp,
                    Math.sin(ahora * f.fx * 1.1 + ud.fase * 1.3) * f.ry * amp,
                    Math.sin(ahora * f.fx * 1.3 + ud.fase) * f.rz * amp + (1 - k) * (i % 2 ? 0.5 : -0.5), // leve giro de llegada
                );
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
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Luz suave en todo el ambiente
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
        /*const PIEZAS_COHETE = [
            { name: 'rocket_baseA', offsetY: 0 },
            { name: 'rocket_finsA', offsetY: 0 },
            { name: 'rocket_sidesA', offsetY: 1.15 },
            { name: 'rocket_topA', offsetY: 2.15 },
        ];
        const CENTRO_PIEZAS_COHETE = new THREE.Vector3(-2.0, 0, -1.5);*/

        // ====================================================================
        // CAPA DE COHETES
        // Los cohetes se dibujan en su PROPIO canvas transparente, por encima de las tarjetas HTML
        // (RocketCards, z-index 5). Así quedan "parados" sobre cada tarjeta como en el diseño
        // (nariz fuera de la tarjeta, llama dentro) y el fondo de la tarjeta no los tapa.
        // Cámara ortográfica en píxeles CSS (1 unidad = 1 px). Cada cohete se ancla a SU tarjeta
        // leyendo su posición real en pantalla en cada frame, así el diseño se mantiene igual en
        // celular, tablet y escritorio sin números fijos, y se mueve junto con la tarjeta.
        // ====================================================================
        const RUTA_MODELO_COHETE = '/assets/cohete/Cohete-AlasRojas.glb'; // public/assets/cohete/Cohete-AlasRojas.glb
        const FLAME_NODE_NAME = 'Rocket_Flame'; // nodo de la llama dentro del GLB (pivote en la boquilla)
        const COHETE_ALTO_REL = 0.72;   // alto del cohete (con llama en reposo) = 72% del ancho de la tarjeta
        const COHETE_NARIZ_REL = 0.40;  // la nariz sobresale 40% del ancho de la tarjeta por encima de su borde
        const LANZAMIENTO_MS = 1100;    // duración del despegue tras pulsar "Aceptar"

        // --- SECUENCIA DE SCROLL del cohete elegido (después de cerrar el modal) -----------------
        // Los tramos de la línea de tiempo (salida, viaje, continuación) están en journey.js.
        // Aquí solo se define cómo se mueve el cohete:
        //   Tramo 1 (p de 0 a 1, ver getJourney): giro de 180 grados (nariz hacia abajo, como en Figma),
        //     descenso desde su tarjeta y desplazamiento hasta el centro de la pantalla.
        //   Salida: sube a la zona superior central y se achica (Frame 5).
        //   Viaje: se queda arriba al centro con un leve vaivén, hasta que SpaceJourney lleva a la página de la etapa elegida.
        // Todo depende de ud.seqD (distancia de scroll suavizada), así que va y vuelve con el scroll.
        const SEQ_GIRO_FIN = 0.3;
        const SEQ_DESCENSO_INICIO = 0.2;
        const SEQ_CENTRADO_INICIO = 0.4;
        const SEQ_ALTO_FINAL_H = 0.36;  // alto del cohete al llegar al centro = 36% del alto de la pantalla...
        const SEQ_ALTO_FINAL_W = 0.55;  // ...sin pasar del 55% del ancho (celulares)
        const SEQ_VIAJE_MARGEN_SUP = 0.13;  // zona libre del viaje: empieza al 13% del alto (debajo de los íconos de arriba)...
        const SEQ_VIAJE_MARGEN_INF = 0.02;  // ...y termina 2% del alto antes de Frutia
        const SEQ_VIAJE_VELOCIDAD = 0.55;   // rad/s: ~11 s por ida y vuelta (más alto = más rápido)
        const reducirMovimiento = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        let seq = null; // { index, startY } mientras hay un cohete elegido y el modal está cerrado
        let seqDSuave = 0; // distancia de scroll suavizada, común a todos los cohetes (para ocultar los no elegidos)

        const rocketRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rocketRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rocketRenderer.setSize(window.innerWidth, window.innerHeight);
        Object.assign(rocketRenderer.domElement.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1001',        // sobre las tarjetas (5) y sobre el fondo oscuro del popup (1000)
            pointerEvents: 'none', // nunca captura clics: los reciben las tarjetas y los botones
        });
        document.body.appendChild(rocketRenderer.domElement);

        const rocketScene = new THREE.Scene();
        const rocketCamera = new THREE.OrthographicCamera(
            -window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 3000,
        );
        rocketCamera.position.z = 1000;
        // Mismas luces que la escena principal, para que el cohete se vea igual que antes
        const rocketDirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        rocketDirLight.position.set(3, 3, 3);
        rocketScene.add(rocketDirLight);
        rocketScene.add(new THREE.AmbientLight(0x404040, 1.5));

        let capaCohetesSucia = false; // true = hay que dibujar una última vez (para borrar) al ocultarse

        // El modelo se descarga/decodifica UNA sola vez; cada cohete es un clon (comparten geometría
        // y textura en la GPU). Antes se cargaba 3 veces.
        const modelosCohete = new Map();
        function cargarModeloCohete(url) {
            if (!modelosCohete.has(url)) {
                modelosCohete.set(url, new Promise((resolve, reject) => {
                    new GLTFLoader().load(url, resolve, undefined, reject);
                }));
            }
            return modelosCohete.get(url);
        }
        let escenaActiva = true; // se pone en false al desmontar, para ignorar cargas que llegan tarde

        function createRocket(position, index) {
            const rocketGroup = new THREE.Group();
            // Dejamos el grupo en escala 0 para que la animación de aparición funcione
            rocketGroup.scale.set(0, 0, 0);

            const modelPath = position.model || RUTA_MODELO_COHETE;

            cargarModeloCohete(modelPath).then((gltf) => {
                if (!escenaActiva) return;
                const rocket = gltf.scene.clone(true);

                // 1. Medidas reales del modelo (así no depende de en qué unidades se exportó)
                rocket.updateMatrixWorld(true);
                const box = new THREE.Box3().setFromObject(rocket);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const modelH = size.y > 0 ? size.y : 1;

                rocket.rotation.y = Math.PI;

                // 2. Nodo de la llama (nombre real del GLB; si no existe, se busca por parecido)
                let flameNode = rocket.getObjectByName(FLAME_NODE_NAME);
                if (!flameNode) {
                    rocket.traverse((o) => { if (!flameNode && /flame|fire|llama|exhaust/i.test(o.name)) flameNode = o; });
                }
                if (!flameNode) console.warn('No se encontró el nodo de la llama (' + FLAME_NODE_NAME + ') en', modelPath);
                const dentroDeLlama = (obj) => {
                    for (let p = obj; p; p = p.parent) if (p === flameNode) return true;
                    return false;
                };

                // 3. Materiales (iluminación plana)
                const flameMats = [];
                rocket.traverse((child) => {
                    if (!child.isMesh) return;
                    const originalColor = child.material.color ? child.material.color.clone() : new THREE.Color(0xffffff);

                    if (flameNode && dentroDeLlama(child)) {
                        // Llama: sin iluminación para que siempre se vea encendida
                        child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: child.material.map || null, vertexColors: !!child.material.vertexColors });
                        flameMats.push(child.material);
                        return;
                    }

                    // vertexColors: el modelo trae el color pintado en los vértices (sin texturas)
                    child.material = new THREE.MeshLambertMaterial({
                        color: originalColor,
                        map: child.material.map || null,
                        vertexColors: !!child.material.vertexColors,
                    });
                    child.userData.originalColor = originalColor;
                });

                // 4. Agregar a la capa de cohetes
                rocketGroup.add(rocket);
                rocketScene.add(rocketGroup);
                rockets.push(rocketGroup);

                // 5. Datos para animaciones, anclaje a la tarjeta y clics
                const ud = rocketGroup.userData;
                ud.url = position.url;
                ud.index = index;
                ud.inner = rocket;
                ud.modelH = modelH;
                ud.modelCenter = center;
                ud.modelMinY = box.min.y;
                ud.cardEl = null;
                ud.floteOffset = index * 2;
                ud.isAppearing = false;
                ud.appearTime = 0;
                ud.hit = [0, 0, 0, 0]; // x0, y0, x1, y1 en px, para clics/hover
                ud.anchorBottomPy = 0;
                ud.anchorAlto = 0;
                // Llama
                ud.flame = flameNode || null;
                ud.flameMats = flameMats;
                ud.speed = 0;            // ÚNICA entrada: 0 = reposo ... 1 = despegue (la intensidad de la llama sale de aquí)
                ud.flameIntensity = 0;   // valor suavizado
                ud.flameClock = 0;
                ud.flamePhase = index * 1.7; // para que las 3 llamas no pulsen sincronizadas
                // Estado del despegue: 'reposo' -> 'prelanzamiento' (clic en Elegir) -> 'despegue' (Aceptar)
                ud.estado = 'reposo';
                ud.shake = 0;            // vibración suavizada 0..1
                ud.despegueInicio = 0;
                ud.despegueDistancia = 0;
                ud.seqD = 0;             // distancia de scroll suavizada desde que se cerró el modal (px)

                // Si la página se recargó ya pasado el umbral, no llegaría ningún scroll nuevo
                // (la aparición se dispara en actualizarCohetes, cuando su tarjeta ya se ve)

                console.log("✅ Cohete cargado:", modelPath);
            }).catch((error) => {
                console.error('❌ Error al cargar el cohete:', error);
            });
        }

        // Crear cohetes (la posición ya no se define aquí: sale de cada tarjeta)
        createRocket({ url: '/ninos', model: RUTA_MODELO_COHETE }, 0);
        createRocket({ url: '/jovenes', model: RUTA_MODELO_COHETE }, 1);
        createRocket({ url: '/padres', model: RUTA_MODELO_COHETE }, 2);

        // --- Animación de la llama ---------------------------------------------------------
        // flameIntensity = f(speed). Pulsa creciendo y encogiendo de forma bien visible; al subir
        // la intensidad la llama es más larga, más rápida y más brillante. Solo escala + pequeños
        // giros + brillo del nodo de la llama (su pivote está en la boquilla, así que no se despega).
        // Nada de setState ni objetos nuevos por frame.
        function actualizarLlama(ud, dt) {
            const flame = ud.flame;
            if (!flame) return;
            const lerp = THREE.MathUtils.lerp;

            ud.flameIntensity = THREE.MathUtils.damp(ud.flameIntensity, THREE.MathUtils.clamp(ud.speed, 0, 1), 3, dt);
            const i = ud.flameIntensity;

            // Reloj propio: al acelerar, la llama pulsa más rápido sin saltos de fase
            ud.flameClock += dt * (1 + i * 1.3);
            const t = ud.flameClock + ud.flamePhase;

            // Pulso 0..1 (crece/encoge): tres senos con frecuencias que no son múltiplos entre sí
            const pulso = 0.5 + 0.5 * (Math.sin(t * 5.5) * 0.55 + Math.sin(t * 8.3 + 1.0) * 0.30 + Math.sin(t * 3.1 + 2.0) * 0.15);
            // Parpadeo rápido (-1..1)
            const flick = Math.sin(t * 23) * 0.5 + Math.sin(t * 31.7 + 0.6) * 0.5;

            const largoMin = lerp(0.55, 1.5, i);
            const largoMax = lerp(1.35, 2.3, i);
            const largo = lerp(largoMin, largoMax, pulso) * (1 + flick * 0.04 * (0.5 + i));
            // Más larga = más delgada (como una llama real). Tope ~1.08: más ancha asomaría por la boquilla
            const ancho = lerp(1.05, 0.9, pulso);
            flame.scale.set(
                ancho * (1 + 0.03 * Math.sin(t * 13)),
                largo,
                ancho * (1 + 0.03 * Math.cos(t * 11.7)),
            );

            const vaiven = lerp(0.02, 0.06, i);
            flame.rotation.x = Math.cos(t * 7.3) * vaiven;
            flame.rotation.z = Math.sin(t * 6.1 + 0.7) * vaiven;

            // Brillo (material sin luces: color > 1 aclara hacia amarillo/blanco)
            const brillo = 0.9 + 0.35 * pulso + 0.25 * i;
            for (let k = 0; k < ud.flameMats.length; k++) ud.flameMats[k].color.setScalar(brillo);
        }

        // --- Anclaje a la tarjeta + flote + vibración + despegue + llama --------------------
        function actualizarCohetes(time, dt) {
            const W = window.innerWidth;
            const H = window.innerHeight;
            const ahora = performance.now();

            // Los cohetes NO elegidos se encogen hasta desaparecer junto con las tarjetas (y vuelven al subir)
            const objetivoGlobal = seq ? Math.max(window.scrollY - seq.startY, 0) : 0;
            seqDSuave = THREE.MathUtils.damp(seqDSuave, objetivoGlobal, 10, dt);
            const salidaGlobal = getJourney(seqDSuave, 0, H).salida;
            // Fondo sincronizado con el recorrido: mismo progreso suavizado que el cohete (estable si el scroll se detiene,
            // retrocede si se sube). Sin secuencia activa vuelve a 0 y el fondo solo sigue al scroll normal.
            viajeFondo = seq ? Math.min(seqDSuave / (rangoInicial(H) + TOTAL_U * unidad(H)), 1) : 0;
            actualizarDesplazamientoFondoLargo(Math.min(window.scrollY / maxScrollY, 1));

            for (let n = 0; n < rockets.length; n++) {
                const g = rockets[n];
                const ud = g.userData;

                // 0. Disparo de la aparición: hay scroll suficiente Y la tarjeta de este cohete ya se ve
                // (RocketCards muestra las tarjetas una a una tras escribir el texto). Se mira la opacidad
                // real del envoltorio de la tarjeta, así no depende de ningún aviso entre componentes.
                if (!ud.isAppearing && g.scale.x === 0 && window.scrollY > maxScrollY * 0.5) {
                    if (!ud.cardEl || !ud.cardEl.isConnected) {
                        ud.cardEl = document.querySelector('[data-rocket-card="' + ud.index + '"]');
                    }
                    const envoltorio = ud.cardEl && ud.cardEl.parentElement;
                    if (envoltorio && parseFloat(getComputedStyle(envoltorio).opacity) > 0.6) {
                        ud.isAppearing = true;
                        ud.appearTime = ahora;
                    }
                }

                // 1. Animación de aparición
                if (ud.isAppearing) {
                    const elapsed = ahora - ud.appearTime;
                    const duration = 1500;
                    const t = Math.min(Math.max(elapsed / duration, 0), 1); // elapsed < 0 = todavía en su retraso
                    const c1 = 1.70158;
                    const c3 = c1 + 1;
                    const ease = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
                    g.scale.setScalar(ease * ((seq && seq.index !== ud.index) ? 1 - salidaGlobal : 1));
                }
                if (g.scale.x <= 0) continue;

                // 2. Dónde está AHORA su tarjeta en pantalla (sigue también la animación de entrada)
                if (!ud.cardEl || !ud.cardEl.isConnected) {
                    ud.cardEl = document.querySelector('[data-rocket-card="' + ud.index + '"]');
                }
                if (!ud.cardEl) continue;
                const r = ud.cardEl.getBoundingClientRect();
                if (r.width === 0) continue;

                const cw = r.width;
                const cxTarjeta = r.left + cw / 2;
                const altoTarjeta = cw * COHETE_ALTO_REL;
                const baseTarjeta = r.top + cw * (COHETE_ALTO_REL - COHETE_NARIZ_REL); // punta de la llama en reposo
                ud.anchorBottomPy = baseTarjeta;
                ud.anchorAlto = altoTarjeta;

                // 2b. Secuencia de scroll: solo el cohete elegido tiene objetivo > 0; los demás se quedan en 0.
                // La distancia se suaviza (damp) para evitar saltos; al parar el scroll converge y queda quieto.
                const objetivoD = (seq && seq.index === ud.index) ? Math.max(window.scrollY - seq.startY, 0) : 0;
                ud.seqD = THREE.MathUtils.damp(ud.seqD, objetivoD, 10, dt);
                if (Math.abs(ud.seqD - objetivoD) < 0.5) ud.seqD = objetivoD;
                // Sonido del motor: arranca en el instante en que el cohete elegido empieza a moverse y se
                // corta si el scroll vuelve al punto de partida (así puede volver a sonar desde el principio)
                const enMarcha = !!seq && seq.index === ud.index && ud.seqD > 6;
                if (enMarcha && !ud.motorSonando) { ud.motorSonando = true; reproducirMotor(); }
                else if (!enMarcha && ud.motorSonando && ud.seqD < 1) { ud.motorSonando = false; detenerMotor(); }
                const j = getJourney(ud.seqD, 0, H);
                const p = j.p;
                const clamp01 = THREE.MathUtils.clamp;
                const giroT = easeInOutCubic(clamp01(p / SEQ_GIRO_FIN, 0, 1));
                const yT = easeInOutCubic(clamp01((p - SEQ_DESCENSO_INICIO) / (1 - SEQ_DESCENSO_INICIO), 0, 1));
                const xT = easeInOutCubic(clamp01((p - SEQ_CENTRADO_INICIO) / (1 - SEQ_CENTRADO_INICIO), 0, 1));
                const altoFinal = Math.max(altoTarjeta, Math.min(H * SEQ_ALTO_FINAL_H, W * SEQ_ALTO_FINAL_W));
                const centroTarjeta = baseTarjeta - altoTarjeta / 2;

                // Tramo 1: de su tarjeta al centro de la pantalla
                let cx = cxTarjeta + (W / 2 - cxTarjeta) * xT;
                let centroY = centroTarjeta + (H / 2 - centroTarjeta) * yT;
                let alto = altoTarjeta + (altoFinal - altoTarjeta) * yT;
                // Salida: del centro (grande) a arriba al centro (pequeño)
                const sal = j.salida;
                centroY += (H * VIAJE_Y - centroY) * sal;
                alto += (altoViaje(W, H) - alto) * sal;
                // Viaje: el cohete recorre de arriba a abajo (y de vuelta) TODO el espacio libre, solo en el eje Y.
                // Zona libre = desde debajo de los íconos de la parte superior hasta justo encima de Frutia (se mide
                // en cada frame, así se adapta a cualquier tamaño de pantalla). Movimiento senoidal = frena suave
                // en cada extremo, y arranca desde donde ya está el cohete (se mezcla con 'sal', sin tirones).
                if (!reducirMovimiento && sal > 0) {
                    if (!ud.frutiaEl || !ud.frutiaEl.isConnected) ud.frutiaEl = document.querySelector('.viaje-frutia');
                    const frutiaTop = ud.frutiaEl ? ud.frutiaEl.getBoundingClientRect().top : H * 0.82;
                    const limiteSup = H * SEQ_VIAJE_MARGEN_SUP;                 // debajo de los íconos de arriba
                    const limiteInf = Math.min(frutiaTop, H) - H * SEQ_VIAJE_MARGEN_INF; // encima de Frutia
                    const medio = (limiteSup + limiteInf) / 2;
                    const mitadRecorrido = Math.max((limiteInf - limiteSup - alto) / 2, 0); // el cohete entero cabe en la zona
                    const yOscila = medio + Math.sin(time * SEQ_VIAJE_VELOCIDAD + ud.floteOffset) * mitadRecorrido;
                    centroY += (yOscila - H * VIAJE_Y) * sal;
                }
                const anguloCohete = giroT * Math.PI; // viaje: nariz hacia abajo
                const bottomPy = centroY + alto / 2; // base del cohete (el resto del código trabaja con la base)

                // 3. Tamaño del cohete: el alto del modelo -> "alto" píxeles; origen centrado y en su base
                const s = alto / ud.modelH;
                ud.inner.scale.setScalar(s);
                ud.inner.position.set(ud.modelCenter.x * s, -ud.modelMinY * s - alto / 2, ud.modelCenter.z * s); // el grupo gira sobre el CENTRO del cohete

                // 4. Vibración (prelanzamiento/despegue) y flote (se calma mientras vibra)
                const shakeObjetivo = ud.estado === 'prelanzamiento' ? 1 : (ud.estado === 'despegue' ? 0.6 : 0);
                ud.shake = THREE.MathUtils.damp(ud.shake, shakeObjetivo, 6, dt);
                const amp = cw * 0.022 * ud.shake;
                const dx = (Math.sin(time * 57) * 0.6 + Math.sin(time * 39.3 + 1.7) * 0.4) * amp;
                const dyShake = (Math.sin(time * 49 + 0.8) * 0.6 + Math.sin(time * 33.1) * 0.4) * amp * 0.7;
                const flote = Math.sin(time * 2 + ud.floteOffset) * cw * 0.045 * (1 - ud.shake) * (1 - clamp01(p * 5, 0, 1)); // se calma al empezar la secuencia
                g.rotation.z = (Math.sin(time * 43) * 0.5 + Math.sin(time * 29 + 1) * 0.5) * 0.035 * ud.shake
                    + anguloCohete; // viaje: gira 180 grados hasta quedar con la nariz hacia abajo (0 fuera de la secuencia)

                // 5. Despegue: aceleración constante hacia arriba hasta salir de la pantalla
                let lift = 0;
                if (ud.estado === 'despegue') {
                    const t = Math.min((ahora - ud.despegueInicio) / LANZAMIENTO_MS, 1);
                    lift = ud.despegueDistancia * t * t;
                }

                const py = bottomPy + flote + dyShake - lift;
                g.position.set(cx + dx - W / 2, H / 2 - (py - alto / 2), 0);

                // 6. Zona de clic/hover (px de pantalla), algo más generosa que el cohete
                const mitad = Math.max(alto * 0.35, 22);
                ud.hit[0] = cx - mitad;
                ud.hit[1] = py - alto - 8;
                ud.hit[2] = cx + mitad;
                ud.hit[3] = py + alto * 0.25;

                // 7. Llama (en la secuencia se va alargando a medida que el cohete avanza)
                if (ud.estado === 'reposo') ud.speed = Math.min(p * 4, 1) * 0.85;
                actualizarLlama(ud, dt);
            }
        }

        // --- Despegue: lo controla RocketCards (botón Elegir / popup) vía Home.jsx -----------
        function buscarCohete(index) {
            for (let n = 0; n < rockets.length; n++) if (rockets[n].userData.index === index) return rockets[n];
            return null;
        }
        // Clic en "Elegir": el cohete se prepara (vibra y la llama se alarga al máximo)
        prepareLaunchRef.current = (index) => {
            rockets.forEach((g) => {
                const ud = g.userData;
                if (ud.index === index) { ud.estado = 'prelanzamiento'; ud.speed = 1; }
                else { ud.estado = 'reposo'; ud.speed = 0; }
            });
        };
        // "Cancelar": todo vuelve poco a poco a reposo
        cancelLaunchRef.current = () => {
            rockets.forEach((g) => { g.userData.estado = 'reposo'; g.userData.speed = 0; });
        };
        // "Aceptar": despega. Devuelve cuánto dura, para que RocketCards navegue justo al terminar
        launchRef.current = (index) => {
            const g = buscarCohete(index);
            if (!g) return 0;
            const ud = g.userData;
            ud.estado = 'despegue';
            ud.speed = 1;
            ud.despegueInicio = performance.now();
            reproducirMotor(); // el motor suena justo cuando empieza el despegue
            ud.despegueDistancia = ud.anchorBottomPy + ud.anchorAlto * 0.35; // hasta que la llama larga también salga
            return LANZAMIENTO_MS;
        };

        // Secuencia de scroll: Home.jsx la arma al cerrar el modal (con el scroll de ese momento como inicio)
        armSequenceRef.current = (index, startY) => { seq = { index, startY }; };
        disarmSequenceRef.current = () => { seq = null; }; // los cohetes vuelven suavemente a su tarjeta

        // Hover y clic sobre los cohetes: prueba directa contra su zona en pantalla (ud.hit), más
        // fácil de acertar con el dedo que un raycast contra un cohete de ~40px.
        function rocketEnPunto(x, y) {
            for (let n = 0; n < rockets.length; n++) {
                const g = rockets[n];
                if (g.scale.x < 0.9 || g.userData.seqD > 20) continue; // en la secuencia el cohete ya no abre el modal
                const h = g.userData.hit;
                if (x >= h[0] && x <= h[2] && y >= h[1] && y <= h[3]) return g;
            }
            return null;
        }

        function handleHover(event) {
            const cursor = rocketEnPunto(event.clientX, event.clientY) ? 'pointer' : 'default';
            if (document.body.style.cursor !== cursor) document.body.style.cursor = cursor;
        }

        // Clic en un cohete = lo mismo que pulsar "Elegir" en su tarjeta: se abre el ÚNICO popup
        // (el de RocketCards). Este archivo ya no crea ningún popup propio.
        function handleClick(event) {
            // Los clics en botones/enlaces/popup son de la interfaz, no del cohete que quede detrás
            if (event.target && event.target.closest && event.target.closest('button, a, input, .rocket-popup-overlay, .nave-modal-overlay')) return;
            const g = rocketEnPunto(event.clientX, event.clientY);
            if (g && onRocketClickRef.current) {
                reproducirClic(); // el cohete 3D no es un elemento HTML: el escuchador global no lo ve
                onRocketClickRef.current(g.userData.index);
            }
        }

        // Agregar event listeners. (Se quitó el listener de touchstart que lanzaba un clic falso:
        // en celular el toque ya genera su propio clic, así que el cohete reaccionaba DOS veces.)
        window.addEventListener('mousemove', handleHover);
        window.addEventListener('click', handleClick);

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
                const deberiaVerse = window.scrollY > UMBRAL_COHETES_SCROLL;
                // La aparición la dispara actualizarCohetes (cuando su tarjeta ya se ve). Aquí solo el reinicio:
                if (!deberiaVerse) {
                    // Si subimos el scroll, se reinician
                    rocket.userData.isAppearing = false;
                    rocket.scale.set(0, 0, 0);
                    rocket.userData.estado = 'reposo';
                    rocket.userData.speed = 0;
                    rocket.userData.shake = 0;
                    rocket.userData.seqD = 0;
                    seq = null;
                }
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

        let ultimoFrameCohetes = performance.now();

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            planet.rotation.y += 0.004;
            updatePlanetReveal();
            updateCornerMove();
            animateParticles();
            actualizarEstrellasAlternas();
            actualizarAstronautasFlotantes();
            notificarTransformPlaneta();
            // Tiempo global para las animaciones
            const time = performance.now() * 0.001;
            // Animaciones de los cohetes (anclaje a su tarjeta, flote, vibración, despegue y llama)
            const ahoraMs = performance.now();
            const dt = Math.min((ahoraMs - ultimoFrameCohetes) / 1000, 0.1); // segundos; tope por si la pestaña estuvo en segundo plano
            ultimoFrameCohetes = ahoraMs;
            actualizarCohetes(time, dt);

            renderer.render(scene, camera);

            // Capa de cohetes: solo se dibuja si hay alguno visible (y una última vez para borrarse)
            let hayCohetes = false;
            for (let n = 0; n < rockets.length; n++) if (rockets[n].scale.x > 0) { hayCohetes = true; break; }
            if (hayCohetes || capaCohetesSucia) {
                rocketRenderer.render(rocketScene, rocketCamera);
                capaCohetesSucia = hayCohetes;
            }
        }

                function handleResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            actualizarFondoLargo();
            realinearEsquinaSiAplica();

            // Capa de cohetes: solo cambia el tamaño del lienzo; la posición de cada cohete se
            // recalcula en cada frame a partir de su tarjeta, así que no hay nada que reubicar.
            rocketRenderer.setSize(width, height);
            rocketCamera.left = -width / 2;
            rocketCamera.right = width / 2;
            rocketCamera.top = height / 2;
            rocketCamera.bottom = -height / 2;
            rocketCamera.updateProjectionMatrix();
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

            // Capa de cohetes
            escenaActiva = false;
            prepareLaunchRef.current = () => {};
            cancelLaunchRef.current = () => {};
            launchRef.current = () => 0;
            detenerMotor();
            armSequenceRef.current = () => {};
            disarmSequenceRef.current = () => {};
            rockets.forEach((g) => {
                g.traverse((o) => { if (o.isMesh && o.material) o.material.dispose(); });
            });
            modelosCohete.forEach((promesa) => promesa.then((gltf) => {
                gltf.scene.traverse((o) => {
                    if (o.isMesh) {
                        o.geometry.dispose();
                        if (o.material && o.material.map) o.material.map.dispose();
                    }
                });
            }).catch(() => {}));
            rocketRenderer.dispose();
            if (rocketRenderer.domElement.parentNode) rocketRenderer.domElement.parentNode.removeChild(rocketRenderer.domElement);
        };

    }, [navigate, onLoad]); // Dependencia de onLoad para asegurarnos de que funcione correctamente

    return null;
});

export default ThreeScene;