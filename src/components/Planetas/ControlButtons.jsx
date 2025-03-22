import React from 'react';

// Componente SVG para la flecha izquierda
const LeftArrow = () => (
    <svg
        width="64" // Tamaño grande para coincidir con el estilo actual
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

// Componente SVG para la flecha derecha
const RightArrow = () => (
    <svg
        width="64" // Tamaño grande para coincidir con el estilo actual
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export default function ControlButtons({ onPrev, onNext, onViewMore, color = '#ff0000', clickSoundRef, planetSoundRef }) {
    // Estilo base para el botón central "Ver más"
    const centerButtonStyle = {
        fontSize: '24px',
        background: 'none',
        border: `2px solid ${color}`,
        color: color,
        cursor: 'pointer',
        padding: '12px 40px', // Más padding horizontal para que sea más ancho
        borderRadius: '20px',
        boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
        transition: 'all 0.3s ease',
        textShadow: `0 0 3px ${color}`,
        whiteSpace: 'nowrap', // Evita que el texto se divida en varias líneas
    };

    // Estilo para los botones de los costados
    const sideButtonStyle = {
        background: 'none',
        border: 'none', // Sin bordes
        color: '#ffffff', // Color blanco
        cursor: 'pointer',
        fontSize: '64px', // Tamaño muy grande para los iconos
        padding: '0', // Sin padding
        textShadow: `0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 20px ${color}`, // Efecto neón
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Efecto hover para los botones de los costados
    const handleSideButtonMouseOver = (e) => {
        e.currentTarget.style.transform = 'scale(1.2)'; // Crecimiento al hacer hover
        e.currentTarget.style.textShadow = `0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px ${color}`; // Efecto neón más intenso
    };

    const handleSideButtonMouseOut = (e) => {
        e.currentTarget.style.transform = 'scale(1)'; // Vuelve al tamaño original
        e.currentTarget.style.textShadow = `0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 20px ${color}`; // Efecto neón original
    };

    // Efecto hover para el botón central
    const handleCenterButtonMouseOver = (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        e.currentTarget.style.textShadow = `0 0 5px ${color}`;
    };

    const handleCenterButtonMouseOut = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        e.currentTarget.style.textShadow = `0 0 3px ${color}`;
    };

    // Función para manejar el clic y reproducir sonido
    const handleClick = (callback, soundRef) => {
        if (soundRef.current) {
            soundRef.current.play();
        }
        callback();
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center', // Alinea verticalmente los botones
                gap: '32px',
                pointerEvents: 'auto',
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000, // Asegúrate de que esté por encima de otros elementos
            }}
        >
            {/* Botón izquierdo (flecha izquierda) */}
            <button
                style={sideButtonStyle}
                onMouseOver={handleSideButtonMouseOver}
                onMouseOut={handleSideButtonMouseOut}
                onClick={() => handleClick(onPrev, clickSoundRef)}
            >
                <LeftArrow />
            </button>

            {/* Botón central "Ver más" */}
            <button
                style={centerButtonStyle}
                onMouseOver={handleCenterButtonMouseOver}
                onMouseOut={handleCenterButtonMouseOut}
                onClick={() => handleClick(onViewMore, planetSoundRef)}
            >
                Ingresar
            </button>

            {/* Botón derecho (flecha derecha) */}
            <button
                style={sideButtonStyle}
                onMouseOver={handleSideButtonMouseOver}
                onMouseOut={handleSideButtonMouseOut}
                onClick={() => handleClick(onNext, clickSoundRef)}
            >
                <RightArrow />
            </button>
        </div>
    );
}