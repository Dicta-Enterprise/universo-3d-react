import React from 'react';
import BotonImagen from './BotonImagen';

export default function BackButton({ color = '#ff0000', redirectUrl = "/" }) {
    const handleClick = () => {
        window.location.href = redirectUrl;
    };

    // Figma: el botón es la imagen ya diseñada (public/assets/Boton-regresar.png). Estilos: .boton-volver-galaxias en styles.css
    return (
        <BotonImagen
            className="boton-volver-galaxias"
            src="/assets/Boton-regresar.png"
            etiqueta="Volver a galaxias"
            onClick={handleClick}
        />
    );
}