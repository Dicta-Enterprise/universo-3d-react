import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/BackButton';
import ThreeScene from '../../../components/Landing/ThreeScene';
import MainContent from '../../../components/Landing/MainContent';
import ResizeHandler from '../../../components/Landing/ResizeHandler';

const PlanetaKio = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showCarousel, setShowCarousel] = useState(false);

    // Texturas para el carrusel de planetas
    const textures = [
        '/assets/2k_makemake_fictional.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
        '/assets/2k_neptune.jpg',
        '/assets/2k_venus_surface.jpg',
        '/assets/2k_uranus.jpg',
        '/assets/2k_venus_atmosphere.jpg',
        '/assets/2k_earth_clouds.jpg',
        '/assets/2k_jupiter.jpg',
        '/assets/2k_mars.jpg',
    ];

    // URLs de los planetas
    const planetUrls = [
        '/padres/salud_social/planeta_kio',
        '/padres/salud_social/planeta_mer',
        '/padres/salud_social/planeta_ven',
        '/padres/salud_social/planeta_4',
        '/padres/salud_social/planeta_5',
        '/padres/salud_social/planeta_6',
        '/padres/salud_social/planeta_7',
        '/padres/salud_social/planeta_8',
        '/padres/salud_social/planeta_9',
        '/padres/salud_social/planeta_10',
    ];

    // Rutas de las imágenes
    const imagenResumen = 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXN0cm9uYXV0fGVufDB8fDB8fHww';
    const imagenBeneficios = 'https://tn.com.ar/resizer/v2/cual-es-el-sueldo-de-un-astronauta-de-la-nasa-foto-adobestock-OVP5HZHY7NHB3PWLAVL5ARG66A.png?auth=a3e77c7ff1be7c62dfc79ca3276dbc43d99ec81620644ed5637f4993c154dad4&width=767';

    // Información específica del Planeta Kio
    const planetaNombre = "Kio";
    const resumenCurso = (
        <div>
            <p>Este curso te llevará a través de los conceptos básicos y avanzados del planeta Kio, explorando:</p>
            <ul>
                <li><strong>Geografía única:</strong> Montañas cristalinas, océanos de lava y biomas impresionantes.</li>
                <li><strong>Clima extremo:</strong> Tormentas de arena eléctricas y lluvias ácidas.</li>
                <li><strong>Desafíos tecnológicos:</strong> Tecnologías avanzadas para explorar y habitar Kio.</li>
            </ul>
        </div>
    );

    // Peligros del planeta Kio
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

    // Beneficios del curso
    const beneficios = [
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

    const handleComprarClick = () => {
        console.log("Botón Comprar clickeado");
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        return () => {
            document.body.style.overflow = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
        }}>
            <BackButton color="#FFFFFF" redirectUrl="/padres/salud_social" background= {'none'}/>
            <ThreeScene textures={textures} planetUrls={planetUrls} showCarousel={showCarousel} />
            <MainContent
                isMobile={isMobile}
                onComprarClick={handleComprarClick}
                planetaNombre={planetaNombre}
                resumenCurso={resumenCurso}
                beneficios={beneficios}
                peligros={peligros}
                imagenResumen={imagenResumen}
                imagenBeneficios={imagenBeneficios}
                setShowCarousel={setShowCarousel}
            />
            <ResizeHandler setIsMobile={setIsMobile} />
        </div>
    );
};

export default PlanetaKio;