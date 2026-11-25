import * as THREE from 'three';
import { RELACION_OVALO } from './disposicionMovil';

// ============================================================================================
// Etiquetas verdes de las 4 galaxias (Figma: "Galaxia Salud Física", etc.), debajo de cada una.
// Sustituyen al cuadro central "¿A dónde vamos a ir hoy?": ahora cada galaxia se reconoce por su etiqueta y se
// elige pulsando la galaxia o su etiqueta. Se crean una vez por página, siguen a la galaxia en pantalla
// (proyectando su posición 3D en cada frame: no hay posiciones fijas) y aparecen cuando la intro termina.
// Los textos van en el orden de numeración de las páginas: 0 Social, 1 Peligros Digitales, 2 Física, 3 Mental.
// ============================================================================================
export const NOMBRES_GALAXIAS = [
    ['Galaxia', 'Salud Social'],
    ['Galaxia', 'Peligros Digitales'],
    ['Galaxia', 'Salud Física'],
    ['Galaxia', 'Salud Mental'],
];

function radioGalaxia(g) {
    const geo = g.geometry;
    if (geo && !geo.boundingSphere) geo.computeBoundingSphere();
    return (geo && geo.boundingSphere ? geo.boundingSphere.radius : 5) * (g.scale ? g.scale.x : 1);
}

// camera, getGalaxias: la escena de la página. onElegir(i): se llama al pulsar una etiqueta.
// puedeMostrar(): true cuando ya se pueden elegir galaxias (termina la llegada del cohete).
export function crearEtiquetasGalaxias({ camera, getGalaxias, onElegir, puedeMostrar }) {
    let bloqueado = false;
    let claveMedida = '';   // tamaño de letra/pantalla con el que se midieron las etiquetas por última vez
    const punto = new THREE.Vector3();
    const botones = NOMBRES_GALAXIAS.map((lineas, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', lineas.join(' '));
        lineas.forEach((texto, k) => {
            if (k) b.appendChild(document.createElement('br'));
            b.appendChild(document.createTextNode(texto));
        });
        Object.assign(b.style, {
            position: 'fixed', left: '0', top: '0', zIndex: '3',
            background: '#33ff66', color: '#0a2f12', border: 'none', borderRadius: '14px',
            padding: '0.45em 0.9em', fontFamily: "'Fredoka', sans-serif", fontWeight: '700',
            lineHeight: '1.15', textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer', boxSizing: 'border-box',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.35)',
            opacity: '0', pointerEvents: 'none', willChange: 'transform',
            transition: 'opacity 0.6s ease',
        });
        b.addEventListener('click', () => { if (!bloqueado) onElegir(i); });
        document.body.appendChild(b);
        return b;
    });

    // Las 4 etiquetas miden lo mismo: el ancho y alto de la más grande ("Galaxia Peligros Digitales"). Se vuelve a medir solo
    // cuando cambia el tamaño de letra (pantalla) o cuando termina de cargar la fuente; no en cada frame.
    function igualarTamanos(tamano) {
        const clave = tamano + '|' + window.innerWidth;
        if (clave === claveMedida) return;
        claveMedida = clave;
        botones.forEach((b) => { b.style.fontSize = tamano; b.style.width = ''; b.style.height = ''; });
        const ancho = Math.max(...botones.map((b) => b.offsetWidth));
        const alto = Math.max(...botones.map((b) => b.offsetHeight));
        botones.forEach((b) => { b.style.width = ancho + 'px'; b.style.height = alto + 'px'; });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { claveMedida = ''; });

    function actualizar() {
        const gs = getGalaxias();
        const W = window.innerWidth;
        const H = window.innerHeight;
        const movil = W < 768;
        const mostrar = puedeMostrar();
        const tamano = movil ? 'clamp(0.62rem, 3.1vw, 0.95rem)' : 'clamp(0.8rem, 1.1vw, 1rem)';
        igualarTamanos(tamano);
        for (let i = 0; i < botones.length; i++) {
            const b = botones[i];
            const g = gs[i];
            if (!g || g.visible === false) { b.style.opacity = '0'; b.style.pointerEvents = 'none'; continue; }
            // la etiqueta va justo debajo del borde inferior de la galaxia (su óvalo: ~RELACION_OVALO del ancho en móvil)
            const mitadAlto = radioGalaxia(g) * (movil ? RELACION_OVALO : 0.6);
            punto.set(g.position.x, g.position.y - mitadAlto, g.position.z).project(camera);
            const px = (punto.x * 0.5 + 0.5) * W;
            const py = (-punto.y * 0.5 + 0.5) * H;
            b.style.fontSize = tamano;
            b.style.transform = `translate3d(${px}px, ${py + 8}px, 0) translateX(-50%)`;
            b.style.opacity = mostrar ? '1' : '0';
            b.style.pointerEvents = mostrar && !bloqueado ? 'auto' : 'none';
        }
    }

    // Al elegir una galaxia las etiquetas siguen visibles pero ya no reciben clics (evita elecciones dobles)
    function bloquear() { bloqueado = true; }

    function dispose() { botones.forEach((b) => b.remove()); }

    return { actualizar, bloquear, dispose };
}