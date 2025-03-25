import React, { useState, useEffect } from 'react';
import './styles.css'; // Importa el archivo CSS

const MainContent = ({ isMobile, onComprarClick, planetaNombre, resumenCurso, beneficios, imagenResumen, imagenBeneficios, setShowCarousel }) => {
    const [showCarouselLocal, setShowCarouselLocal] = useState(false); // Estado local para controlar la visibilidad del carrusel

    // Información de los peligros del planeta Kio
    const peligros = [
        {
            nombre: "🌐 Ciberbullying",
            descripcion: "🛑 Acoso virtual que puede llevar a la víctima a sufrir daños emocionales y psicológicos.",
            nivelRiesgo: "🔴 Alto",
            temperatura: "🌡️ -30°C a 127°C",
            villano: "👾 Ciberbull",
            cta: "🚀 Visita al planeta KIO",
        },
        {
            nombre: "🌪️ Tormentas de arena eléctricas",
            descripcion: "⚡ Fenómenos climáticos extremos que pueden dañar equipos y estructuras.",
            nivelRiesgo: "🟠 Medio",
            temperatura: "🌡️ -50°C a 150°C",
            villano: "🌀 Electrostorm",
            cta: "🚀 Visita al planeta KIO",
        },
        {
            nombre: "🌧️ Lluvias ácidas",
            descripcion: "☣️ Precipitaciones corrosivas que afectan el ambiente y la salud.",
            nivelRiesgo: "🔴 Alto",
            temperatura: "🌡️ -20°C a 100°C",
            villano: "☠️ Acidrain",
            cta: "🚀 Visita al planeta KIO",
        },
        {
            nombre: "💨 Falta de oxígeno",
            descripcion: "🫁 Atmósfera delgada que requiere equipos especiales para respirar.",
            nivelRiesgo: "⚫ Crítico",
            temperatura: "🌡️ -70°C a 80°C",
            villano: "🌫️ Oxyvoid",
            cta: "🚀 Visita al planeta KIO",
        },
        {
            nombre: "☢️ Radiación solar extrema",
            descripcion: "⚠️ Altos niveles de radiación que pueden dañar la piel y los equipos.",
            nivelRiesgo: "🔴 Alto",
            temperatura: "🌡️ -10°C a 120°C",
            villano: "☀️ Radstorm",
            cta: "🚀 Visita al planeta KIO",
        }
    ];

    // Array de beneficios (puede venir como prop o definirse aquí)
    const beneficiosArray = [
        {
            titulo: "📚 Comprensión profunda de Kio",
            descripcion: "🪐 Conoce todos los detalles sobre este fascinante planeta.",
        },
        {
            titulo: "🛠️ Habilidades prácticas",
            descripcion: "🧭 Aprende a navegar y sobrevivir en los desafíos únicos de Kio.",
        },
        {
            titulo: "📜 Certificación reconocida",
            descripcion: "🎓 Obtén un certificado que valide tus conocimientos.",
        },
        {
            titulo: "🗺️ Acceso a recursos exclusivos",
            descripcion: "🔍 Mapas, datos científicos y entrevistas con expertos.",
        },
        {
            titulo: "🛟 Soporte continuo",
            descripcion: "👨‍🚀 Recibe ayuda de instructores expertos durante y después del curso.",
        },
    ];

    // Efecto para detectar el scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY; // Posición actual del scroll
            const windowHeight = window.innerHeight; // Altura de la ventana
            const documentHeight = document.documentElement.scrollHeight; // Altura total del documento

            // Mostrar el carrusel cuando el usuario esté cerca del final del scroll
            if (scrollY + windowHeight >= documentHeight - 100) { // 100 es un margen para asegurar que se active antes de llegar al final exacto
                setShowCarouselLocal(true);
                setShowCarousel(true); // Actualizar el estado en el componente padre
            } else {
                setShowCarouselLocal(false);
                setShowCarousel(false); // Actualizar el estado en el componente padre
            }
        };

        // Agregar el listener de scroll
        window.addEventListener('scroll', handleScroll);

        // Limpiar el listener al desmontar el componente
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [setShowCarousel]);

    return (
        <div style={{
            position: 'absolute',
            zIndex: 2, // Asegúrate de que este valor sea mayor que el de ThreeScene
            top: isMobile ? '100px' : '150px', // Ajustar la posición vertical
            left: 0,
            width: '100%',
            minHeight: '100%',
            color: 'white',
            overflowY: 'auto',
            overflowX: 'hidden', // Oculta el scroll horizontal
            boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
            marginBottom: isMobile ? '900px' : '900px', // Dejar espacio para la pasarela de planetas --- PARA QUE FUNCIONE BOTONESSSSSS ----
        }}>
            {/* Título del Planeta */}
            <h1 style={{
                fontSize: isMobile ? '40px' : '56px',
                textAlign: 'center',
                marginBottom: '120px',
                color: '#00ffcc', // Color neon cian
                textShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc', // Efecto neon
                padding: isMobile ? '0 20px' : '0', // Añadir padding en móvil para evitar desbordamiento
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
                boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
            }}>
                {/* Imagen del Resumen */}
                <img
                    src={imagenResumen}
                    alt="Imagen del Resumen"
                    style={{
                        width: isMobile ? '100%' : '40%',
                        maxWidth: '100%', // Asegura que la imagen no exceda el ancho de la pantalla
                        borderRadius: '10px',
                        boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)', // Sombra RGB
                    }}
                />
                
                {/* Resumen del Curso */}
                <div className="rgb-border" style={{
                    fontSize: isMobile ? '20px' : '32px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
                    padding: '24px',
                    borderRadius: '10px',
                    width: isMobile ? '100%' : '50%', // Ajustar el ancho en móvil
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)', // Sombra RGB
                    border: '1px solid transparent', // Borde transparente para el efecto RGB
                    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '20px', color: '#00ffcc', textShadow: '0 0 10px #00ffcc' }}>📖 Resumen del Curso</h2>
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
                boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
            }}>
                {/* Texto introductorio de Riesgos */}
                <div className="rgb-border" style={{
                    fontSize: isMobile ? '20px' : '24px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
                    padding: '24px',
                    borderRadius: '10px',
                    width: '100%',
                    maxWidth: '800px',
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)', // Sombra RGB
                    border: '1px solid transparent', // Borde transparente para el efecto RGB
                    textAlign: 'center',
                    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '20px', color: '#00ffcc', textShadow: '0 0 10px #00ffcc' }}>⚠️ Riesgos del Planeta Kio</h2>
                    <p>
                        El planeta Kio es un lugar fascinante, pero también está lleno de peligros. A continuación,
                        te presentamos algunos de los riesgos más importantes que debes conocer antes de explorar este
                        increíble mundo. 🌌
                    </p>
                </div>

                {/* Tarjetas de Peligros */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap', // Permite que las tarjetas se envuelvan en varias filas
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                }}>
                    {peligros.map((peligro, index) => (
                        <div key={index} className="rgb-border" style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
                            padding: '24px',
                            borderRadius: '10px',
                            width: isMobile ? '100%' : '22%', // 1 tarjeta en móvil, 4 en escritorio
                            boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)', // Sombra RGB
                            border: '1px solid transparent', // Borde transparente para el efecto RGB
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transición suave
                            cursor: 'pointer', // Cambia el cursor a pointer
                            position: 'relative', // Necesario para el pseudo-elemento
                            overflow: 'hidden', // Oculta el desbordamiento del borde animado
                            boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 0, 153, 0.8)'; // Efecto hover RGB
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.5)'; // Restaurar sombra
                        }}
                        >
                            <h2 style={{ fontSize: '32px', marginBottom: '20px', color: '#00ffcc', textShadow: '0 0 10px #00ffcc' }}>{peligro.nombre}</h2>
                            <p><strong>📝 Descripción:</strong> {peligro.descripcion}</p>
                            <p><strong>🚨 Nivel de Riesgo:</strong> {peligro.nivelRiesgo}</p>
                            <p><strong>🌡️ Temperatura:</strong> {peligro.temperatura}</p>
                            <p><strong>👹 Villano:</strong> {peligro.villano}</p>
                            <button className="rgb-border" style={{
                                background: 'none',
                                border: '2px solid transparent', // Borde transparente para el efecto RGB
                                color: '#00ffcc',
                                cursor: 'pointer',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                marginTop: '20px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 0 10px rgba(255, 0, 153, 0.5)', // Sombra RGB
                                textShadow: '0 0 5px #00ffcc', // Texto neon
                                position: 'relative', // Necesario para el pseudo-elemento
                                overflow: 'hidden', // Oculta el desbordamiento del borde animado
                                boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.8)'; // Efecto hover RGB
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 153, 0.5)'; // Restaurar sombra
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
                boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
            }}>
                {/* Imagen de Beneficios */}
                <img
                    src={imagenBeneficios}
                    alt="Imagen de Beneficios"
                    style={{
                        width: isMobile ? '100%' : '40%',
                        maxWidth: '100%', // Asegura que la imagen no exceda el ancho de la pantalla
                        borderRadius: '10px',
                        boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)', // Sombra RGB
                    }}
                />

                {/* Beneficios */}
                <div className="rgb-border" style={{
                    fontSize: isMobile ? '20px' : '32px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
                    padding: '24px',
                    borderRadius: '10px',
                    width: isMobile ? '100%' : '50%', // Ajustar el ancho en móvil
                    boxShadow: '0 0 20px rgba(255, 0, 153, 0.5)', // Sombra RGB
                    border: '1px solid transparent', // Borde transparente para el efecto RGB
                    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '20px', color: '#00ffcc', textShadow: '0 0 10px #00ffcc' }}>🌟 Beneficios</h2>
                    {/* Renderizado dinámico de los beneficios */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}>
                        {beneficiosArray.map((beneficio, index) => (
                            <div key={index} className="rgb-border" style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo oscuro semitransparente
                                padding: '16px',
                                borderRadius: '8px',
                                boxShadow: '0 0 10px rgba(255, 0, 153, 0.3)', // Sombra RGB
                                border: '1px solid transparent', // Borde transparente para el efecto RGB
                                boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                            }}>
                                <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#00ffcc', textShadow: '0 0 5px #00ffcc' }}>{beneficio.titulo}</h3>
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
                marginBottom: '40px',
                boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
            }}>
                <button onClick={onComprarClick} className="rgb-border" style={{
                    fontSize: '24px',
                    background: 'none',
                    border: '2px solid transparent', // Borde transparente para el efecto RGB
                    color: '#00ffcc',
                    cursor: 'pointer',
                    padding: '12px 40px',
                    borderRadius: '12px',
                    boxShadow: '0 0 10px rgba(255, 0, 153, 0.5)', // Sombra RGB
                    textShadow: '0 0 5px #00ffcc', // Texto neon
                    transition: 'all 0.3s ease',
                    position: 'relative', // Necesario para el pseudo-elemento
                    overflow: 'hidden', // Oculta el desbordamiento del borde animado
                    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 153, 0.8)'; // Efecto hover RGB
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 153, 0.5)'; // Restaurar sombra
                }}
                >
                    🛒 Agregar al Carrito
                </button>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semitransparente
                padding: '20px',
                textAlign: 'center',
                color: '#00ffcc', // Color neon cian
                textShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc', // Efecto neon
                borderTop: '2px solid #00ffcc', // Borde superior con efecto neon
                marginTop: '40px', // Espacio antes del footer
                boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
                position: 'relative', // Posición relativa para que no interfiera con la pasarela
                zIndex: 1, // Asegurar que el footer esté por encima del contenido principal
            }}>
                <p style={{ margin: '0', fontSize: isMobile ? '16px' : '20px' }}>
                    © 2023 Exploración Espacial Mundo Dictario. Todos los derechos reservados.
                </p>
                <p style={{ margin: '10px 0 0', fontSize: isMobile ? '14px' : '16px' }}>
                    Desarrollado con ❤️ por el equipo de Mundo Dictario.
                </p>
            </footer>
        </div>
    );
};

export default MainContent;