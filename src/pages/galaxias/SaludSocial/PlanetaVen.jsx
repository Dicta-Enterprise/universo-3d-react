import React, { useState, useEffect } from "react";
import BackButton from "../../../components/BackButton";
import ThreeScene from "../../../components/Landing/ThreeScene";
import MainContent from "../../../components/Landing/MainContent";
import ResizeHandler from "../../../components/Landing/ResizeHandler";

const PlanetaVen = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Texturas para el carrusel de planetas
  const textures = [
    "/assets/earthx5400x2700.jpg", // Textura del planeta Ven (primera posición)
    "/assets/2k_neptune.jpg",
    "/assets/2k_venus_surface.jpg",
    "/assets/2k_uranus.jpg",
    "/assets/2k_venus_atmosphere.jpg",
    "/assets/2k_earth_clouds.jpg",
    "/assets/2k_jupiter.jpg",
    "/assets/2k_mars.jpg",
    "/assets/2k_makemake_fictional.jpg", // Textura del planeta Kio
    "/assets/2k_haumea_fictional.jpg", // Textura del planeta Mer
  ];

  // URLs de los planetas
  const planetUrls = [
    "/ninos/salud_social/planeta_ven",
    "/ninos/salud_social/planeta_4",
    "/ninos/salud_social/planeta_5",
    "/ninos/salud_social/planeta_6",
    "/ninos/salud_social/planeta_7",
    "/ninos/salud_social/planeta_8",
    "/ninos/salud_social/planeta_9",
    "/ninos/salud_social/planeta_10",
    "/ninos/salud_social/planeta_kio",
    "/ninos/salud_social/planeta_mer",
  ];

  // Información específica del Planeta Ven
  const planetaNombre = "Ven";
  const resumenCurso = "Este curso te llevará a través de los conceptos básicos y avanzados del planeta Ven, explorando su geografía única, clima extremo y desafíos tecnológicos.";
  const beneficios = "Al completar este curso, ganarás una comprensión profunda de Ven, habilidades prácticas para navegar sus desafíos y una certificación reconocida.";

  const handleComprarClick = () => {
    // Aquí puedes agregar la lógica que desees ejecutar al hacer clic en "Comprar"
    console.log("Botón Comprar clickeado");
  };

  // Ocultar scroll y ajustar estilos del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // Limpieza al desmontar el componente
    return () => {
      document.body.style.overflow = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Botón de retroceso */}
      <BackButton color="#FFFFFF" redirectUrl="/ninos/salud_social" />

      {/* Escena de Three.js con el planeta central y el carrusel */}
      <ThreeScene textures={textures} planetUrls={planetUrls} />

      {/* Contenido principal (título, divs, botón) */}
      <MainContent
        isMobile={isMobile}
        onComprarClick={handleComprarClick}
        planetaNombre={planetaNombre}
        resumenCurso={resumenCurso}
        beneficios={beneficios}
      />

      {/* Manejador de redimensionamiento */}
      <ResizeHandler setIsMobile={setIsMobile} />
    </div>
  );
};

export default PlanetaVen;