// TarjetaConfirmacion.js
import React from 'react';

const mockData = {
  title:"GALAXIA PELIGROS EN LA SALUD FÍSICA INFANTIL",
  desc:"Descubre mundos donde el mal uso de la tecnología te traerá consecuencias devastadoras.¡Explora con cuidado y mantente activo para evitar daños!",
  desafio:"Descubrir cómo un mal uso de pantallas puede afectar tu salud física",
  riesgo:"Riesgos de leve a severo que pueden afectar tu crecimiento y salud.",
  conquista:"Aprendiendo cómo combinar herramientas saludables para ser más fuerte en internet",
  cta:"¡Actívate y protege tu cuerpo!"
}

export default function TarjetaConfirmacion({ title, descripcion = "", onConfirm, onClose }) {
  return (
    <div className="tarjeta-confirmacion">
      <div className="tarjeta-contenido">
      <h3>{title}</h3>
        <p>{descripcion}</p>
        <h3>¿QUÉ DESAFÍO TENDRÁS?</h3>
        <p>{mockData.desafio}</p>
        <h3>¿QUÉ NIVELES DE RIESGO HAY?</h3>
        <p>{mockData.riesgo}</p>
        <h3>¿CÓMO DEBO CONQUISTAR LOS DESAFÍOS?</h3>
        <p>{mockData.desafio}conquista</p>
        <h5><b>{mockData.cta}</b></h5>

        <div className="botones">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onConfirm}>Ir a conocer mundos</button>
        </div>
      </div>
    </div>
  );
}
