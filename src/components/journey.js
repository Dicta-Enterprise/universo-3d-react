// ============================================================================================
// Línea de tiempo ÚNICA de la secuencia narrativa (después de cerrar el modal de la nave).
// La leen ThreeScene.jsx (cohete) y SpaceJourney.jsx (capas HTML), así nunca se desfasan.
// Todo se mide en píxeles de scroll desde `startY` (el scroll al cerrar el modal).
//   Tramo 1 (0 .. rangoInicial): el cohete gira, desciende y llega al centro (ThreeScene).
//   Después, en "unidades" u = max(alto de pantalla, 500px):  ver TRAMOS.
// Al final del recorrido se pasa a la página de la etapa elegida: ahí vive su galaxia (ver llegadaCohete.js).
// ============================================================================================
// Cohete en el viaje (Frame 5): arriba al centro y pequeño
export const VIAJE_Y = 0.24;          // centro del cohete a 24% del alto de la pantalla
export const VIAJE_ALTO_H = 0.2;      // alto del cohete = 20% del alto (sin pasar del 40% del ancho)

// Tramos en unidades u, contadas desde que el cohete llega al centro
export const TRAMOS = {
    SALIDA: [0, 0.6],         // tarjetas, cohetes no elegidos y demo se desvanecen; el cohete sube y se achica
    DIALOGO_IN: [1.0, 1.2],   // aparece Frutia (se queda hasta el fundido)
    CONTINUAR: [2.3, 2.9],    // fundido a oscuro y paso a la página de la etapa elegida (/ninos, /jovenes, /padres)
};
// Para que el traslado tarde más/menos de scroll, cambia los números de CONTINUAR (y TOTAL_U igual a su segundo valor)
export const TOTAL_U = 2.9;   // fin de la secuencia (para el alto del espaciador de scroll)

const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const suave = (t) => t * t * (3 - 2 * t);

export const unidad = (H) => Math.max(H, 500);
export const rangoInicial = (H) => Math.max(H * 1.2, 500); // debe coincidir con el espaciador de Home.jsx

export function altoViaje(W, H) {
    return Math.min(H * VIAJE_ALTO_H, W * 0.4);
}

// Progreso de cada etapa (0..1) para un scroll dado
export function getJourney(scrollY, startY, H) {
    const u = unidad(H);
    const r1 = rangoInicial(H);
    const d = Math.max(scrollY - startY, 0);
    const q = (d - r1) / u;
    const tramo = ([a, b]) => clamp01((q - a) / (b - a));
    return {
        d,
        p: clamp01(d / r1),
        viajePx: Math.max(d - r1, 0),
        salida: suave(tramo(TRAMOS.SALIDA)),
        dialogoIn: suave(tramo(TRAMOS.DIALOGO_IN)),
        continuar: tramo(TRAMOS.CONTINUAR),
    };
}