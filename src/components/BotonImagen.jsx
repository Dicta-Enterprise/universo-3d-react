import React from 'react';

// ============================================================================================
// Botón cuya cara es una imagen ya hecha (public/assets/...). Es un <button> real: se puede pulsar con
// mouse, toque y teclado (Enter/Espacio), tiene foco visible y etiqueta accesible. La imagen conserva su
// proporción (width 100%, height auto) y NO lleva texto aparte: si el dibujo ya tiene texto, no se duplica.
// Cada uso decide su propia acción con `onClick`; este componente no hace nada por sí mismo.
//
//   <BotonImagen src="/assets/estrella.png" etiqueta="..." onClick={...} className="..." />
//
// Props: src, etiqueta (aria-label), onClick, className (posición/tamaño de cada uso), pressed (opcional: botón
// de alternar), title (opcional), sinSonido (opcional: el que lo usa ya reproduce su propio sonido).
// Estilos (.boton-imagen: hover, active y foco) en styles.css.
// ============================================================================================
export default function BotonImagen({ src, etiqueta, onClick, className = '', pressed, title, sinSonido = false }) {
    return (
        <button
            type="button"
            className={`boton-imagen ${className}`}
            onClick={onClick}
            aria-label={etiqueta}
            aria-pressed={pressed}
            title={title}
            data-sin-sonido={sinSonido ? '' : undefined}
        >
            <img src={src} alt="" draggable={false} />
        </button>
    );
}
