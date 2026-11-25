import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import datagalaxia from '../data';                       // src/pages/data.js: galaxias y planetas (los de siempre)
import FondoUniverso from '../../components/FondoUniverso';
import ControlesSuperiores from '../../components/ControlesSuperiores';
import { reproducirClicEspacio, reproducirPlaneta } from '../../components/sonidos';
import BotonImagen from '../../components/BotonImagen';
import './GalaxiaInterior.css';

// ============================================================================================
// PANTALLA INTERNA DE UNA GALAXIA (diseño de Figma "iPhone 14 & 15 Pro - 7"):
//   cabecera (Volver a galáxias + música / sonido / logotipo) -> título -> subtítulo ->
//   carrusel de 3 planetas con flechas -> etiquetas verdes -> tarjeta "Primer Vistazo".
//
// Datos: cada página de galaxia puede pasar los suyos por props (lo normal, ver abajo) o, si no los pasa, se
// buscan en data.js según la URL (/ninos/peligros_digitales -> etapa "ninos", galaxia "peligros_digitales").
//   <GalaxiaInterior etapa="ninos" galaxia="peligros_digitales" categoria="niños" />   (planetas de data.js)
//   <GalaxiaInterior etapa="ninos" titulo="Peligros Digitales" planetas={[{ name, texture, planetUrl, text }, ...]} />
//   - name / texture / planetUrl: nombre, textura y ruta del planeta (la misma forma que usa data.js)
//   - text: ficha en texto ("Clave: valor\n...") para la tarjeta "Primer Vistazo" (opcional)
// No necesita react-router.
// Los planetas son esferas 3D con la textura de cada planeta (las mismas texturas de data.js), con giro lento.
// Ingresar a un planeta usa la misma navegación de siempre: ir a su `planetUrl`.
// ============================================================================================

// Posición de cada planeta del carrusel, como fracción del ancho del carrusel (medida en Figma)
// Laterales más pequeños y con la misma separación (0.06 del ancho) entre el borde del central y cada lateral
const X_PLANETAS = [0.2225, 0.5, 0.7775];
const DIAMETRO_PLANETAS = [0.16, 0.275, 0.16];
const ZOOM_INGRESAR = 1.3;     // el planeta central crece hasta esta escala al ingresar (como el acercamiento de siempre)
const DURACION_INGRESAR_MS = 1000; // y a los 1000 ms se pasa a la página del planeta (igual que antes)

const aSlug = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '_');
// "Planeta VÍTREO" -> "Planeta Vítreo"
const partesNombre = (nombre) => {
    const resto = nombre.replace(/^planeta\s+/i, '').toLowerCase();
    return ['Planeta', `${resto.charAt(0).toUpperCase()}${resto.slice(1)}`];
};
const nombreBonito = (nombre) => partesNombre(nombre).join(' ');
// Convierte el texto de data.js ("Clave: valor\n...") en un objeto
const leerFicha = (texto) => {
    const ficha = {};
    String(texto || '').split('\n').forEach((linea) => {
        const i = linea.indexOf(':');
        if (i > 0) ficha[linea.slice(0, i).trim()] = linea.slice(i + 1).trim();
    });
    return ficha;
};

// --------------------------------------------------------------------------------------------
// Tres esferas 3D (anterior / actual / siguiente) en un canvas transparente que ocupa el carrusel
// --------------------------------------------------------------------------------------------
const PlanetasCarrusel = forwardRef(function PlanetasCarrusel({ texturas }, refControl) {
    const montaje = useRef(null);
    const motor = useRef(null);
    const ultimas = useRef(texturas);
    ultimas.current = texturas;

    useEffect(() => {
        const cont = montaje.current;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
        cont.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 5000); // unidades = píxeles
        camera.position.z = 1000;
        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const sol = new THREE.DirectionalLight(0xffffff, 1.7);
        sol.position.set(-400, 300, 800);
        scene.add(sol);

        const geometria = new THREE.SphereGeometry(1, 48, 48);
        const mallas = [0, 1, 2].map(() => {
            const malla = new THREE.Mesh(geometria, new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 }));
            malla.visible = false;
            scene.add(malla);
            return malla;
        });

        const cargador = new THREE.TextureLoader();
        const cache = new Map();
        const textura = (ruta) => {
            if (!cache.has(ruta)) {
                const t = cargador.load(encodeURI(ruta)); // algunas texturas tienen espacios en el nombre
                if (THREE.SRGBColorSpace && 'colorSpace' in t) t.colorSpace = THREE.SRGBColorSpace;
                cache.set(ruta, t);
            }
            return cache.get(ruta);
        };

        const estado = { w: 1, h: 1, zoomInicio: null };
        const aplicar = (rutas) => rutas.forEach((ruta, i) => {
            const malla = mallas[i];
            if (!ruta) { malla.visible = false; return; }
            malla.visible = true;
            const t = textura(ruta);
            if (malla.material.map !== t) { malla.material.map = t; malla.material.needsUpdate = true; }
        });
        motor.current = { aplicar, ampliar: () => { estado.zoomInicio = performance.now(); } };

        const ajustar = () => {
            const w = Math.max(cont.clientWidth, 1);
            const h = Math.max(cont.clientHeight, 1);
            estado.w = w;
            estado.h = h;
            renderer.setSize(w, h, false);
            camera.left = -w / 2; camera.right = w / 2; camera.top = h / 2; camera.bottom = -h / 2;
            camera.updateProjectionMatrix();
        };
        const observador = new ResizeObserver(ajustar);
        observador.observe(cont);
        ajustar();
        aplicar(ultimas.current);

        let raf = 0;
        const bucle = () => {
            raf = requestAnimationFrame(bucle);
            // acercamiento al ingresar: solo el planeta central, con aceleración suave
            let zoom = 1;
            if (estado.zoomInicio !== null) {
                const u = Math.min((performance.now() - estado.zoomInicio) / DURACION_INGRESAR_MS, 1);
                zoom = 1 + (ZOOM_INGRESAR - 1) * u * u;
            }
            mallas.forEach((malla, i) => {
                malla.position.set((X_PLANETAS[i] - 0.5) * estado.w, 0, 0);
                malla.scale.setScalar(((DIAMETRO_PLANETAS[i] * estado.w) / 2) * (i === 1 ? zoom : 1));
                malla.rotation.y += 0.004;
            });
            renderer.render(scene, camera);
        };
        bucle();

        return () => {
            cancelAnimationFrame(raf);
            observador.disconnect();
            motor.current = null;
            geometria.dispose();
            mallas.forEach((m) => m.material.dispose());
            cache.forEach((t) => t.dispose());
            renderer.dispose();
            if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => { if (motor.current) motor.current.aplicar(texturas); }, [texturas]);
    useImperativeHandle(refControl, () => ({ ampliar: () => { if (motor.current) motor.current.ampliar(); } }), []);

    return <div className="gi-canvas" ref={montaje} aria-hidden="true" />;
});

// --------------------------------------------------------------------------------------------
export default function GalaxiaInterior({ etapa: etapaProp, galaxia: galaxiaProp, titulo: tituloProp, planetas: planetasProp, categoria }) {
    const [, rutaEtapa, rutaGalaxia] = useMemo(() => ['', ...window.location.pathname.split('/').filter(Boolean)], []);
    const navigate = useNavigate();
    const etapa = etapaProp || rutaEtapa || 'ninos';
    const volverAGalaxias = () => navigate(`/${etapa}`); // vuelve a la escena de las 4 galaxias de la etapa, sin recargar
    const slugGalaxia = galaxiaProp || rutaGalaxia || '';
    const galaxiaData = useMemo(() => datagalaxia.find((g) => aSlug(g.name) === slugGalaxia), [slugGalaxia]);
    // Los planetas vienen por props si la página los pasa; si no, de data.js
    const planetas = useMemo(
        () => (planetasProp || (galaxiaData ? galaxiaData.planetas : []))
            .filter((p) => p.activo !== false && (!categoria || p.categoria === categoria)),
        [planetasProp, galaxiaData, categoria],
    );
    const galaxia = tituloProp ? { name: tituloProp } : galaxiaData;
    const n = planetas.length;
    const [actual, setActual] = useState(0);
    const carruselRef = useRef(null);
    const entrando = useRef(false);
    const temporizador = useRef(null);
    useEffect(() => () => clearTimeout(temporizador.current), []);

    // Esta pantalla fluye con el contenido (no está limitada a una sola altura): el fondo oficial es fijo y acompaña el scroll
    useEffect(() => {
        document.documentElement.classList.add('pagina-flujo');
        document.body.classList.add('pagina-flujo');
        window.scrollTo(0, 0);
        return () => {
            document.documentElement.classList.remove('pagina-flujo');
            document.body.classList.remove('pagina-flujo');
        };
    }, []);

    // Con 3 planetas o más el carrusel da la vuelta; con menos solo se ven los vecinos que existen
    const vecino = (d) => {
        if (n >= 3) return (actual + d + n) % n;
        const j = actual + d;
        return j >= 0 && j < n ? j : null;
    };
    const indices = [vecino(-1), actual, vecino(1)];
    const clave = indices.join(',');
    const texturas = useMemo(
        () => indices.map((i) => (i === null || !planetas[i] ? null : planetas[i].texture)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [clave, planetas],
    );
    const puedeIr = (d) => vecino(d) !== null;
    // Cambiar de planeta: el sonido de siempre de estas páginas (click-space), ahora dentro del silencio global
    const elegirPlaneta = (j) => { if (entrando.current) return; reproducirClicEspacio(); setActual(j); };
    const ir = (d) => { const j = vecino(d); if (j !== null) elegirPlaneta(j); };

    // Ingresar: igual que el botón "Ingresar" de antes -- sonido "Planeta", acercamiento de 1 s y paso a la página del planeta
    const entrar = () => {
        if (entrando.current || !planetas[actual]) return;
        entrando.current = true;
        reproducirPlaneta();
        if (carruselRef.current) carruselRef.current.ampliar();
        temporizador.current = setTimeout(() => { window.location.href = planetas[actual].planetUrl; }, DURACION_INGRESAR_MS);
    };

    if (!galaxia || n === 0) {
        return (
            <div className="gi-pantalla">
                <FondoUniverso />
                <ControlesSuperiores />
                <BotonImagen className="gi-volver" src="/assets/Boton-regresar.png" etiqueta="Volver a galáxias" onClick={volverAGalaxias} />
                <main className="gi-contenido"><h1 className="gi-titulo">Galaxia no encontrada</h1></main>
            </div>
        );
    }

    const ficha = leerFicha(planetas[actual].text);
    const lineas = [
        ficha['Nombre del riesgo'] && `Planeta atacado por: ${ficha['Nombre del riesgo']}`,
        ficha['Nivel de riesgo'] && `-Nivel de riesgo: ${ficha['Nivel de riesgo']}`,
        ficha.Ambiente && `-Ambiente: ${ficha.Ambiente}`,
        ficha.Villano && `-Villano: ${ficha.Villano}`,
    ].filter(Boolean);

    return (
        <div className="gi-pantalla">
            <FondoUniverso />
            <ControlesSuperiores />

            {/* Botón de regreso: imagen ya hecha (public/assets/Boton-regresar.png) */}
            <BotonImagen className="gi-volver" src="/assets/Boton-regresar.png" etiqueta="Volver a galáxias" onClick={volverAGalaxias} />

            <main className="gi-contenido">
                <h1 className="gi-titulo">Galaxia<br />{galaxia.name}</h1>
                <p className="gi-subtitulo">{n} planetas disponibles. Elige uno para continuar.</p>

                <section className="gi-carrusel" aria-label="Planetas de la galaxia">
                    <PlanetasCarrusel ref={carruselRef} texturas={texturas} />
                    <button type="button" className="gi-flecha gi-flecha--izq" onClick={() => ir(-1)} disabled={!puedeIr(-1)} data-sin-sonido aria-label="Planeta anterior">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button type="button" className="gi-flecha gi-flecha--der" onClick={() => ir(1)} disabled={!puedeIr(1)} data-sin-sonido aria-label="Planeta siguiente">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                    {/* Zonas pulsables sobre cada planeta: los de los lados se eligen; el central entra */}
                    {indices.map((i, k) => (i === null ? null : (
                        <button
                            key={`${k}-${i}`}
                            type="button"
                            className="gi-planeta"
                            style={{ '--x': `${X_PLANETAS[k] * 100}%`, '--d': `${DIAMETRO_PLANETAS[k] * 100}%` }}
                            onClick={k === 1 ? entrar : () => elegirPlaneta(i)}
                            data-sin-sonido
                            aria-label={k === 1 ? `Ingresar a ${nombreBonito(planetas[i].name)}` : `Elegir ${nombreBonito(planetas[i].name)}`}
                        />
                    )))}
                </section>

                <div className="gi-etiquetas">
                    {indices.map((i, k) => (i === null ? null : (
                        <button
                            key={`${k}-${i}`}
                            type="button"
                            className={`gi-etiqueta ${k === 1 ? 'gi-etiqueta--centro' : ''}`}
                            style={{ '--x': `${X_PLANETAS[k] * 100}%` }}
                            onClick={k === 1 ? entrar : () => elegirPlaneta(i)}
                            data-sin-sonido
                        >
                            {partesNombre(planetas[i].name).map((t) => <span key={t}>{t}</span>)}
                        </button>
                    )))}
                </div>

                <section className="gi-vistazo" aria-label="Primer vistazo">
                    <h2 className="gi-vistazo__tab">Primer Vistazo</h2>
                    <div className="gi-vistazo__panel">
                        {lineas.map((l) => <div key={l}>{l}</div>)}
                    </div>
                </section>
            </main>
        </div>
    );
}