import React from 'react';

// Fondo oficial del universo, común a las pantallas de galaxias (Ninos, Jovenes, Padres, Galaxia).
// Es UN solo archivo: public/assets/fondo-md-extend.png (el mismo que ya usa ThreeScene.jsx en Home).
// Va con position: fixed y z-index -1: queda detrás del canvas 3D (que debe ser transparente:
// renderer con alpha: true y scene.background = null), de los botones y de todo el contenido.
const FONDO_UNIVERSO = '/assets/fondo-md-extend.png';

export default function FondoUniverso() {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
                backgroundColor: '#222a6b', // mismo azul del body mientras carga la imagen
                backgroundImage: `url(${FONDO_UNIVERSO})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        />
    );
}
