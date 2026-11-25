import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotonImagen from './BotonImagen';

// Botón "Volver a roles" de las pantallas de galaxias (Niño, Joven y Padre): vuelve a la pantalla donde se
// eligen los cohetes. Usa la navegación de React Router (sin recargar la página) y le avisa a Home, con un
// estado de ruta, que debe aparecer ya en la selección (tarjetas y cohetes) y no en la portada.
// Imagen: public/assets/volver-a-roles.png
export default function VolverARoles() {
    const navigate = useNavigate();
    return (
        <BotonImagen
            className="boton-volver-roles"
            src="/assets/volver-a-roles.png"
            etiqueta="Volver a roles"
            onClick={() => navigate('/', { state: { seleccion: true } })}
        />
    );
}
