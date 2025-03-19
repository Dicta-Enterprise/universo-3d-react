import React from 'react';

const LeftArrow = () => (
    <svg
        width="24"
        height="24"
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

export default function BackButton({ color = '#ff0000', redirectUrl = "/"}) { // Color predeterminado: rojo
    const handleClick = () => {
        //window.history.back();
        window.location.href = redirectUrl;
    };

    return (
        <button
            style={{
                position: 'absolute',
                left: '20px',
                top: '20px',
                zIndex: '1000',
                fontSize: '24px',
                background: 'none',
                border: `2px solid ${color}`,
                color: color,
                cursor: 'pointer',
                padding: '12px 20px',
                borderRadius: '20px',
                boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
                transition: 'all 0.3s ease',
                textShadow: `0 0 3px ${color}`,
                transform: 'scale(1)', // Estado normal
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'; // Efecto hover
                e.currentTarget.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`; // Sombra más pronunciada
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'; // Volver al tamaño original
                e.currentTarget.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`; // Restaurar sombra
            }}
            onClick={handleClick}
        >
            <LeftArrow />
            <span style={{ marginLeft: '8px' }}>Atras</span>
        </button>
    );
}