import React from 'react';
import PlanetGateway from '../../../components/LadingPage/PlanetGateway'; // Importar el componente PlanetGateway

const Jovenes = () => {
    const textures = [
        '/assets/2k_makemake_fictional.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
        '/assets/2k_neptune.jpg',
        '/assets/2k_venus_surface.jpg',
    ];

    const texts = [
        "Tipo de riesgo: Peligro digital\nPlaneta: Planeta KIO\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Ciberbullying\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Ciberbull",
        "SEGUNDO PLANETA - - ",
        "TERCER PLANETA - - - ",
        "CUARTO PLANETA - - - - ",
        "QUINTO PLANETA - - - - - ",
    ];

    const planetUrls = [
        '/ninos/salud_social/planeta_kio',
        '/ninos/salud_social/planeta_2',
        '/ninos/salud_social/planeta_3',
        '/ninos/salud_social/planeta_4',
        '/ninos/salud_social/planeta_5',
    ];

    return (
        <PlanetGateway textures={textures} texts={texts} planetUrls={planetUrls} />
    );
};

export default Jovenes;