import * as THREE from 'three';

// ============================================================================================
// Galaxias en teléfonos (< 768 px) de las páginas de Niño, Joven y Padre (Ninos.jsx, Jovenes.jsx, Padres.jsx).
//
// 1) DISTRIBUCIÓN (referencia de Figma, iPhone 14 / 15 Pro):
//                 [ Salud Física ]            <- arriba, centrada
//        [ Salud Mental ]   [ Salud Social ]  <- misma fila, izquierda y derecha
//               [ Peligros Digitales ]        <- abajo, centrada
//    Las tres páginas numeran sus galaxias igual: 0 = Social, 1 = Peligros Digitales, 2 = Física, 3 = Mental.
//    posicionesMovilFigma() devuelve las posiciones en ESE orden, calculadas con el tamaño real de la pantalla y
//    de la cámara de cada página (nada de coordenadas fijas), y la escala con la que caben sin amontonarse.
//
// 2) ASPECTO UNIFORME (la galaxia morada como referencia):
//    Cada galaxia tenía una inclinación fija distinta y la cámara las ve desde posiciones distintas: la de arriba se veía
//    casi de frente (redonda) y la de abajo aplastada. orientarGalaxiaMovil() calcula, para CADA galaxia, la inclinación
//    que hace que desde la cámara se vea siempre como un óvalo horizontal con la misma proporción (RELACION_OVALO).
//    No toca colores, partículas ni materiales, y el giro propio de cada galaxia sigue funcionando.
// ============================================================================================

// Posición de cada galaxia, como fracción de la pantalla (0,0 = arriba a la izquierda), medida en la referencia de Figma.
export const FIGMA_MOVIL = {
    fisica:    { x: 0.50, y: 0.31 },
    mental:    { x: 0.24, y: 0.50 },
    social:    { x: 0.76, y: 0.50 },
    digitales: { x: 0.50, y: 0.71 },
};
const ANCHO_GALAXIA = 0.36;    // ancho de cada galaxia como fracción del ancho de pantalla (en Figma ~0.35)
const ALTO_MAX_GALAXIA = 0.26; // y como máximo esta fracción del alto, para que no se toquen las filas

// Proporción alto/ancho con la que se ve cada galaxia en móvil: la de la galaxia morada de referencia (~0.35-0.4).
// 1 = redonda (de frente), más cerca de 0 = más aplastada.
export const RELACION_OVALO = 0.38;

// fov: campo de visión vertical de la cámara de la página; distancia: de la cámara al plano de las galaxias;
// radio: radio con el que la página dibuja cada galaxia; z: profundidad a la que están las galaxias.
export function posicionesMovilFigma({ fov, distancia, radio, z = 0 }) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const mitadAlto = Math.tan((fov * Math.PI) / 360) * distancia;
    const mitadAncho = mitadAlto * (W / H);
    const aMundo = (f) => ({ x: (f.x - 0.5) * 2 * mitadAncho, y: (0.5 - f.y) * 2 * mitadAlto, z });
    const diametro = Math.min(ANCHO_GALAXIA * 2 * mitadAncho, ALTO_MAX_GALAXIA * 2 * mitadAlto);
    return {
        // orden de las páginas: [Social, Digitales, Física, Mental]
        posiciones: [FIGMA_MOVIL.social, FIGMA_MOVIL.digitales, FIGMA_MOVIL.fisica, FIGMA_MOVIL.mental].map(aMundo),
        escala: Math.min(diametro / (2 * radio), 1),
    };
}

// Orienta una galaxia para que, vista desde la cámara, tenga la proporción RELACION_OVALO y su eje mayor horizontal.
//   eje 'z': la espiral está en el plano XY y gira con rotation.z   (Ninos.jsx)
//   eje 'y': la espiral está en el plano XZ y gira con rotation.y   (Jovenes.jsx y Padres.jsx)
// Hay que llamarla con la cámara ya colocada y cada vez que cambie la posición de la galaxia.
export function orientarGalaxiaMovil(galaxia, camara, eje) {
    const haciaCamara = new THREE.Vector3().subVectors(camara.position, galaxia.position).normalize();
    const arriba = new THREE.Vector3(0, 1, 0);
    const perp = arriba.clone().sub(haciaCamara.clone().multiplyScalar(arriba.dot(haciaCamara)));
    if (perp.lengthSq() < 1e-6) perp.set(0, 0, 1);
    perp.normalize();
    const psi = Math.acos(RELACION_OVALO);
    // Normal del disco: inclinada psi respecto a la vista, en el plano vertical (así el óvalo queda horizontal).
    // Se conserva el lado que ya mostraba cada página (Ninos: normal hacia abajo; Jovenes/Padres: hacia arriba).
    const lado = eje === 'z' ? -1 : 1;
    const n = haciaCamara.clone().multiplyScalar(Math.cos(psi)).add(perp.multiplyScalar(lado * Math.sin(psi)));
    if (eje === 'z') {
        // R = Rx(a)·Ry(b)·Rz(giro): la normal local Z queda en n; rotation.z sigue siendo el giro propio
        galaxia.rotation.order = 'XYZ';
        galaxia.rotation.set(Math.atan2(-n.y, n.z), Math.asin(THREE.MathUtils.clamp(n.x, -1, 1)), galaxia.rotation.z);
    } else {
        // R = Rz(c)·Rx(a)·Ry(giro): la normal local Y queda en n; rotation.y sigue siendo el giro propio
        galaxia.rotation.order = 'ZXY';
        galaxia.rotation.set(Math.asin(THREE.MathUtils.clamp(n.z, -1, 1)), galaxia.rotation.y, Math.atan2(-n.x, n.y));
    }
}

// Al volver a escritorio la página ya repone los ángulos originales de cada galaxia; solo hay que devolver el orden de rotación
export function restaurarGalaxia(galaxia) {
    galaxia.rotation.order = 'XYZ';
}