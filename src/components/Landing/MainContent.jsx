import React, { useState, useEffect } from 'react';
import './styles.css'; // Importa el archivo CSS

const MainContent = ({ 
  isMobile, 
  onComprarClick, 
  planetaNombre, 
  resumenCurso, 
  beneficios, 
  peligros, 
  imagenResumen, 
  imagenBeneficios, 
  setShowCarousel 
}) => {
    const [showCarouselLocal, setShowCarouselLocal] = useState(false);

    // Efecto para detectar el scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollY + windowHeight >= documentHeight - 100) {
                setShowCarouselLocal(true);
                setShowCarousel(true);
            } else {
                setShowCarouselLocal(false);
                setShowCarousel(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [setShowCarousel]);

    return (
        <div style={{
            position: 'absolute',
            zIndex: 2,
            top: isMobile ? '0px' : '0px',
            bottom: isMobile ? '100px' : '120px',
            left: 0,
            width: '100%',
            minHeight: '84%',
            color: 'white',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            marginBottom: isMobile ? '900px' : '900px',
        }}>
            {/* Título del Planeta */}
            <h1 style={{    
                position: 'relative',
                fontSize: isMobile ? '44px' : '56px',
                paddingTop: '32px',
                textAlign: 'center',
                marginBottom: '800px',
                color: '#ffffff',
                textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)',
            }}>
                🚀 Bienvenidos al Planeta {planetaNombre} 🪐
            </h1>

            {/* Primer bloque: Resumen del Curso + Imagen */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: isMobile ? '20px' : '40px',
                marginBottom: '60px',
                marginTop: isMobile ? '20px' : '40px',
                gap: isMobile ? '20px' : '40px',
                boxSizing: 'border-box',
            }}>
                <img
                    src={imagenResumen}
                    alt="Imagen del Resumen"
                    style={{
                        width: isMobile ? '100%' : '40%',
                        maxWidth: '100%',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    }}
                />
                
                <div className="rgb-border" style={{
                    fontSize: isMobile ? '22px' : '32px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '24px',
                    borderRadius: '10px',
                    width: isMobile ? '100%' : '50%',
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    border: '1px solid transparent',
                    boxSizing: 'border-box',
                }}>
                    <h2 style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>📖 Resumen del Curso</h2>
                    <p>{resumenCurso}</p>
                </div>
            </div>

            {/* Segundo bloque: Riesgos */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: isMobile ? '20px' : '40px',
                marginBottom: '60px',
                gap: '20px',
                boxSizing: 'border-box',
            }}>
                <div className="rgb-border" style={{
                    fontSize: isMobile ? '22px' : '32px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '24px',
                    borderRadius: '10px',
                    width: '100%',
                    maxWidth: '1000px',
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    border: '1px solid transparent',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                }}>
                    <h2 style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>⚠️ Riesgos del Planeta {planetaNombre}</h2>
                    <p>
                        El planeta es un lugar fascinante, pero también está lleno de peligros. A continuación,
                        te presentamos algunos de los riesgos más importantes que debes conocer antes de explorar este
                        increíble mundo. 🌌
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                    boxSizing: 'border-box',
                }}>
                    {peligros.map((peligro, index) => (
                        <div key={index} className="rgb-border" style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            padding: '24px',
                            borderRadius: '10px',
                            width: isMobile ? '100%' : '30%',
                            boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                            border: '1px solid transparent',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            fontSize: isMobile ? '22px' : '28px',
                            minHeight: isMobile ? '22px' : '660px',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 0, 153, 0.8)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.5)';
                        }}
                        >
                            <h2 style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>{peligro.nombre}</h2>
                            <p><strong>📝 Descripción:</strong> {peligro.descripcion}</p>
                            <p><strong>🚨 Nivel de Riesgo:</strong> {peligro.nivelRiesgo}</p>
                            <p><strong>🌡️ Temperatura:</strong> {peligro.temperatura}</p>
                            <p><strong>👹 Villano:</strong> {peligro.villano}</p>
                            <button className="rgb-border" style={{
                                background: 'none',
                                color: '#ffffff',
                                fontSize: '16px',
                                cursor: 'pointer',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                marginTop: '20px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 0 10px rgba(255, 0, 153, 0.5)',
                                textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.8)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 153, 0.5)';
                            }}
                            >
                                {peligro.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tercer bloque: Imagen + Beneficios */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: isMobile ? '20px' : '40px',
                marginBottom: '60px',
                gap: isMobile ? '20px' : '40px',
                boxSizing: 'border-box',
            }}>
                <img
                    src={imagenBeneficios}
                    alt="Imagen de Beneficios"
                    style={{
                        width: isMobile ? '100%' : '40%',
                        maxWidth: '100%',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    }}
                />

                <div className="rgb-border" style={{
                    fontSize: isMobile ? '20px' : '24px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '24px',
                    borderRadius: '10px',
                    width: isMobile ? '100%' : '50%',
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)',
                    border: '1px solid transparent',
                    boxSizing: 'border-box',
                }}>
                    <h2 style={{ fontSize: '40px', marginBottom: '20px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>🌟 Beneficios</h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}>
                        {beneficios.map((beneficio, index) => (
                            <div key={index} className="rgb-border" style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                padding: '16px',
                                borderRadius: '8px',
                                boxShadow: '0 0 10px rgba(255, 0, 153, 0.3)',
                                border: '1px solid transparent',
                                boxSizing: 'border-box',
                            }}>
                                <h3 style={{ fontSize: '32px', marginBottom: '10px', color: '#ffffff', textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)' }}>{beneficio.titulo}</h3>
                                <p>{beneficio.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Botón de Comprar */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '20px',
                marginBottom: '120px',
                boxSizing: 'border-box',
            }}>
                <button onClick={onComprarClick} className="rgb-border" style={{
                    fontSize: '24px',
                    background: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '12px 40px',
                    borderRadius: '12px',
                    boxShadow: '0 0 10px rgba(255, 0, 153, 0.5)',
                    textShadow: '0 0 10px rgb(255, 0, 0), 0 0 20px rgb(255, 0, 0)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.8)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 153, 0.5)';
                }}
                >
                    🛒 Agregar al Carrito
                </button>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '24px',
                textAlign: 'center',
                color: '#ffffff',
                textShadow: '0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.5)',
                marginTop: '40px',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(5px)',
                boxShadow: '0 -5px 15px rgba(255, 0, 0, 0.3)',
                border: 'none',
                borderTop: '1px solid rgba(255, 0, 0, 0.2)',
            }}>
                <p style={{ 
                    margin: '0', 
                    fontSize: isMobile ? '24px' : '28px',
                    fontWeight: '300',
                }}>
                    © 2023 Exploración Espacial Mundo Dictario. Todos los derechos reservados.
                </p>
                <p style={{ 
                    margin: '10px 0 0', 
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: '300',
                }}>
                    Desarrollado con ❤️ por el equipo de Mundo Dictario.
                </p>
            </footer>
        </div>
    );
};

export default MainContent;