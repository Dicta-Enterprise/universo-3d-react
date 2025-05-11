import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import ThreeScene from "../../../components/Landing/ThreeScene";
import MainContent from "../../../components/Landing/MainContent";
import ResizeHandler from "../../../components/Landing/ResizeHandler";

const PlanetaGenerico = ({
  planetaNombre,
  textures,
  planetUrls,
  resumenCurso,
  beneficios,
  precio = 49.99, // Precio por defecto
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Manejar clic en "Comprar"
  const handleComprarClick = () => {
    const course = {
      id: `curso-${planetaNombre.toLowerCase()}`,
      name: `Seguridad en ${planetaNombre}`,
      price: precio,
      quantity: 1,
      planeta: planetaNombre,
      textura: textures[0], // Usamos la primera textura del array
      resumen: resumenCurso,
      beneficios: beneficios,
    };

    // Obtener el carrito actual desde localStorage
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = currentCart.find((item) => item.id === course.id);

    // Actualizar el carrito
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push(course);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(currentCart));
    console.log("Curso agregado al carrito:", course); // Depuración

    // Redirigir a la página del carrito
    navigate("/comprar");
  };

  // Ocultar scroll y ajustar estilos del body
  useEffect(() => {
    document.body.style.overflow = "auto";
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
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh', // Asegura que el contenedor tenga al menos el alto de la ventana
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Botón de retroceso */}
      <BackButton color="#FFFFFF" redirectUrl="/ninos/salud_social"  background= {'none'}/>

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

export default PlanetaGenerico;