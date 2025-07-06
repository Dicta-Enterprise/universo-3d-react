import React from 'react';

export default function BotonFlecha({ direccion = 'izquierda', onClick, color = '#ffffff' }) {
  const icono = direccion === 'izquierda' ? (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ) : (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  return (
    <button
      className="boton-flecha"
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.2)';
        e.currentTarget.style.textShadow = `0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px ${color}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.textShadow = `0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 20px ${color}`;
      }}
      style={{
        color: color,
        textShadow: `0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 20px ${color}`,
      }}
    >
      {icono}
    </button>
  );
}