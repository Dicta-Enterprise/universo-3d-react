import React, { useEffect, useRef } from 'react';
import './SpaceJourney.css';
import { getJourney } from './journey';

// ============================================================================================
// Capas HTML de la secuencia: Frutia + globo y el fundido final que lleva a la
// página de la etapa elegida (/ninos, /jovenes o /padres), donde está la galaxia de esa etapa.
// El cohete NO está aquí: es el mismo modelo 3D de ThreeScene.jsx. Nada usa setState al hacer
// scroll: un requestAnimationFrame lee window.scrollY y escribe opacity/transform por refs.
// ============================================================================================

const FRUTIA_IMG = '/assets/nino-astronauta.webp';          // ilustración que ya existe (la del niño); se recorta a la cara
const MENSAJE_FRUTIA = 'Hemos detectado cuatro galaxias. Cada una esconde desafíos diferentes. ¿Por cuál comenzamos?';

export default function SpaceJourney({ startY, rutaBase, cardsLayerRef, demoLayerRef }) {
    const frutiaRef = useRef(null);
    const estrellasRef = useRef(null);
    const fundidoRef = useRef(null);

    useEffect(() => {
        const reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        let navegando = false;

        const tick = () => {
            raf = requestAnimationFrame(tick);
            const j = getJourney(window.scrollY, startY, window.innerHeight);

            // 1. Salida: tarjetas (con sus botones) y demo de personalización se desvanecen
            [cardsLayerRef, demoLayerRef].forEach((ref) => {
                const el = ref && ref.current;
                if (!el) return;
                const o = 1 - j.salida;
                el.style.opacity = String(o);
                el.style.visibility = o < 0.02 ? 'hidden' : '';
            });

            // 1b. Estrellas en movimiento (sensación de viaje): aparecen mientras el cohete sube a su lugar
            if (estrellasRef.current) {
                const el = estrellasRef.current;
                el.style.opacity = String(j.salida);
                el.style.visibility = j.salida < 0.01 ? 'hidden' : 'visible';
            }

            // 2. Frutia: aparece y se queda hasta el fundido
            const a = j.dialogoIn;
            if (frutiaRef.current) {
                const el = frutiaRef.current;
                el.style.opacity = String(a);
                el.style.visibility = a < 0.01 ? 'hidden' : 'visible';
                el.style.transform = `translate3d(0, ${reducir ? 0 : (1 - j.dialogoIn) * 24}px, 0)`;
            }

            // 3. Continuación: fundido a oscuro y paso a la página de la etapa elegida. La página empieza a
            // oscuras (llegadaCohete.js): el cohete llega desde la oscuridad y un destello revela la galaxia.
            if (fundidoRef.current) fundidoRef.current.style.opacity = String(j.continuar);
            if (j.continuar >= 0.995 && !navegando) {
                navegando = true;
                window.location.href = rutaBase; // mismo mecanismo que usa el proyecto (/ninos, /jovenes, /padres)
            }
        };
        tick();

        return () => {
            cancelAnimationFrame(raf);
            [cardsLayerRef, demoLayerRef].forEach((ref) => {
                const el = ref && ref.current;
                if (el) { el.style.opacity = ''; el.style.visibility = ''; }
            });
        };
    }, [startY, rutaBase, cardsLayerRef, demoLayerRef]);

    return (
        <>
            <div className="viaje-estrellas" ref={estrellasRef} aria-hidden="true">
                <div className="viaje-estrellas__capa viaje-estrellas__capa--lejos" />
                <div className="viaje-estrellas__capa viaje-estrellas__capa--medio" />
                <div className="viaje-estrellas__capa viaje-estrellas__capa--cerca" />
            </div>

            <div className="viaje-frutia" ref={frutiaRef} style={{ '--frutia-img': `url(${FRUTIA_IMG})` }}>
                <div className="viaje-frutia__avatar" role="img" aria-label="Frutia" />
                <div className="viaje-frutia__globo"><p>{MENSAJE_FRUTIA}</p></div>
            </div>

            <div className="viaje-fundido" ref={fundidoRef} aria-hidden="true" />
        </>
    );
}