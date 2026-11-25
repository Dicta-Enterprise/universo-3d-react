import React, { useState, useCallback } from 'react';
import IconoMundoGirando from './IconoMundoGirando';
import { establecerSonidoActivo, estaSonidoActivo } from './sonidos';

// ============================================================================================
// Controles de la esquina superior derecha: Música -> Sonido -> logotipo de Mundo Dictariano.
// Es el MISMO componente en todas las pantallas (Home y las páginas de Niño, Joven y Padre), así
// no puede haber diferencias de aspecto ni de comportamiento. Los estilos son los de siempre
// (.iconos-esquina, .icono-esquina-btn, .icono-mundo-slot en styles.css).
//
//   Música : activa/desactiva el icono (todavía no hay una pista de fondo conectada).
//   Sonido : interruptor GLOBAL de todos los audios (ver sonidos.js); su preferencia se guarda.
//
// Props (todas opcionales):
//   barraRef     ref de la barra (Home la usa para colocar los botones de Historia y Personalización)
//   children     elementos que van ANTES de música (Home: los huecos de esos dos botones)
//   mundoAbierto false = el logotipo aparece más tarde (Home lo abre en la fase 2); por defecto visible
// ============================================================================================
export default function ControlesSuperiores({ barraRef, children, mundoAbierto = true }) {
    const [musicaActiva, setMusicaActiva] = useState(true);
    const [sonidoActivo, setSonidoActivo] = useState(() => estaSonidoActivo());

    const alternarSonido = useCallback(() => {
        const nuevo = !estaSonidoActivo();
        establecerSonidoActivo(nuevo); // si es silencio, corta ya todo lo que suene
        setSonidoActivo(nuevo);        // solo cambia el aspecto del icono
    }, []);

    return (
        <div className="iconos-esquina" ref={barraRef}>
            {children}
            <button
                type="button"
                className="icono-esquina-btn"
                onClick={() => setMusicaActiva((v) => !v)}
                aria-pressed={musicaActiva}
                aria-label={musicaActiva ? 'Apagar música' : 'Encender música'}
            >
                <img src="/assets/icons/icono-musica.png" alt="" className={musicaActiva ? '' : 'icono-esquina-apagado'} />
            </button>
            <button
                type="button"
                className="icono-esquina-btn"
                onClick={alternarSonido}
                data-sin-sonido
                aria-pressed={sonidoActivo}
                aria-label={sonidoActivo ? 'Silenciar sonido' : 'Activar sonido'}
            >
                <img src="/assets/icons/icono-sonido.png" alt="" className={sonidoActivo ? '' : 'icono-esquina-apagado'} />
            </button>
            {/* Logotipo: esfera giratoria fija en esta fila */}
            <div className={`icono-mundo-slot ${mundoAbierto ? 'icono-mundo-slot--abierto' : ''}`}>
                {mundoAbierto && <IconoMundoGirando />}
            </div>
        </div>
    );
}
