import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/BackButton';
import ThreeScene from '../../../components/Landing/ThreeScene';
import MainContent from '../../../components/Landing/MainContent';
import ResizeHandler from '../../../components/Landing/ResizeHandler';

const PlanetaKio = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showCarousel, setShowCarousel] = useState(false); // Estado para controlar la visibilidad del carrusel

    // Texturas para el carrusel de planetas
    const textures = [
        '/assets/2k_makemake_fictional.jpg', // Textura del planeta Kio
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
        '/ninos/salud_social/planeta_kio',
        '/ninos/salud_social/planeta_mer',
        '/ninos/salud_social/planeta_ven',
        '/ninos/salud_social/planeta_4',
        '/ninos/salud_social/planeta_5',
        '/ninos/salud_social/planeta_6',
        '/ninos/salud_social/planeta_7',
        '/ninos/salud_social/planeta_8',
        '/ninos/salud_social/planeta_9',
        '/ninos/salud_social/planeta_10',
    ];

    // Rutas de las imágenes
    const imagenResumen = 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXN0cm9uYXV0fGVufDB8fDB8fHww'; // Ruta de la imagen de resumen
    const imagenBeneficios = 'https://tn.com.ar/resizer/v2/cual-es-el-sueldo-de-un-astronauta-de-la-nasa-foto-adobestock-OVP5HZHY7NHB3PWLAVL5ARG66A.png?auth=a3e77c7ff1be7c62dfc79ca3276dbc43d99ec81620644ed5637f4993c154dad4&width=767'; // Ruta de la imagen de beneficios

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

    const beneficios = (
        <div>
            <p>Al completar este curso, ganarás:</p>
            <ul>
                <li><strong>Comprensión profunda de Kio:</strong> Conoce todos los detalles sobre este fascinante planeta.</li>
                <li><strong>Habilidades prácticas:</strong> Aprende a navegar y sobrevivir en los desafíos únicos de Kio.</li>
                <li><strong>Certificación reconocida:</strong> Obtén un certificado que valide tus conocimientos.</li>
                <li><strong>Acceso a recursos exclusivos:</strong> Mapas, datos científicos y entrevistas con expertos.</li>
                <li><strong>Soporte continuo:</strong> Recibe ayuda de instructores expertos durante y después del curso.</li>
            </ul>
        </div>
    );

    const handleComprarClick = () => {
        // Aquí puedes agregar la lógica que desees ejecutar al hacer clic en "Comprar"
        console.log("Botón Comprar clickeado");
    };

    // Ocultar scroll y ajustar estilos del body
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Esto bloquea el scroll
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        // Limpieza al desmontar el componente
        return () => {
            document.body.style.overflow = ''; // Restaura el scroll al desmontar
            document.body.style.margin = '';
            document.body.style.padding = '';
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh', // Asegura que el contenedor tenga al menos el alto de la ventana
            overflowY: 'auto', // Permite el scroll vertical
            overflowX: 'hidden', // Oculta el scroll horizontal
        }}>
            {/* Botón de retroceso */}
            <BackButton color="#FFFFFF" redirectUrl="/ninos/salud_social" />

            {/* Escena de Three.js con el planeta central y el carrusel */}
            <ThreeScene textures={textures} planetUrls={planetUrls} showCarousel={showCarousel} />

            {/* Contenido principal (título, divs, botón) */}
            <MainContent
                isMobile={isMobile}
                onComprarClick={handleComprarClick}
                planetaNombre={planetaNombre}
                resumenCurso={resumenCurso}
                beneficios={beneficios}
                imagenResumen={imagenResumen} // Pasar la imagen de resumen
                imagenBeneficios={imagenBeneficios} // Pasar la imagen de beneficios
                setShowCarousel={setShowCarousel} // Pasar la función para actualizar el estado
            />

            {/* Manejador de redimensionamiento */}
            <ResizeHandler setIsMobile={setIsMobile} />
        </div>
    );
};

export default PlanetaKio;