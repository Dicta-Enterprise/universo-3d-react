import React from 'react';

export default function BackButton({color , background}) { // Color predeterminado: rojo
    const handleClick = () => {
        window.history.back();
    };

    return (
        <button
            style={{
                position: 'absolute',
                left: '20px',
                top: '20px',
                zIndex: '1000',
                fontSize: '20px',
                background: background,
                border: `2px solid ${color}`,
                color: color,
                cursor: 'pointer',
                padding: '12px 20px',
                borderRadius: '20px',
                boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
                transition: 'all 0.3s ease',
                textShadow: `0 0 3px ${color}`,
                transform: 'scale(1)', // Estado normal
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'; // Efecto hover
                e.currentTarget.style.boxShadow = `0 0 5px ${color}, 0 0 5px ${color}`; // Sombra más pronunciada
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'; // Volver al tamaño original
                e.currentTarget.style.boxShadow = `0 0 5px ${color}, 0 0 5px ${color}`; // Restaurar sombra
            }}
            onClick={handleClick}
        >
            ← Regresar
        </button>
    );
}