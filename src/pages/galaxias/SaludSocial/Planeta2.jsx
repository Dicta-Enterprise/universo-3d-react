import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/BackButton';
import ThreeScene from '../../../components/Landing/ThreeScene';
import MainContent from '../../../components/Landing/MainContent';
import ResizeHandler from '../../../components/Landing/ResizeHandler';

const Planeta = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    const planetUrls = [
        '/ninos/salud_social/planeta_kio',
        '/ninos/salud_social/Planeta2',
        '/ninos/salud_social/planeta_3',
        '/ninos/salud_social/planeta_4',
        '/ninos/salud_social/planeta_5',
        '/ninos/salud_social/planeta_6',
        '/ninos/salud_social/planeta_7',
        '/ninos/salud_social/planeta_8',
        '/ninos/salud_social/planeta_9',
        '/ninos/salud_social/planeta_10',
    ];

    const handleComprarClick = () => {
        window.location.href = '/compra.html'; // Redirige a la página de compra
    };

    useEffect(() => {
        // Ocultar el scroll y ajustar el margen y padding del body
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        // Limpieza al desmontar el componente
        return () => {
            document.body.style.overflow = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* Botón de retroceso */}
            <BackButton color="#FFFFFF" />

            {/* Escena de Three.js con el planeta central y el carrusel */}
            <ThreeScene textures={textures} planetUrls={planetUrls} />

            {/* Contenido principal (título, divs, botón) */}
            <MainContent isMobile={isMobile} onComprarClick={handleComprarClick} />

            {/* Manejador de redimensionamiento */}
            <ResizeHandler setIsMobile={setIsMobile} />
        </div>
    );
};

export default Planeta;