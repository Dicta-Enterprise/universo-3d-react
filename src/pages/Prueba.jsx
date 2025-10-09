import React from "react";
import Visualizer from '../pages/galaxias/GalaxiaEjemplo/ui/3dVisualizer'

function Prueba() {
    //fetch("http://127.0.0.1:8000/modelos/cohete/scene.gltf")
  return (
    <>
    <div>hola</div>
    {<div
      className="div-full-height div-absolute z-back"
    >
      <Visualizer
        color={"fff"}
        scale={{ x: 15, y: 15, z: 15 }}
        modelo="http://localhost:5000/uploads/modelos/modelo-689e35179ea8c5a0572ee845-1759801287053.glb"
        pos={{ x: 0, y: -2, z: -3 }}
        intensidad_luz={2}
        posAnim={{ x: 0, y: -2, z: -3 }}
      ></Visualizer>
    </div>}
    </>
  );
}

export default Prueba;
