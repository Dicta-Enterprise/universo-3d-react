import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const LeftArrow = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export default function BotonAtras({ color = '#ffffff', className = '', style = {} }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const dynamicStyle = {
    color: color,
    border: `2px solid ${color}`,
    boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
    textShadow: `0 0 3px ${color}`,
    background: 'rgba(0, 0, 0, 0.5)',
    ...style,
  };

  const handleClick = () => {
    // Si estás en una ruta con grupo y tema, volvés al grupo
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'galaxia' && pathParts.length >= 4) {
      const grupo = pathParts[2];
      navigate(`/galaxia/${grupo}`);
    } else {
      navigate('/'); // Fallback general si no está dentro de /galaxia
    }
  };

  return (
    <button className={`boton-atras ${className}`} style={dynamicStyle} onClick={handleClick}>
      <LeftArrow color={color} />
      <span style={{ marginLeft: '8px' }}>Atrás</span>
    </button>
  );
}