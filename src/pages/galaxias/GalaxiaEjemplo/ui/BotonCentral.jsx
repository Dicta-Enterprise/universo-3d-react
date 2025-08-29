import React from 'react';

export default function BotonCentral({ onClick, color = '#ffffff', textoColor = '#ffffff', texto = 'Ingresar' }) {
  return (
    <button
      className="boton-central"
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        e.currentTarget.style.textShadow = `0 0 5px ${color}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        e.currentTarget.style.textShadow = `0 0 3px ${color}`;
      }}
      style={{
        border: `2px solid ${color}`,
        color: textoColor,
        boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
        textShadow: `0 0 3px ${textoColor}`,
      }}
    >
      {texto}
    </button>
  );
}