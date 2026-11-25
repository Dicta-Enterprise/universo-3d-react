// ============================================================================================
// Bloqueo de scroll COMPARTIDO (un solo lugar para todo lo que necesite congelar la página):
//   - Home: mientras se escriben los textos introductorios (clave "escritura")
//   - RocketCards: mientras el modal de la nave está abierto (clave "modal")
//   - SpaceJourney: desde que se elige una galaxia hasta que el cohete entra (clave "galaxia")
//
// Cada uso pide el bloqueo con su propia clave. La página queda bloqueada mientras HAYA alguna clave
// activa y se libera sola cuando la última se libera: así dos usos a la vez no se pisan.
//
// Cómo bloquea: overflow: hidden en <html> (no se mueve con rueda, teclado, gestos táctiles ni barra
// de scroll) y scrollbar-gutter: stable para que la página no "salte" al desaparecer la barra.
// La posición del scroll se conserva y se restaura al liberar. Además, mientras está bloqueado se
// cancela el arrastre táctil (touchmove) solo fuera de campos de texto, para los navegadores móviles
// que ignoran overflow: hidden en <html>. NO es un preventDefault global: wheel y teclas no se tocan.
//
// Salida segura: cada bloqueo trae un tiempo máximo (maxMs). Si algo falla y nadie lo libera, se
// libera solo: el usuario nunca queda atrapado.
// ============================================================================================

const activos = new Map(); // clave -> id del temporizador de seguridad
let guardado = null;       // estilos y posición previos al bloqueo

function alTocar(evento) {
    if (!evento.cancelable) return;
    const objetivo = evento.target;
    if (objetivo && objetivo.closest && objetivo.closest('input, textarea, select, [data-scroll-permitido]')) return;
    evento.preventDefault();
}

function aplicar() {
    const html = document.documentElement;
    guardado = {
        overflow: html.style.overflow,
        gutter: html.style.scrollbarGutter,
        y: window.scrollY,
    };
    html.style.overflow = 'hidden';
    html.style.scrollbarGutter = 'stable';
    window.addEventListener('touchmove', alTocar, { passive: false });
}

function restaurar() {
    const html = document.documentElement;
    window.removeEventListener('touchmove', alTocar);
    if (!guardado) return;
    html.style.overflow = guardado.overflow;
    html.style.scrollbarGutter = guardado.gutter;
    // Defensa: si algún navegador movió la página mientras estaba bloqueada, vuelve a donde estaba
    if (Math.abs(window.scrollY - guardado.y) > 1) window.scrollTo(0, guardado.y);
    guardado = null;
}

export function bloquearScroll(clave, { maxMs = 15000 } = {}) {
    if (typeof document === 'undefined') return;
    if (activos.has(clave)) clearTimeout(activos.get(clave));
    const id = setTimeout(() => liberarScroll(clave), maxMs); // salida segura
    const yaBloqueado = activos.size > 0;
    activos.set(clave, id);
    if (!yaBloqueado) aplicar();
}

export function liberarScroll(clave) {
    if (!activos.has(clave)) return;
    clearTimeout(activos.get(clave));
    activos.delete(clave);
    if (activos.size === 0) restaurar();
}
