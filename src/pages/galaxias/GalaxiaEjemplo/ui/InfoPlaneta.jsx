import React from 'react';

export default function InfoPlaneta({ text, color = '#ffffff' }) {
  return (
    <div
      className="InfoPlaneta"
      style={{
        fontSize: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '24px',
        margin: '32px',
        borderRadius: '10px',
        pointerEvents: 'auto',
        border: `2px solid ${color}`,
        boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
        color: 'white',
        textShadow: `0 0 3px ${color}`,
        zIndex: 1000,
      }}
      dangerouslySetInnerHTML={{
        __html: text.replace(/\n/g, '<br />'),
      }}
    />
  );
}
