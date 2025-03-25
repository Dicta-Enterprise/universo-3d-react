import React from 'react';

export default function ResumenBeneficios({ isMobile }) {
    return (
        <>
            {/* Div de Resumen del Curso */}
            <div
                style={{
                    position: isMobile ? 'static' : 'absolute',
                    fontSize: '20px',
                    backgroundColor: 'rgba(252, 107, 102, 0.32)',
                    padding: '24px',
                    margin: isMobile ? '20px 0' : '32px',
                    borderRadius: '10px',
                    pointerEvents: 'auto',
                    maxWidth: '340px',
                    width: '100%',
                    left: isMobile ? '0' : '10%',
                    top: isMobile ? '0' : '50%',
                    transform: isMobile ? 'none' : 'translateY(-50%)',
                }}
            >
                <h2>Resumen del Curso</h2>
                <p>
                    Este curso te llevará a través de los conceptos básicos y avanzados del planeta KIO, explorando su geografía, clima, y los desafíos únicos que presenta.
                </p>
            </div>

            {/* Botón Comprar */}
            <button
                style={{
                    fontSize: '24px',
                    background: 'none',
                    border: '2px solid #FFFFFF',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    padding: '12px 40px',
                    borderRadius: '12px',
                    boxShadow: '0 0 5px #FFFFFF, 0 0 10px #FFFFFF',
                    transition: 'all 0.3s ease',
                    textShadow: '0 0 3px #FFFFFF',
                    marginTop: '10px',
                    pointerEvents: 'auto',
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 0 10px #FFFFFF, 0 0 20px #FFFFFF';
                    e.target.style.textShadow = '0 0 5px #FFFFFF';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 0 5px #FFFFFF, 0 0 10px #FFFFFF';
                    e.target.style.textShadow = '0 0 3px #FFFFFF';
                }}
                onClick={() => {
                    window.location.href = ''; // Redirigir a la página de compra
                }}
            >
                Comprar
            </button>

            {/* Div de Beneficios */}
            <div
                style={{
                    position: isMobile ? 'static' : 'absolute',
                    fontSize: '20px',
                    backgroundColor: 'rgba(252, 107, 102, 0.32)',
                    padding: '24px',
                    margin: isMobile ? '20px 0' : '32px',
                    borderRadius: '10px',
                    pointerEvents: 'auto',
                    maxWidth: '340px',
                    width: '100%',
                    left: isMobile ? '0' : '90%',
                    top: isMobile ? '0' : '50%',
                    transform: isMobile ? 'none' : 'translate(-100%, -50%)',
                }}
            >
                <h2>Beneficios</h2>
                <p>
                    Al completar este curso, ganarás una comprensión profunda de KIO, habilidades prácticas para navegar sus desafíos, y una certificación reconocida.
                </p>
            </div>
        </>
    );
}