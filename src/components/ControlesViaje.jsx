import React, { useEffect, useRef } from 'react';
import { getJourney } from './journey';

// ============================================================================================
// Los 2 botones de la pantalla "Anticípate" (Historia y Personalización).
// Son LOS MISMOS dos elementos durante todo el recorrido (no hay copias): viven en una capa fija
// y, con el scroll, viajan desde su sitio en la pantalla "Anticípate" hasta su hueco en la barra
// superior (izquierda de música y sonido), achicándose. Orden final de la barra:
//   Historia | Personalización | Música | Sonido | Mundo Dictariano
//
// Cómo se sincroniza con el scroll (sin useState por scroll): un requestAnimationFrame lee
// window.scrollY y, con el progreso s (0..1), interpola entre dos "huecos" medidos del DOM:
//   - hueco de inicio: <div data-slot="..."> dentro de .anticipate-pantalla (pantallaRef)
//   - hueco de fin:    <div data-slot="..."> dentro de .iconos-esquina (barraRef)
// Como las posiciones salen de la maqueta flex real, funciona en cualquier resolución.
// También pone la variable CSS --barra (0..1) en la barra, que abre los huecos poco a poco, y
// desvanece la pantalla "Anticípate" a medida que s avanza.
// ============================================================================================

const S_INICIO = 650;  // scroll donde empieza el traslado (la fase 2 empieza en 400)
const S_FIN = 1000;    // llega a la barra justo cuando empiezan los cohetes (= UMBRAL_COHETES en Home.jsx)

const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const suave = (t) => t * t * (3 - 2 * t);

// Iconos PNG de public/assets/icons (los mismos que música y sonido: el PNG ya trae su marco verde).
// Si quedaron intercambiados, solo cambia estas dos rutas.
// OJO: "iconosmd-08 1.png" tiene un espacio en el nombre; por eso va escrito como %20.
// Recomendado: renombrarlo (p. ej. a icono-historia.png) y poner aquí el nombre nuevo.
const ICONO_HISTORIA = '/assets/icons/iconosmd-08%201.png';      // micrófono
const ICONO_PERSONALIZAR = '/assets/icons/icono-astronauta.png'; // casco de astronauta

const BOTONES = [
    { id: 'historia', etiqueta: 'Descubre nuestra historia', icono: ICONO_HISTORIA },
    { id: 'personalizar', etiqueta: 'Personaliza tu traje', icono: ICONO_PERSONALIZAR },
];

export default function ControlesViaje({ revelado, startY, pantallaRef, barraRef, onPersonalizar, personalizarAbierto }) {
    const wrappers = useRef({});
    const reveladoRef = useRef(revelado);
    const startYRef = useRef(startY);
    useEffect(() => { reveladoRef.current = revelado; }, [revelado]);
    useEffect(() => { startYRef.current = startY; }, [startY]);

    useEffect(() => {
        let raf = 0;
        let barraAnterior = -1;

        const tick = () => {
            raf = requestAnimationFrame(tick);
            const y = window.scrollY;
            const H = window.innerHeight;
            const s = suave(clamp01((y - S_INICIO) / (S_FIN - S_INICIO)));
            // Al empezar el viaje espacial (SpaceJourney) estos botones se retiran junto con las tarjetas
            const salida = startYRef.current != null ? getJourney(y, startYRef.current, H).salida : 0;

            const barra = barraRef.current;
            const pantalla = pantallaRef.current;

            const abierto = s * (1 - salida);
            if (barra && Math.abs(abierto - barraAnterior) > 0.0005) {
                barra.style.setProperty('--barra', String(abierto));
                barraAnterior = abierto;
            }
            if (pantalla) {
                pantalla.style.opacity = String(1 - clamp01(s * 1.8)); // la pantalla "Anticípate" se va desvaneciendo
                pantalla.style.pointerEvents = s > 0.4 ? 'none' : '';
            }

            BOTONES.forEach(({ id }) => {
                const el = wrappers.current[id];
                if (!el) return;
                const fin = barra && barra.querySelector(`[data-slot="${id}"]`);
                if (!fin) return;
                const rf = fin.getBoundingClientRect();
                const inicio = pantalla && pantalla.querySelector(`[data-slot="${id}"]`);
                const ri = inicio ? inicio.getBoundingClientRect() : rf; // sin pantalla (ya en cohetes) -> directo a la barra
                const base = el.offsetHeight || 56;
                const e = inicio ? s : 1;
                const x = ri.left + (rf.left - ri.left) * e;
                const yy = ri.top + (rf.top - ri.top) * e;
                const escala = 1 + (rf.height / base - 1) * e;
                el.style.transform = `translate3d(${x}px, ${yy}px, 0) scale(${escala})`;
                el.style.opacity = String(1 - salida);
                el.style.visibility = salida >= 0.99 ? 'hidden' : 'visible';
                el.classList.toggle('control-viaje--quieto', e >= 0.99); // ya en la barra: sin pulsación
                const reveal = el.firstElementChild;
                if (reveal) reveal.classList.toggle('control-viaje__reveal--on', reveladoRef.current || s > 0.02);
            });
        };
        tick();

        return () => {
            cancelAnimationFrame(raf);
            if (barraRef.current) barraRef.current.style.removeProperty('--barra');
        };
    }, [pantallaRef, barraRef]);

    return (
        <>
            {/* Filtro que quita el fondo azul opaco que traen los PNG de los iconos: la transparencia sale
                de cuánto verde tiene cada pixel (fondo ~ 0.16 -> transparente, dibujo y marco ~ 1 -> opaco).
                Si re-exportas los PNG con fondo transparente, este filtro ya no hace falta pero no estorba. */}
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
                <filter id="icono-sin-fondo" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 1.2 0 0 -0.19" />
                </filter>
            </svg>
            {BOTONES.map(({ id, etiqueta, icono }) => (
                <div
                    key={id}
                    className="control-viaje"
                    ref={(el) => { wrappers.current[id] = el; }}
                >
                    <div className="control-viaje__reveal">
                        {/* Personalización abre/cierra el panel flotante del traje; Historia todavía no abre nada
                            (falta que el equipo defina esa pantalla) */}
                        <button
                            type="button"
                            className={`control-viaje__boton ${id === 'personalizar' && personalizarAbierto ? 'control-viaje__boton--activo' : ''}`}
                            aria-label={etiqueta}
                            aria-pressed={id === 'personalizar' ? !!personalizarAbierto : undefined}
                            onClick={id === 'personalizar' ? onPersonalizar : undefined}
                        >
                            <img src={icono} alt="" draggable={false} />
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}