import React from 'react';

const LeftArrow = () => (
    <svg
        width="16"
        height="16"
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

export default function BackButton({ color = '#ff0000', redirectUrl = "/" }) {
    const handleClick = () => {
        window.location.href = redirectUrl;
    };

    return (
        <button
            style={{
                position: 'fixed', // Cambiado de 'absolute' a 'fixed'
                left: '20px',
                top: '20px',
                zIndex: '1000',
                fontSize: '14px',
                background: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
                border: `2px solid ${color}`,
                color: color,
                cursor: 'pointer',
                padding: '10px 16px',
                borderRadius: '20px',
                boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
                transition: 'all 0.3s ease',
                textShadow: `0 0 3px ${color}`,
                transform: 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)', // Efecto de desenfoque para mejor legibilidad
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'; // Fondo más oscuro al hacer hover
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            }}
            onClick={handleClick}
        >
            <LeftArrow />
            <span style={{ marginLeft: '8px' }}>Atras</span>
        </button>
    );
}