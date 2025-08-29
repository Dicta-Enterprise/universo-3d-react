import React, { useState, useEffect } from "react";
import BackButton from "../../../components/BackButton";
import ThreeScene from "../../../components/Landing/ThreeScene";
import MainContent from "../../../components/Landing/MainContent";
import ResizeHandler from "../../../components/Landing/ResizeHandler";

const Planeta17Nat = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCarousel, setShowCarousel] = useState(false);

  // Texturas para el carrusel de planetas
  const textures = [
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
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
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
  ];

  // URLs de los planetas
  const planetUrls = [
    '/ninos/peligros_digitales/planeta_nat',
    '/ninos/peligros_digitales/planeta_sil',
    '/ninos/peligros_digitales/planeta_ami',
    '/ninos/peligros_digitales/planeta_per',
    '/ninos/peligros_digitales/planeta_int',
    '/ninos/peligros_digitales/planeta_unu',
    '/ninos/peligros_digitales/planeta_und',
    '/ninos/peligros_digitales/planeta_inc',
    '/ninos/peligros_digitales/planeta_ver',
    '/ninos/peligros_digitales/planeta_qui',
    '/ninos/peligros_digitales/planeta_sin',
    '/ninos/peligros_digitales/planeta_det',
    '/ninos/peligros_digitales/planeta_den',
    '/ninos/peligros_digitales/planeta_hon',
    '/ninos/peligros_digitales/planeta_kio',
    '/ninos/peligros_digitales/planeta_2',
    '/ninos/peligros_digitales/planeta_3',
    '/ninos/peligros_digitales/planeta_4',
    '/ninos/peligros_digitales/planeta_5',
    '/ninos/peligros_digitales/planeta_gra',
    '/ninos/peligros_digitales/planeta_sci',
    '/ninos/peligros_digitales/planeta_gau',
    '/ninos/peligros_digitales/planeta_pax',
    '/ninos/peligros_digitales/planeta_lib',
    '/ninos/peligros_digitales/planeta_rea',
    '/ninos/peligros_digitales/planeta_rep',
    '/ninos/peligros_digitales/planeta_pri',
    '/ninos/peligros_digitales/planeta_acc',
    '/ninos/peligros_digitales/planeta_tri',
    '/ninos/peligros_digitales/planeta_cau',
  ];

  // Rutas de las imágenes
  const imagenResumen = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80';
  const imagenBeneficios = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3111&q=80';

  // Información específica del Planeta Mer
  const planetaNombre = "NATUS";
  const resumenCurso = (
    <div>
      <p>Explora los misterios del planeta NATUS, un mundo de contrastes extremos donde:</p>
      <ul>
        <li><strong>Geografía cambiante:</strong> Montañas de hielo que se derriten en lagos de metano.</li>
        <li><strong>Clima impredecible:</strong> Tormentas magnéticas que alteran la percepción del tiempo.</li>
        <li><strong>Tecnología adaptativa:</strong> Sistemas que evolucionan con el entorno.</li>
      </ul>
    </div>
  );

  // Peligros del planeta Mer (7 en lugar de 5)
  const peligros = [
    {
      nombre: "🌀 Tormentas magnéticas",
      descripcion: "⚡ Alteran equipos electrónicos y la percepción del tiempo.",
      nivelRiesgo: "🔴 Alto",
      temperatura: "🌡️ -100°C a 200°C",
      villano: "🌪️ Magnetor",
      cta: "🚀 Visita al planeta Mer",
    },
    {
      nombre: "💧 Lagos de metano",
      descripcion: "☠️ Líquidos corrosivos que disuelven materiales convencionales.",
      nivelRiesgo: "⚫ Crítico",
      temperatura: "🌡️ -150°C",
      villano: "👹 Methanos",
      cta: "🚀 Visita al planeta Mer",
    },
    {
      nombre: "❄️ Congelamiento instantáneo",
      descripcion: "⚠️ Cambios bruscos de temperatura que congelan todo en segundos.",
      nivelRiesgo: "🔴 Alto",
      temperatura: "🌡️ 50°C a -200°C",
      villano: "🧊 Frostbite",
      cta: "🚀 Visita al planeta Mer",
    },
    {
      nombre: "🌫️ Niebla tóxica",
      descripcion: "☣️ Gases que afectan el sistema nervioso y la visión.",
      nivelRiesgo: "🟠 Medio",
      temperatura: "🌡️ -80°C a 0°C",
      villano: "👻 Nebulon",
      cta: "🚀 Visita al planeta Mer",
    },
    {
      nombre: "⚡ Descargas estáticas",
      descripcion: "💥 Acumulación de energía que daña circuitos y equipos.",
      nivelRiesgo: "🟠 Medio",
      temperatura: "🌡️ -30°C a 100°C",
      villano: "⚡ Voltarius",
      cta: "🚀 Visita al planeta Mer",
    },
    {
      nombre: "🌋 Erupciones de hielo",
      descripcion: "🧊 Géiseres que expulsan fragmentos de hielo a alta velocidad.",
      nivelRiesgo: "🔴 Alto",
      temperatura: "🌡️ -120°C",
      villano: "🧊 Icerupt",
      cta: "🚀 Visita al planeta Mer",
    },
    {
      nombre: "🕳️ Sumideros temporales",
      descripcion: "⏳ Pozos que aparecen y desaparecen aleatoriamente.",
      nivelRiesgo: "🟡 Bajo",
      temperatura: "🌡️ -50°C a 50°C",
      villano: "🌀 Tempovoid",
      cta: "🚀 Visita al planeta Mer",
    }
  ];

  // Beneficios del curso (3 en lugar de 5)
  const beneficios = [
    {
      titulo: "🧠 Dominio de tecnologías adaptativas",
      descripcion: "Aprende a usar equipos que evolucionan con el entorno cambiante de Mer.",
    },
    {
      titulo: "⏱️ Manejo de distorsiones temporales",
      descripcion: "Técnicas para navegar en zonas con alteraciones en la percepción del tiempo.",
    },
    {
      titulo: "❄️ Especialista en entornos criogénicos",
      descripcion: "Certificación en supervivencia en climas bajo cero extremos.",
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
      <BackButton color="#FFFFFF" redirectUrl="/ninos/peligros_digitales" background= {'none'}/>
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

export default Planeta17Nat;