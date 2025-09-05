import React, { useState, useEffect } from "react";
import BackButton from '../../../../components/BackButton';
import ThreeScene from '../../../../components/Landing/ThreeScene';
import MainContent from '../../../../components/Landing/MainContent';
import ResizeHandler from '../../../../components/Landing/ResizeHandler';

const Planeta13Som = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCarousel, setShowCarousel] = useState(false);

  // Texturas para el carrusel de planetas
  const textures = [
    "/assets/textura blanco.jpg",
    "/assets/textura negro.jpg",
    "/assets/textura blanco.jpg",
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
    "/assets/textura blanco.jpg",
    "/assets/textura negro.jpg",
  ];

  // URLs de los planetas
  const planetUrls = [
    "/ninos/salud_mental/planeta_som",
    "/ninos/salud_mental/planeta_act",
    "/ninos/salud_mental/planeta_ali",
    "/ninos/salud_mental/planeta_cons",
    "/ninos/salud_mental/planeta_ima",
    "/ninos/salud_mental/planeta_suf",
    "/ninos/salud_mental/planeta_cen",
    "/ninos/salud_mental/planeta_eue",
    "/ninos/salud_mental/planeta_pra",
    "/ninos/salud_mental/planeta_aes",
    "/ninos/salud_mental/planeta_ina",
    "/ninos/salud_mental/planeta_cer",
    "/ninos/salud_mental/planeta_mat",
    "/ninos/salud_mental/planeta_res",
    "/ninos/salud_mental/planeta_abs",
  ];

  // Rutas de las imágenes
  const imagenResumen = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3111&q=80';
  const imagenBeneficios = 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2960&q=80';

  // Información específica del Planeta Ven
  const planetaNombre = "SOMNUS";
  const resumenCurso = (
    <div>
      <p>Descubre los secretos del planeta SOMNUS, un mundo de contrastes vibrantes donde:</p>
      <ul>
        <li><strong>Geografía lumínica:</strong> Montañas que brillan en la oscuridad y ríos de plasma.</li>
        <li><strong>Clima energético:</strong> Tormentas de partículas cargadas y auroras permanentes.</li>
        <li><strong>Tecnología fotónica:</strong> Sistemas que funcionan con energía lumínica pura.</li>
      </ul>
    </div>
  );

  // Peligros del planeta Ven (6 riesgos)
  const peligros = [
    {
      nombre: "☀️ Tormentas solares",
      descripcion: "🌪️ Emisiones masivas de radiación que afectan equipos y organismos.",
      nivelRiesgo: "🔴 Alto",
      temperatura: "🌡️ 200°C a 500°C",
      villano: "☀️ Solaris",
      cta: "🚀 Visita al planeta Ven",
    },
    {
      nombre: "💥 Explosiones de plasma",
      descripcion: "⚡ Descargas energéticas que funden materiales en segundos.",
      nivelRiesgo: "⚫ Crítico",
      temperatura: "🌡️ 1000°C+",
      villano: "🔥 Plasmor",
      cta: "🚀 Visita al planeta Ven",
    },
    {
      nombre: "🌌 Campos gravitacionales",
      descripcion: "🌀 Zonas con gravedad variable que afectan el movimiento.",
      nivelRiesgo: "🟠 Medio",
      temperatura: "🌡️ 50°C a 300°C",
      villano: "🌑 Graviton",
      cta: "🚀 Visita al planeta Ven",
    },
    {
      nombre: "🌈 Refracciones extremas",
      descripcion: "👁️ Distorsiones visuales que causan desorientación.",
      nivelRiesgo: "🟡 Bajo",
      temperatura: "🌡️ 100°C a 200°C",
      villano: "👁️ Illusionix",
      cta: "🚀 Visita al planeta Ven",
    },
    {
      nombre: "⚡ Electrocución ambiental",
      descripcion: "💢 Cargas estáticas que se acumulan en cualquier superficie.",
      nivelRiesgo: "🔴 Alto",
      temperatura: "🌡️ 150°C a 400°C",
      villano: "⚡ Voltax",
      cta: "🚀 Visita al planeta Ven",
    },
    {
      nombre: "🌠 Lluvia de meteoritos",
      descripcion: "💫 Fragmentos estelares que impactan constantemente la superficie.",
      nivelRiesgo: "🟠 Medio",
      temperatura: "🌡️ 80°C to 250°C",
      villano: "🌠 Meteorax",
      cta: "🚀 Visita al planeta Ven",
    }
  ];

  // Beneficios del curso (4 beneficios)
  const beneficios = [
    {
      titulo: "🔭 Dominio de telescopios cuánticos",
      descripcion: "Aprende a usar equipos que ven a través de las distorsiones lumínicas de Ven.",
    },
    {
      titulo: "⚡ Manejo de energía pura",
      descripcion: "Técnicas para recolectar y utilizar la energía de plasma ambiental.",
    },
    {
      titulo: "🌌 Navegación en campos gravitacionales",
      descripcion: "Certificación en pilotaje en zonas de gravedad variable.",
    },
    {
      titulo: "🌈 Especialista en óptica extrema",
      descripcion: "Habilidades para trabajar en entornos con refracciones peligrosas.",
    }
  ];

  const handleComprarClick = () => {
    console.log("Botón Comprar clickeado");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.overflow = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <div style={{ 
      position: "relative", 
      width: "100%", 
      minHeight: "100vh", 
      overflowY: "auto",
      overflowX: "hidden" 
    }}>
      <BackButton color="#FFFFFF" redirectUrl="/ninos/salud_mental" background= {'none'}/>
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

export default Planeta13Som;