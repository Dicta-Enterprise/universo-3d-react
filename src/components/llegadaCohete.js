// ============================================================================================
// LLEGADA DEL COHETE a la galaxia de cada etapa (Niño /ninos, Joven /jovenes, Padre /padres).
// Un solo módulo para las tres experiencias: cada página lo crea UNA vez con su propia escena,
// su cámara y sus galaxias, y lo actualiza dentro de SU bucle de animación (no crea otro bucle).
//
// Secuencia (todo en segundos, ver TIEMPOS):
//   A. Aproximación desde la oscuridad: la escena arranca oscura; el cohete (mismo modelo
//      Cohete-AlasRojas.glb) viene de lejos en curva; se intuye un resplandor tenue y las galaxias
//      empiezan a distinguirse apenas.
//   B. Destello: justo antes de llegar, una luz radial intensa y breve (centrada en la zona de
//      llegada del cohete) se expande y se disipa; el velo oscuro se levanta y las galaxias quedan
//      completamente visibles.
//   C. Órbita: el cohete da una vuelta curva alrededor de las galaxias de ESA página (calculada con
//      sus posiciones reales) y queda en espera con un balanceo sutil.
//   Entrada: cuando el usuario confirma una galaxia (flujo que ya tenía cada página), el cohete se
//      orienta, se aproxima en curva y se hunde en su centro mientras la cámara se acerca.
//
// Efectos: velo oscuro y destello son <div> con opacity/transform (sin postprocesado ni
// dependencias nuevas: coste mínimo). Las galaxias solo cambian su opacidad (no su color ni forma).
// ============================================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const RUTA_MODELO_COHETE = '/assets/cohete/Cohete-AlasRojas.glb'; // public/assets/cohete/Cohete-AlasRojas.glb
const FLAME_NODE_NAME = 'Rocket_Flame';

// ---- Tiempos de la llegada (segundos desde que el cohete está listo) -------------------------
export const TIEMPOS = {
    APROXIMACION: 4.6,   // duración del viaje desde la oscuridad hasta la zona de galaxias
    PICO_DESTELLO: 3.9,  // instante del destello (el cohete llega ~0.7 s después)
    SUBIDA_DESTELLO: 0.8,// el destello crece hasta su pico en este tiempo
    BAJADA_DESTELLO: 1.7,// y se disipa en este otro
    REVELADO: 1.4,       // el velo oscuro se levanta y las galaxias se ven del todo
};
// ---- Aspecto del destello ---------------------------------------------------------------------
export const DESTELLO = {
    INTENSIDAD_MAX: 0.9,    // opacidad máxima de la luz (0-1). Más alto = más blanco
    TAMANO: 0.55,           // radio de la luz, como fracción del lado mayor de la pantalla
    TENUE: 0.2,             // resplandor lejano antes del destello (0-1 de la intensidad)
    COLOR_CENTRO: '168, 178, 255',  // azul claro (núcleo luminoso)
    COLOR_MEDIO: '60, 71, 179',     // #3C47B3 (azul principal)
    COLOR_BORDE: '30, 36, 110',     // azul profundo (halo exterior)
};
const OSCURIDAD = { INICIAL: 0.94, ANTES_DESTELLO: 0.78, COLOR: '#040716' };
// ---- Órbita (segundos) y entrada --------------------------------------------------------------
export const ORBITA = { DETENCION: 0, TRAMO: 3.4, ARRANQUE: 0.8, CENTRADO: 2.2 };   // DETENCION 0 = recorrido continuo (sin pausas); TRAMO = trayecto entre una galaxia y la siguiente; ARRANQUE = aceleración al empezar; CENTRADO = tiempo en acomodarse al centro
export const ENTRADA = { APROXIMACION: 0.55, HUNDIMIENTO: 0.45 };   // antes 1.0 / 0.9: el cohete entra en ~1 s
const ALTO_COHETE_REL = 0.12; // alto del cohete = 12% del alto visible de la escena

// Clave de la entrada actual del historial: cada navegación de React Router tiene la suya.
const claveNavegacion = () => (window.history.state && window.history.state.key) || window.location.pathname;
let introVistaEn = null;      // clave de la navegación en la que la intro YA terminó: no se repite si la página reconstruye su
                              // escena (cambio de tamaño, StrictMode), pero SÍ se repite al volver a entrar desde otra pantalla
let promesaModelo = null;
function cargarModelo() {
    if (!promesaModelo) {
        promesaModelo = new Promise((resolve, reject) => new GLTFLoader().load(RUTA_MODELO_COHETE, resolve, undefined, reject));
    }
    return promesaModelo;
}

const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const suave = (x) => x * x * (3 - 2 * x);
const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const angDif = (a, b) => { // a - b por el camino corto
    let d = (a - b) % (2 * Math.PI);
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    return d;
};

export function crearLlegadaCohete({ scene, camera, getGalaxias }) {
    const reducir = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const saltarIntro = introVistaEn === claveNavegacion() || reducir;

    const z0 = Math.abs(camera.position.z) || 18; // distancia de la cámara al plano de las galaxias, al empezar
    const creado = performance.now();
    let ultimo = creado;
    let reloj = 0;
    let t0 = null;               // reloj al empezar (cuando el cohete está listo)
    let cargado = false;
    let liberado = false;
    let introTerminada = saltarIntro;
    let estado = 'aprox';        // aprox | orbita | ir | hundir | dentro
    let tEstado = 0;             // reloj al entrar en el estado actual
    let ang = 0;                 // ángulo suavizado del cohete
    let angInicializado = false;
    let ultimaPose = null;
    let entrada = null;
    let cacheOrbita = { clave: '', curva: null, paradas: 0 };
    let curvaAprox = null;

    // ---- Velo oscuro y destello (DOM) --------------------------------------------------------
    const velo = document.createElement('div');
    Object.assign(velo.style, {
        position: 'fixed', inset: '0', zIndex: '1', pointerEvents: 'none',
        background: OSCURIDAD.COLOR, opacity: saltarIntro ? '0' : String(OSCURIDAD.INICIAL),
    });
    const destello = document.createElement('div');
    Object.assign(destello.style, {
        position: 'fixed', left: '0', top: '0', zIndex: '2', pointerEvents: 'none',
        mixBlendMode: 'screen', opacity: '0', willChange: 'transform, opacity',
        background: `radial-gradient(circle, rgba(${DESTELLO.COLOR_CENTRO},1) 0%, rgba(${DESTELLO.COLOR_MEDIO},0.7) 18%, rgba(${DESTELLO.COLOR_BORDE},0.32) 42%, rgba(${DESTELLO.COLOR_BORDE},0) 70%)`,
    });
    if (!saltarIntro) document.body.append(velo, destello);

    // Las galaxias empiezan invisibles (solo opacidad: sus colores y formas no se tocan)
    const fijarOpacidadGalaxias = (v) => {
        const gs = getGalaxias();
        for (let i = 0; i < gs.length; i++) {
            const m = gs[i].material;
            if (!m) continue;
            if (v >= 1) { if (m.opacity !== 1) m.opacity = 1; continue; }
            m.transparent = true;
            m.opacity = v;
        }
    };
    if (!saltarIntro) fijarOpacidadGalaxias(0);

    // ---- Cohete (mismo GLB y mismo tratamiento de materiales que ThreeScene.jsx) ---------------
    const grupo = new THREE.Group();
    grupo.visible = false;
    scene.add(grupo);
    const luces = [];
    if (!scene.children.some((o) => o.isLight)) { // solo si la página no tiene luces propias
        const dir = new THREE.DirectionalLight(0xffffff, 1.5);
        dir.position.set(5, 10, 10);
        const amb = new THREE.AmbientLight(0x404040, 1.5);
        scene.add(dir, amb);
        luces.push(dir, amb);
    }
    const materialesPropios = [];
    const llama = { nodo: null, mats: [], intensidad: 0.85, reloj: 0, fase: Math.random() * 6 };
    let modelH = 1;

    cargarModelo().then((gltf) => {
        if (liberado) return;
        const cohete = gltf.scene.clone(true);
        cohete.rotation.y = Math.PI;
        cohete.updateMatrixWorld(true);
        const caja = new THREE.Box3().setFromObject(cohete);
        const tam = caja.getSize(new THREE.Vector3());
        modelH = tam.y > 0 ? tam.y : 1;
        cohete.position.sub(caja.getCenter(new THREE.Vector3())); // centrado en su origen: gira sobre su centro

        let nodoLlama = cohete.getObjectByName(FLAME_NODE_NAME);
        if (!nodoLlama) cohete.traverse((o) => { if (!nodoLlama && /flame|fire|llama|exhaust/i.test(o.name)) nodoLlama = o; });
        const dentroDeLlama = (obj) => { for (let p = obj; p; p = p.parent) if (p === nodoLlama) return true; return false; };
        cohete.traverse((hijo) => {
            if (!hijo.isMesh) return;
            const colorOriginal = hijo.material.color ? hijo.material.color.clone() : new THREE.Color(0xffffff);
            if (nodoLlama && dentroDeLlama(hijo)) {
                hijo.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: hijo.material.map || null, vertexColors: !!hijo.material.vertexColors });
                llama.mats.push(hijo.material);
            } else {
                hijo.material = new THREE.MeshLambertMaterial({ color: colorOriginal, map: hijo.material.map || null, vertexColors: !!hijo.material.vertexColors });
            }
            materialesPropios.push(hijo.material);
        });
        llama.nodo = nodoLlama || null;
        grupo.add(cohete);
        cargado = true;
    }).catch((error) => {
        console.error('Llegada del cohete: no se pudo cargar', RUTA_MODELO_COHETE, error);
        cargado = true; // sin cohete la página sigue funcionando: solo se ve la revelación de las galaxias
    });

    function actualizarLlama(dt) {
        const f = llama.nodo;
        if (!f) return;
        const lerp = THREE.MathUtils.lerp;
        const i = llama.intensidad;
        llama.reloj += dt * (1 + i * 1.3);
        const t = llama.reloj + llama.fase;
        const pulso = 0.5 + 0.5 * (Math.sin(t * 5.5) * 0.55 + Math.sin(t * 8.3 + 1.0) * 0.30 + Math.sin(t * 3.1 + 2.0) * 0.15);
        const flick = Math.sin(t * 23) * 0.5 + Math.sin(t * 31.7 + 0.6) * 0.5;
        const largo = lerp(lerp(0.55, 1.5, i), lerp(1.35, 2.3, i), pulso) * (1 + flick * 0.04 * (0.5 + i));
        const ancho = lerp(1.05, 0.9, pulso);
        f.scale.set(ancho * (1 + 0.03 * Math.sin(t * 13)), largo, ancho * (1 + 0.03 * Math.cos(t * 11.7)));
        const vaiven = lerp(0.02, 0.06, i);
        f.rotation.x = Math.cos(t * 7.3) * vaiven;
        f.rotation.z = Math.sin(t * 6.1 + 0.7) * vaiven;
        const brillo = 0.9 + 0.35 * pulso + 0.25 * i;
        for (let k = 0; k < llama.mats.length; k++) llama.mats[k].color.setScalar(brillo);
    }

    // ---- Geometría: extensión visible, órbita ------------------------------------------------
    function extension() {
        const mitadAlto = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * z0;
        return { halfH: mitadAlto, halfW: mitadAlto * camera.aspect };
    }
    function radioGalaxia(g) {
        const geo = g.geometry;
        if (geo && !geo.boundingSphere) geo.computeBoundingSphere();
        const r = geo && geo.boundingSphere ? geo.boundingSphere.radius : 5;
        return r * (g.scale ? g.scale.x : 1);
    }
    // Curva cerrada alrededor de las galaxias de ESTA página (posiciones reales). Pasa por una parada
    // por galaxia (por fuera de ella) y por un punto intermedio entre cada par.
    function curvaOrbita(gs, alto, halfW, halfH) {
        const clave = gs.map((g) => g.position.x.toFixed(1) + ',' + g.position.y.toFixed(1)).join('|') + '|' + halfW.toFixed(1) + 'x' + halfH.toFixed(1);
        if (cacheOrbita.clave === clave && cacheOrbita.curva) return cacheOrbita;
        const n = gs.length;
        const cx0 = gs.reduce((s, g) => s + g.position.x, 0) / n;
        const cy0 = gs.reduce((s, g) => s + g.position.y, 0) / n;
        const R = Math.max(...gs.map(radioGalaxia));
        const maxDx = Math.max(...gs.map((g) => Math.abs(g.position.x - cx0)));
        const maxDy = Math.max(...gs.map((g) => Math.abs(g.position.y - cy0)));
        let rx = maxDx + R * 1.15 + alto * 0.5;
        let ry = maxDy + R * 0.75 + alto * 0.5;
        rx = Math.max(Math.min(rx, halfW - alto * 0.8), alto);   // siempre dentro de la vista
        ry = Math.max(Math.min(ry, halfH - alto * 0.8), alto);
        // ángulo (en sentido horario visto en pantalla) de cada galaxia respecto al centro del grupo
        const angs = gs.map((g) => Math.atan2(-(g.position.y - cy0) / ry, (g.position.x - cx0) / rx));
        const arriba = gs.reduce((mejor, g, i) => (g.position.y > gs[mejor].position.y ? i : mejor), 0); // la de más arriba: de ahí llega el cohete
        const rel = angs.map((a) => ((a - angs[arriba]) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)).sort((a, b) => a - b);
        const punto = (a) => new THREE.Vector3(cx0 + rx * Math.cos(a), cy0 - ry * Math.sin(a), 0);
        const puntos = [];
        for (let i = 0; i < n; i++) {
            const a0 = angs[arriba] + rel[i];
            const a1 = angs[arriba] + (i < n - 1 ? rel[i + 1] : 2 * Math.PI);
            puntos.push(punto(a0), punto((a0 + a1) / 2));
        }
        // Punto de espera (teléfono y escritorio): el centro entre las dos galaxias de la misma fila; si no hay, el centro del grupo
        let fila = null;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const dx = Math.abs(gs[i].position.x - gs[j].position.x);
                const dy = Math.abs(gs[i].position.y - gs[j].position.y);
                if (dx > alto * 0.5 && (!fila || dy < fila.dy)) fila = { dy, x: (gs[i].position.x + gs[j].position.x) / 2, y: (gs[i].position.y + gs[j].position.y) / 2 };
            }
        }
        cacheOrbita = { clave, curva: new THREE.CatmullRomCurve3(puntos, true, 'catmullrom', 0.5), paradas: n, espera: fila ? { x: fila.x, y: fila.y } : { x: cx0, y: cy0 } }; // en el centro, justo entre las galaxias: no cae sobre etiquetas ni galaxias
        return cacheOrbita;
    }
    function poseOrbita(tau, time, gs, alto, ext) {
        const { curva, paradas: n, espera } = curvaOrbita(gs, alto, ext.halfW, ext.halfH);
        // Recorrido continuo: una sola vuelta por todas las galaxias, sin pausas, a velocidad constante
        // (arranca acelerando un poco para enlazar con la aproximación).
        const r = ORBITA.ARRANQUE;
        const tVuelta = n * (ORBITA.DETENCION + ORBITA.TRAMO);
        const duracionVuelta = tVuelta + r / 2;
        const recorrido = tau < r ? (tau * tau) / (2 * r) : tau - r / 2;   // tiempo "efectivo" recorrido
        const u = Math.min(recorrido / tVuelta, 1);
        const quieto = tau >= duracionVuelta;       // terminada la vuelta: se acomoda al centro y espera
        const uu = ((u % 1) + 1) % 1;
        const p = curva.getPoint(uu);
        const tg = curva.getTangent(uu);
        let x = p.x;
        let y = p.y;
        let a = Math.atan2(-tg.x, tg.y);
        if (tau >= duracionVuelta) {                // al terminar la vuelta se coloca en el centro de la pantalla, entre las galaxias
            const e = suave(clamp01((tau - duracionVuelta) / ORBITA.CENTRADO));
            x += (espera.x - x) * e;
            y += (espera.y - y) * e;
            a += angDif(Math.PI, a) * e;            // y se gira con la punta hacia abajo y la llama arriba, como en Figma
        }
        if (quieto && !reducir) {                   // pausa/espera: deriva y balanceo muy sutiles
            x += Math.sin(time * 0.9) * alto * 0.05;
            y += Math.sin(time * 1.3) * alto * 0.06;
            a += Math.sin(time * 0.8) * 0.05;
        }
        return { x, y, z: 1.2, ang: a, escala: 1 };
    }
    function poseAproximacion(u, alto, gs, ext) {
        // viaje en curva desde lejos (arriba, al fondo) hasta la primera parada de la órbita
        const fin = poseOrbita(0, 0, gs, alto, ext);
        if (!curvaAprox || curvaAprox.clave !== cacheOrbita.clave) {
            const S = new THREE.Vector3(fin.x - ext.halfW * 0.55, fin.y + ext.halfH * 1.25, -z0 * 0.9);
            const E = new THREE.Vector3(fin.x, fin.y, fin.z);
            const C1 = new THREE.Vector3(S.x + ext.halfW * 0.5, S.y - ext.halfH * 0.9, -z0 * 0.55);
            const C2 = new THREE.Vector3(E.x - ext.halfW * 0.45, E.y + ext.halfH * 0.55, -z0 * 0.15);
            curvaAprox = { clave: cacheOrbita.clave, curva: new THREE.CubicBezierCurve3(S, C1, C2, E) };
        }
        const e = easeInOutSine(u);
        const p = curvaAprox.curva.getPoint(e);
        const tg = curvaAprox.curva.getTangent(e);
        return { x: p.x, y: p.y, z: p.z, ang: Math.atan2(-tg.x, tg.y), escala: 1 };
    }
    function poseEntrada(ahora, alto) {
        const a = entrada;
        if (estado === 'ir') {
            const u = Math.min((reloj - tEstado) / ENTRADA.APROXIMACION, 1);
            const e = suave(u);
            const bez = (p0, p1, p2, p3, t) => { const m = 1 - t; return m * m * m * p0 + 3 * m * m * t * p1 + 3 * m * t * t * p2 + t * t * t * p3; };
            const der = (p0, p1, p2, p3, t) => { const m = 1 - t; return 3 * m * m * (p1 - p0) + 6 * m * t * (p2 - p1) + 3 * t * t * (p3 - p2); };
            if (u >= 1) { estado = 'hundir'; tEstado = reloj; }
            return {
                x: bez(a.p0.x, a.p1.x, a.p2.x, a.p3.x, e), y: bez(a.p0.y, a.p1.y, a.p2.y, a.p3.y, e), z: a.z0,
                ang: Math.atan2(-der(a.p0.x, a.p1.x, a.p2.x, a.p3.x, e), der(a.p0.y, a.p1.y, a.p2.y, a.p3.y, e)),
                escala: 1 + 0.3 * e,                 // al acercarse crece
            };
        }
        const u = Math.min((reloj - tEstado) / ENTRADA.HUNDIMIENTO, 1);
        const e = u * u * u;                         // acelera al hundirse
        if (u >= 1) estado = 'dentro';
        return {
            x: a.p3.x + (a.G.x - a.p3.x) * e, y: a.p3.y + (a.G.y - a.p3.y) * e,
            z: a.z0 + (a.G.z - 1.5 - a.z0) * e,      // termina por detrás de las partículas: "dentro" de la galaxia
            ang: a.angF + u * 0.9,
            escala: 1.3 * (1 - e) + 0.03 * e,
        };
    }

    // ---- Actualización (se llama dentro del bucle de animación de la página) -------------------
    function actualizar() {
        if (liberado) return;
        const ahora = performance.now();
        const dt = Math.min((ahora - ultimo) / 1000, 0.1);
        ultimo = ahora;
        reloj += dt;
        if (t0 === null && (cargado || ahora - creado > 4000)) t0 = reloj;
        const t = saltarIntro ? 999 : (t0 === null ? 0 : reloj - t0);

        const gs = getGalaxias();
        const ext = extension();
        const alto = ext.halfH * 2 * ALTO_COHETE_REL;
        const T = TIEMPOS;

        // --- Velo oscuro, galaxias y destello ---
        if (!introTerminada) {
            const antes = Math.max(T.PICO_DESTELLO - 0.1, 0.1);
            let velo_a;
            let gal_a;
            if (t < antes) {
                velo_a = OSCURIDAD.INICIAL + (OSCURIDAD.ANTES_DESTELLO - OSCURIDAD.INICIAL) * suave(clamp01(t / antes));
                gal_a = 0.18 * suave(clamp01(t / antes));
            } else {
                const r = suave(clamp01((t - antes) / T.REVELADO));
                velo_a = OSCURIDAD.ANTES_DESTELLO * (1 - r);
                gal_a = 0.18 + 0.82 * r;
            }
            velo.style.opacity = String(velo_a);
            fijarOpacidadGalaxias(gal_a);

            // Destello: tenue a lo lejos -> sube hasta el pico -> se disipa (centrado donde llega el cohete)
            const ini = T.PICO_DESTELLO - T.SUBIDA_DESTELLO;
            let inten;
            if (t < ini) inten = DESTELLO.TENUE * suave(clamp01((t - 0.6) / Math.max(ini - 0.6, 0.1)));
            else if (t < T.PICO_DESTELLO) { const u = (t - ini) / T.SUBIDA_DESTELLO; inten = DESTELLO.TENUE + (1 - DESTELLO.TENUE) * u * u; }
            else inten = Math.pow(1 - clamp01((t - T.PICO_DESTELLO) / T.BAJADA_DESTELLO), 2);
            const crece = suave(clamp01((t - ini * 0.5) / (T.PICO_DESTELLO + T.BAJADA_DESTELLO - ini * 0.5)));
            const W = window.innerWidth;
            const H = window.innerHeight;
            const radio = Math.max(W, H) * DESTELLO.TAMANO;
            const zona = gs.length ? poseOrbita(0, 0, gs, alto, ext) : { x: 0, y: 0 }; // donde llega el cohete
            const ref = new THREE.Vector3(zona.x, zona.y, 0);
            const pantalla = ref.project(camera);
            const px = (pantalla.x * 0.5 + 0.5) * W;
            const py = (-pantalla.y * 0.5 + 0.5) * H;
            const tam = radio * (0.45 + 1.0 * crece);
            destello.style.width = destello.style.height = (tam * 2) + 'px';
            destello.style.transform = `translate3d(${px - tam}px, ${py - tam}px, 0)`;
            destello.style.opacity = String(Math.min(inten, 1) * DESTELLO.INTENSIDAD_MAX);

            if (t > T.PICO_DESTELLO + T.BAJADA_DESTELLO + 0.2 && t > antes + T.REVELADO) {
                introTerminada = true;                // listo: se quitan los efectos
                introVistaEn = claveNavegacion();
                fijarOpacidadGalaxias(1);
                velo.remove();
                destello.remove();
            }
        }

        // --- Cohete ---
        if (!cargado || !grupo.children.length) return;
        grupo.visible = estado !== 'dentro';
        let pose;
        if (estado === 'ir' || estado === 'hundir' || estado === 'dentro') {
            pose = estado === 'dentro' ? ultimaPose : poseEntrada(ahora, alto);
        } else if (gs.length) {
            const aprox = saltarIntro ? 1 : t / T.APROXIMACION;
            if (aprox < 1) { estado = 'aprox'; pose = poseAproximacion(Math.max(aprox, 0), alto, gs, ext); }
            else {
                if (estado === 'aprox') { estado = 'orbita'; tEstado = reloj; }
                const tau = saltarIntro ? reloj - (t0 === null ? 0 : t0) : t - T.APROXIMACION;
                pose = poseOrbita(Math.max(tau, 0), reloj, gs, alto, ext);
            }
        }
        if (!pose) return;
        if (!angInicializado) { ang = pose.ang; angInicializado = true; }
        ang += angDif(pose.ang, ang) * (1 - Math.exp(-7 * dt)); // gira sin latigazos
        ultimaPose = { ...pose, ang };
        grupo.position.set(pose.x, pose.y, pose.z);
        grupo.rotation.z = ang;
        grupo.scale.setScalar((alto / modelH) * pose.escala);
        actualizarLlama(dt);
    }

    // El usuario confirma una galaxia (el flujo de cada página no cambia): el cohete se orienta, se acerca en curva y se hunde
    function entrarEnGalaxia(galaxia) {
        if (liberado || !cargado || !grupo.children.length || !ultimaPose || estado === 'ir' || estado === 'hundir' || estado === 'dentro') return;
        const ext = extension();
        const alto = ext.halfH * 2 * ALTO_COHETE_REL;
        const u = ultimaPose;
        const G = galaxia.position.clone();
        const dx = G.x - u.x;
        const dy = G.y - u.y;
        const dist = Math.hypot(dx, dy) || 1;
        const dir = { x: dx / dist, y: dy / dist };
        const F = { x: G.x - dir.x * alto * 1.2, y: G.y - dir.y * alto * 1.2 };            // frente a la galaxia
        const largo = Math.hypot(F.x - u.x, F.y - u.y) || 1;
        const rumbo = { x: -Math.sin(ang), y: Math.cos(ang) };                               // hacia donde apunta ahora
        entrada = {
            p0: { x: u.x, y: u.y },
            p1: { x: u.x + rumbo.x * largo * 0.4, y: u.y + rumbo.y * largo * 0.4 },
            p2: { x: F.x - dir.x * largo * 0.35, y: F.y - dir.y * largo * 0.35 },
            p3: F, G, z0: u.z, angF: Math.atan2(-dir.x, dir.y),
        };
        estado = 'ir';
        tEstado = reloj;
    }

    function puedeElegir() {
        if (saltarIntro || introTerminada) return true;
        return t0 !== null && (reloj - t0) >= TIEMPOS.PICO_DESTELLO + 0.9; // ya se ven las galaxias
    }

    function dispose() {
        liberado = true;
        velo.remove();
        destello.remove();
        scene.remove(grupo);
        luces.forEach((l) => scene.remove(l));
        materialesPropios.forEach((m) => m.dispose());
        fijarOpacidadGalaxias(1);
    }

    return { actualizar, entrarEnGalaxia, puedeElegir, dispose };
}