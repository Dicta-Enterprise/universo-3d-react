import React from 'react';

const MainContent = ({ isMobile, onComprarClick }) => {
    return (
        <>
            <div style={{
                position: 'absolute',
                zIndex: 3,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                pointerEvents: 'none',
            }}>
                <h1 style={{
                    fontSize: '40px',
                    textAlign: 'center',
                    pointerEvents: 'auto',
                    position: 'absolute',
                    left: '50%',
                    top: '6%',
                    transform: 'translate(-50%, 0%)',
                }}>
                    Bienvenidos al Planeta KIO
                </h1>

                {/* Contenedor de Secciones */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: isMobile ? '12%' : '8%',
                    gap: isMobile ? '20px' : '400px', // Espaciado entre elementos DIVS
                }}>
                    {/* Resumen del Curso */}
                    <div style={{
                        fontSize: '20px',
                        backgroundColor: 'rgba(252, 107, 102, 0.32)',
                        padding: '24px',
                        borderRadius: '10px',
                        pointerEvents: 'auto',
                        maxWidth: '340px',
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        <h2>Resumen del Curso</h2>
                        <p>Este curso te llevará a través de los conceptos básicos y avanzados del planeta KIO, explorando su geografía, clima y desafíos únicos.</p>
                    </div>

                    {/* Beneficios */}
                    <div style={{
                        fontSize: '20px',
                        backgroundColor: 'rgba(252, 107, 102, 0.32)',
                        padding: '24px',
                        borderRadius: '10px',
                        pointerEvents: 'auto',
                        maxWidth: '340px',
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        <h2>Beneficios</h2>
                        <p>Al completar este curso, ganarás una comprensión profunda de KIO, habilidades prácticas para navegar sus desafíos y una certificación reconocida.</p>
                    </div>
                </div>
            </div>

            {/* Botón centrado en la pantalla */}
            <button onClick={onComprarClick} style={{
                position: 'absolute',
                left: '50%',
                top: '85%',
                transform: 'translate(-50%, -50%)',
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
                zIndex: 4,
            }}>
                Comprar
            </button>
        </>
    );
};

export default MainContent;
